const fs = require('fs');
const path = require('path');
const OpenAI = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const accentVoiceMap = {
  default: 'nova',
  us: 'nova',
  uk: 'shimmer',
  india: 'echo',
  pakistan: 'fable',
  germany: 'onyx',
  australia: 'alloy'
};

exports.textToSpeech = async (text, filepath, accent = 'default') => {
  try {
    if (!text || !text.trim()) throw new Error('❌ No valid text for TTS');

    const dir = path.dirname(filepath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log('📂 [TTS] Created output directory:', dir);
    }

    const voice = accentVoiceMap[accent.toLowerCase()] || accentVoiceMap.default;

    console.log('🗣️ [TTS] Generating voice for:', text);
    console.log('🌍 [TTS] Selected voice:', voice);
    console.log('📁 [TTS] File will be saved to:', filepath);

    const response = await openai.audio.speech.create({
      model: 'tts-1',
      voice: voice,
      input: text,
      response_format: 'mp3'  // ✅ Ensures clean MP3
    });

    const buffer = Buffer.from(await response.arrayBuffer());
    fs.writeFileSync(filepath, buffer);

    const stats = fs.statSync(filepath);
    if (stats.size === 0) {
      throw new Error('❌ TTS file created but is empty.');
    }

    console.log('✅ [TTS] MP3 saved successfully at:', filepath);
    return filepath;
  } catch (err) {
    console.error('❌ [TTS] Error generating speech:', err.message);
    
    // 🔁 Optional fallback: Try with default voice
    if (accent !== 'default') {
      console.log('🔁 [TTS] Retrying with default voice (nova)...');
      return await exports.textToSpeech(text, filepath, 'default');
    }

    throw err;
  }
};
