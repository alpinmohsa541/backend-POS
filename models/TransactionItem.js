const mongoose = require("mongoose");

// Schema untuk Transaction Item
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

// Buat dan ekspor model
module.exports = mongoose.model("TransactionItem", transactionItemSchema);
