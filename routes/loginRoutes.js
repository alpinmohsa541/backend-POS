const express = require("express");
const router = express.Router();
const db = require("../db"); // Koneksi ke database

// Login API
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Validasi login dengan query database
  const query = `SELECT * FROM user WHERE username = ? AND password = ?`;
  db.query(query, [username, password], (err, results) => {
    if (err)
      return res.status(500).json({ message: "Database error", error: err });

    if (results.length > 0) {
      const user = results[0];
      res.json({
        name: user.name,
        role: user.role,
      });
    } else {
      res.status(401).json({ message: "Invalid username or password" });
    }
  });
});

module.exports = router;
