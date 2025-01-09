const { Pool } = require("pg");

// Konfigurasi koneksi ke database
const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    "postgres://neondb_owner:WxfERYg4y7li@ep-billowing-darkness-a1kypg66-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require",
  ssl: {
    rejectUnauthorized: false, // Pastikan SSL diizinkan
  },
});

// Fungsi untuk menguji koneksi
pool.connect((err, client, release) => {
  if (err) {
    return console.error("Error acquiring client", err.stack);
  }
  console.log("Connected to PostgreSQL database successfully!");
  release(); // Kembalikan client ke pool
});

// Ekspor pool untuk digunakan di file lain
module.exports = pool;
