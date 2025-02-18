const express = require('express');
const router = express.Router();
const { createCollectionHandler } = require('../controllers/collectionController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

// Route to create a collection (with file upload)
router.post('/create', verifyToken, isAdmin, createCollectionHandler);

module.exports = router;