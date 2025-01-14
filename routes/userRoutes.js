const express = require("express");
const router = express.Router();
const User = require("../models/User"); // Impor model User

// API untuk mendapatkan semua pengguna
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch users", error: err.message });
  }
});

// API lainnya ...
module.exports = router;
