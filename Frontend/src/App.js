import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import CreateBill from './components/CreateBill';
import ViewBills from './components/ViewBills';
import MonthlySummary from './components/MonthlySummary';
import Expenditures from './components/Expenditures';
import Calendar from './components/Calendar';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Router>
      <div className="min-h-screen bg-white-pure">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        
        <div className="lg:pl-64">
          <Header setSidebarOpen={setSidebarOpen} />
          
          <main className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/create-bill" element={<CreateBill />} />
                <Route path="/view-bills" element={<ViewBills />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/monthly-summary" element={<MonthlySummary />} />
                <Route path="/expenditures" element={<Expenditures />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
