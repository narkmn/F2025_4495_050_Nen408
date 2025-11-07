const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '2mb' }));

// ---------- ENV ----------
const {
  LLM_PROVIDER = 'cf',
  EMBED_PROVIDER = 'cf',

  CF_ACCOUNT_ID,
  CF_API_TOKEN,
  CF_AI_BASE,
  CF_LLM_MODEL,
  CF_EMBED_MODEL,
  CF_VECTORIZE_INDEX,

  OPENAI_API_KEY,
  OPENAI_MODEL,
  OPENAI_EMBED_MODEL,
} = process.env;

// ---------- DB (SQLite) ----------
const db = new Database('./conversations.db');
db.exec(`
CREATE TABLE IF NOT EXISTS conversations (
  id TEXT PRIMARY KEY,
  tenant TEXT,
  created_at TEXT
);
CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  conversation_id TEXT,
  role TEXT,
  content TEXT,
  created_at TEXT
);
`);

// Helpers
const nowISO = () => new Date().toISOString();

// ---------- Provider: Embeddings ----------
async function embedTexts(texts) {
  if (EMBED_PROVIDER === 'cf') {
    const r = await fetch(`${CF_AI_BASE}/run/${CF_EMBED_MODEL}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${CF_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: texts }),
    });
    const j = await r.json();
    if (!j.embeddings) throw new Error('Embedding failed (CF)');
    return j.embeddings; // number[][]
  }

  if (EMBED_PROVIDER === 'openai') {
    const r = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: OPENAI_EMBED_MODEL || 'text-embedding-3-small',
        input: texts,
      }),
    });
    const j = await r.json();
    if (!j.data) throw new Error('Embedding failed (OpenAI)');
    return j.data.map((d) => d.embedding);
  }

  throw new Error(`Unknown EMBED_PROVIDER: ${EMBED_PROVIDER}`);
}

// ---------- Provider: LLM Generation ----------
async function generateAnswer(prompt) {
  if (LLM_PROVIDER === 'cf') {
    const r = await fetch(`${CF_AI_BASE}/run/${CF_LLM_MODEL}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${CF_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages: [{ role: 'user', content: prompt }] }),
    });
    const j = await r.json();
    // Workers AI returns different shapes per model; normalize best-effort:
    const text = j?.result?.response || j?.result || j?.response || '';
    return String(text);
  }

  if (LLM_PROVIDER === 'openai') {
    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: OPENAI_MODEL || 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.2,
      }),
    });
    const j = await r.json();
    const text = j?.choices?.[0]?.message?.content || '';
    return String(text);
  }

  throw new Error(`Unknown LLM_PROVIDER: ${LLM_PROVIDER}`);
}

// ---------- Vectorize ----------
async function vectorizeUpsert(vectors) {
  // vectors: [{id, vector:number[], metadata:{ text, source, tenant }}]
  const r = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/vectorize/indexes/${CF_VECTORIZE_INDEX}/upsert`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${CF_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ vectors }),
    }
  );
  if (!r.ok) {
    const t = await r.text();
    throw new Error(`Vectorize upsert failed: ${t}`);
  }
}

async function vectorizeQuery(vec, topK = 6) {
  const r = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/vectorize/indexes/${CF_VECTORIZE_INDEX}/query`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${CF_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ vector: vec, topK, returnMetadata: true }),
    }
  );
  const j = await r.json();
  return j?.result?.matches || [];
}

// ---------- Prompt builder ----------
function buildPrompt(question, chunks) {
  const ctx = chunks.map((c, i) => `[[${i + 1}]] ${c.metadata?.text ?? ''}`).join('\n\n');
  return `You are a helpful assistant for HealthAcademy (multi-tenant).
Use ONLY the context below. If the answer is missing, say you don't know and offer to escalate.

CONTEXT:
${ctx}

QUESTION: ${question}

Answer in 6–10 concise sentences. When relevant, cite snippet numbers like [1], [2].`;
}

