const mongoose = require("mongoose");

// Konfigurasi koneksi ke MongoDB
const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb+srv://admin:admin@pos-sederhana.jtuq3.mongodb.net/pos-sederhana?retryWrites=true&w=majority";

// Fungsi untuk koneksi MongoDB
mongoose
  .connect(MONGO_URI) // Gunakan variabel MONGO_URI
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB:", err));

// Ekspor mongoose untuk digunakan di file lain
module.exports = mongoose;
