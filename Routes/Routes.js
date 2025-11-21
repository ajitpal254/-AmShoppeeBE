const express = require("express");
const router = express.Router();
const {
  registerUser,
  verifyEmail,
  loginUser,
  googleLogin
} = require("../controllers/userController");
require("dotenv").config();

// Ensure JWT_SECRET is set
if (!process.env.JWT_SECRET) {
  console.error("FATAL ERROR: JWT_SECRET is not defined in environment variables.");
  process.exit(1);
}

// Signup Route
router.post("/signup", registerUser);

// Verify Email Route
router.get("/verify/:token", verifyEmail);

// Test Route
router.get("/test", (req, res) => {
  res.send("Test Route");
});

// Login Route
router.post("/login", loginUser);

// Google Login Route
router.post("/google-login", googleLogin);

module.exports = router;