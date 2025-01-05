const express = require("express");
const router = express.Router();
const db = require("../db"); // Koneksi database

// **1. API untuk mendapatkan daftar menu**
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

// **2. API untuk menambahkan menu baru**
router.post("/", (req, res) => {
  const { name, category, price, description, image } = req.body;

  // Validasi input
  if (!name || !category || !price || !description) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const query = `INSERT INTO menu (name, category, price, description, image, is_deleted) VALUES (?, ?, ?, ?, ?, 0)`;
  db.query(
    query,
    [name, category, price, description, image || "/assets/default-image.jpg"],
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

// **3. API untuk menghapus menu**
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  const query = `UPDATE menu SET is_deleted = 1 WHERE menu_id = ?`;
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Database error (delete menu):", err);
      return res.status(500).json({ message: "Failed to delete menu" });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Menu not found" });
    }
    res.json({ message: "Menu deleted successfully" });
  });
});

module.exports = router;
