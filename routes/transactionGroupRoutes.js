const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// Definisikan schema untuk transaction group
const transactionGroupSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, required: true }, // ID pengguna
  order_number: { type: String, required: true }, // Nomor pesanan
  transaction_type: { type: String, required: true }, // Jenis transaksi
  customer_name: { type: String, required: true }, // Nama pelanggan
  table: { type: String }, // Nomor meja
  subtotal_group: { type: Number, required: true }, // Subtotal transaksi
  tax: { type: Number, required: true }, // Pajak
  total: { type: Number, required: true }, // Total transaksi
  status: { type: String, required: true }, // Status transaksi
  cash: { type: Number, required: true }, // Uang tunai yang dibayar
  cashback: { type: Number, required: true }, // Kembalian
  created_at: { type: Date, default: Date.now }, // Tanggal transaksi
});

// Buat model berdasarkan schema
const TransactionGroup = mongoose.model(
  "TransactionGroup",
  transactionGroupSchema
);

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

// API untuk membuat transaction group baru
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

  try {
    // Validasi input
    if (
      !user_id ||
      !order_number ||
      !transaction_type ||
      !customer_name ||
      !subtotal_group ||
      !tax ||
      !total ||
      !status ||
      !cash ||
      !cashback
    ) {
      return res
        .status(400)
        .json({ message: "All required fields must be filled" });
    }

    // Buat transaksi baru
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
