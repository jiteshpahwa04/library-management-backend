const express = require("express");
const { addItemHandler, submitCartHandler, getCartHandler, removeItemHandler, reviewRequestHandler, getRequestedItemsHandler, getUserCartStatusHandler } = require("../controllers/cartController.js");
const { verifyToken, isUser, isLibrarian } = require('../middlewares/authMiddleware');

const router = express.Router();

// for user
router.get("/", verifyToken, isUser, getCartHandler);
router.post("/add", verifyToken, isUser, addItemHandler);
router.post("/remove", verifyToken, isUser, removeItemHandler);
router.post("/submit", verifyToken, isUser, submitCartHandler);
router.get("/status", verifyToken, isUser, getUserCartStatusHandler);

// for librarian
router.get("/requests", verifyToken, isLibrarian, getRequestedItemsHandler);
router.post("/review", verifyToken, isLibrarian, reviewRequestHandler);

module.exports = router;