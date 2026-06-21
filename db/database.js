// ============================================================
// DATABASE SETUP — SQLite via better-sqlite3
// No external DB server needed — perfect for a portfolio
// project. The .db file is created automatically on first run.
// ============================================================
const Database = require("better-sqlite3");
const path = require("path");

const db = new Database(path.join(__dirname, "syedflights.db"));

// Enable foreign key constraints
db.pragma("foreign_keys = ON");

// ------------------------------------------------------------
// USERS TABLE
// ------------------------------------------------------------
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// ------------------------------------------------------------
// CONTACT MESSAGES TABLE (bonus — wires up the contact form too)
// ------------------------------------------------------------
db.exec(`
  CREATE TABLE IF NOT EXISTS contact_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// ------------------------------------------------------------
// BOOKINGS TABLE (bonus — lets logged-in users "save" a search)
// ------------------------------------------------------------
db.exec(`
  CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    from_city TEXT NOT NULL,
    to_city TEXT NOT NULL,
    depart_date TEXT NOT NULL,
    return_date TEXT,
    passengers INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
  )
`);

module.exports = db;
