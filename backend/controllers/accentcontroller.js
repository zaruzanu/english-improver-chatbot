const { transcribeAudio } = require('../utils/whisperutils');
const { textToSpeech } = require('../utils/ttsutils');
const Accent = require('../models/accent');
const path = require('path');
const fs = require('fs');

// ✅ Main Accent Improvement Route
exports.improveAccent = async (req, res) => {
  console.log('🎯 /improve-accent API hit');
  try {
    const audioPath = req.file.path;
    const email = req.body.email || 'unknown@example.com';
    const accent = req.body.accent || 'us';
    console.log('📁 Received audio file:', audioPath);
    const transcribedText = await transcribeAudio(audioPath);
    const correctedText = transcribedText;

    // ✅ Basic Pronunciation Feedback
    let issues = [];
    let tips = '';

    if (!transcribedText || transcribedText.trim().length < 5) {
      issues.push("Audio too short or unclear.");
      tips = "Try speaking clearly and a bit longer.";
    } else {
      if (accent === 'in' || accent === 'pk') {
        if (transcribedText.toLowerCase().includes('w')) {
          issues.push("‘W’ sound may need softening.");
          tips = "Try saying 'v' and 'w' separately to practice contrast.";
        }
      }

      if (accent === 'uk') {
        if (transcribedText.toLowerCase().includes("r") && !transcribedText.toLowerCase().includes("ar")) {
          issues.push("Avoid hard 'r' sounds if aiming for UK accent.");
          tips = "British English tends to soften post-vocalic R.";
        }
      }

      if (transcribedText.toLowerCase().includes("school")) {
        issues.push("‘School’ pronunciation might need more emphasis.");
      }

      if (tips === '') {
        tips = "Great effort! Try to vary tone and stress for clarity.";
      }
    }

    const pronunciationFeedback = {
      issues: issues.length > 0 ? issues : ["No major issues found."],
      tips,
    };

    // ✅ TTS: Generate audio path & synthesize
    const timestamp = Date.now();
    const fileName = `accent-${timestamp}.mp3`;
    const audioResponsePath = `public/audio/${fileName}`;

    if (correctedText && correctedText.trim()) {
      await textToSpeech(correctedText, audioResponsePath);
    } else {
      console.warn('⚠️ No corrected text found to synthesize.');
    }

    // ✅ Save record in MongoDB
    const accentRecord = new Accent({
      email,
      originalSpeech: transcribedText,
      transcribedText,
      correctedText,
      pronunciationFeedback,
      audioPath,
      accent,
    });

    await accentRecord.save();

    console.log("🧾 Transcription:", transcribedText);
    console.log("📣 Corrected Text:", correctedText);
    console.log("🗣️ Feedback:", pronunciationFeedback);
    console.log("🔊 TTS Audio:", audioResponsePath);

    // ✅ Send correct public audio URL
     const BACKEND_URL = 'http://localhost:5000';
 res.json({
  transcribedText,
  correctedText,
  pronunciationFeedback,
userAudioUrl: `${BACKEND_URL}/uploads/${path.basename(audioPath)}`,
audioUrl: `${BACKEND_URL}/audio/${path.basename(audioResponsePath)}`

});

  this.aiAudioUrl = res.audioUrl;
  } catch (error) {
    console.error('❌ improveAccent error:', error);
    res.status(500).json({ error: "Server error during accent improvement." });
  }
};
