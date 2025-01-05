const express = require("express");
const router = express.Router();
const db = require("../db");

// Get all settings
router.get("/", (req, res) => {
  db.query("SELECT * FROM setting", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

module.exports = router;
