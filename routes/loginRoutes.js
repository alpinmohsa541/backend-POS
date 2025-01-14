const express = require("express");
const router = express.Router();
const User = require("../models/User"); // Impor model User

// Login API
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username, password });

    if (user) {
      res.json({
        name: user.name,
        role: user.role,
      });
    } else {
      res.status(401).json({ message: "Invalid username or password" });
    }
  } catch (err) {
    res.status(500).json({ message: "Database error", error: err.message });
  }
});

module.exports = router;
