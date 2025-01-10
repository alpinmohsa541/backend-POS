const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// Definisikan schema untuk user
const userSchema = new mongoose.Schema({
  role: { type: String, required: true }, // Peran pengguna (admin/user)
  name: { type: String, required: true }, // Nama pengguna
  email: { type: String, required: true, unique: true }, // Email unik
  image: { type: String }, // URL gambar pengguna
  username: { type: String, required: true, unique: true }, // Username unik
  password: { type: String, required: true }, // Password pengguna
  status: { type: String, required: true }, // Status pengguna (aktif/nonaktif)
  language: { type: String, required: true }, // Bahasa pengguna
  updated_at: { type: Date, default: Date.now }, // Tanggal update terakhir
});

// Buat model untuk user
const User = mongoose.model("User", userSchema);

// API untuk mendapatkan semua pengguna (GET)
router.get("/", async (req, res) => {
  try {
    const users = await User.find(); // Mengambil semua data pengguna
    res.status(200).json(users); // Mengembalikan data dalam format JSON
  } catch (err) {
    console.error("Database error (fetch users):", err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

// API untuk mendapatkan data pengguna berdasarkan `user_id` (GET)
router.get("/:user_id", async (req, res) => {
  const { user_id } = req.params; // Mengambil `user_id` dari parameter URL

  try {
    const user = await User.findById(user_id); // Mencari pengguna berdasarkan ID
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user); // Mengembalikan data pengguna
  } catch (err) {
    console.error("Database error (fetch user):", err);
    res.status(500).json({ message: "Failed to fetch user" });
  }
});

// API untuk memperbarui data pengguna berdasarkan `user_id` (PUT)
router.put("/:user_id", async (req, res) => {
  const { user_id } = req.params; // Mengambil `user_id` dari parameter URL
  const { role, name, email, image, username, password, status, language } =
    req.body;

  // Validasi input
  if (
    !role ||
    !name ||
    !email ||
    !username ||
    !password ||
    !status ||
    !language
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      user_id,
      {
        role,
        name,
        email,
        image: image || null,
        username,
        password,
        status,
        language,
        updated_at: Date.now(),
      },
      { new: true, runValidators: true } // Mengembalikan data yang diperbarui
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res
      .status(200)
      .json({ message: "User updated successfully", user: updatedUser });
  } catch (err) {
    console.error("Database error (update user):", err);
    res.status(500).json({ message: "Failed to update user" });
  }
});

module.exports = router;
