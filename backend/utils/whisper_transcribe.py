# whisper_transcribe.py
import whisper
import sys

audio_path = sys.argv[1]  # Get audio file path from Node.js

model = whisper.load_model("base")  # You can also try "tiny" (faster) or "small"

result = model.transcribe(audio_path)

print(result["text"])  # Send back transcription to Node.js
