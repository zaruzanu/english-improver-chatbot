const express = require('express');
const router = express.Router();
const multer = require('multer');

// Set up Multer for .webm file uploads
const upload = multer({ dest: 'uploads/' });

const { publicSpeaking } = require('../controllers/publicspeakingcontroller'); // ✅ use correct function name

// ✅ Public Speaking Route
router.post(
  '/public-speaking',
  upload.single('audio'),
  (req, res, next) => {
    console.log('\n🎤 [ROUTE HIT] POST /api/publicspeaking/public-speaking');

    if (!req.file) {
      console.error('❌ No audio file found in request.');
      return res.status(400).json({ error: 'Audio file is required.' });
    }

    console.log('📁 Uploaded File:', req.file.originalname);
    console.log('📧 Email in Request:', req.body.email);

    next();
  },
  publicSpeaking
);

module.exports = router;
