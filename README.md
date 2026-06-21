# SyedFlights — Backend API

A Node.js + Express + SQLite backend powering authentication, contact
messages, and saved trips for the SyedFlights travel website.

Built by **Syed Imran Shah**.

---

## Features

- **User authentication** — signup & login with bcrypt-hashed passwords and JWT sessions
- **Protected routes** — `/api/bookings/*` requires a valid token
- **Contact form persistence** — messages submitted on the site are saved to the database
- **Saved trips** — logged-in users can save and delete flight searches tied to their account
- **Rate limiting** — login/signup routes are throttled to prevent brute-force abuse
- **Zero external dependencies for the database** — uses SQLite via `better-sqlite3`, so there's no separate database server to install or configure

---

## Tech Stack

| Layer | Technology |
|---|---|
| Server | Node.js + Express |
| Database | SQLite (`better-sqlite3`) |
| Auth | JWT (`jsonwebtoken`) + bcrypt password hashing |
| Security | `express-rate-limit`, `cors` |
| Frontend | Static HTML/CSS/JS served from `/public` |

---

## Project Structure

```
syedflights-backend/
├── server.js              # Entry point — starts Express, wires routes
├── package.json
├── .env.example            # Copy to .env and fill in your own secret
├── db/
│   └── database.js         # SQLite connection + table definitions
├── middleware/
│   └── auth.js             # JWT verification middleware
├── routes/
│   ├── auth.js              # POST /signup, POST /login, GET /me
│   ├── contact.js           # POST /api/contact
│   └── bookings.js          # GET/POST/DELETE /api/bookings (protected)
└── public/                 # Your existing frontend (HTML/CSS/JS) lives here
    ├── index.html
    ├── styles.css
    ├── main.js
    └── assets/              # Add your images here (see assets/README.txt)
```

---

