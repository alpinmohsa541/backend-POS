const express = require("express");
const router = express.Router();
const upload = require("../uploadConfig"); // Import konfigurasi multer
const Menu = require("../models/Menu"); // Mengimpor model Menu yang sudah ada

// API untuk mendapatkan daftar menu
router.get("/", async (req, res) => {
  try {
    const menus = await Menu.find({ is_deleted: false }); // Hanya menu yang tidak dihapus
    res.json(menus);
  } catch (err) {
    console.error("Database error (fetch menus):", err);
    res.status(500).json({ message: "Failed to fetch menus" });
  }
});

// API untuk menambahkan menu baru dengan gambar
router.post("/", upload.single("image"), async (req, res) => {
  if (req.fileValidationError) {
    return res.status(400).json({ message: req.fileValidationError });
  }

  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const { name, category, price, description } = req.body;

  // Validasi input
  if (!name || !category || !price || !description) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Tentukan path gambar
  const imagePath = `/assets/${req.file.filename}`;

  try {
    const newMenu = new Menu({
      name,
      category,
      price,
      description,
      image: imagePath, // Menyimpan path gambar ke database
    });

    const savedMenu = await newMenu.save();
    res.status(201).json({
      message: "Menu added successfully",
      menu_id: savedMenu._id,
    });
  } catch (err) {
    console.error("Database error (add menu):", err);
    res.status(500).json({ message: "Failed to add menu", error: err.message });
  }
});

// API untuk menghapus menu (mengubah status is_deleted menjadi true)
router.delete("/:id", async (req, res) => {
  const { id } = req.params; // Mengambil menu_id dari parameter URL
  try {
    const deletedMenu = await Menu.findByIdAndUpdate(
      id,
      { is_deleted: true }, // Mengubah status is_deleted menjadi true
      { new: true } // Mengembalikan data yang telah diperbarui
    );

    if (!deletedMenu) {
      return res.status(404).json({ message: "Menu not found" });
    }

    res.status(200).json({ message: "Menu deleted successfully" });
  } catch (err) {
    console.error("Database error (delete menu):", err);
    res.status(500).json({ message: "Failed to delete menu" });
  }
});

// API untuk mengedit menu berdasarkan menu_id
router.put("/:id", upload.single("image"), async (req, res) => {
  const { id } = req.params; // Mengambil menu_id dari parameter URL
  const { name, category, price, description } = req.body;

  // Menentukan path gambar baru jika ada
  const imagePath = req.file
    ? `/assets/${req.file.filename}` // Update image jika ada file baru
    : undefined;

  // Validasi input
  if (!name || !category || !price || !description) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const updatedMenu = await Menu.findByIdAndUpdate(
      id,
      {
        name,
        category,
        price,
        description,
        ...(imagePath && { image: imagePath }), // Update image hanya jika tersedia
      },
      { new: true } // Mengembalikan data yang telah diperbarui
    );

    if (!updatedMenu) {
      return res.status(404).json({ message: "Menu not found" });
    }

    res.status(200).json({
      message: "Menu updated successfully",
      menu_id: updatedMenu._id,
      updatedFields: {
        name,
        category,
        price,
        description,
        image: updatedMenu.image,
      },
    });
  } catch (err) {
    console.error("Database error (update menu):", err);
    res.status(500).json({ message: "Failed to update menu" });
  }
});

module.exports = router;
