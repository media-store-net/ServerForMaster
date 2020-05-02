const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  orderId: { type: String, required: true },
  orderDate: { type: String, required: true, default: "" },
  desc: { type: String, required: true },
  status: { type: Number, required: true },
  updated: { type: Date, required: true, default: Date.now() },
});

module.exports = mongoose.model("Order", orderSchema);