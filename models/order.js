const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  orderId: { type: String, required: true },
  orderDate: { type: String, required: true, default: "" },
  desc: { type: String, required: true },
  status: { type: Number, required: true, default: 0 },
  cell: { type: Number, required: true, default: 0 },
  dateOpen: { type: Date, required: true, default: new Date() },
  dateAssembly: { type: Date, required: true, default: 0 },
  dateDone: { type: Date, required: true, default: 0 },
  dateDone_ready: { type: Date, required: true, default: 0 },
  dateErr: { type: Date, required: true, default: 0 },
  dateClose: { type: Date, required: true, default: 0 },
});

module.exports = mongoose.model("Order", orderSchema);
