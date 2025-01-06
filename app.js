const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./db");
const menuRoutes = require("./routes/menuRoutes");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors()); // Mengaktifkan CORS
app.use(bodyParser.json()); // Untuk parsing body request dalam format JSON
app.use(bodyParser.urlencoded({ extended: true }));

// Menyiapkan direktori statis untuk menyimpan gambar yang diunggah
// app.use(express.static("assets"));

// Serve static files from the 'assets' directory
app.use("/assets", express.static("assets"));
app.use("/assets", express.static(path.join(__dirname, "assets")));
// Routes
app.use("/transaction-groups", require("./routes/transactionGroupRoutes")); // Rute untuk kelompok transaksi
app.use("/transaction-items", require("./routes/transactionItemRoutes")); // Rute untuk item transaksi
app.use("/menus", require("./routes/menuRoutes")); // Rute untuk menu (termasuk fungsi unggah gambar)
app.use("/users", require("./routes/userRoutes")); // Rute untuk pengguna
app.use("/settings", require("./routes/settingRoutes")); // Rute untuk pengaturan
app.use("/api", require("./routes/registerRoutes")); // Rute untuk pendaftaran
app.use(cors());
// Route setup
app.use("/api/menus", menuRoutes); // Gunakan API prefix yang sesuai
app.use("/uploads", express.static("uploads")); // Serve images from uploads directory

// Tambahkan rute login
app.use("/api", require("./routes/loginRoutes")); // Rute untuk login API

// Default route
app.get("/", (req, res) => {
  res.send("POS Backend is running...");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
