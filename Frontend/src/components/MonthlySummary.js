import React, { useState, useEffect, useCallback } from 'react';
import { summaryAPI } from '../utils/api';
import { generateMonthlySummaryPDF } from '../utils/pdfGenerator';
import { 
  Calendar, 
  Download, 
  BarChart3, 
  TrendingUp, 
  IndianRupee,
  FileText,
  Users
} from 'lucide-react';
import moment from 'moment';

const MonthlySummary = () => {
  const [selectedMonth, setSelectedMonth] = useState(moment().month() + 1);
  const [selectedYear, setSelectedYear] = useState(moment().year());
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(false);

  const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' }
  ];

  const years = Array.from({ length: 10 }, (_, i) => moment().year() - 5 + i);

  const fetchSummary = React.useCallback(async () => {
    try {
      setLoading(true);
      const response = await summaryAPI.getMonthly(selectedMonth, selectedYear);
      setSummaryData(response.data);
    } catch (error) {
      console.error('Error fetching summary:', error);
      alert('Failed to fetch summary');
    } finally {
      setLoading(false);
    }
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    if (selectedMonth && selectedYear) {
      fetchSummary();
    }
  }, [selectedMonth, selectedYear, fetchSummary]);

  const handleDownloadPDF = async () => {
    if (summaryData) {
      await generateMonthlySummaryPDF(summaryData);
    }
  };

  const getMonthName = (monthNumber) => {
    return months.find(m => m.value === monthNumber)?.label || '';
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page header */}
      <div className="animate-slideInLeft">
        <h1 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-gulmohar-600 to-gulmohar-800 bg-clip-text text-transparent">
          Monthly Summary
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Generate comprehensive monthly reports and statistics
        </p>
      </div>

      {/* Date Selection */}
      <div className="card transform-hover animate-slideInRight">
        <div className="flex items-center mb-4">
          <Calendar className="h-5 w-5 text-gulmohar mr-2" />
          <h2 className="text-lg font-semibold text-gray-900">Select Month & Year</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label htmlFor="month" className="block text-sm font-medium text-gray-700">
              Month
            </label>
            <select
              id="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="form-select mt-1"
            >
              {months.map(month => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="year" className="block text-sm font-medium text-gray-700">
              Year
            </label>
            <select
              id="year"
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="form-select mt-1"
            >
              {years.map(year => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <button
              onClick={fetchSummary}
              disabled={loading}
              className={`btn-primary w-full interactive ${loading ? 'loading-state' : ''}`}
            >
              {loading ? (
                <div className="loading-spinner mr-2"></div>
              ) : (
                <BarChart3 className="h-4 w-4 mr-2" />
              )}
              Generate Summary
            </button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center h-32">
          <div className="loading-spinner"></div>
          <span className="ml-2">Generating summary...</span>
        </div>
      )}

      {/* Summary Results */}
      {summaryData && !loading && (
        <div className="space-y-6">
          {/* Summary Header */}
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">
              {getMonthName(summaryData.month)} {summaryData.year} Summary
            </h2>
            <button
              onClick={handleDownloadPDF}
              className="btn-primary"
            >
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </button>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="card">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-blue-100">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Bills</p>
                  <p className="text-2xl font-bold text-gray-900">{summaryData.totalBills}</p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-green-100">
                  <IndianRupee className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-green-600">₹{summaryData.totalRevenue.toFixed(2)}</p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-purple-100">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Avg Bill Value</p>
                  <p className="text-2xl font-bold text-purple-600">
                    ₹{summaryData.totalBills > 0 ? (summaryData.totalRevenue / summaryData.totalBills).toFixed(2) : '0.00'}
                  </p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-orange-100">
                  <Users className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Tax</p>
                  <p className="text-2xl font-bold text-orange-600">
                    ₹{(summaryData.totalSGST + summaryData.totalCGST).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Breakdown */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Breakdown</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Food Charges:</span>
                  <span className="font-semibold">₹{summaryData.totalFoodCharges.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Other Charges:</span>
                  <span className="font-semibold">₹{summaryData.totalOtherCharges.toFixed(2)}</span>
                </div>
                <hr />
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal:</span>
                  <span>₹{(summaryData.totalFoodCharges + summaryData.totalOtherCharges).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">SGST (2.5%):</span>
                  <span>₹{summaryData.totalSGST.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">CGST (2.5%):</span>
                  <span>₹{summaryData.totalCGST.toFixed(2)}</span>
                </div>
                <hr />
                <div className="flex justify-between font-bold text-lg text-gulmohar">
                  <span>Total Revenue:</span>
                  <span>₹{summaryData.totalRevenue.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Room Usage */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Room Usage Statistics</h3>
              {summaryData.bills && summaryData.bills.length > 0 ? (
                <div className="space-y-3">
                  {(() => {
                    const roomStats = {};
                    summaryData.bills.forEach(bill => {
                      if (!roomStats[bill.roomNumber]) {
                        roomStats[bill.roomNumber] = { count: 0, revenue: 0 };
                      }
                      roomStats[bill.roomNumber].count++;
                      roomStats[bill.roomNumber].revenue += bill.grandTotal;
                    });

                    return Object.entries(roomStats)
                      .sort(([, a], [, b]) => b.count - a.count)
                      .map(([room, stats]) => (
                        <div key={room} className="flex justify-between items-center">
                          <div>
                            <span className="font-medium">Room {room}</span>
                            <span className="text-sm text-gray-500 ml-2">({stats.count} bookings)</span>
                          </div>
                          <span className="font-semibold">₹{stats.revenue.toFixed(2)}</span>
                        </div>
                      ));
                  })()}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No room data available</p>
              )}
            </div>
          </div>

          {/* Bills Table */}
          {summaryData.bills && summaryData.bills.length > 0 && (
            <div className="card p-0">
              <div className="p-6 pb-0">
                <h3 className="text-lg font-semibold text-gray-900">Bills for {getMonthName(summaryData.month)} {summaryData.year}</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Bill No</th>
                      <th>Date</th>
                      <th>Customer</th>
                      <th>Room</th>
                      <th>Food</th>
                      <th>Other</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {summaryData.bills.map((bill) => (
                      <tr key={bill.id} className="hover:bg-gray-50">
                        <td className="font-medium text-gulmohar">{bill.billNumber}</td>
                        <td>{moment(bill.createdAt).format('DD/MM/YYYY')}</td>
                        <td>{bill.customerName}</td>
                        <td>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gulmohar text-white">
                            {bill.roomNumber}
                          </span>
                        </td>
                        <td>₹{bill.foodCharges.toFixed(2)}</td>
                        <td>₹{bill.otherCharges.toFixed(2)}</td>
                        <td className="font-bold text-gulmohar">₹{bill.grandTotal.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* No Data State */}
      {summaryData && summaryData.totalBills === 0 && !loading && (
        <div className="card text-center py-12">
          <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No bills found</h3>
          <p className="text-gray-600 mb-4">
            No bills were created in {getMonthName(selectedMonth)} {selectedYear}.
          </p>
          <a href="/create-bill" className="btn-primary">
            Create a bill
          </a>
        </div>
      )}
    </div>
  );
};

export default MonthlySummary;
