const mongoose = require("mongoose");
const counterSchema = new mongoose.Schema({
  key: { type: String, unique: true },
  seq: { type: Number, default: 1 },
});
module.exports = mongoose.model("Counter", counterSchema);
