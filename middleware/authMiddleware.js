const jwt = require('jsonwebtoken');
const Vendor = require('../models/VendorModel');
const User = require('../models/UserModel'); // Assuming you have a User model

// Middleware to verify vendor JWT token
const protectVendor = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.vendor = await Vendor.findById(decoded.id).select('-password');

            if (!req.vendor) {
                return res.status(401).json({ message: 'Not authorized as vendor' });
            }

            next();
        } catch (error) {
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// Middleware to verify user JWT token
const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Try to find user, if not found it might be a vendor or just invalid
            // For now, let's assume we just need to attach the decoded info or find the user
            // If you have a User model, uncomment the next line:
            // req.user = await User.findById(decoded.id).select('-password');
            req.user = decoded;

            next();
        } catch (error) {
            console.error('Token verification failed:', error.message);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

module.exports = { protectVendor, protect };
