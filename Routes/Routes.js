const express = require("express");
const router = express.Router();
const {
  registerUser,
  verifyEmail,
  loginUser,
  googleLogin,
  forgotPassword,
  resetPassword
} = require("../controllers/userController");
const { authLimiter } = require("../middleware/rateLimiters");
require("dotenv").config();

// Ensure JWT_SECRET is set
if (!process.env.JWT_SECRET) {
  console.error("FATAL ERROR: JWT_SECRET is not defined in environment variables.");
  process.exit(1);
}

// Signup Route
router.post("/signup", authLimiter, registerUser);

// Verify Email Route
router.get("/verify/:token", verifyEmail);

// Test Route
router.get("/test", (req, res) => {
  res.send("Test Route");
});

// Login Route
router.post("/login", authLimiter, loginUser);

// Google Login Route
router.post("/google-login", authLimiter, googleLogin);

// Forgot Password Route
router.post("/forgot-password", authLimiter, forgotPassword);

// Reset Password Route
router.post("/reset-password", authLimiter, resetPassword);

module.exports = router;