const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
require("dotenv").config(); // Mengambil konfigurasi dari .env
const upload = require("./uploadConfig"); // Menambahkan konfigurasi upload (Cloudinary)

const app = express();
const PORT = process.env.PORT || 3000;

// Validasi MONGO_URI
if (!process.env.MONGO_URI) {
  console.error("MONGO_URI is not defined in the environment variables.");
  process.exit(1);
}

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Static file route untuk assets dan uploads
app.use("/assets", express.static(path.join(__dirname, "assets")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Koneksi ke MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1);
  });

// Routes dengan prefix /api
try {
  // Daftar routes API yang dipakai di backend
  app.use(
    "/api/transaction-groups",
    require("./routes/transactionGroupRoutes")
  );
  app.use("/api/transaction-items", require("./routes/transactionItemRoutes"));
  app.use("/api/menus", require("./routes/menuRoutes"));
  app.use("/api/users", require("./routes/userRoutes"));

  // Route untuk upload file ke Cloudinary
  app.post("/api/upload", upload.single("file"), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Jika file berhasil diupload ke Cloudinary
    res.status(200).json({
      message: "File uploaded successfully",
      url: req.file.path, // URL file yang sudah di-upload di Cloudinary
    });
  });
} catch (error) {
  console.error("Error setting up routes:", error);
  process.exit(1);
}

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
