const express = require("express");
const router = express.Router();
const User = require("../models/User"); // Pastikan path relatif sudah benar

// API untuk register user baru
router.post("/", async (req, res) => {
  const { username, password, name, role, email, status, language } = req.body;

  // Validasi data yang diperlukan
  if (
    !username ||
    !password ||
    !name ||
    !role ||
    !email ||
    !status ||
    !language
  ) {
    return res.status(400).json({ message: "All fields are required" });
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
      role,
      email,
      status,
      language,
    });
    const savedUser = await newUser.save();

    res.status(201).json({
      message: "User registered successfully",
      user_id: savedUser._id,
    });
  } catch (err) {
    console.error(err); // Log error lebih detail
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
});

module.exports = router;
