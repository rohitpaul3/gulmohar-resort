import React, { useState, useEffect } from 'react';
import { billsAPI } from '../utils/api';
import { generateBillPDF } from '../utils/pdfGenerator';
import { 
  Search, 
  Download, 
  Eye, 
  RefreshCw,
  Trash2
} from 'lucide-react';
import moment from 'moment';

const ViewBills = () => {
  const [bills, setBills] = useState([]);
  const [filteredBills, setFilteredBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState({
    startDate: '',
    endDate: ''
  });
  const [roomFilter, setRoomFilter] = useState('');

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      setLoading(true);
      const response = await billsAPI.getAll();
      setBills(response.data);
    } catch (error) {
      console.error('Error fetching bills:', error);
      alert('Failed to fetch bills');
    } finally {
      setLoading(false);
    }
  };

  const filterBills = React.useCallback(() => {
    let filtered = [...bills];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(bill => 
        bill.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bill.billNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bill.mobileNo.includes(searchTerm)
      );
    }

    // Date filter
    if (dateFilter.startDate && dateFilter.endDate) {
      filtered = filtered.filter(bill => {
        const billDate = moment(bill.createdAt).format('YYYY-MM-DD');
        return billDate >= dateFilter.startDate && billDate <= dateFilter.endDate;
      });
    }

    // Room filter
    if (roomFilter) {
      filtered = filtered.filter(bill => bill.roomNumber === roomFilter);
    }

    // Sort by creation date (newest first)
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    setFilteredBills(filtered);
  }, [bills, searchTerm, dateFilter, roomFilter]);

  useEffect(() => {
    filterBills();
  }, [filterBills]);

  const handleDownloadPDF = async (bill) => {
    // Ensure roomCharges exists for older bills
    const billWithRoomCharges = {
      ...bill,
      roomCharges: bill.roomCharges || 0
    };
    await generateBillPDF(billWithRoomCharges);
  };

  const handleDeleteBill = async (billId, billNumber) => {
    if (window.confirm(`Are you sure you want to delete bill ${billNumber}? This action cannot be undone.`)) {
      try {
        await billsAPI.delete(billId);
        alert('Bill deleted successfully!');
        fetchBills();
      } catch (error) {
        console.error('Error deleting bill:', error);
        alert('Failed to delete bill. Please try again.');
      }
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDateFilterChange = (e) => {
    const { name, value } = e.target;
    setDateFilter(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const clearFilters = () => {
    setSearchTerm('');
    setDateFilter({ startDate: '', endDate: '' });
    setRoomFilter('');
  };

  const roomOptions = ['C1', 'C2', 'C3', 'C4', 'D1', 'D2', 'G1', 'G2'];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loading-spinner"></div>
        <span className="ml-2">Loading bills...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page header */}
      <div className="flex justify-between items-center animate-slideInLeft">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-gulmohar-600 to-gulmohar-800 bg-clip-text text-transparent">
            View Bills
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage and download previous bills
          </p>
        </div>
        <button
          onClick={fetchBills}
          className="btn-secondary interactive"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="card transform-hover animate-slideInRight">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900">Filters</h2>
          {(searchTerm || dateFilter.startDate || dateFilter.endDate || roomFilter) && (
            <button
              onClick={clearFilters}
              className="text-sm text-gulmohar hover:text-gulmohar interactive"
            >
              Clear all filters
            </button>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700">
              Search
            </label>
            <div className="relative mt-1">
              <input
                type="text"
                name="search"
                id="search"
                value={searchTerm}
                onChange={handleSearchChange}
                className="form-input pl-10"
                placeholder="Customer, Bill No, Mobile"
              />
              <Search className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
            </div>
          </div>

          {/* Start Date */}
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
              From Date
            </label>
            <input
              type="date"
              name="startDate"
              id="startDate"
              value={dateFilter.startDate}
              onChange={handleDateFilterChange}
              className="form-input mt-1"
            />
          </div>

          {/* End Date */}
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
              To Date
            </label>
            <input
              type="date"
              name="endDate"
              id="endDate"
              value={dateFilter.endDate}
              onChange={handleDateFilterChange}
              className="form-input mt-1"
            />
          </div>

          {/* Room Filter */}
          <div>
            <label htmlFor="roomFilter" className="block text-sm font-medium text-gray-700">
              Room
            </label>
            <select
              name="roomFilter"
              id="roomFilter"
              value={roomFilter}
              onChange={(e) => setRoomFilter(e.target.value)}
              className="form-select mt-1"
            >
              <option value="">All Rooms</option>
              {roomOptions.map(room => (
                <option key={room} value={room}>{room}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>
          Showing {filteredBills.length} of {bills.length} bills
        </span>
        {filteredBills.length > 0 && (
          <span>
            Total Amount: ₹{filteredBills.reduce((sum, bill) => sum + bill.grandTotal, 0).toFixed(2)}
          </span>
        )}
      </div>

      {/* Bills Table */}
      <div className="card p-0 animate-scaleIn">
        {filteredBills.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Bill No</th>
                  <th>Date</th>
                  <th>Customer</th>
                  <th>Room No</th>
                  <th>Mobile</th>
                  <th>Room ₹</th>
                  <th>Food ₹</th>
                  <th>Other ₹</th>
                  <th>Tax ₹</th>
                  <th>Total ₹</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredBills.map((bill) => (
                  <tr key={bill.id} className="hover:bg-gray-50">
                    <td className="font-medium text-gulmohar">{bill.billNumber}</td>
                    <td>
                      <div className="text-sm">
                        <div>{moment(bill.createdAt).format('DD/MM/YYYY')}</div>
                        <div className="text-gray-500">{moment(bill.createdAt).format('HH:mm')}</div>
                      </div>
                    </td>
                    <td>
                      <div className="font-medium">{bill.customerName}</div>
                      {bill.checkInDate && bill.checkOutDate && (
                        <div className="text-xs text-gray-500">
                          {moment(bill.checkInDate).format('DD/MM')} - {moment(bill.checkOutDate).format('DD/MM')}
                        </div>
                      )}
                    </td>
                    <td>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gulmohar text-white">
                        {bill.roomNumber}
                      </span>
                    </td>
                    <td>{bill.mobileNo}</td>
                    <td>₹{(bill.roomCharges || 0).toFixed(2)}</td>
                    <td>₹{bill.foodCharges.toFixed(2)}</td>
                    <td>₹{bill.otherCharges.toFixed(2)}</td>
                    <td>
                      <div className="text-sm">
                        <div>₹{bill.totalTax.toFixed(2)}</div>
                        <div className="text-xs text-gray-500">
                          S: ₹{bill.sgst.toFixed(2)} | C: ₹{bill.cgst.toFixed(2)}
                        </div>
                      </div>
                    </td>
                    <td className="font-bold text-gulmohar">₹{bill.grandTotal.toFixed(2)}</td>
                    <td>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleDownloadPDF(bill)}
                          className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg interactive transform-hover"
                          title="Download PDF"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteBill(bill._id, bill.billNumber)}
                          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg interactive transform-hover"
                          title="Delete Bill"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 animate-fadeIn">
            <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-pulse" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No bills found</h3>
            <p className="text-gray-600 mb-4">
              {bills.length === 0 
                ? "No bills have been created yet." 
                : "No bills match your current filters."
              }
            </p>
            {bills.length === 0 ? (
              <button className="btn-primary interactive animate-bounce">
                <a href="/create-bill">Create your first bill</a>
              </button>
            ) : (
              <button onClick={clearFilters} className="btn-secondary">
                Clear filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewBills;
