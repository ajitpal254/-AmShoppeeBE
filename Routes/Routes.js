const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./../models/user");
const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const sendVerificationEmail = require("../middleware/verificationEmail");
require("dotenv").config();

// Ensure JWT_SECRET is set
if (!process.env.JWT_SECRET) {
  console.error("FATAL ERROR: JWT_SECRET is not defined in environment variables.");
  process.exit(1);
}

// Signup Route
router.post(
  "/signup",
  asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    // Validate Input
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required (name, email, password)." });
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).json({ message: "Invalid email format." });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long." });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User with this email already exists." });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create and save new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      isVerified: false // Explicitly set to false
    });

    const savedUser = await newUser.save();

    // Generate verification token
    const verificationToken = jwt.sign(
      { id: savedUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Create verification link
    const domain = process.env.NODE_ENV === 'production'
      ? 'https://3amShoppme.netlify.app'
      : 'http://localhost:3000';
    const verificationLink = `${domain}/verify/${verificationToken}`;

    // Send verification email
    try {
      await sendVerificationEmail(savedUser.email, verificationLink);
    } catch (error) {
      console.error("Error sending verification email:", error);
      // Continue even if email fails
    }

    // Respond
    res.status(201).json({
      _id: savedUser._id,
      name: savedUser.name,
      email: savedUser.email,
      isVerified: savedUser.isVerified,
      message: "Registration successful. Please check your email to verify your account.",
      token: jwt.sign(
        { id: savedUser._id, email: savedUser.email },
        process.env.JWT_SECRET,
        { expiresIn: "30d" }
      )
    });
  })
);

// Verify Email Route
router.get(
  "/verify/:token",
  asyncHandler(async (req, res) => {
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
  })
);

// Test Route
router.get("/test", (req, res) => {
  res.send("Test Route");
});

// Login Route
router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Validate Input
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    console.log(`Attempting login for ${email}`);

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // Generate JWT token with 30-day expiration
    const tokenPayload = {
      id: user._id,
      email: user.email,
    };

    const token = jwt.sign(
      tokenPayload,
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    // Respond with token and user info
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
  })
);

// Google Login Route
router.post(
  "/google-login",
  asyncHandler(async (req, res) => {
    const { token: idToken, attemptingAdminLogin } = req.body;

    // Validate input
    if (!idToken) {
      return res.status(400).json({ message: "Google ID token is required." });
    }

    try {
      // Import Firebase Admin
      const { admin } = require('../config/firebaseAdmin');

      // Verify the Firebase ID token
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

      console.log(`Google login attempt for: ${email}`);

      // Check if user exists
      let user = await User.findOne({ email });

      if (!user) {
        // Create new user if doesn't exist
        console.log(`Creating new user from Google login: ${email}`);

        user = new User({
          name: name || email.split('@')[0],
          email: email,
          password: await bcrypt.hash(uid + process.env.JWT_SECRET, 10), // Random secure password
          googleId: uid,
          isAdmin: false, // New Google users are not admin by default
          isVerified: true // Google users are verified by default
        });

        await user.save();
        console.log(`New user created: ${user._id}`);
      } else {
        // Update googleId if not set
        if (!user.googleId) {
          user.googleId = uid;
          await user.save();
        }
      }

      // Check admin access if attempting admin login
      if (attemptingAdminLogin && !user.isAdmin) {
        return res.status(403).json({
          message: "You don't have admin privileges with this Google account."
        });
      }

      // Generate JWT token
      const tokenPayload = {
        id: user._id,
        email: user.email,
      };

      const jwtToken = jwt.sign(
        tokenPayload,
        process.env.JWT_SECRET,
        { expiresIn: "30d" }
      );

      // Respond with token and user info
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
  })
);

module.exports = router;