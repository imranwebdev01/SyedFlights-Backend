// ============================================================
// AUTH MIDDLEWARE — verifies JWT on protected routes
// ============================================================
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-this-in-production";

function authenticateToken(req, res, next) {
  // Expect header: Authorization: Bearer <token>
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access denied. No token provided.",
    });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: "Invalid or expired token. Please log in again.",
      });
    }
    // Attach decoded user info (id, email) to the request
    req.user = decoded;
    next();
  });
}

module.exports = { authenticateToken, JWT_SECRET };