// ---------- API: Upsert KB ----------
app.post('/api/kb/upsert', async (req, res) => {
  try {
    const { tenant = 'default', docs = [] } = req.body || {};
    if (!Array.isArray(docs) || docs.length === 0) {
      return res.status(400).json({ ok: false, error: 'No docs' });
    }
    const embeddings = await embedTexts(docs.map((d) => d.text));
    const vectors = docs.map((d, i) => ({
      id: `${tenant}:${d.id}`,
      vector: embeddings[i],
      metadata: { text: d.text, source: d.source, tenant },
    }));
    await vectorizeUpsert(vectors);
    res.json({ ok: true, count: vectors.length });
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e) });
  }
});

// ---------- API: Chat ----------
app.post('/api/chat', async (req, res) => {
  try {
    const { tenant = 'default', message = '', sessionId } = req.body || {};
    if (!message) return res.status(400).json({ ok: false, error: 'message required' });

    // conversation record
    const convId = sessionId || `${tenant}:${Date.now()}:${Math.random().toString(36).slice(2)}`;
    const exists = db.prepare('SELECT 1 FROM conversations WHERE id=?').get(convId);
    if (!exists) {
      db.prepare('INSERT INTO conversations(id, tenant, created_at) VALUES (?, ?, ?)').run(
        convId,
        tenant,
        nowISO()
      );
    }
    db.prepare('INSERT INTO messages(conversation_id, role, content, created_at) VALUES (?, ?, ?, ?)').run(
      convId,
      'user',
      message,
      nowISO()
    );

    // RAG
    const [qVec] = await embedTexts([message]);
    const hits = await vectorizeQuery(qVec, 6);
    const prompt = buildPrompt(message, hits);
    const answer = await generateAnswer(prompt);

    db.prepare('INSERT INTO messages(conversation_id, role, content, created_at) VALUES (?, ?, ?, ?)').run(
      convId,
      'assistant',
      answer,
      nowISO()
    );

    res.json({ ok: true, conversationId: convId, answer, hitsCount: hits.length, provider: LLM_PROVIDER });
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e) });
  }
});

// ---------- Admin: view conversations ----------
app.get('/admin', (req, res) => {
  const convs = db.prepare('SELECT id, tenant, created_at FROM conversations ORDER BY created_at DESC LIMIT 100').all();
  const msgs = db.prepare('SELECT conversation_id, role, content, created_at FROM messages ORDER BY id').all();

  const grouped = convs.map((c) => ({
    ...c,
    messages: msgs.filter((m) => m.conversation_id === c.id),
  }));

  const html = `
<!doctype html><meta charset="utf-8"/>
<title>AI Broker – Conversations</title>
<style>
  body{font:14px/1.4 system-ui,Segoe UI,Arial;padding:24px;max-width:1000px;margin:auto}
  .c{border:1px solid #ddd;border-radius:10px;padding:12px;margin:12px 0}
  .meta{color:#555;font-size:12px;margin-bottom:8px}
  .msg{padding:6px 8px;border-left:4px solid #eee;margin:4px 0;white-space:pre-wrap}
  .user{border-color:#999;background:#fafafa}
  .assistant{border-color:#0a7}
</style>
<h1>AI Broker – Conversations</h1>
<p>Provider: <b>${LLM_PROVIDER}</b> (switch by editing <code>.env</code>)</p>
${grouped
  .map(
    (c) => `
  <div class="c">
    <div class="meta">
      <b>${c.id}</b> — Tenant: <b>${c.tenant}</b> — Started: ${c.created_at}
    </div>
    ${c.messages
      .map(
        (m) =>
          `<div class="msg ${m.role}"><b>${m.role.toUpperCase()}</b>: ${escapeHtml(
            m.content || ''
          )}<div class="meta">${m.created_at}</div></div>`
      )
      .join('')}
  </div>`
  )
  .join('')}
`;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(html);
});

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
}

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`AI Broker running at http://localhost:${PORT}`);
  console.log(`Admin console:     http://localhost:${PORT}/admin`);
});
