const express = require("express");
const router = express.Router();
const TransactionGroup = require("../models/TransactionGroup"); // Import model TransactionGroup

// API untuk mendapatkan semua transaction group
router.get("/", async (req, res) => {
  try {
    const transactionGroups = await TransactionGroup.find();
    res.json(transactionGroups);
  } catch (err) {
    console.error("Database error (fetch transaction groups):", err);
    res.status(500).json({ message: "Failed to fetch transaction groups" });
  }
});

// API untuk membuat transaction group baru tanpa validasi input
router.post("/", async (req, res) => {
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

  // Log incoming request data
  console.log("Received Data:", req.body);  // Log data yang diterima

  try {
    // Buat transaksi baru tanpa validasi input
    const newTransactionGroup = new TransactionGroup({
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
    });

    const savedTransaction = await newTransactionGroup.save();
    res.status(201).json({
      message: "Transaction group created successfully.",
      id: savedTransaction._id,
    });
  } catch (err) {
    console.error("Database error (create transaction group):", err);
    res.status(500).json({ message: "Failed to create transaction group" });
  }
});

module.exports = router;
