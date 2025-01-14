const express = require("express");
const router = express.Router();
const User = require("../models/User"); // Impor model User

// API untuk register user baru
router.post("/register", async (req, res) => {
  const { username, password, name, role } = req.body;

  if (!username || !password || !name || !role) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: "Username is already taken" });
    }

    const newUser = new User({ username, password, name, role });
    const savedUser = await newUser.save();

    res.status(201).json({
      message: "User registered successfully",
      user_id: savedUser._id,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
});

module.exports = router;
