const express = require('express');
const router = express.Router();
const User = require('../models/user');
const UserProfile = require('../models/UserProfile');
const bcrypt = require('bcrypt');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            next();
        } catch (error) {
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// @route   GET /api/profile
// @desc    Get user profile
// @access  Private
router.get(
    '/',
    protect,
    asyncHandler(async (req, res) => {
        const user = await User.findById(req.user._id).select('-password');
        const userProfile = await UserProfile.findOne({ user: req.user._id });

        if (user) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                profilePicture: user.profilePicture,
                isAdmin: user.isAdmin,
                isVerified: user.isVerified,
                createdAt: user.createdAt,
                // Extended profile data
                address: userProfile ? userProfile.address : '',
                city: userProfile ? userProfile.city : '',
                country: userProfile ? userProfile.country : '',
                postalCode: userProfile ? userProfile.postalCode : '',
                bio: userProfile ? userProfile.bio : '',
                preferences: userProfile ? userProfile.preferences : {}
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    })
);

// @route   PUT /api/profile
// @desc    Update user profile
// @access  Private
router.put(
    '/',
    protect,
    asyncHandler(async (req, res) => {
        const user = await User.findById(req.user._id);
        let userProfile = await UserProfile.findOne({ user: req.user._id });

        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.phone = req.body.phone || user.phone;
            user.profilePicture = req.body.profilePicture || user.profilePicture;

            // Update password if provided
            if (req.body.password) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(req.body.password, salt);
            }

            const updatedUser = await user.save();

            // Update or create UserProfile
            if (!userProfile) {
                userProfile = new UserProfile({ user: user._id });
            }

            userProfile.address = req.body.address || userProfile.address;
            userProfile.city = req.body.city || userProfile.city;
            userProfile.country = req.body.country || userProfile.country;
            userProfile.postalCode = req.body.postalCode || userProfile.postalCode;
            userProfile.bio = req.body.bio || userProfile.bio;
            if (req.body.preferences) {
                userProfile.preferences = req.body.preferences;
            }

            const updatedUserProfile = await userProfile.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                phone: updatedUser.phone,
                profilePicture: updatedUser.profilePicture,
                isAdmin: updatedUser.isAdmin,
                isVerified: updatedUser.isVerified,
                token: jwt.sign(
                    { id: updatedUser._id, email: updatedUser.email },
                    process.env.JWT_SECRET,
                    { expiresIn: '30d' }
                ),
                // Extended profile data
                address: updatedUserProfile.address,
                city: updatedUserProfile.city,
                country: updatedUserProfile.country,
                postalCode: updatedUserProfile.postalCode,
                bio: updatedUserProfile.bio,
                preferences: updatedUserProfile.preferences
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    })
);

// @route   POST /api/profile/upload
// @desc    Upload profile picture
// @access  Private
router.post(
    '/upload',
    protect,
    asyncHandler(async (req, res) => {
        const { imageUrl } = req.body;

        if (!imageUrl) {
            return res.status(400).json({ message: 'Image URL is required' });
        }

        const user = await User.findById(req.user._id);

        if (user) {
            user.profilePicture = imageUrl;
            await user.save();

            res.json({
                message: 'Profile picture updated successfully',
                profilePicture: user.profilePicture,
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    })
);

// @route   GET /api/profile/:id
// @desc    Get user profile by ID (public)
// @access  Public
router.get(
    '/:id',
    asyncHandler(async (req, res) => {
        const user = await User.findById(req.params.id).select('-password -googleId');
        const userProfile = await UserProfile.findOne({ user: req.params.id });

        if (user) {
            res.json({
                _id: user._id,
                name: user.name,
                profilePicture: user.profilePicture,
                createdAt: user.createdAt,
                bio: userProfile ? userProfile.bio : ''
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    })
);

module.exports = router;
