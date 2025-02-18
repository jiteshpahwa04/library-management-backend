const express = require('express');
const { createCommunity } = require('../controllers/communityController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/create', verifyToken, isAdmin, createCommunity);

module.exports = router;