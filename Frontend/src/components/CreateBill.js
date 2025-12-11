import React, { useState } from 'react';
import { billsAPI } from '../utils/api';
import { generateBillPDF } from '../utils/pdfGenerator';
import { Save, Download, Calculator, Plus, X } from 'lucide-react';
import moment from 'moment';

const CreateBill = () => {
  const [formData, setFormData] = useState({
    customerNames: [''],
    roomNumbers: [],
    mobileNo: '',
    roomCharges: '',
    foodCharges: '',
    otherCharges: '',
    checkInDate: '',
    checkOutDate: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    advanceAmount: '',
    dueAmount: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [calculatedTax, setCalculatedTax] = useState({
    subtotal: 0,
    sgst: 0,
    cgst: 0,
    totalTax: 0,
    grandTotal: 0
  });

  // Generate date-based serial number
  const generateSerialNumber = () => {
    const date = moment().format('DDMMYY');
    const time = moment().format('HHmmss');
    return `GR${date}${time}`;
  };

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

  const handleCustomerNameChange = (index, value) => {
    const newCustomerNames = [...formData.customerNames];
    newCustomerNames[index] = value;
    setFormData(prev => ({
      ...prev,
      customerNames: newCustomerNames
    }));
  };

  const addCustomerName = () => {
    setFormData(prev => ({
      ...prev,
      customerNames: [...prev.customerNames, '']
    }));
  };

  const removeCustomerName = (index) => {
    setFormData(prev => ({
      ...prev,
      customerNames: prev.customerNames.filter((_, i) => i !== index)
    }));
  };

  const handleRoomNumberChange = (e) => {
    const selectedRoom = e.target.value;
    if (selectedRoom && !formData.roomNumbers.includes(selectedRoom)) {
      setFormData(prev => ({
        ...prev,
        roomNumbers: [...prev.roomNumbers, selectedRoom]
      }));
    }
  };

  const removeRoomNumber = (roomToRemove) => {
    setFormData(prev => ({
      ...prev,
      roomNumbers: prev.roomNumbers.filter(room => room !== roomToRemove)
    }));
  };

  const calculateTax = React.useCallback(() => {
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
  }, [formData.roomCharges, formData.foodCharges, formData.otherCharges]);

  // Recalculate tax whenever room, food, or other charges change
  React.useEffect(() => {
    calculateTax();
  }, [calculateTax]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    const validCustomerNames = formData.customerNames.filter(name => name.trim());
    if (validCustomerNames.length === 0) {
      alert('At least one customer name is required');
      return;
    }
    if (formData.roomNumbers.length === 0) {
      alert('Please select at least one room number');
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
      const billData = {
        ...formData,
        customerNames: validCustomerNames,
        customerName: validCustomerNames.join(', '), // For backward compatibility
        roomNumber: formData.roomNumbers.join(', '), // For backward compatibility
        billNumber: generateSerialNumber()
      };
      console.log('Form data being sent to API:', billData);
      const response = await billsAPI.create(billData);
      const newBill = response.data;
      console.log('Bill received from API:', newBill);
      
      alert('Bill created successfully!');
      
      // Generate PDF
      await generateBillPDF(newBill);
      
      // Reset form
      setFormData({
        customerNames: [''],
        roomNumbers: [],
        mobileNo: '',
        roomCharges: '',
        foodCharges: '',
        otherCharges: '',
        checkInDate: '',
        checkOutDate: '',
        address: '',
        city: '',
        state: '',
        pincode: ''
      });
      
    } catch (error) {
      console.error('Error creating bill:', error);
      alert('Failed to create bill. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePreviewPDF = async () => {
    const validCustomerNames = formData.customerNames.filter(name => name.trim());
    if (validCustomerNames.length === 0 || formData.roomNumbers.length === 0) {
      alert('Please fill in at least one customer name and select at least one room to preview');
      return;
    }

    const previewData = {
      ...formData,
      customerNames: validCustomerNames,
      customerName: validCustomerNames.join(', '),
      roomNumber: formData.roomNumbers.join(', '),
      ...calculatedTax,
      billNumber: generateSerialNumber(),
      createdAt: new Date().toISOString()
    };

    await generateBillPDF(previewData);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
      {/* Page header */}
      <div className="animate-slideInLeft">
        <div className="bg-gradient-to-r from-gulmohar-50 to-gulmohar-100 rounded-xl p-6 border border-gulmohar-200 shadow-lg">
          <h1 className="text-4xl font-bold text-transparent bg-gradient-to-r from-gulmohar-600 to-gulmohar-800 bg-clip-text">
            Create New Bill
          </h1>
          <p className="mt-3 text-sm text-gray-600 flex items-center">
            <span className="inline-block w-1 h-1 bg-gulmohar-600 rounded-full mr-2"></span>
            Generate a new bill for customer checkout
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main form */}
          <div className="lg:col-span-2 space-y-6 animate-slideInLeft">
            {/* Customer Information */}
            <div className="card transform-hover border-l-4 border-gulmohar-600 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-1 h-6 bg-gradient-to-b from-gulmohar-600 to-gulmohar-400 rounded mr-3"></div>
                <h2 className="text-lg font-bold text-gray-900">Customer Information</h2>
              </div>
              
              {/* Customer Names */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Names *
                </label>
                <div className="space-y-2">
                  {formData.customerNames.map((name, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => handleCustomerNameChange(index, e.target.value)}
                        className="form-input flex-1"
                        placeholder={`Customer name ${index + 1}`}
                      />
                      {formData.customerNames.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeCustomerName(index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg interactive"
                          title="Remove customer"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addCustomerName}
                  className="mt-2 flex items-center text-gulmohar hover:text-gulmohar text-sm font-medium interactive"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Another Customer
                </button>
              </div>

              {/* Mobile Number */}
              <div className="mb-4">
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

            {/* Room Information */}
            <div className="card transform-hover">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Room Information</h2>
              
              {/* Room Selection */}
              <div className="mb-4">
                <label htmlFor="roomNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  Select Rooms *
                </label>
                <select
                  id="roomNumber"
                  onChange={handleRoomNumberChange}
                  className="form-select"
                  defaultValue=""
                >
                  <option value="">Add a room...</option>
                  {roomOptions.slice(1).map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                
                {/* Selected Rooms */}
                {formData.roomNumbers.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {formData.roomNumbers.map((room) => (
                      <div
                        key={room}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gulmohar text-white"
                      >
                        {room}
                        <button
                          type="button"
                          onClick={() => removeRoomNumber(room)}
                          className="ml-2 hover:opacity-80 interactive"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Check-in and Check-out Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <div className="card transform-hover border-l-4 border-blue-600 shadow-lg hover:shadow-xl transition-all duration-300 animate-slideInUp">
              <div className="flex items-center mb-4">
                <div className="w-1 h-6 bg-gradient-to-b from-blue-600 to-blue-400 rounded mr-3"></div>
                <h2 className="text-lg font-bold text-gray-900">Charges</h2>
              </div>
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

            {/* Advance & Due Amount */}
            <div className="card transform-hover border-l-4 border-green-600 shadow-lg hover:shadow-xl transition-all duration-300 animate-slideInUp">
              <div className="flex items-center mb-4">
                <div className="w-1 h-6 bg-gradient-to-b from-green-600 to-green-400 rounded mr-3"></div>
                <h2 className="text-lg font-bold text-gray-900">Payment Details</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="advanceAmount" className="block text-sm font-medium text-gray-700">
                    Advance Amount (₹)
                  </label>
                  <input
                    type="number"
                    name="advanceAmount"
                    id="advanceAmount"
                    min="0"
                    step="0.01"
                    value={formData.advanceAmount}
                    onChange={handleInputChange}
                    className="form-input mt-1"
                    placeholder="0.00"
                  />
                </div>
                
                <div>
                  <label htmlFor="dueAmount" className="block text-sm font-medium text-gray-700">
                    Due Amount (₹)
                  </label>
                  <input
                    type="number"
                    name="dueAmount"
                    id="dueAmount"
                    min="0"
                    step="0.01"
                    value={formData.dueAmount}
                    onChange={handleInputChange}
                    className="form-input mt-1"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="card transform-hover border-l-4 border-purple-600 shadow-lg hover:shadow-xl transition-all duration-300 animate-slideInUp">
              <div className="flex items-center mb-4">
                <div className="w-1 h-6 bg-gradient-to-b from-purple-600 to-purple-400 rounded mr-3"></div>
                <h2 className="text-lg font-bold text-gray-900">Address Information</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                    Street Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    id="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="form-input mt-1"
                    placeholder="Enter street address"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      id="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="form-input mt-1"
                      placeholder="Enter city"
                    />
                  </div>

                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                      State
                    </label>
                    <input
                      type="text"
                      name="state"
                      id="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="form-input mt-1"
                      placeholder="Enter state"
                    />
                  </div>

                  <div>
                    <label htmlFor="pincode" className="block text-sm font-medium text-gray-700">
                      Pincode
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      id="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      className="form-input mt-1"
                      placeholder="Enter pincode"
                    />
                  </div>
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
