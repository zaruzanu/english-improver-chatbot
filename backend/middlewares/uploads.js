const multer = require('multer');
const path = require('path');

// 🔧 Storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // make sure 'uploads/' folder exists
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `audio-${uniqueSuffix}${ext}`);
  }
});

// ✅ File type filter (optional but recommended)
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'audio/mp3',
    'audio/mpeg',
    'audio/wav',
    'audio/webm',
    'audio/ogg',
    'audio/mp4'
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('❌ Invalid audio format. Only common audio types are allowed.'), false);
  }
};

// ✅ Final export
const upload = multer({ storage, fileFilter });

module.exports = upload;
