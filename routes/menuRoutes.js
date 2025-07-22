const express = require("express");
const router = express.Router();
const upload = require("../uploadConfig"); // Import konfigurasi multer Anda
const Menu = require("../models/Menu"); // Mengimpor model Menu yang sudah ada
const cloudinary = require("cloudinary").v2; // Pastikan Anda telah mengkonfigurasi Cloudinary SDK

// Konfigurasi Cloudinary (Pastikan ini sudah ada di file config/cloudinary.js Anda)
// Contoh:
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// API untuk mendapatkan daftar menu (tidak ada perubahan)
router.get("/", async (req, res) => {
  try {
    const menus = await Menu.find({ is_deleted: false }); // Hanya menu yang tidak dihapus
    res.json(menus);
  } catch (err) {
    console.error("Database error (fetch menus):", err);
    res.status(500).json({ message: "Failed to fetch menus" });
  }
});

// API untuk menambahkan menu baru dengan gambar (tidak ada perubahan signifikan, hanya log)
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

  // Mendapatkan URL gambar yang disimpan di Cloudinary (dari uploadConfig yang sudah multer-cloudinary-storage)
  const imagePath = req.file.path; // Cloudinary URL disimpan di req.file.path

  try {
    const newMenu = new Menu({
      name,
      category,
      price,
      description,
      image: imagePath, // Menyimpan URL gambar Cloudinary ke database
    });

    const savedMenu = await newMenu.save();
    res.status(201).json({
      message: "Menu added successfully",
      menu_id: savedMenu._id,
      image_url: imagePath, // Menampilkan URL gambar dari Cloudinary
      menu: savedMenu, // Mengembalikan objek menu lengkap jika diperlukan di frontend
    });
  } catch (err) {
    console.error("Database error (add menu):", err);
    res.status(500).json({ message: "Failed to add menu", error: err.message });
  }
});

// API untuk mengedit menu berdasarkan menu_id
router.put("/:id", upload.single("image"), async (req, res) => {
  const { id } = req.params; // Mengambil menu_id dari parameter URL
  const { name, category, price, description } = req.body;

  // Objek untuk menampung field yang akan diupdate
  const updateFields = { name, category, price, description };

  // Periksa jika ada file gambar baru yang diupload
  if (req.file) {
    if (req.fileValidationError) {
      return res.status(400).json({ message: req.fileValidationError });
    }
    // Jika ada file baru, gunakan URL Cloudinary dari req.file.path
    updateFields.image = req.file.path;

    // Opsional: Hapus gambar lama dari Cloudinary jika ada
    try {
      const oldMenu = await Menu.findById(id);
      if (oldMenu && oldMenu.image) {
        // Ekstrak public_id dari URL Cloudinary
        const publicId = oldMenu.image.split("/").pop().split(".")[0]; // Ini mungkin perlu disesuaikan dengan format URL Cloudinary Anda
        await cloudinary.uploader.destroy(publicId);
        console.log(`Old image ${publicId} deleted from Cloudinary.`);
      }
    } catch (deleteError) {
      console.warn(
        "Could not delete old image from Cloudinary:",
        deleteError.message
      );
      // Lanjutkan proses update meskipun gagal menghapus gambar lama
    }
  }

  // Validasi input dasar (Anda bisa tambahkan validasi lebih lanjut jika diperlukan)
  if (!name || !category || !price || !description) {
    // Periksa juga apakah mereka menjadi string 'undefined' jika tidak dikirim dari frontend
    if (
      name === "undefined" ||
      category === "undefined" ||
      price === "undefined" ||
      description === "undefined"
    ) {
      return res.status(400).json({
        message:
          "Invalid input values received. All fields are required and must be valid.",
      });
    }
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const updatedMenu = await Menu.findByIdAndUpdate(
      id,
      updateFields, // Gunakan objek updateFields yang sudah termasuk image jika ada
      { new: true, runValidators: true } // new: true untuk mengembalikan dokumen yang sudah diupdate, runValidators: true untuk menjalankan validasi skema
    );

    if (!updatedMenu) {
      return res.status(404).json({ message: "Menu not found" });
    }

    res.status(200).json({
      message: "Menu updated successfully",
      menu_id: updatedMenu._id,
      updatedFields: {
        // Mengembalikan semua field yang telah diupdate, termasuk image URL yang baru
        name: updatedMenu.name,
        category: updatedMenu.category,
        price: updatedMenu.price,
        description: updatedMenu.description,
        image: updatedMenu.image, // URL gambar Cloudinary yang baru
      },
    });
  } catch (err) {
    console.error("Database error (update menu):", err);
    // Tambahkan penanganan error validasi Mongoose jika ada
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: err.message });
    }
    res
      .status(500)
      .json({ message: "Failed to update menu", error: err.message });
  }
});

// API untuk menghapus menu secara permanen (tidak ada perubahan signifikan)
router.delete("/:id", async (req, res) => {
  const { id } = req.params; // Mengambil menu_id dari parameter URL
  try {
    // Menghapus data menu secara permanen
    const deletedMenu = await Menu.findByIdAndDelete(id);

    if (!deletedMenu) {
      return res.status(404).json({ message: "Menu not found" });
    }

    // Opsional: Hapus gambar terkait dari Cloudinary
    if (deletedMenu.image) {
      try {
        const publicId = deletedMenu.image.split("/").pop().split(".")[0]; // Ekstrak public_id
        await cloudinary.uploader.destroy(publicId);
        console.log(
          `Image ${publicId} deleted from Cloudinary on menu deletion.`
        );
      } catch (cloudinaryError) {
        console.warn(
          "Could not delete image from Cloudinary:",
          cloudinaryError.message
        );
        // Lanjutkan meskipun gagal menghapus gambar dari Cloudinary
      }
    }

    // Jika berhasil, kirim respons sukses
    res.status(200).json({ message: "Menu deleted successfully" });
  } catch (err) {
    console.error("Database error (delete menu):", err);
    // Jika ada kesalahan pada database, kirim respons gagal
    res
      .status(500)
      .json({ message: "Failed to delete menu", error: err.message });
  }
});

// API untuk mendapatkan menu berdasarkan ID (tidak ada perubahan signifikan)
router.get("/:id", async (req, res) => {
  const { id } = req.params; // Mengambil menu_id dari parameter URL
  try {
    const menu = await Menu.findById(id); // Mencari menu berdasarkan ID

    if (!menu) {
      return res.status(404).json({ message: "Menu not found" });
    }

    // Mendapatkan URL gambar dari Cloudinary yang disimpan di database
    // Pastikan ini adalah URL Cloudinary penuh, bukan hanya '/assets/...'
    const imageUrl = menu.image ? menu.image : "/assets/default-image.jpg"; // URL gambar dari Cloudinary

    // Mengembalikan data menu
    res.status(200).json({
      _id: menu._id, // Sertakan ID juga jika diperlukan
      name: menu.name,
      category: menu.category,
      price: menu.price,
      description: menu.description,
      image: imageUrl, // URL gambar Cloudinary yang lengkap
      // Tambahkan field lain dari model Menu jika diperlukan
    });
  } catch (err) {
    console.error("Database error (fetch menu by ID):", err);
    res
      .status(500)
      .json({ message: "Failed to fetch menu", error: err.message });
  }
});

module.exports = router;
