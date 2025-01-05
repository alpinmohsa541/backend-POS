const express = require("express");
const router = express.Router();
const db = require("../db");

// Get all transaction items
router.get("/", (req, res) => {
  db.query("SELECT * FROM transaction_item", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// Create new transaction item
router.post("/", (req, res) => {
  const { transaction_group_id, menu_id, quantity, subtotal } = req.body;
  const query = `INSERT INTO transaction_item (transaction_group_id, menu_id, quantity, subtotal) VALUES (?, ?, ?, ?)`;
  db.query(
    query,
    [transaction_group_id, menu_id, quantity, subtotal],
    (err, results) => {
      if (err) return res.status(500).json(err);
      res.json({
        message: "Transaction item created successfully.",
        id: results.insertId,
      });
    }
  );
});

module.exports = router;
