const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./db");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/transaction-groups", require("./routes/transactionGroupRoutes"));
app.use("/transaction-items", require("./routes/transactionItemRoutes"));
app.use("/menus", require("./routes/menuRoutes"));
app.use("/users", require("./routes/userRoutes"));
app.use("/settings", require("./routes/settingRoutes"));
app.use("/api", require("./routes/registerRoutes")); // Register route

// Tambahkan rute login
app.use("/api", require("./routes/loginRoutes")); // Rute untuk login API
app.use(bodyParser.json()); // Untuk memproses JSON
app.use("/menus", require("./routes/menuRoutes"));

// Default route
app.get("/", (req, res) => {
  res.send("POS Backend is running...");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
