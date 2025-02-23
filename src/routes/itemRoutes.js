const express = require('express');
const router = express.Router();
const { verifyToken, isLibrarian } = require('../middlewares/authMiddleware');
const { createItemHandler } = require('../controllers/itemController');
const upload = require('../middlewares/filesUploadMiddleware');

// Route to create a collection (with file upload)
router.post('/create', verifyToken, isLibrarian, upload.array('files'), createItemHandler);

module.exports = router;