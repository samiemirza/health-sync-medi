// server.js
const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();    // npm install dotenv

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;
const DEEPSEEK_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_URL = 'https://api.deepseek.ai/v3/chat';

app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;
  try {
    const dsRes = await axios.post(
      DEEPSEEK_URL,
      {
        model: 'deepseek-v3',
        messages: [
          { role: 'system', content: 'You are a first-aid and general healthcare assistant. Include a disclaimer that you are not a substitute for professional advice.' },
          { role: 'user', content: userMessage }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${DEEPSEEK_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    const reply = dsRes.data.choices[0].message.content;
    res.json({ reply });
  } catch (err) {
    console.error('DeepSeek error:', err.response?.data || err.message);
    res.status(500).json({ error: 'DeepSeek API error' });
  }
});

app.listen(PORT, () => console.log(`🚀 Server on http://localhost:${PORT}`));
