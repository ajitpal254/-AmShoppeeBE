const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const dotenv = require('dotenv');
const Order = require('../models/OrderModel');
const User = require('../models/user');
const { protect } = require('../middleware/authMiddleware');

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const CAD_EXCHANGE_RATE = 1.35;

router.post('/create-payment-intent', protect, async (req, res) => {
    try {
        const { orderId, currency = 'usd' } = req.body;

        if (!orderId) {
            return res.status(400).json({ error: 'Order ID is required' });
        }

        const normalizedCurrency = String(currency).toLowerCase();
        if (!['usd', 'cad'].includes(normalizedCurrency)) {
            return res.status(400).json({ error: 'Unsupported currency' });
        }

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        const user = await User.findById(req.user.id).select('isAdmin');
        const ownsOrder = order.User.toString() === req.user.id;
        if (!ownsOrder && !user?.isAdmin) {
            return res.status(403).json({ error: 'Not authorized for this order' });
        }

        if (order.isPaid) {
            return res.status(400).json({ error: 'Order is already paid' });
        }

        const orderTotal = Number(order.totalPrice) || 0;
        const convertedTotal =
            normalizedCurrency === 'cad'
                ? orderTotal * CAD_EXCHANGE_RATE
                : orderTotal;
        const amount = Math.round(convertedTotal * 100);

        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: normalizedCurrency,
            metadata: {
                orderId: order._id.toString(),
                userId: order.User.toString(),
            },
        });

        res.send({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        console.error('Stripe Error:', error);
        res.status(500).json({ error: error.message });
    }
});

router.get('/config/stripe', (req, res) => {
    res.send(process.env.STRIPE_PUBLISHABLE_KEY);
});

module.exports = router;
