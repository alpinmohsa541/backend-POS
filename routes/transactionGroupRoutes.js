const express = require("express");
const router = express.Router();
const db = require("../db");

// Get all transaction groups
router.get("/", (req, res) => {
  db.query("SELECT * FROM transaction_group", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// Create new transaction group
router.post("/", (req, res) => {
  const {
    user_id,
    order_number,
    transaction_type,
    customer_name,
    table,
    subtotal_group,
    tax,
    total,
    status,
    cash,
    cashback,
  } = req.body;
  const query = `INSERT INTO transaction_group (user_id, order_number, transaction_type, customer_name, table, subtotal_group, tax, total, status, cash, cashback) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  db.query(
    query,
    [
      user_id,
      order_number,
      transaction_type,
      customer_name,
      table,
      subtotal_group,
      tax,
      total,
      status,
      cash,
      cashback,
    ],
    (err, results) => {
      if (err) return res.status(500).json(err);
      res.json({
        message: "Transaction group created successfully.",
        id: results.insertId,
      });
    }
  );
});

module.exports = router;
