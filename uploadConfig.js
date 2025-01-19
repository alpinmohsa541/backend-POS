const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Gunakan direktori yang dapat ditulis
const dir = "assets/";
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, dir); // Direktori yang dapat ditulis
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.replace(/\s+/g, "_");
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
      cb(new Error("Error: Images Only!"));
    }
  },
  limits: { fileSize: 1000000 },
});

module.exports = upload;
