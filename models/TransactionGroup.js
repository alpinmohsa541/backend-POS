const mongoose = require("mongoose");

// Schema untuk Transaction Group
const transactionGroupSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, required: true }, // ID pengguna
  order_number: { type: String, required: true }, // Nomor pesanan
  transaction_type: { type: String, required: true }, // Jenis transaksi
  customer_name: { type: String, required: true }, // Nama pelanggan
  table: { type: String }, // Nomor meja (opsional)
  subtotal_group: { type: Number, required: true }, // Subtotal transaksi
  tax: { type: Number, required: true }, // Pajak
  total: { type: Number, required: true }, // Total transaksi
  status: { type: String, required: true }, // Status transaksi
  cash: { type: Number, required: true }, // Uang tunai yang dibayar
  cashback: { type: Number, required: true }, // Kembalian
  created_at: { type: Date, default: Date.now }, // Tanggal transaksi
});

// Buat dan ekspor model
module.exports = mongoose.model("TransactionGroup", transactionGroupSchema);
