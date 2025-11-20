const Cart = require('../models/CartModel');
const asyncHandler = require('express-async-handler');

// @route   POST /api/orders/addCart
// @desc    Add item to cart
// @access  Private
const addToCart = asyncHandler(async (req, res) => {
    const { id, name, image, price, quantity } = req.body;

    const cartItem = new Cart({
        user: req.user.id,
        product: id,
        name,
        image,
        price,
        quantity
    });

    const createdItem = await cartItem.save();
    res.json(createdItem);
});

module.exports = { addToCart };
