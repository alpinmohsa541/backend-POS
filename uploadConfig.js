const cloudinary = require("./cloudinaryConfig");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Setup multer storage untuk Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "uploads", // Folder untuk menyimpan gambar di Cloudinary
    allowed_formats: ["jpg", "jpeg", "png", "gif"], // Format file yang diizinkan
  },
});

// Multer upload middleware
const upload = multer({ storage: storage });

module.exports = upload;
