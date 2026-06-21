// ============================================================
// CONTACT ROUTES — /api/contact
// Wires up the existing contact form on your site to actually
// save messages instead of just simulating success in JS.
// ============================================================
const express = require("express");
const db = require("../db/database");

const router = express.Router();

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ------------------------------------------------------------
// POST /api/contact
// ------------------------------------------------------------
router.post("/", (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address.",
      });
    }

    if (message.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: "Message must be at least 10 characters.",
      });
    }

    db.prepare(
      `INSERT INTO contact_messages (name, email, subject, message)
       VALUES (?, ?, ?, ?)`
    ).run(name.trim(), email.toLowerCase(), subject, message.trim());

    res.status(201).json({
      success: true,
      message: "Message sent successfully! We'll get back to you within 24 hours.",
    });
  } catch (err) {
    console.error("Contact form error:", err);
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again.",
    });
  }
});

module.exports = router;
