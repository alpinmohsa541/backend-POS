const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// Definisikan schema untuk user
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, required: true },
});

// Buat model untuk user
const User = mongoose.model("User", userSchema);

// API untuk register user baru
router.post("/register", async (req, res) => {
  const { username, password, name, role } = req.body;

  // Validasi input
  if (!username || !password || !name || !role) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Periksa apakah username sudah digunakan
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: "Username is already taken" });
    }

    // Tambahkan user baru ke database
    const newUser = new User({ username, password, name, role });
    const savedUser = await newUser.save();

    console.log("User registered with ID:", savedUser._id);
    res.status(201).json({
      message: "User registered successfully",
      user_id: savedUser._id, // ID yang dihasilkan oleh MongoDB
    });
  } catch (err) {
    console.error("Database error (register user):", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
