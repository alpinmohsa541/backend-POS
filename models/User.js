const mongoose = require("mongoose");
const bcrypt = require("bcryptjs"); // Import bcrypt

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

// Fungsi untuk melakukan hashing password sebelum disimpan
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
  }
  next();
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

module.exports = User;
