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
  customerNames: {
    type: [String],
    default: []
  },
  roomNumber: {
    type: String,
    required: true
  },
  roomNumbers: {
    type: [String],
    default: []
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
  address: {
    type: String,
    default: ''
  },
  city: {
    type: String,
    default: ''
  },
  state: {
    type: String,
    default: ''
  },
  pincode: {
    type: String,
    default: ''
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
  advanceAmount: {
    type: Number,
    default: 0
  },
  dueAmount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Bill', billSchema);
