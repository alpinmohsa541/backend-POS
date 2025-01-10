const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// Definisikan schema untuk setting
const settingSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true }, // Key unik untuk setting
  value: { type: mongoose.Schema.Types.Mixed, required: true }, // Value bisa berupa tipe data apa saja
});

// Buat model untuk setting
const Setting = mongoose.model("Setting", settingSchema);

// API untuk mendapatkan semua setting
router.get("/", async (req, res) => {
  try {
    const settings = await Setting.find(); // Ambil semua setting dari MongoDB
    res.json(settings);
  } catch (err) {
    console.error("Database error (fetch settings):", err);
    res.status(500).json({ message: "Failed to fetch settings" });
  }
});

module.exports = router;
