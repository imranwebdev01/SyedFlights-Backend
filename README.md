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

## Setup & Run

### 1. Install dependencies

```bash
cd syedflights-backend
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

Then open `.env` and replace `JWT_SECRET` with a real random string. You can generate one with:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 3. Add your images

Place your original assets (`header.png`, `destination-1.jpg`, etc.) into `public/assets/`. See `public/assets/README.txt` for the full list.

### 4. Start the server

```bash
npm start
```

You should see:

```
🚀 SyedFlights server running at http://localhost:4000
   API health check: http://localhost:4000/api/health
```

Open **http://localhost:4000** in your browser — the full site, including Sign In / Create Account, now works end-to-end.

For development with auto-restart on file changes:

```bash
npm run dev
```

---

## API Reference

All responses are JSON in the shape `{ success: boolean, message?: string, ... }`.

### `POST /api/auth/signup`
Create a new account. Returns a JWT immediately (no separate login step needed).

```json
// Request body
{ "fullName": "Syed Imran Shah", "email": "syed@example.com", "password": "secret123" }

// Success response (201)
{ "success": true, "message": "Account created successfully!", "token": "...", "user": { "id": 1, "fullName": "...", "email": "..." } }
```

### `POST /api/auth/login`

```json
// Request body
{ "email": "syed@example.com", "password": "secret123" }

// Success response (200)
{ "success": true, "message": "Welcome back, Syed Imran Shah!", "token": "...", "user": { ... } }
```

### `GET /api/auth/me` *(protected)*
Returns the currently logged-in user based on the JWT sent in the `Authorization: Bearer <token>` header.

### `POST /api/contact`
Saves a contact form submission.

```json
{ "name": "Jane Doe", "email": "jane@example.com", "subject": "booking", "message": "I'd like to ask about..." }
```

### `GET /api/bookings` *(protected)*
Returns all saved trips for the logged-in user.

### `POST /api/bookings` *(protected)*
Saves a new trip.

```json
{ "fromCity": "New York (JFK)", "toCity": "Paris (CDG)", "departDate": "2026-08-10", "returnDate": "2026-08-20", "passengers": 2 }
```

### `DELETE /api/bookings/:id` *(protected)*
Deletes a saved trip (only if it belongs to the logged-in user).

### `GET /api/health`
Simple uptime check — returns `{ success: true, message: "...", time: "..." }`.

---

## How Authentication Works (for your CV / interview talking points)

1. On signup or login, the server hashes/verifies the password with **bcrypt** (never stored in plain text).
2. On success, the server signs a **JWT** containing the user's id and email, valid for 7 days.
3. The frontend stores this token in memory and sends it as `Authorization: Bearer <token>` on every request to protected routes (`/api/bookings/*`).
4. The `authenticateToken` middleware verifies the token's signature and expiry before allowing the request through, attaching the decoded user to `req.user`.
5. Routes like `DELETE /api/bookings/:id` filter by `user_id`, so users can only ever see or modify their own data.

---

## Security Notes

- Passwords are hashed with bcrypt (10 salt rounds) — never stored or logged in plain text.
- Generic error messages on login (`"Invalid email or password"`) avoid revealing whether an email is registered.
- Rate limiting (20 requests / 15 min) on `/api/auth/login` and `/api/auth/signup` mitigates brute-force attempts.
- `.env` (containing your JWT secret) is excluded from version control via `.gitignore`.

### Before deploying to production
- Replace the default JWT secret with a strong random value.
- Consider storing the JWT in an `httpOnly` cookie instead of frontend memory/localStorage to reduce XSS risk.
- Add HTTPS (most hosting platforms like Render or Railway handle this automatically).

---

## Deploying

This backend is a normal Express app, so it deploys easily to **Render**, **Railway**, or **Fly.io** (all have free tiers). Since it serves the frontend statically from `/public`, deploying this one project gives you both the site and the API at the same URL — no separate frontend hosting needed.
