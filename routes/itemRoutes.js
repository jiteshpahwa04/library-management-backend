const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');
const { createItemHandler } = require('../controllers/itemController');
const upload = require('../middlewares/uploadMiddleware');

// Route to create a collection (with file upload)
router.post('/create', verifyToken, isAdmin, upload.array('files'), createItemHandler);

module.exports = router;