const { addItemsToCart, removeItemFromCart, submitCart, getCart, reviewRequest, getRequestedItems, getUserCartStatus } = require("../services/cartService.js");

/// USER ///

async function getCartHandler(req, res) {
    try {
        const userId = req.user.userId;
        const cart = await getCart(userId);
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function addItemHandler(req, res) {
    try {
        const { itemId } = req.body;
        const userId = req.user.userId;

        if (!itemId) return res.status(400).json({ error: "Item ID is required" });

        await addItemsToCart(userId, itemId);
        res.status(200).json({
            success: true,
            messag: "Item added to the cart"
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function removeItemHandler(req, res) {
    try {
        const { cartItemId } = req.body;

        if (!cartItemId) return res.status(400).json({ error: "Cart Item ID is required" });

        await removeItemFromCart(cartItemId);
        res.status(200).json({
            success: true,
            messag: "Item removed from the cart"
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function submitCartHandler(req, res) {
    try {
        const userId = req.user.userId;
        const cart = await submitCart(userId);
        res.status(200).json({
            success: true,
            messag: "Cart submitted successfully"
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getUserCartStatusHandler(req, res) {
    try {
        const { userId } = req.user;
        const { page = 1, limit = 10 } = req.query;

        const data = await getUserCartStatus(userId, page, limit);

        return res.status(200).json(data);
    } catch (error) {
        console.error("Error fetching cart status:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

/// LIBRARIAN ///

async function getRequestedItemsHandler(req, res) {
    try {
        const { userId, page = 0, limit = 10 } = req.query;
        const data = await getRequestedItems(userId, page, limit);

        return res.status(200).json(data);
    } catch (error) {
        console.error("Error fetching requested items:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

async function reviewRequestHandler(req, res) {
    try {
        const data = req.body;
        const librarianId = req.user.userId;
        await reviewRequest(data.itemId, data.action, librarianId);
        res.status(200).json({
            success: true,
            messag: "Item response sent successfully"
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = { getCartHandler, addItemHandler, removeItemHandler, submitCartHandler, getUserCartStatusHandler, getRequestedItemsHandler, reviewRequestHandler };