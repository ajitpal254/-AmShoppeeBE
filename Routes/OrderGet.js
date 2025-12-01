const express = require('express')
const orderSchema = require('../models/CartModel')
const asyncHandler = require('express-async-handler')
const cartOrder = express.Router();
const Cart = require('../models/CartModel')
const mongoose = require("mongoose");
const { protect } = require('../middleware/jwtauth');



cartOrder.get('/cart', protect, async (req, res) => {
    const cart = await Cart.find({ user: req.user.id })
    res.json(cart);
}
);
cartOrder.get('/cart/:id', asyncHandler(async (req, res) => {
    const product = await Cart.findById(req.params.id);
    if (product) {
        res.json(product)
    }
    else {
        res.status(404).json({ message: "Product not found" })
    }
}));

cartOrder.delete("/cart/:id", protect, (req, res) => {
    Cart.findByIdAndDelete(req.params.id)
        .exec()
        .then(() => {
            res.sendStatus(200)
        }).catch(() => {
            res.sendStatus(400)
        })

})


module.exports = cartOrder;
