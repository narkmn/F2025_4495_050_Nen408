/*  js/chat.js  */
document.addEventListener('DOMContentLoaded', () => {
  const BODY = document.body;
  const ROOT_ID = 'nc-floating-chat';
  let root = document.getElementById(ROOT_ID);

  if (!root) {
    root = document.createElement('div');
    root.id = ROOT_ID;
    BODY.appendChild(root);
  }

  root.innerHTML = `
    <div id="nc-chat-toggle" title="Open Nutrition Chat">
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5c-1.5 0-2.9-.4-4.1-1.1l-4.1 1.1 1.1-4.1A8.48 8.48 0 0 1 4 12a8.5 8.5 0 0 1 8.5-8.5 8.5 8.5 0 0 1 8.5 8.5z"/>
      </svg>
    </div>

    <div id="nc-chat-panel" class="nc-hidden">
      <div id="nc-chat-header">
        <span>Nutrition Coach</span>
        <button id="nc-chat-minimize" title="Minimize">−</button>
      </div>
      <div id="nc-chat-window"></div>
      <form id="nc-chat-form">
        <input id="nc-chat-input" type="text" placeholder="Ask about nutrition…" autocomplete="off" />
        <button type="submit">Send</button>
      </form>
    </div>
  `;

  const toggleBtn   = root.querySelector('#nc-chat-toggle');
  const panel       = root.querySelector('#nc-chat-panel');
  const minimizeBtn = root.querySelector('#nc-chat-minimize');
  const windowDiv   = root.querySelector('#nc-chat-window');
  const form        = root.querySelector('#nc-chat-form');
  const input       = root.querySelector('#nc-chat-input');
  const sendBtn     = form.querySelector('button');

  /* ---------- Toggle open/close ---------- */
  const toggle = () => {
    panel.classList.toggle('nc-hidden');
    if (!panel.classList.contains('nc-hidden')) {
      loadHistory(); // Load when opening
    }
  };
  toggleBtn.addEventListener('click', toggle);
  minimizeBtn.addEventListener('click', toggle);

  /* Click outside → hide */
  document.addEventListener('click', e => {
    if (!root.contains(e.target) && !panel.classList.contains('nc-hidden')) {
      panel.classList.add('nc-hidden');
    }
  });

  /* ---------- Append message with time ---------- */
  const append = (role, text, time = '') => {
    const msg = document.createElement('div');
    msg.className = `nc-msg ${role === 'assistant' ? 'nc-assistant' : 'nc-user'}`;

    const textEl = document.createElement('div');
    textEl.textContent = text;
    msg.appendChild(textEl);

    if (time) {
      const timeEl = document.createElement('div');
      timeEl.className = 'nc-msg-time';
      timeEl.textContent = time;
      msg.appendChild(timeEl);
    }

    windowDiv.appendChild(msg);
    windowDiv.scrollTop = windowDiv.scrollHeight;
  };

  /* ---------- Load history ---------- */
  const loadHistory = async () => {
    windowDiv.innerHTML = ''; // Clear
    try {
      const resp = await fetch(ncChatConfig.restUrl.replace('/chat', '/history'), {
        headers: { 'X-WP-Nonce': ncChatConfig.nonce }
      });
      const data = await resp.json();
      if (data?.history) {
        data.history.forEach(msg => {
          append(msg.role, msg.message, msg.time);
        });
      }
    } catch (err) {
      console.error('History load failed', err);
    }
  };

  /* ---------- Submit message ---------- */
  const submitMessage = async () => {
    const text = input.value.trim();
    if (!text) return;

    append('user', text); // Show immediately
    input.value = '';
    sendBtn.disabled = true;
    const loading = showLoading();

    try {
      const resp = await fetch(ncChatConfig.restUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-WP-Nonce': ncChatConfig.nonce
        },
        body: JSON.stringify({ message: text })
      });
      const data = await resp.json();
      removeLoading(loading);

      if (data?.reply) {
        append('assistant', data.reply, data.assistant_time);
      } else {
        append('assistant', data?.error || 'No response');
      }
    } catch (err) {
      removeLoading(loading);
      append('assistant', 'Network error');
      console.error(err);
    } finally {
      sendBtn.disabled = false;
      input.focus();
    }
  };

  const showLoading = () => {
    const el = document.createElement('div');
    el.className = 'nc-msg nc-assistant nc-loading';
    el.textContent = 'Thinking…';
    windowDiv.appendChild(el);
    windowDiv.scrollTop = windowDiv.scrollHeight;
    return el;
  };
  const removeLoading = el => el?.remove();

  form.addEventListener('submit', e => { e.preventDefault(); submitMessage(); });
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submitMessage();
    }
  });
});