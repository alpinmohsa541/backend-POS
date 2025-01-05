const mysql = require("mysql2");

// Konfigurasi koneksi database
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "", // Ubah jika ada password
  database: "pos_sederhana", // Nama database
});

// Test koneksi
db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("Connected to MySQL Database.");
  }
});

module.exports = db;
