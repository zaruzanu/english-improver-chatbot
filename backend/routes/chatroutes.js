// routes/chatroutes.js
const express = require('express');
const router = express.Router();
const Chat = require('../models/chat');
const axios = require('axios');
// POST /api/chat — Handle user message & get bot reply
router.post('/chat', async (req, res) => {
  const { email, message } = req.body;
  console.log("Request landed here")
  try {
    // Save user's message
    const userChat = new Chat({ sender: 'user', message });
    await userChat.save();

    // Get corrected version from GPT-4o
    const botReply = await callO4MiniModel(message);

    // Save bot's reply
    const botChat = new Chat({ sender: 'bot', message: botReply });
    await botChat.save();

    res.json({ botReply });
  } catch (err) {
    console.error('Chat error:', err.message);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// GET /api/history/:email — Retrieve chat history
router.get('/history/:email', async (req, res) => {
  try {
    const chats = await Chat.find({ email: req.params.email }).sort({ timestamp: 1 });
    res.json({ history: chats });
  } catch (err) {
    console.error('History error:', err.message);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Function to call OpenAI GPT-4o
async function callO4MiniModel(userMessage) {
  try {
    console.log("Chat gpt api called")
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are an English grammar corrector. Only return the corrected version of the user’s message without explanation.',
          },
          {
            role: 'user',
            content: userMessage,
          }
        ],
        temperature: 0.5
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log(response.data.choices)
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API error:', error);
    return '⚠️ Sorry, the AI could not process your message.';
  }
}
module.exports = router;
