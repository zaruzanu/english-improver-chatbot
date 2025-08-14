// models/chat.js — Only this
const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  sender: { type: String, enum: ['user', 'bot'], required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Chat', chatSchema);

