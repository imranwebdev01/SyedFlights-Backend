// ============================================================
// AUTH ROUTES — /api/auth/*
// ============================================================
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db/database");
const { authenticateToken, JWT_SECRET } = require("../middleware/auth");

const router = express.Router();

const SALT_ROUNDS = 10;
const TOKEN_EXPIRY = "7d"; // tokens stay valid for 7 days

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ------------------------------------------------------------
// POST /api/auth/signup
// ------------------------------------------------------------
router.post("/signup", async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    // ---- Validation ----
    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Full name, email, and password are all required.",
      });
    }

    if (fullName.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: "Full name must be at least 2 characters.",
      });
    }

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters.",
      });
    }

    // ---- Check if email is already registered ----
    const existingUser = db
      .prepare("SELECT id FROM users WHERE email = ?")
      .get(email.toLowerCase());

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists. Try logging in.",
      });
    }

    // ---- Hash password & create user ----
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const result = db
      .prepare(
        "INSERT INTO users (full_name, email, password_hash) VALUES (?, ?, ?)"
      )
      .run(fullName.trim(), email.toLowerCase(), passwordHash);

    const newUser = {
      id: result.lastInsertRowid,
      fullName: fullName.trim(),
      email: email.toLowerCase(),
    };

    // ---- Issue JWT so the user is logged in immediately after signup ----
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email },
      JWT_SECRET,
      { expiresIn: TOKEN_EXPIRY }
    );

    res.status(201).json({
      success: true,
      message: "Account created successfully!",
      token,
      user: newUser,
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again.",
    });
  }
});

// ------------------------------------------------------------
// POST /api/auth/login
// ------------------------------------------------------------
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const user = db
      .prepare("SELECT * FROM users WHERE email = ?")
      .get(email.toLowerCase());

    // Same generic message whether email or password is wrong —
    // avoids leaking which emails are registered (security best practice)
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const passwordMatches = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: TOKEN_EXPIRY }
    );

    res.json({
      success: true,
      message: `Welcome back, ${user.full_name}!`,
      token,
      user: {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again.",
    });
  }
});

// ------------------------------------------------------------
// GET /api/auth/me  (protected — requires valid JWT)
// Lets the frontend check "am I still logged in?" on page load
// ------------------------------------------------------------
router.get("/me", authenticateToken, (req, res) => {
  const user = db
    .prepare("SELECT id, full_name, email, created_at FROM users WHERE id = ?")
    .get(req.user.id);

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found." });
  }

  res.json({
    success: true,
    user: {
      id: user.id,
      fullName: user.full_name,
      email: user.email,
      memberSince: user.created_at,
    },
  });
});

module.exports = router;
