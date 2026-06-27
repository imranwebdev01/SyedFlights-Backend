// ============================================================
// BOOKINGS ROUTES — /api/bookings/*
// All routes here require a logged-in user (JWT protected).
// Demonstrates a typical "user owns their own data" pattern.
// ============================================================
const express = require("express");
const db = require("../db/database");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();
const generateBookingReference = require("../utils/bookingReference");

// Every route below runs authenticateToken first
router.use(authenticateToken);

// ------------------------------------------------------------
// POST /api/bookings — save a flight search for the logged-in user
// ------------------------------------------------------------
router.post("/", (req, res) => {
  try {
    const { fromCity, toCity, departDate, returnDate, passengers } = req.body;

    if (!fromCity || !toCity || !departDate) {
      return res.status(400).json({
        success: false,
        message: "From city, to city, and departure date are required.",
      });
    }
const bookingReference = generateBookingReference();
const user = db
  .prepare("SELECT * FROM users WHERE id = ?")
  .get(req.user.id);

console.log("Decoded user id:", req.user.id);
console.log("User exists:", user);
const result = db
      .prepare(`
INSERT INTO bookings
(
    booking_reference,
    user_id,
    from_city,
    to_city,
    depart_date,
    return_date,
    passengers,
    status,
    payment_status
)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`)
    .run(
    bookingReference,
    req.user.id,
    fromCity,
    toCity,
    departDate,
    returnDate || null,
    passengers || 1,
    "Pending",
    "Pending"
);
console.log("Generated booking reference:", bookingReference);
    res.status(201).json({
    success: true,
    message: "Booking created successfully.",
    bookingId: result.lastInsertRowid,
    bookingReference,
});
  } catch (err) {
    console.error("Booking save error:", err);
    res.status(500).json({ success: false, message: "Something went wrong." });
  }
});

   // ------------------------------------------------------------
// GET /api/bookings — list all saved trips for the logged-in user
// ------------------------------------------------------------
router.get("/", (req, res) => {
  try {
    const bookings = db
      .prepare(`
        SELECT
          booking_reference,
          id,
          status,
          payment_status,
          from_city,
          to_city,
          depart_date,
          return_date,
          flight_class,
          passengers,
          created_at
        FROM bookings
        WHERE user_id = ?
        ORDER BY created_at DESC
      `)
      .all(req.user.id);

    res.json({
      success: true,
      bookings,
    });
  } catch (err) {
    console.error("Booking fetch error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch bookings.",
    });
  }
});
// ------------------------------------------------------------
// DELETE /api/bookings/:id — remove a saved trip (only if it's yours)
// ------------------------------------------------------------
router.delete("/:id", (req, res) => {
  const result = db
    .prepare("DELETE FROM bookings WHERE id = ? AND user_id = ?")
    .run(req.params.id, req.user.id);

  if (result.changes === 0) {
    return res.status(404).json({
      success: false,
      message: "Booking not found or doesn't belong to you.",
    });
  }

  res.json({ success: true, message: "Booking removed." });
});

module.exports = router;
