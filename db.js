const mysql = require("mysql2");

// Konfigurasi koneksi database untuk XAMPP
const db = mysql.createConnection({
  host: "localhost", // Host default XAMPP
  user: "root", // User default XAMPP
  password: "", // Password default XAMPP (kosong)
  database: "pos-sederhana", // Nama database
  port: 3306, // Port default MySQL di XAMPP
});

// Tes koneksi
db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("Connected to MySQL Database on XAMPP.");
  }
});

module.exports = db;
