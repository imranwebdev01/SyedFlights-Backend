// ============================================================
// SYEDFLIGHTS BACKEND — server.js
// Entry point: wires together middleware, routes, and starts
// the server. Run with: npm start  (or npm run dev to autoreload)
// ============================================================
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const rateLimit = require("express-rate-limit");

const authRoutes = require("./routes/auth");
const contactRoutes = require("./routes/contact");
const bookingsRoutes = require("./routes/bookings");

const app = express();
app.set("trust proxy", 1);
const PORT = process.env.PORT || 4000;

// ------------------------------------------------------------
// CORE MIDDLEWARE
// ------------------------------------------------------------
app.use(cors()); // allow the frontend (different port) to call this API
app.use(express.json()); // parse JSON request bodies
app.use(express.urlencoded({ extended: true }));

// Serve the frontend (index.html, styles.css, main.js, assets/)
// directly from this same server — one command runs everything.
app.use(express.static(path.join(__dirname, "public")));

// ------------------------------------------------------------
// RATE LIMITING — protects login/signup from brute-force abuse
// A real, professional touch most tutorial projects skip.
// ------------------------------------------------------------
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 requests per IP per window
  message: {
    success: false,
    message: "Too many attempts. Please try again in 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api/auth/login", authLimiter);
app.use("/api/auth/signup", authLimiter);

// ------------------------------------------------------------
// ROUTES
// ------------------------------------------------------------
app.use("/api/auth", authRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/bookings", bookingsRoutes);

// Simple health check — useful for confirming the server is alive
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "SyedFlights API is running.", time: new Date() });
});

// ------------------------------------------------------------
// 404 HANDLER (for unknown API routes)
// ------------------------------------------------------------
app.use("/api", (req, res) => {
  res.status(404).json({ success: false, message: "API route not found." });
});

// ------------------------------------------------------------
// GLOBAL ERROR HANDLER
// ------------------------------------------------------------
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ success: false, message: "Internal server error." });
});

// ------------------------------------------------------------
// START SERVER
// ------------------------------------------------------------
app.listen(PORT, () => {
  console.log(`\n🚀 SyedFlights server running at http://localhost:${PORT}`);
  console.log(`   API health check: http://localhost:${PORT}/api/health\n`);
});
