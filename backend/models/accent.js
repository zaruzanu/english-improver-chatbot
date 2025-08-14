// models/accent.js
const mongoose = require('mongoose');

const AccentSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  originalSpeech: {
    type: String,
    required: true
  },
  correctedSpeech: {
    type: String
  },
  feedback: {
    type: String
  },
  audioPath: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Accent', AccentSchema);
