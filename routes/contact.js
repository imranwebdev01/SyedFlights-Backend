// ============================================================
// CONTACT ROUTES — /api/contact
// ============================================================

const express = require("express");
const db = require("../db/database");
const nodemailer = require("nodemailer");

const router = express.Router();

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ===================== Nodemailer =====================
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});
// ======================================================
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
    // Send email to you
    // ===========================

    await transporter.sendMail({
      from: `"SyedFlights Website" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `📩 New Contact Form: ${subject}`,
      html: `
        <h2>New Contact Form Submission</h2>

        <p><strong>Name:</strong> ${name}</p>

        <p><strong>Email:</strong> ${email}</p>

        <p><strong>Subject:</strong> ${subject}</p>

        <hr>

        <p>${message}</p>
      `,
    });

    // ===========================
    // Auto reply to customer
    // ===========================

   console.log("Sending auto reply...");

try {
  await transporter.sendMail({
    from: `"SyedFlights" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Thank you for contacting SyedFlights",
    html: `
      <h2>Hi ${name},</h2>
      <p>Thank you for contacting <strong>SyedFlights</strong>.</p>
      <p>We have received your message and will get back to you within 24 hours.</p>
    `,
  });

  console.log("✅ Auto reply sent");

} catch (err) {
  console.error("❌ AUTO REPLY ERROR");
  console.error(err);
}

    return res.status(201).json({
      success: true,
      message: "Message sent successfully!",
    });

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Unable to send message.",
    });

  }
});

module.exports = router;