const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const UserProfile = require("../models/UserProfile");
const { sendVerificationEmail } = require("../utils/emailService");
const { admin } = require('../config/firebaseAdmin');

// @desc    Register a new user
// @route   POST /app/signup
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, phone, address, city, country, postalCode } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required (name, email, password)." });
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
        return res.status(400).json({ message: "Invalid email format." });
    }
    if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters long." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(409).json({ message: "User with this email already exists." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
        name,
        email,
        password: hashedPassword,
        phone: phone || null,
        isVerified: false
    });

    const savedUser = await newUser.save();

    const userProfile = new UserProfile({
        user: savedUser._id,
        address: address || '',
        city: city || '',
        country: country || '',
        postalCode: postalCode || ''
    });
    await userProfile.save();

    const verificationToken = jwt.sign(
        { id: savedUser._id },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
    );

    const domain = process.env.NODE_ENV === 'production'
        ? 'https://3amShoppme.netlify.app'
        : 'http://localhost:3000';
    const verificationLink = `${domain}/verify/${verificationToken}`;

    try {
        await sendVerificationEmail(savedUser.email, verificationLink);
    } catch (error) {
        console.error("Error sending verification email:", error);
    }

    res.status(201).json({
        _id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        phone: savedUser.phone,
        isVerified: savedUser.isVerified,
        message: "Registration successful. Please check your email to verify your account.",
        token: jwt.sign(
            { id: savedUser._id, email: savedUser.email },
            process.env.JWT_SECRET,
            { expiresIn: "30d" }
        )
    });
});

// @desc    Verify email
// @route   GET /app/verify/:token
// @access  Public
const verifyEmail = asyncHandler(async (req, res) => {
    const { token } = req.params;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(400).json({ message: "Invalid token. User not found." });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: "User already verified." });
        }

        user.isVerified = true;
        await user.save();

        res.status(200).json({ message: "Email verified successfully." });
    } catch (error) {
        console.error("Verification error:", error);
        res.status(400).json({ message: "Invalid or expired token." });
    }
});

// @desc    Auth user & get token
// @route   POST /app/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(401).json({ message: "Invalid credentials." });
    }

    if (!user.isVerified) {
        return res.status(401).json({ message: "Please verify your email before logging in." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials." });
    }

    const tokenPayload = {
        id: user._id,
        email: user.email,
    };

    const token = jwt.sign(
        tokenPayload,
        process.env.JWT_SECRET,
        { expiresIn: "30d" }
    );

    res.status(200).json({
        message: "Login successful",
        token,
        status: 200,
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            isVerified: user.isVerified
        },
    });
});

// @desc    Google login
// @route   POST /app/google-login
// @access  Public
const googleLogin = asyncHandler(async (req, res) => {
    const { token: idToken, attemptingAdminLogin } = req.body;

    if (!idToken) {
        return res.status(400).json({ message: "Google ID token is required." });
    }

    try {
        let decodedToken;
        try {
            decodedToken = await admin.auth().verifyIdToken(idToken);
        } catch (verifyError) {
            console.error('Firebase token verification failed:', verifyError.message);
            return res.status(401).json({
                message: "Invalid Google token. Please try again.",
                error: verifyError.message
            });
        }

        const { email, name, picture, uid } = decodedToken;

        if (!email) {
            return res.status(400).json({ message: "Email not provided by Google." });
        }

        let user = await User.findOne({ email });

        if (!user) {
            user = new User({
                name: name || email.split('@')[0],
                email: email,
                password: await bcrypt.hash(uid + process.env.JWT_SECRET, 10),
                googleId: uid,
                isAdmin: false,
                isVerified: true
            });

            await user.save();

            const userProfile = new UserProfile({
                user: user._id
            });
            await userProfile.save();

        } else {
            if (!user.googleId) {
                user.googleId = uid;
                await user.save();
            }
        }

        if (attemptingAdminLogin && !user.isAdmin) {
            return res.status(403).json({
                message: "You don't have admin privileges with this Google account."
            });
        }

        const tokenPayload = {
            id: user._id,
            email: user.email,
        };

        const jwtToken = jwt.sign(
            tokenPayload,
            process.env.JWT_SECRET,
            { expiresIn: "30d" }
        );

        res.status(200).json({
            message: "Google login successful",
            token: jwtToken,
            status: 200,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                isVerified: user.isVerified
            },
        });

    } catch (error) {
        console.error('Google login error:', error);
        res.status(500).json({
            message: "Google login failed. Please try again.",
            error: error.message
        });
    }
});

module.exports = {
    registerUser,
    verifyEmail,
    loginUser,
    googleLogin
};
