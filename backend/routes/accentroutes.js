const express = require('express');
const multer = require('multer');
const { improveAccent, analyzePronunciation } = require('../controllers/accentcontroller');
const upload = require('../middlewares/uploads'); // ✅ import from middlewares/upload.js
const router = express.Router();

// ✅ Main Accent Improvement Route
router.post('/improve-accent', upload.single('audio'), improveAccent);

module.exports = router;
