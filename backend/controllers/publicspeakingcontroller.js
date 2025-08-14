const fs = require('fs');
const path = require('path');
const { transcribeAudio } = require('../utils/whisperutils');
const { convertWebmToMp3 } = require('../utils/ffmpegutils');
const { textToSpeech } = require('../utils/ttsutils');
const PublicSpeaking = require('../models/publicspeaking');
const OpenAI = require('openai');

// ✅ OpenAI Setup
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.publicSpeaking = async (req, res) => {
  try {
    console.log('\n🎤 [ROUTE HIT] POST /api/publicspeaking/public-speaking');
    console.log('📁 Uploaded File:', req.file?.originalname || 'None');
    console.log('📧 Email in Request:', req.body.email || 'None');

    // ✅ Clean email and tone
    const rawEmail = req.body.email || 'guest';
    const userEmail = rawEmail.replace(/[^a-zA-Z0-9]/g, '_') || 'guest';
    const selectedTone = req.body.tone || 'formal';
    console.log(`👤 Email: ${userEmail}`);
    // ✅ Uploaded webm file path
    const webmPath = req.file?.path;
    if (!webmPath) {
      console.error('❌ No audio file provided');
      return res.status(400).json({ error: 'No audio file provided' });
    }

    console.log(`📥 Uploaded file path: ${webmPath}`);

    // ✅ Convert to mp3
    const mp3Path = `${webmPath}.mp3`;
    await convertWebmToMp3(webmPath, mp3Path);
    console.log(`🎼 Converted to mp3: ${mp3Path}`);

    // ✅ Transcription using Whisper
    console.log(`📥 Transcribing: ${mp3Path}`);
    const transcript = await transcribeAudio(mp3Path);
    console.log(`📝 Transcription result: ${transcript}`);

    // ✅ Professional tone rephrasing
    const professionalVersion = await generateSpeakingFeedback(transcript, selectedTone);
    console.log(`🧠 Rephrased (Tone: ${selectedTone}): ${professionalVersion}`);

    // ✅ Ensure audio folder exists
    const audioDir = path.join(__dirname, '../public/audio');
    if (!fs.existsSync(audioDir)) {
      fs.mkdirSync(audioDir, { recursive: true });
      console.log('📂 Created audio folder');
    }

    // ✅ Generate TTS
    const ttsFileName = `${userEmail}-public-speaking-response.mp3`;
    const ttsFilePath = path.join(audioDir, ttsFileName);
    console.log(`🗣️ Starting TTS for: ${professionalVersion}`);
    await textToSpeech(professionalVersion, ttsFilePath);
    console.log(`🔊 TTS saved at: ${ttsFilePath}`);

    // ✅ URLs
    const userAudioUrl = `http://localhost:5000/${webmPath.replace('uploads/', '')}`;
    const aiAudioUrl = `http://localhost:5000/audio/${ttsFileName}`;

    // ✅ Save to DB
    await PublicSpeaking.create({
  email: userEmail,
  userTranscription: transcript,     // ✅ match your schema
  aiFeedback: professionalVersion,   // ✅ match your schema
  audioPath: webmPath,
  userAudioUrl,
  aiAudioUrl
});
   console.log('💾 Session saved to MongoDB');

    // ✅ Send frontend JSON
    res.json({
      transcription: transcript,
      professionalVersion,
      userAudioUrl,
      aiAudioUrl
    });

    console.log('✅ Response sent successfully.');

  } catch (err) {
    console.error('❌ Error in publicSpeaking controller:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// ✅ Helper: Generate professional rephrasing with selected tone
async function generateSpeakingFeedback(transcript, tone = 'formal') {
  const prompt = `Convert the following speech into a ${tone} tone. Make it sound confident, clear, and professional:\n\n"${transcript}"`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });

    return response.choices[0].message.content.trim();
  } catch (err) {
    console.error('❌ GPT Rephrase Error:', err.message);
    return transcript;
  }
}
