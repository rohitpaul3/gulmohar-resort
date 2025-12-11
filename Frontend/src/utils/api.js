import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Bills API
export const billsAPI = {
  // Get all bills
  getAll: () => api.get('/bills'),
  
  // Get bill by ID
  getById: (id) => api.get(`/bills/${id}`),
  
  // Create new bill
  create: (billData) => api.post('/bills', billData),
  
  // Delete bill
  delete: (id) => api.delete(`/bills/${id}`),
};

// Monthly Summary API
export const summaryAPI = {
  // Get monthly summary
  getMonthly: (month, year) => api.get(`/summary/monthly/${month}/${year}`),
};

// Expenditures API
export const expendituresAPI = {
  // Get all expenditures
  getAll: () => api.get('/expenditures'),
  
  // Create new expenditure
  create: (expenditureData) => api.post('/expenditures', expenditureData),
  
  // Delete expenditure
  delete: (id) => api.delete(`/expenditures/${id}`),
};

// Health check
export const healthCheck = () => api.get('/health');

export default api;
