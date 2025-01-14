const express = require("express");
const bcrypt = require("bcryptjs"); // Tambahkan bcrypt
const router = express.Router();
const User = require("../models/User"); // Impor model User

// Login API
router.post("/", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Mencari user berdasarkan username
    const user = await User.findOne({ username });

    if (user) {
      // Verifikasi password menggunakan bcrypt
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (isPasswordValid) {
        // Password valid, kirimkan response dengan data user
        res.json({
          name: user.name,
          role: user.role,
        });
      } else {
        res.status(401).json({ message: "Invalid username or password" });
      }
    } else {
      res.status(401).json({ message: "Invalid username or password" });
    }
  } catch (err) {
    res.status(500).json({ message: "Database error", error: err.message });
  }
});

module.exports = router;
