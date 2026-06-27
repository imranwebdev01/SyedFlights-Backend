// ============================================================
// CONTACT ROUTES — /api/contact
// ============================================================

const express = require("express");
const db = require("../db/database");
const sendEmail = require("../services/brevo");

const router = express.Router();

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST /api/contact
// ======================================================

router.post("/", async (req, res) => {
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

    // ===========================
    // Save message in SQLite
    // ===========================

    db.prepare(`
      INSERT INTO contact_messages (name, email, subject, message)
      VALUES (?, ?, ?, ?)
    `).run(
      name.trim(),
      email.toLowerCase(),
      subject.trim(),
      message.trim()
    );

    // ===========================
// Send email using Brevo API
// ===========================

await sendEmail({
  to: "syedimranshah695@gmail.com",
  toName: "Syed Imran Shah",

  subject: `📩 New Contact Form: ${subject}`,

  replyTo: {
    email,
    name,
  },

  html: `
    <h2>New Contact Form Submission</h2>

    <p><strong>Name:</strong> ${name}</p>

    <p><strong>Email:</strong> ${email}</p>

    <p><strong>Subject:</strong> ${subject}</p>

    <hr>

    <p>${message}</p>
  `,
});
    return res.status(201).json({
      success: true,
      message: "Message sent successfully!",
    });

  } catch (err) {

    console.error("BREVO ERROR:");
console.error(err.response?.body || err);

    return res.status(500).json({
      success: false,
      message: "Unable to send message.",
    });

  }
});

module.exports = router;