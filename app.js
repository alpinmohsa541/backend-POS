const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

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
app.use("/assets", express.static(path.join(__dirname, "assets")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Koneksi ke MongoDB tanpa opsi deprecated
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1);
  });

// Routes
try {
  // Pastikan semua route menggunakan model yang sudah didefinisikan di folder 'models'
  app.use("/transaction-groups", require("./routes/transactionGroupRoutes"));
  app.use("/transaction-items", require("./routes/transactionItemRoutes"));
  app.use("/menus", require("./routes/menuRoutes"));
  app.use("/users", require("./routes/userRoutes"));
  app.use("/settings", require("./routes/settingRoutes"));
  app.use("/api/register", require("./routes/registerRoutes"));
  app.use("/api/login", require("./routes/loginRoutes"));
} catch (err) {
  console.error("Error loading routes:", err.message);
  process.exit(1);
}

// Default route
app.get("/", (req, res) => {
  res.send("POS Backend is running...");
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Global error:", err.stack);
  res
    .status(500)
    .json({ message: "Internal Server Error", error: err.message });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
