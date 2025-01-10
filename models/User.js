const mongoose = require("mongoose");

// Schema untuk User
const userSchema = new mongoose.Schema({
  role: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  image: { type: String },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  status: { type: String, required: true },
  language: { type: String, required: true },
  updated_at: { type: Date, default: Date.now },
});

// Ekspor model
module.exports = mongoose.model("User", userSchema);
