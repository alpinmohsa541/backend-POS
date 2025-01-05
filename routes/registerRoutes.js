const express = require("express");
const router = express.Router();
const db = require("../db"); // Koneksi database

// API untuk register user baru
router.post("/register", (req, res) => {
  const { username, password, name, role } = req.body;

  // Validasi input
  if (!username || !password || !name || !role) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Periksa apakah username sudah digunakan
  const checkQuery = `SELECT * FROM user WHERE username = ?`;
  db.query(checkQuery, [username], (err, results) => {
    if (err) {
      console.error("Database error (check username):", err);
      return res.status(500).json({ message: "Internal server error" });
    }

    if (results.length > 0) {
      return res.status(409).json({ message: "Username is already taken" });
    }

    // Tambahkan user ke database (user_id diisi otomatis)
    const insertQuery = `INSERT INTO user (username, password, name, role) VALUES (?, ?, ?, ?)`;
    db.query(insertQuery, [username, password, name, role], (err, results) => {
      if (err) {
        console.error("Database error (insert user):", err);
        return res.status(500).json({ message: "Failed to register user" });
      }

      console.log("User registered with ID:", results.insertId);
      res.status(201).json({
        message: "User registered successfully",
        user_id: results.insertId, // ID yang dihasilkan oleh database
      });
    });
  });
});

module.exports = router;
