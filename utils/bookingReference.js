// ============================================================
// BOOKING REFERENCE GENERATOR
// Example: SF-20260626-A8F4K2
// ============================================================

function randomCode(length = 6) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "";

  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return result;
}

function generateBookingReference() {
  const now = new Date();

  const year = now.getFullYear();

  const month = String(now.getMonth() + 1).padStart(2, "0");

  const day = String(now.getDate()).padStart(2, "0");

  return `SF-${year}${month}${day}-${randomCode()}`;
}

module.exports = generateBookingReference;