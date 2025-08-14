const fs = require("fs");
const path = require("path");
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
ffmpeg.setFfmpegPath(ffmpegPath);
const { exec } = require("child_process");
const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // 🔐 Use .env
});

// ✅ Helper: Convert .webm to .mp3
function convertWebmToMp3(inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    const command = `ffmpeg -i "${inputPath}" -vn -ar 44100 -ac 2 -b:a 192k "${outputPath}" -y`;
    exec(command, (error) => {
      if (error) {
        console.error("❌ Error converting to .mp3:", error);
        return reject(error);
      }
      console.log("✅ Converted .webm to .mp3:", outputPath);
      resolve(outputPath);
    });
  });
}

// ✅ Main transcription function
async function transcribeAudio(filePath) {
  try {
    console.log("📥 Received audio file for transcription:", filePath);

    let finalPath = filePath;

    // Convert if .webm
    if (path.extname(filePath) === ".webm") {
      const mp3Path = filePath.replace(".webm", ".mp3");
      await convertWebmToMp3(filePath, mp3Path);

      const size = fs.statSync(mp3Path).size;
      console.log("📂 Converted MP3 file path:", mp3Path);
      console.log("📏 MP3 file size:", size, "bytes");

      finalPath = mp3Path;
    }

    console.log("🚀 Sending file to Whisper API...");
   const response = await openai.audio.transcriptions.create({
      file: fs.createReadStream(finalPath),
      model: "whisper-1",
    });

    console.log("📝 Transcription result:", response.text);
    return response.text;

  } catch (err) {
    console.error("❌ Whisper API error:", err);
    throw err;
  }
}

module.exports = {
  transcribeAudio
};
