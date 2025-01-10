const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// Definisikan schema untuk transaction item
const transactionItemSchema = new mongoose.Schema({
  transaction_group_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "TransactionGroup",
  }, // Referensi ke group transaksi
  menu_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Menu",
  }, // Referensi ke menu
  quantity: { type: Number, required: true }, // Jumlah item
  subtotal: { type: Number, required: true }, // Subtotal transaksi
  created_at: { type: Date, default: Date.now }, // Waktu pembuatan
});

// Buat model untuk transaction item
const TransactionItem = mongoose.model(
  "TransactionItem",
  transactionItemSchema
);

// API untuk mendapatkan semua transaction items
router.get("/", async (req, res) => {
  try {
    const transactionItems = await TransactionItem.find()
      .populate("transaction_group_id") // Opsional: Populate data dari TransactionGroup
      .populate("menu_id"); // Opsional: Populate data dari Menu
    res.json(transactionItems);
  } catch (err) {
    console.error("Database error (fetch transaction items):", err);
    res.status(500).json({ message: "Failed to fetch transaction items" });
  }
});

// API untuk membuat transaction item baru
router.post("/", async (req, res) => {
  const { transaction_group_id, menu_id, quantity, subtotal } = req.body;

  try {
    // Validasi input
    if (!transaction_group_id || !menu_id || !quantity || !subtotal) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Buat transaction item baru
    const newTransactionItem = new TransactionItem({
      transaction_group_id,
      menu_id,
      quantity,
      subtotal,
    });

    const savedTransactionItem = await newTransactionItem.save();
    res.status(201).json({
      message: "Transaction item created successfully.",
      id: savedTransactionItem._id,
    });
  } catch (err) {
    console.error("Database error (create transaction item):", err);
    res.status(500).json({ message: "Failed to create transaction item" });
  }
});

module.exports = router;
