const express = require("express");
const router = express.Router();
const db = require("../db"); // Koneksi database
const upload = require("../uploadConfig"); // Konfigurasi multer

// API untuk mendapatkan daftar menu
router.get("/", (req, res) => {
  const query = `SELECT * FROM menu WHERE is_deleted = 0`;
  db.query(query, (err, results) => {
    if (err) {
      console.error("Database error (fetch menus):", err);
      return res.status(500).json({ message: "Failed to fetch menus" });
    }
    res.json(results);
  });
});

// API untuk menambahkan menu baru dengan gambar
router.post("/", upload.single("image"), (req, res) => {
  const { name, category, price, description } = req.body;
  const imagePath = req.file
    ? `/assets/${req.file.filename}` // Memastikan path ini sesuai dengan URL akses
    : "/assets/default-image.jpg";

  if (!name || !category || !price || !description) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const query = `INSERT INTO menu (name, category, price, description, image, is_deleted) VALUES (?, ?, ?, ?, ?, 0)`;
  db.query(
    query,
    [name, category, price, description, imagePath],
    (err, results) => {
      if (err) {
        console.error("Database error (add menu):", err);
        return res.status(500).json({ message: "Failed to add menu" });
      }
      res.status(201).json({
        message: "Menu added successfully",
        menu_id: results.insertId,
      });
    }
  );
});

// API untuk menghapus menu (mengubah status is_deleted menjadi 1)
router.delete("/:id", (req, res) => {
  const { id } = req.params; // Mengambil menu_id dari parameter URL
  const query = `UPDATE menu SET is_deleted = 1 WHERE menu_id = ?`; // Memperbarui kolom is_deleted menjadi 1
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Database error (delete menu):", err);
      return res.status(500).json({ message: "Failed to delete menu" });
    }

    // Jika tidak ada baris yang terpengaruh (menu tidak ditemukan)
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Menu not found" });
    }

    // Mengembalikan status 200 OK jika penghapusan berhasil
    res.status(200).json({ message: "Menu deleted successfully" });
  });
});

// API untuk mengedit menu berdasarkan menu_id
router.put("/:id", upload.single("image"), (req, res) => {
  const { id } = req.params; // Mengambil menu_id dari parameter URL
  const { name, category, price, description } = req.body; // Mengambil data baru dari body request

  // Menentukan path gambar baru jika ada
  const imagePath = req.file
    ? `/assets/${req.file.filename}` // Memastikan path gambar sesuai dengan URL
    : null;

  // Validasi input
  if (!name || !category || !price || !description) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Query untuk memperbarui menu berdasarkan menu_id
  const query = `
    UPDATE menu
    SET name = ?, category = ?, price = ?, description = ?, image = ?
    WHERE menu_id = ? AND is_deleted = 0`; // Pastikan hanya mengupdate menu yang tidak dihapus

  db.query(
    query,
    [name, category, price, description, imagePath, id],
    (err, results) => {
      if (err) {
        console.error("Database error (update menu):", err);
        return res.status(500).json({ message: "Failed to update menu" });
      }

      // Jika tidak ada baris yang terpengaruh (menu tidak ditemukan)
      if (results.affectedRows === 0) {
        return res.status(404).json({ message: "Menu not found" });
      }

      // Mengembalikan status 200 OK dengan data menu yang telah diperbarui
      res.status(200).json({
        message: "Menu updated successfully",
        menu_id: id,
        updatedFields: {
          name,
          category,
          price,
          description,
          image: imagePath || null,
        },
      });
    }
  );
});

module.exports = router;
