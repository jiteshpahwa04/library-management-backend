const express = require('express');
const router = express.Router();
const { createCollectionHandler } = require('../controllers/collectionController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/logoUploadMiddleware');

// Route to create a collection (with file upload)
router.post('/create', verifyToken, isAdmin, upload.single('logo'), createCollectionHandler);

module.exports = router;