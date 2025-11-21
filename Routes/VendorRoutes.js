const express = require('express');
const jwt = require('jsonwebtoken');
const Vendor = require('../models/VendorModel');
const { sendVerificationEmail } = require('../utils/emailService');


const router = express.Router();

const JWT_SECRET_VENDOR = process.env.JWT_SECRET_VENDOR;

// POST /signup - Register a new vendor
router.post('/vendor/signup', async (req, res) => {
    try {
        const { name, email, password, businessCategory, niche, phone, website } = req.body;

        // Check if vendor already exists
        let vendor = await Vendor.findOne({ email });
        if (vendor) {
            return res.status(400).json({ msg: 'Vendor already exists.' });
        }

        // Create new vendor with isVerified set to false
        // Password will be hashed by the pre-save hook in VendorModel
        vendor = new Vendor({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password, // Plain password, model handles hashing
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

        // Send verification email
        await sendVerificationEmail(email, verificationLink, true);

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

// POST /login - Authenticate vendor and get token
router.post('/vendor/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Look up vendor by email
        const vendor = await Vendor.findOne({ email });
        if (!vendor) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Compare passwords using model method
        const isMatch = await vendor.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Check approval status
        if (vendor.approvalStatus === 'pending') {
            return res.status(403).json({
                msg: 'Your vendor account is pending admin approval. Please wait for approval before logging in.',
                approvalStatus: 'pending'
            });
        }

        if (vendor.approvalStatus === 'rejected') {
            return res.status(403).json({
                msg: `Your vendor account has been rejected. Reason: ${vendor.rejectionReason || 'Not specified'}`,
                approvalStatus: 'rejected',
                rejectionReason: vendor.rejectionReason
            });
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