const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Health check route
app.get("/", (req, res) => {
  res.send("AskNutritionist Plugin API is running.");
});

app.post('/api/chat', (req, res) => {
  const { message } = req.body;
  const reply = `This is a reply to: "${message}"`;
  res.json({ reply });
});

app.listen(PORT, () => {
  console.log(`Chatbot plugin server running on http://localhost:${PORT}`);
});
