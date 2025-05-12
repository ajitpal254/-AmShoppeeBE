const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); // Added: Import jsonwebtoken
const User = require("./../models/user"); // Assuming your User model is in ./../models/user
const mongoose = require("mongoose"); // Keep if you perform mongoose specific operations here, otherwise it might just be for the model
const asyncHandler = require("express-async-handler");
require("dotenv").config();

// --- Environment Variable Check (Important Prerequisite) ---
// Ensure JWT_SECRET is set in your environment variables
if (!process.env.JWT_SECRET) {
  console.error("FATAL ERROR: JWT_SECRET is not defined in environment variables.");
  process.exit(1); // Exit the application if JWT_SECRET is not set
}

// --- Signup Route ---
router.post(
  "/signup",
  asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    // **1. Validate Input (Basic Example)**
    // You should add more robust validation here (e.g., using a library like Joi or express-validator)
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required (name, email, password)." });
    }
    // Basic email format validation (can be more sophisticated)
    if (!/\S+@\S+\.\S+/.test(email)) {
        return res.status(400).json({ message: "Invalid email format." });
    }
    // Basic password strength (example: min 6 characters)
    if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters long." });
    }

    // **2. Check if user already exists**
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User with this email already exists." }); // 409 Conflict
    }

    // **3. Hash password**
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // **4. Create and save new user**
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();

    // **5. Respond (excluding password)**
    // It's good practice not to send the password hash back in the response
    res.status(201).json({
      _id: savedUser._id,
      name: savedUser.name,
      email: savedUser.email,
      // createdAt: savedUser.createdAt, // if you have timestamps in your schema
      // updatedAt: savedUser.updatedAt, // if you have timestamps in your schema
    });
  })
);

// --- Test Route (Unchanged) ---
router.get("/test", (req, res) => {
  res.send("Test Route");
});

// --- Login Route ---
router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // **1. Validate Input**
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    console.log(`Attempting login for ${email}`);

    // **2. Find user by email**
    const user = await User.findOne({ email });
    if (!user) {
      // User not found. Return 401 to prevent email enumeration.
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // **3. Compare password**
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // Password does not match. Return 401.
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // **4. User authenticated, generate JWT token**
    const tokenPayload = {
      id: user._id,
      email: user.email,
      // You can add other non-sensitive user info here, like roles, if needed
    };

    const token = jwt.sign(
      tokenPayload,
      process.env.JWT_SECRET,
      { expiresIn: "15m" } // Token expiration time (e.g., 1 hour)
      // You can also add 'issuer', 'audience' etc. for more security
    );

    // **5. Respond with token and user info (excluding password)**
    res.status(200).json({
      message: "Login successful",
      token,
      status: 200,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  })
);

module.exports = router;