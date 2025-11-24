const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const dotenv = require('dotenv');

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post('/create-payment-intent', async (req, res) => {
    try {
        const { amount, currency } = req.body;

        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
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
