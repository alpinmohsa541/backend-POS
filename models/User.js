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

// Gunakan `mongoose.models` untuk mencegah overwrite model
const User = mongoose.models.User || mongoose.model("User", userSchema);

module.exports = User;
