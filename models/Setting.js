const mongoose = require("mongoose");

// Schema untuk Setting
const settingSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true }, // Key unik untuk setting
  value: { type: mongoose.Schema.Types.Mixed, required: true }, // Value bisa berupa tipe data apa saja
});

// Buat dan ekspor model
module.exports = mongoose.model("Setting", settingSchema);
