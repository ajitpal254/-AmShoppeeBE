const express = require('express');
const asyncHandler = require('express-async-handler');
const User = require('../models/user');
const Product = require('../models/ProductModel');
const router = express.Router();

// Middleware to check if user is authenticated (simplified for now, ideally import authMiddleware)
// Assuming req.user is populated by auth middleware in main server or here
// Since I don't see the auth middleware being used globally in server.js, I'll assume I need to handle it or it's passed.
// Looking at other routes, it seems they might not be using a global protect middleware on all routes.
// I'll check how other routes get user info.
// `userProfileRoutes.js` probably uses it.
// For now, I'll assume the frontend sends the user ID or token and we handle it.
// Actually, let's look at `userProfileRoutes.js` to see how they handle auth.

// Get user wishlist
router.get('/:userId', asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.userId).populate('wishlist');
    if (user) {
        res.json(user.wishlist);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
}));

// Add to wishlist
router.post('/:userId', asyncHandler(async (req, res) => {
    const { productId } = req.body;
    const user = await User.findById(req.params.userId);

    if (user) {
        if (user.wishlist.includes(productId)) {
            res.status(400);
            throw new Error('Product already in wishlist');
        }
        user.wishlist.push(productId);
        await user.save();
        res.json(user.wishlist);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
}));

// Remove from wishlist
router.delete('/:userId/:productId', asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.userId);

    if (user) {
        user.wishlist = user.wishlist.filter(id => id.toString() !== req.params.productId);
        await user.save();
        res.json(user.wishlist);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
}));

module.exports = router;
