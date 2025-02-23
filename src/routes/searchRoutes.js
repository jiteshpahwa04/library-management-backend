const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');
const { isUser, verifyToken } = require('../middlewares/authMiddleware');

router.get('/', verifyToken, isUser, searchController.searchHandler);

module.exports = router;