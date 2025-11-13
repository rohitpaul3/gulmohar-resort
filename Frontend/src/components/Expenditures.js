import React, { useState, useEffect } from 'react';
import { expendituresAPI } from '../utils/api';
import { 
  Plus, 
  Trash2, 
  DollarSign, 
  Calendar,
  Filter,
  TrendingDown
} from 'lucide-react';
import moment from 'moment';

const Expenditures = () => {
  const [expenditures, setExpenditures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [monthFilter, setMonthFilter] = useState('');
  
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: 'General',
    date: moment().format('YYYY-MM-DD')
  });

  const categories = [
    'General',
    'Maintenance',
    'Food & Supplies',
    'Utilities',
    'Staff Salary',
    'Marketing',
    'Equipment',
    'Other'
  ];

  useEffect(() => {
    fetchExpenditures();
  }, []);

  const fetchExpenditures = async () => {
    try {
      setLoading(true);
      const response = await expendituresAPI.getAll();
      setExpenditures(response.data);
    } catch (error) {
      console.error('Error fetching expenditures:', error);
      alert('Failed to fetch expenditures');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.description.trim() || !formData.amount) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      await expendituresAPI.create(formData);
      setFormData({
        description: '',
        amount: '',
        category: 'General',
        date: moment().format('YYYY-MM-DD')
      });
      setShowAddForm(false);
      fetchExpenditures();
      alert('Expenditure added successfully!');
    } catch (error) {
      console.error('Error creating expenditure:', error);
      alert('Failed to add expenditure');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this expenditure?')) {
      try {
        await expendituresAPI.delete(id);
        fetchExpenditures();
        alert('Expenditure deleted successfully!');
      } catch (error) {
        console.error('Error deleting expenditure:', error);
        alert('Failed to delete expenditure');
      }
    }
  };

  // Filter expenditures
  const filteredExpenditures = expenditures.filter(exp => {
    const categoryMatch = !categoryFilter || exp.category === categoryFilter;
    const monthMatch = !monthFilter || moment(exp.date).format('YYYY-MM') === monthFilter;
    return categoryMatch && monthMatch;
  });

  // Calculate totals
  const totalExpenditure = filteredExpenditures.reduce((sum, exp) => sum + exp.amount, 0);
  const monthlyTotals = {};
  expenditures.forEach(exp => {
    const month = moment(exp.date).format('YYYY-MM');
    monthlyTotals[month] = (monthlyTotals[month] || 0) + exp.amount;
  });

  const currentMonth = moment().format('YYYY-MM');
  const currentMonthTotal = monthlyTotals[currentMonth] || 0;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loading-spinner"></div>
        <span className="ml-2">Loading expenditures...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Expenditures</h1>
          <p className="mt-1 text-sm text-gray-600">
            Track and manage resort expenses
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="btn-primary"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Expenditure
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-red-100">
              <TrendingDown className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Filtered</p>
              <p className="text-2xl font-bold text-red-600">₹{totalExpenditure.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-orange-100">
              <Calendar className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-orange-600">₹{currentMonthTotal.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-100">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Entries</p>
              <p className="text-2xl font-bold text-blue-600">{filteredExpenditures.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex items-center mb-4">
          <Filter className="h-5 w-5 text-gulmohar mr-2" />
          <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="categoryFilter" className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              id="categoryFilter"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="form-select mt-1"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="monthFilter" className="block text-sm font-medium text-gray-700">
              Month
            </label>
            <input
              type="month"
              id="monthFilter"
              value={monthFilter}
              onChange={(e) => setMonthFilter(e.target.value)}
              className="form-input mt-1"
            />
          </div>
          
          <div className="flex items-end">
            <button
              onClick={() => {
                setCategoryFilter('');
                setMonthFilter('');
              }}
              className="btn-secondary w-full"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Add Expenditure Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Expenditure</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description *
                  </label>
                  <input
                    type="text"
                    name="description"
                    id="description"
                    required
                    value={formData.description}
                    onChange={handleInputChange}
                    className="form-input mt-1 w-full"
                    placeholder="Enter description"
                  />
                </div>
                
                <div>
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                    Amount (₹) *
                  </label>
                  <input
                    type="number"
                    name="amount"
                    id="amount"
                    required
                    min="0"
                    step="0.01"
                    value={formData.amount}
                    onChange={handleInputChange}
                    className="form-input mt-1 w-full"
                    placeholder="0.00"
                  />
                </div>
                
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <select
                    name="category"
                    id="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="form-select mt-1 w-full"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    id="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="form-input mt-1 w-full"
                  />
                </div>
                
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="flex-1 btn-primary"
                  >
                    Add Expenditure
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Expenditures Table */}
      <div className="card p-0">
        {filteredExpenditures.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredExpenditures
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .map((expenditure) => (
                    <tr key={expenditure.id} className="hover:bg-gray-50">
                      <td>{moment(expenditure.date).format('DD/MM/YYYY')}</td>
                      <td className="font-medium">{expenditure.description}</td>
                      <td>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {expenditure.category}
                        </span>
                      </td>
                      <td className="font-bold text-red-600">₹{expenditure.amount.toFixed(2)}</td>
                      <td>
                        <button
                          onClick={() => handleDelete(expenditure.id)}
                          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md"
                          title="Delete expenditure"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No expenditures found</h3>
            <p className="text-gray-600 mb-4">
              {expenditures.length === 0 
                ? "No expenditures have been recorded yet." 
                : "No expenditures match your current filters."
              }
            </p>
            <button 
              onClick={() => setShowAddForm(true)}
              className="btn-primary"
            >
              Add your first expenditure
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Expenditures;
