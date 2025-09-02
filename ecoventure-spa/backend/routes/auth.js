// routes/auth.js
import express from "express";
import jwt from "jsonwebtoken";
import fs from "fs";


const router = express.Router();

// Load admin credentials from JSON file (keep this OUTSIDE /public)
const adminCreds = JSON.parse(fs.readFileSync("admin_credentials.json", "utf-8"));

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey"; // use .env in production

// POST /auth/login
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (email === adminCreds.admin.email && password === adminCreds.admin.password) {
    // Create JWT token
    const token = jwt.sign({ role: "admin", email }, JWT_SECRET, { expiresIn: "1h" });

    return res.json({ token });
  }

  res.status(401).json({ error: "Invalid email or password" });
});

export default router;
