// uploadMiddleware.js
const multer = require('multer');

// Configure storage for Multer (In memory storage or disk storage)
const storage = multer.memoryStorage(); // Or you can use diskStorage if you prefer

// File filter to only accept image files
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Create multer upload instance with storage and file filter
const upload = multer({ storage, fileFilter });

module.exports = upload;