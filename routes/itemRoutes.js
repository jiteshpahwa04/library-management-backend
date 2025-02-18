const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');
const { createItemHandler } = require('../controllers/itemController');

// Route to create a collection (with file upload)
router.post('/create', verifyToken, isAdmin, createItemHandler);

module.exports = router;