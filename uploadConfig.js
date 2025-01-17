const multer = require("multer");
const path = require("path");
const fs = require("fs"); // Membutuhkan fs module untuk memeriksa dan membuat direktori

// Membuat direktori jika belum ada
const dir = "./assets/";
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, dir); // Tentukan direktori tempat file di-upload
  },
  filename: (req, file, cb) => {
    // Gunakan nama file yang dikirim oleh client, atau buat nama unik berdasarkan waktu
    const fileName = file.originalname.replace(/\s+/g, "_"); // Mengganti spasi dengan underscore
    cb(null, `${Date.now()}-${fileName}`);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      cb(null, true);
    } else {
      cb("Error: Images Only!"); // Hanya menerima gambar
    }
  },
  limits: { fileSize: 1000000 }, // Ukuran file maksimum 1 MB
});

module.exports = upload;
