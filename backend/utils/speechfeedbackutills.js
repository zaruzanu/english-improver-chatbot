// utils/speechfeedbackutils.js

function analyzeSpeechMetrics(transcript, durationInSeconds = null) {
  const words = transcript.trim().split(/\s+/);
  const wordCount = words.length;

  const fillerWords = ["um", "uh", "like", "you know", "so", "actually"];
  const fillerCount = words.filter(word =>
    fillerWords.includes(word.toLowerCase())
  ).length;

  const sentences = transcript.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const avgSentenceLength = sentences.length > 0 ? (wordCount / sentences.length).toFixed(2) : 0;

  const paceWPM = durationInSeconds
    ? ((wordCount / durationInSeconds) * 60).toFixed(2)
    : null;

  return {
    wordCount,
    fillerCount,
    fillerRate: ((fillerCount / wordCount) * 100).toFixed(2),
    avgSentenceLength,
    paceWPM,
    tone: "neutral" // Placeholder – real tone analysis would need AI model or sentiment analysis
  };
}

module.exports = { analyzeSpeechMetrics };
