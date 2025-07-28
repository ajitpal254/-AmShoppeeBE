const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Vendor = require('../models/VendorModel');
const sendVerificationEmail = require('../middleware/verificationEmail');
const rateLimit = require('express-rate-limit');

const router = express.Router();

const JWT_SECRET_VENDOR = process.env.JWT_SECRET_VENDOR;

// POST /signup - Register a new vendor
const signupLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: { msg: 'Too many signup attempts from this IP, please try again later.' }
});
router.post('/vendor/signup', signupLimiter, async (req, res) => {
    try {
        const { name, email, password, businessCategory, niche, phone, website } = req.body;

        // Check if vendor already exists
        let vendor = await Vendor.findOne({ email });
        if (vendor) {
            return res.status(400).json({ msg: 'Vendor already exists.' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new vendor with isVerified set to false (make sure your VendorModel supports this field)
        vendor = new Vendor({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            businessCategory: req.body.businessCategory,
            niche: req.body.niche,
            phone: req.body.phone,
            website: req.body.website,
            isVerified: false
        });

        await vendor.save();

        // Generate verification token (expires in 24h)
        const verificationToken = jwt.sign({ id: vendor._id }, JWT_SECRET_VENDOR, { expiresIn: '24h' });
        // Create verification link (adjust the domain as needed)
        const domain = process.env.NODE_ENV === 'production' ? 'https://3amShoppme.netlify.app' : 'http://localhost:3000';
        const verificationLink = domain + '/vendor/verify/' + verificationToken;

        // Send verification email (implement your actual email sending logic)
        await sendVerificationEmail(email, verificationLink);

        // Generate auth token for immediate use if needed
        const token = jwt.sign({ id: vendor._id }, JWT_SECRET_VENDOR, { expiresIn: '1h' });

        res.status(201).json({ vendor, token, msg: 'Verification email sent.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
});

// GET /vendor/verify/:token - Email verification endpoint
router.get('/vendor/verify/:token', async (req, res) => {
    try {
        const { token } = req.params;
        const decoded = jwt.verify(token, JWT_SECRET_VENDOR);

        const vendor = await Vendor.findById(decoded.id);
        if (!vendor) {
            return res.status(400).json({ msg: 'Invalid token' });
        }
        if (vendor.isVerified) {
            return res.status(400).json({ msg: 'Vendor already verified.' });
        }

        vendor.isVerified = true;
        await vendor.save();

        res.json({ msg: 'Email verified successfully.' });
    } catch (err) {
        console.error(err);
        res.status(400).json({ msg: 'Invalid or expired token' });
    }
});

// Dummy email sending function (replace with real implementation)

// POST /login - Authenticate vendor and get token
router.post('/vendor/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Look up vendor by email
        const vendor = await Vendor.findOne({ email });
        if (!vendor) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, vendor.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Generate token
        const token = jwt.sign({ id: vendor._id }, JWT_SECRET_VENDOR, { expiresIn: '1h' });
        
        res.json({ vendor, token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
});

module.exports = router;