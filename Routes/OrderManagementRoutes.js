const express = require('express');
const router = express.Router();
const Order = require('../models/OrderModel');
const Cart = require('../models/CartModel');
const { protect } = require('../middleware/jwtauth');

// Create order from cart items
router.post('/orders', protect, async (req, res) => {
    try {
        // Get user's cart items
        const cartItems = await Cart.find({ user: req.user.id });

        if (cartItems.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        // Calculate total
        const totalPrice = cartItems.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);

        // Create order items
        const orderItems = cartItems.map(item => ({
            name: item.name,
            qty: item.quantity,
            image: item.image,
            price: item.price,
            Product: item.id
        }));

        // Create order
        const order = new Order({
            User: req.user.id,
            orderItems: orderItems,
            totalPrice: totalPrice,
            isPaid: false,
            isDelieved: false
        });

        const createdOrder = await order.save();

        // Clear user's cart after order creation
        await Cart.deleteMany({ user: req.user.id });

        res.status(201).json(createdOrder);
    } catch (error) {
        console.error('Order creation error:', error);
        res.status(500).json({ message: 'Failed to create order', error: error.message });
    }
});

// Get ALL orders (admin only)
router.get('/admin/orders', protect, async (req, res) => {
    try {
        // Check if user is admin
        const User = require('../models/user');
        const user = await User.findById(req.user.id);

        if (!user || !user.isAdmin) {
            return res.status(403).json({ message: 'Not authorized as admin' });
        }

        const orders = await Order.find({}).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.error('Fetch all orders error:', error);
        res.status(500).json({ message: 'Failed to fetch orders' });
    }
});

// Get user's orders
router.get('/orders', protect, async (req, res) => {
    try {
        const orders = await Order.find({ User: req.user.id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.error('Fetch orders error:', error);
        res.status(500).json({ message: 'Failed to fetch orders' });
    }
});

// Get single order by ID
router.get('/orders/:id', protect, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order && order.User.toString() === req.user.id) {
            res.json(order);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch order' });
    }
});

module.exports = router;
