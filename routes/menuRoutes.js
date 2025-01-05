const express = require("express");
const router = express.Router();
const db = require("../db");

// Get all menus
router.get("/", (req, res) => {
  db.query("SELECT * FROM menu WHERE is_deleted = 0", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// Create new menu
router.post("/", (req, res) => {
  const { name, category, price, description } = req.body;
  const query = `INSERT INTO menu (name, category, price, description, is_deleted) VALUES (?, ?, ?, ?, 0)`;
  db.query(query, [name, category, price, description], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Menu created successfully.", id: results.insertId });
  });
});

module.exports = router;
