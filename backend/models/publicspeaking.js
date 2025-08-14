const mongoose = require('mongoose');

const PublicSpeakingSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  userAudioUrl: {
    type: String,
    required: true
  },
  userTranscription: {
    type: String,
    required: true
  },
  aiFeedback: {
    type: String,
    required: true
  },
  aiAudioUrl: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('PublicSpeaking', PublicSpeakingSchema);
