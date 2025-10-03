const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fname: { type: String, required: true },
  lname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  gender: { type: String, enum: ["Male", "Female"], required: true },
  country: { type: String, required: true },
  terms: { type: Boolean, required: false },
  avatarUrl: { type: String, default: "" }, 
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
