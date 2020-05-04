const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  orderId: { type: String, required: true },
  orderDate: { type: String, required: true, default: "" },
  desc: { type: String, required: true },
  status: { type: Number, required: true, default: 0 },
  updated: { type: Date, required: true, default: Date.now() },
  cell: { type: Number, required: true, default: 0 },
});

module.exports = mongoose.model("Order", orderSchema);
