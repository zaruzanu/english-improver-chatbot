require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Middleware
app.use(cors());
app.use(express.json());
app.use('/audio', express.static(path.join(__dirname, 'public/audio')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));
// ✅ Static route to serve audio files (TTS responses)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mydb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// ✅ Routes
const chatRoutes = require('./routes/chatroutes'); // Grammar
const accentRoutes = require('./routes/accentroutes'); // Accent
const publicSpeakingRoutes = require('./routes/publicspeakingroutes'); // Public Speaking

app.use('/api/chat', chatRoutes);                         // POST: /api/chat
app.use('/api/accent-improver', accentRoutes);            // POST: /api/accent-improver/improve-accent
app.use('/api/publicspeaking', publicSpeakingRoutes);     // POST: /api/publicspeaking/public-speaking

// ✅ Server Start
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
