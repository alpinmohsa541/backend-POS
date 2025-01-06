const express = require("express");
const router = express.Router();
const db = require("../db"); // File koneksi database

// API untuk mendapatkan semua pengguna (GET)
router.get("/", (req, res) => {
  const query = "SELECT * FROM user"; // Query untuk mengambil semua data dari tabel `user`
  db.query(query, (err, results) => {
    if (err) {
      console.error("Database error (fetch users):", err);
      return res.status(500).json({ message: "Failed to fetch users" });
    }
    res.status(200).json(results); // Mengembalikan semua data pengguna dalam format JSON
  });
});

// API untuk mendapatkan data pengguna berdasarkan `user_id` (GET)
router.get("/:user_id", (req, res) => {
  const { user_id } = req.params; // Mengambil user_id dari parameter URL
  const query = "SELECT * FROM user WHERE user_id = ?"; // Query untuk mengambil data berdasarkan user_id

  db.query(query, [user_id], (err, results) => {
    if (err) {
      console.error("Database error (fetch user):", err);
      return res.status(500).json({ message: "Failed to fetch user" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(results[0]); // Mengembalikan data pengguna dalam format JSON
  });
});

// API untuk memperbarui data pengguna berdasarkan `user_id` (PUT)
router.put("/:user_id", (req, res) => {
  const { user_id } = req.params; // Mengambil user_id dari parameter URL
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

  const query = `
    UPDATE user
    SET role = ?, name = ?, email = ?, image = ?, username = ?, password = ?, status = ?, language = ?, updated_at = NOW()
    WHERE user_id = ?`; // Query untuk memperbarui data pengguna berdasarkan user_id

  db.query(
    query,
    [
      role,
      name,
      email,
      image || null,
      username,
      password,
      status,
      language,
      user_id,
    ],
    (err, results) => {
      if (err) {
        console.error("Database error (update user):", err);
        return res.status(500).json({ message: "Failed to update user" });
      }

      // Jika tidak ada baris yang terpengaruh (user tidak ditemukan)
      if (results.affectedRows === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({ message: "User updated successfully" });
    }
  );
});

module.exports = router;
