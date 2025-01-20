const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Konfigurasi storage menggunakan diskStorage untuk menyimpan gambar ke folder assets
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "assets"); // Tentukan folder assets

    // Cek apakah folder assets ada, jika tidak buat foldernya
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }

    cb(null, uploadPath); // Tentukan folder tujuan upload
  },
  filename: (req, file, cb) => {
    // Tentukan nama file dengan menambahkan timestamp agar unik
    cb(null, Date.now() + path.extname(file.originalname)); // Menambahkan ekstensi file yang sesuai
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/; // Hanya menerima file dengan ekstensi ini
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      cb(null, true); // Jika tipe dan ekstensi sesuai, lanjutkan
    } else {
      cb(new Error("Error: Images Only!")); // Menolak file jika tidak sesuai
    }
  },
  limits: { fileSize: 1000000 }, // Batasi ukuran file hingga 1MB
});

module.exports = upload;
