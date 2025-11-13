import React, { useState } from 'react';
import { billsAPI } from '../utils/api';
import { generateBillPDF } from '../utils/pdfGenerator';
import { Save, Download, Calculator } from 'lucide-react';

const CreateBill = () => {
  const [formData, setFormData] = useState({
    customerName: '',
    roomNumber: '',
    mobileNo: '',
    roomCharges: '',
    foodCharges: '',
    otherCharges: '',
    checkInDate: '',
    checkOutDate: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [calculatedTax, setCalculatedTax] = useState({
    subtotal: 0,
    sgst: 0,
    cgst: 0,
    totalTax: 0,
    grandTotal: 0
  });

  const roomOptions = [
    { value: '', label: 'Select Room Number' },
    { value: 'C1', label: 'C1 - Category C Room 1' },
    { value: 'C2', label: 'C2 - Category C Room 2' },
    { value: 'C3', label: 'C3 - Category C Room 3' },
    { value: 'C4', label: 'C4 - Category C Room 4' },
    { value: 'D1', label: 'D1 - Category D Room 1' },
    { value: 'D2', label: 'D2 - Category D Room 2' },
    { value: 'G1', label: 'G1 - Category G Room 1' },
    { value: 'G2', label: 'G2 - Category G Room 2' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Recalculate tax when charges change
    if (name === 'roomCharges' || name === 'foodCharges' || name === 'otherCharges') {
      calculateTax();
    }
  };

  const calculateTax = () => {
    const roomCharges = parseFloat(formData.roomCharges) || 0;
    const foodCharges = parseFloat(formData.foodCharges) || 0;
    const otherCharges = parseFloat(formData.otherCharges) || 0;
    const subtotal = roomCharges + foodCharges + otherCharges;
    
    const totalTax = subtotal * 0.05; // 5% total tax
    const sgst = totalTax / 2; // 2.5%
    const cgst = totalTax / 2; // 2.5%
    const grandTotal = subtotal + totalTax;

    setCalculatedTax({
      subtotal: parseFloat(subtotal.toFixed(2)),
      sgst: parseFloat(sgst.toFixed(2)),
      cgst: parseFloat(cgst.toFixed(2)),
      totalTax: parseFloat(totalTax.toFixed(2)),
      grandTotal: parseFloat(grandTotal.toFixed(2))
    });
  };

  // Recalculate tax whenever room, food, or other charges change
  React.useEffect(() => {
    calculateTax();
  }, [formData.roomCharges, formData.foodCharges, formData.otherCharges, calculateTax]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.customerName.trim()) {
      alert('Customer name is required');
      return;
    }
    if (!formData.roomNumber) {
      alert('Please select a room number');
      return;
    }
    if (!formData.mobileNo.trim()) {
      alert('Mobile number is required');
      return;
    }
    if (formData.mobileNo.length !== 10) {
      alert('Mobile number must be 10 digits');
      return;
    }

    try {
      setLoading(true);
      console.log('Form data being sent to API:', formData);
      const response = await billsAPI.create(formData);
      const newBill = response.data;
      console.log('Bill received from API:', newBill);
      
      alert('Bill created successfully!');
      
      // Generate PDF
      await generateBillPDF(newBill);
      
      // Reset form
      setFormData({
        customerName: '',
        roomNumber: '',
        mobileNo: '',
        roomCharges: '',
        foodCharges: '',
        otherCharges: '',
        checkInDate: '',
        checkOutDate: ''
      });
      
    } catch (error) {
      console.error('Error creating bill:', error);
      alert('Failed to create bill. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePreviewPDF = async () => {
    if (!formData.customerName.trim() || !formData.roomNumber) {
      alert('Please fill in customer name and room number to preview');
      return;
    }

    const previewData = {
      ...formData,
      ...calculatedTax,
      billNumber: `GR${Date.now()}`,
      createdAt: new Date().toISOString()
    };

    await generateBillPDF(previewData);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
      {/* Page header */}
      <div className="animate-slideInLeft">
        <h1 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-gulmohar-600 to-gulmohar-800 bg-clip-text text-transparent">
          Create New Bill
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Generate a new bill for customer checkout
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main form */}
          <div className="lg:col-span-2 space-y-6 animate-slideInLeft">
            {/* Customer Information */}
            <div className="card transform-hover">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="customerName" className="block text-sm font-medium text-gray-700">
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    name="customerName"
                    id="customerName"
                    required
                    value={formData.customerName}
                    onChange={handleInputChange}
                    className="form-input mt-1"
                    placeholder="Enter customer name"
                  />
                </div>
                
                <div>
                  <label htmlFor="mobileNo" className="block text-sm font-medium text-gray-700">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    name="mobileNo"
                    id="mobileNo"
                    required
                    pattern="[0-9]{10}"
                    value={formData.mobileNo}
                    onChange={handleInputChange}
                    className="form-input mt-1"
                    placeholder="Enter 10-digit mobile number"
                  />
                </div>
              </div>
            </div>

            {/* Room Information */}
            <div className="card transform-hover">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Room Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="roomNumber" className="block text-sm font-medium text-gray-700">
                    Room Number *
                  </label>
                  <select
                    name="roomNumber"
                    id="roomNumber"
                    required
                    value={formData.roomNumber}
                    onChange={handleInputChange}
                    className="form-select mt-1"
                  >
                    {roomOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="checkInDate" className="block text-sm font-medium text-gray-700">
                    Check-in Date
                  </label>
                  <input
                    type="date"
                    name="checkInDate"
                    id="checkInDate"
                    value={formData.checkInDate}
                    onChange={handleInputChange}
                    className="form-input mt-1"
                  />
                </div>
                
                <div>
                  <label htmlFor="checkOutDate" className="block text-sm font-medium text-gray-700">
                    Check-out Date
                  </label>
                  <input
                    type="date"
                    name="checkOutDate"
                    id="checkOutDate"
                    value={formData.checkOutDate}
                    onChange={handleInputChange}
                    className="form-input mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Charges */}
            <div className="card transform-hover border-animated">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Charges</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="roomCharges" className="block text-sm font-medium text-gray-700">
                    Room Charges (₹)
                  </label>
                  <input
                    type="number"
                    name="roomCharges"
                    id="roomCharges"
                    min="0"
                    step="0.01"
                    value={formData.roomCharges}
                    onChange={handleInputChange}
                    className="form-input mt-1"
                    placeholder="0.00"
                  />
                </div>
                
                <div>
                  <label htmlFor="foodCharges" className="block text-sm font-medium text-gray-700">
                    Food Charges (₹)
                  </label>
                  <input
                    type="number"
                    name="foodCharges"
                    id="foodCharges"
                    min="0"
                    step="0.01"
                    value={formData.foodCharges}
                    onChange={handleInputChange}
                    className="form-input mt-1"
                    placeholder="0.00"
                  />
                </div>
                
                <div>
                  <label htmlFor="otherCharges" className="block text-sm font-medium text-gray-700">
                    Other Charges (₹)
                  </label>
                  <input
                    type="number"
                    name="otherCharges"
                    id="otherCharges"
                    min="0"
                    step="0.01"
                    value={formData.otherCharges}
                    onChange={handleInputChange}
                    className="form-input mt-1"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Bill Summary Sidebar */}
          <div className="lg:col-span-1 animate-slideInRight">
            <div className="card sticky top-6 glass shadow-modern">
              <div className="flex items-center mb-4">
                <Calculator className="h-5 w-5 text-gulmohar mr-2" />
                <h2 className="text-lg font-semibold text-gray-900">Bill Summary</h2>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Room Charges:</span>
                  <span>₹{(parseFloat(formData.roomCharges) || 0).toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span>Food Charges:</span>
                  <span>₹{(parseFloat(formData.foodCharges) || 0).toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span>Other Charges:</span>
                  <span>₹{(parseFloat(formData.otherCharges) || 0).toFixed(2)}</span>
                </div>
                
                <hr />
                
                <div className="flex justify-between text-sm font-medium">
                  <span>Subtotal:</span>
                  <span>₹{calculatedTax.subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between text-sm text-gray-600">
                  <span>SGST (2.5%):</span>
                  <span>₹{calculatedTax.sgst.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between text-sm text-gray-600">
                  <span>CGST (2.5%):</span>
                  <span>₹{calculatedTax.cgst.toFixed(2)}</span>
                </div>
                
                <hr />
                
                <div className="flex justify-between text-lg font-bold text-gulmohar">
                  <span>Total Amount:</span>
                  <span>₹{calculatedTax.grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <button
                  type="button"
                  onClick={handlePreviewPDF}
                  className="w-full btn-secondary interactive"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Preview PDF
                </button>
                
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full btn-primary interactive ${loading ? 'loading-state' : ''}`}
                >
                  {loading ? (
                    <div className="loading-spinner mr-2"></div>
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  {loading ? 'Creating...' : 'Create & Save Bill'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateBill;
