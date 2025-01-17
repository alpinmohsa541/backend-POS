const mongoose = require("mongoose");

// Definisikan schema untuk menu
const menuSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    }, // Nama menu, wajib diisi
    category: {
      type: String,
      required: true,
    }, // Kategori menu, wajib diisi
    price: {
      type: Number,
      required: true,
    }, // Harga menu, wajib diisi
    description: {
      type: String,
      required: true,
    }, // Deskripsi menu, wajib diisi
    image: {
      type: String,
      default: "/assets/default-image.jpg", // Gambar default jika tidak ada
    }, // Path gambar
    is_deleted: {
      type: Boolean,
      default: false,
    }, // Status penghapusan (soft delete)
  },
  {
    timestamps: true, // Menambahkan createdAt dan updatedAt secara otomatis
  }
);

// Buat model berdasarkan schema
const Menu = mongoose.model("Menu", menuSchema);

// Ekspor model untuk digunakan di file lain
module.exports = Menu;
