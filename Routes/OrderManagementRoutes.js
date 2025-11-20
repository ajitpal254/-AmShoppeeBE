const express = require('express');
const router = express.Router();
const Order = require('../models/OrderModel');
const Cart = require('../models/CartModel');
const { protect } = require('../middleware/jwtauth');

// Create order from cart items
router.post('/orders', protect, async (req, res) => {
    try {
        const {
            orderItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            couponCode,
            discount
        } = req.body;

        if (orderItems && orderItems.length === 0) {
            return res.status(400).json({ message: 'No order items' });
        }

        // Create order
        const order = new Order({
            User: req.user.id,
            orderItems: orderItems,
            shippingAddress: shippingAddress,
            paymentMethod: paymentMethod || 'PayPal',
            itemsPrice: itemsPrice,
            taxPrice: taxPrice,
            shippingPrice: shippingPrice,
            totalPrice: totalPrice,
            couponCode: couponCode,
            discount: discount || 0,
            isPaid: false,
            isDelivered: false
        });

        const createdOrder = await order.save();

        // Optionally clear user's cart after order creation
        // await Cart.deleteMany({ user: req.user.id });

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

// Update order payment status (admin only)
router.put('/admin/orders/:id/payment', protect, async (req, res) => {
    try {
        const User = require('../models/user');
        const user = await User.findById(req.user.id);

        if (!user || !user.isAdmin) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        order.isPaid = req.body.isPaid;
        if (req.body.isPaid) {
            order.paidAt = Date.now();
        }

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } catch (error) {
        console.error('Update payment status error:', error);
        res.status(500).json({ message: 'Failed to update payment status' });
    }
});

// Update order delivery status (admin only)
router.put('/admin/orders/:id/delivery', protect, async (req, res) => {
    try {
        const User = require('../models/user');
        const user = await User.findById(req.user.id);

        if (!user || !user.isAdmin) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        order.isDelivered = req.body.isDelivered;
        // Also update old field name if it exists
        if (order.isDelieved !== undefined) {
            order.isDelieved = req.body.isDelivered;
        }
        if (req.body.isDelivered) {
            order.deliveredAt = Date.now();
        }

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } catch (error) {
        console.error('Update delivery status error:', error);
        res.status(500).json({ message: 'Failed to update delivery status' });
    }
});

module.exports = router;

