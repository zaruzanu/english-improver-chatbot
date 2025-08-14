// utils/ffmpegutils.js
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');

/**
 * Converts a .webm file to .mp3 using FFmpeg.
 * @param {string} inputPath - Path to the .webm file
 * @param {string} outputPath - Desired output .mp3 path
 * @returns {Promise<void>}
 */
exports.convertWebmToMp3 = (inputPath, outputPath) => {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .toFormat('mp3')
      .on('end', () => {
        console.log(`🎵 FFmpeg: Converted → ${outputPath}`);
        resolve();
      })
      .on('error', (err) => {
        console.error('❌ FFmpeg Error:', err.message);
        reject(err);
      })
      .save(outputPath);
  });
};
