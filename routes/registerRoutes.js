const express = require("express");
const router = express.Router();
const User = require("../models/User"); // Pastikan path relatif sudah benar

// API untuk register user baru
router.post("/", async (req, res) => {
  // Perhatikan bahwa route yang dipakai adalah "/"
  const { username, password, confirmPassword, name, email, role } = req.body;

  // Validasi untuk memastikan semua field yang diperlukan ada
  if (!username || !password || !name || !role || !email) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Pastikan password dan confirmPassword cocok
  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  try {
    // Cek apakah username atau email sudah ada
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "Username or email is already taken" });
    }

    // Membuat user baru
    const newUser = new User({
      username,
      password,
      name,
      email,
      role,
      status: "active", // Status default adalah active
      language: "en", // Bahasa default adalah English
    });

    // Simpan user ke database
    const savedUser = await newUser.save();

    res.status(201).json({
      message: "User registered successfully",
      user_id: savedUser._id,
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
});

module.exports = router;
