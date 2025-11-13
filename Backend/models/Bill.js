const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
  billNumber: {
    type: String,
    required: true,
    unique: true
  },
  customerName: {
    type: String,
    required: true
  },
  roomNumber: {
    type: String,
    required: true
  },
  mobileNo: {
    type: String,
    required: true
  },
  roomCharges: {
    type: Number,
    default: 0
  },
  foodCharges: {
    type: Number,
    default: 0
  },
  otherCharges: {
    type: Number,
    default: 0
  },
  checkInDate: {
    type: Date
  },
  checkOutDate: {
    type: Date
  },
  subtotal: {
    type: Number,
    required: true
  },
  sgst: {
    type: Number,
    required: true
  },
  cgst: {
    type: Number,
    required: true
  },
  totalTax: {
    type: Number,
    required: true
  },
  grandTotal: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Bill', billSchema);
