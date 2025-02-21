const express = require('express');
const { createCommunity } = require('../controllers/communityController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

const router = express.Router();

router.post('/create', verifyToken, isAdmin, upload.single('logo'), createCommunity);

module.exports = router;