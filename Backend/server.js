const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const moment = require('moment');

// Import models
const Bill = require('./models/Bill');
const Expenditure = require('./models/Expenditure');

const app = express();
const PORT = process.env.PORT || 5001;

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/gulmohar-resort';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Calculate tax breakdown
function calculateTaxes(subtotal) {
  const totalTax = subtotal * 0.05; // 5% total tax
  const sgst = totalTax / 2; // 2.5%
  const cgst = totalTax / 2; // 2.5%
  
  return {
    subtotal: parseFloat(subtotal.toFixed(2)),
    sgst: parseFloat(sgst.toFixed(2)),
    cgst: parseFloat(cgst.toFixed(2)),
    totalTax: parseFloat(totalTax.toFixed(2)),
    grandTotal: parseFloat((subtotal + totalTax).toFixed(2))
  };
}

// Routes

// Get all bills
app.get('/api/bills', async (req, res) => {
  try {
    const bills = await Bill.find().sort({ createdAt: -1 });
    res.json(bills);
  } catch (error) {
    console.error('Error fetching bills:', error);
    res.status(500).json({ error: 'Failed to fetch bills' });
  }
});

// Get bill by ID
app.get('/api/bills/:id', async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id);
    
    if (!bill) {
      return res.status(404).json({ error: 'Bill not found' });
    }
    
    res.json(bill);
  } catch (error) {
    console.error('Error fetching bill:', error);
    res.status(500).json({ error: 'Failed to fetch bill' });
  }
});

// Create new bill
app.post('/api/bills', async (req, res) => {
  try {
    const {
      customerName,
      customerNames,
      roomNumber,
      roomNumbers,
      mobileNo,
      roomCharges,
      foodCharges,
      otherCharges,
      checkInDate,
      checkOutDate,
      address,
      city,
      state,
      pincode,
      billNumber,
      advanceAmount,
      dueAmount
    } = req.body;

    // Validate required fields
    if (!customerName || !roomNumber || !mobileNo) {
      return res.status(400).json({ error: 'Customer name, room number, and mobile number are required' });
    }

    const subtotal = (parseFloat(roomCharges) || 0) + (parseFloat(foodCharges) || 0) + (parseFloat(otherCharges) || 0);
    const taxes = calculateTaxes(subtotal);

    const newBill = new Bill({
      customerName,
      customerNames: customerNames || [customerName],
      roomNumber,
      roomNumbers: roomNumbers || [roomNumber],
      mobileNo,
      roomCharges: parseFloat(roomCharges) || 0,
      foodCharges: parseFloat(foodCharges) || 0,
      otherCharges: parseFloat(otherCharges) || 0,
      checkInDate: checkInDate ? new Date(checkInDate) : null,
      checkOutDate: checkOutDate ? new Date(checkOutDate) : null,
      address: address || '',
      city: city || '',
      state: state || '',
      pincode: pincode || '',
      advanceAmount: parseFloat(advanceAmount) || 0,
      dueAmount: parseFloat(dueAmount) || 0,
      ...taxes,
      billNumber: billNumber || `GR${Date.now()}`
    });

    const savedBill = await newBill.save();
    res.status(201).json(savedBill);
  } catch (error) {
    console.error('Error creating bill:', error);
    res.status(500).json({ error: 'Failed to create bill' });
  }
});

// Get monthly summary
app.get('/api/summary/monthly/:month/:year', async (req, res) => {
  try {
    const { month, year } = req.params;
    
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);
    
    const monthlyBills = await Bill.find({
      createdAt: {
        $gte: startDate,
        $lte: endDate
      }
    }).sort({ createdAt: -1 });

    const summary = {
      month: parseInt(month),
      year: parseInt(year),
      totalBills: monthlyBills.length,
      totalRevenue: monthlyBills.reduce((sum, bill) => sum + bill.grandTotal, 0),
      totalRoomCharges: monthlyBills.reduce((sum, bill) => sum + (bill.roomCharges || 0), 0),
      totalFoodCharges: monthlyBills.reduce((sum, bill) => sum + bill.foodCharges, 0),
      totalOtherCharges: monthlyBills.reduce((sum, bill) => sum + bill.otherCharges, 0),
      totalSGST: monthlyBills.reduce((sum, bill) => sum + bill.sgst, 0),
      totalCGST: monthlyBills.reduce((sum, bill) => sum + bill.cgst, 0),
      bills: monthlyBills
    };

    res.json(summary);
  } catch (error) {
    console.error('Error generating monthly summary:', error);
    res.status(500).json({ error: 'Failed to generate monthly summary' });
  }
});

// Get all expenditures
app.get('/api/expenditures', async (req, res) => {
  try {
    const expenditures = await Expenditure.find().sort({ createdAt: -1 });
    res.json(expenditures);
  } catch (error) {
    console.error('Error fetching expenditures:', error);
    res.status(500).json({ error: 'Failed to fetch expenditures' });
  }
});

// Create new expenditure
app.post('/api/expenditures', async (req, res) => {
  try {
    const { description, amount, category, date } = req.body;

    if (!description || !amount) {
      return res.status(400).json({ error: 'Description and amount are required' });
    }

    const newExpenditure = new Expenditure({
      description,
      amount: parseFloat(amount),
      category: category || 'General',
      date: date ? new Date(date) : new Date()
    });

    const savedExpenditure = await newExpenditure.save();
    res.status(201).json(savedExpenditure);
  } catch (error) {
    console.error('Error creating expenditure:', error);
    res.status(500).json({ error: 'Failed to create expenditure' });
  }
});

// Delete bill
app.delete('/api/bills/:id', async (req, res) => {
  try {
    const deletedBill = await Bill.findByIdAndDelete(req.params.id);
    
    if (!deletedBill) {
      return res.status(404).json({ error: 'Bill not found' });
    }

    res.json({ message: 'Bill deleted successfully' });
  } catch (error) {
    console.error('Error deleting bill:', error);
    res.status(500).json({ error: 'Failed to delete bill' });
  }
});

// Delete expenditure
app.delete('/api/expenditures/:id', async (req, res) => {
  try {
    const deletedExpenditure = await Expenditure.findByIdAndDelete(req.params.id);
    
    if (!deletedExpenditure) {
      return res.status(404).json({ error: 'Expenditure not found' });
    }

    res.json({ message: 'Expenditure deleted successfully' });
  } catch (error) {
    console.error('Error deleting expenditure:', error);
    res.status(500).json({ error: 'Failed to delete expenditure' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: moment().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Gulmohar Resort Backend running on port ${PORT}`);
});

module.exports = app;
