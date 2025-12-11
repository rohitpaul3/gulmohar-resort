import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Eye, 
  BarChart3, 
  DollarSign, 
  TrendingUp, 
  Users,
  Calendar,
  Trash2
} from 'lucide-react';
import { billsAPI } from '../utils/api';
import moment from 'moment';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalBills: 0,
    todayBills: 0,
    monthlyRevenue: 0,
    recentBills: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await billsAPI.getAll();
      const bills = response.data;

      // Calculate dashboard metrics
      const today = moment().format('YYYY-MM-DD');
      const currentMonth = moment().month();
      const currentYear = moment().year();

      const todayBills = bills.filter(bill => 
        moment(bill.createdAt).format('YYYY-MM-DD') === today
      ).length;

      const monthlyRevenue = bills
        .filter(bill => {
          const billDate = moment(bill.createdAt);
          return billDate.month() === currentMonth && billDate.year() === currentYear;
        })
        .reduce((sum, bill) => sum + bill.grandTotal, 0);

      const recentBills = bills
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

      setDashboardData({
        totalBills: bills.length,
        todayBills,
        monthlyRevenue,
        recentBills
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      name: 'Total Bills',
      stat: dashboardData.totalBills,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      name: "Today's Bills",
      stat: dashboardData.todayBills,
      icon: Calendar,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      name: 'Monthly Revenue',
      stat: `₹${dashboardData.monthlyRevenue.toFixed(2)}`,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      name: 'Active Rooms',
      stat: '8 Rooms',
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  const quickActions = [
    {
      name: 'Create New Bill',
      description: 'Generate a new bill for customer',
      href: '/create-bill',
      icon: FileText,
      color: 'bg-gulmohar hover:bg-gulmohar text-white'
    },
    {
      name: 'View All Bills',
      description: 'Browse and manage existing bills',
      href: '/view-bills',
      icon: Eye,
      color: 'bg-blue-600 hover:bg-blue-700 text-white'
    },
    {
      name: 'Delete Bills',
      description: 'Remove bills from the system',
      href: '/view-bills',
      icon: Trash2,
      color: 'bg-red-600 hover:bg-red-700 text-white'
    },
    {
      name: 'Monthly Summary',
      description: 'Generate monthly reports',
      href: '/monthly-summary',
      icon: BarChart3,
      color: 'bg-purple-600 hover:bg-purple-700 text-white'
    },
    {
      name: 'Expenditures',
      description: 'Manage resort expenses',
      href: '/expenditures',
      icon: DollarSign,
      color: 'bg-orange-600 hover:bg-orange-700 text-white'
    }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loading-spinner"></div>
        <span className="ml-2">Loading dashboard...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page header */}
      <div className="animate-slideInLeft">
        <h1 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-gulmohar-600 to-gulmohar-800 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Welcome to Gulmohar Resort Billing System
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 animate-slideInRight">
        {stats.map((item, index) => (
          <div key={item.name} className="card transform-hover interactive" style={{animationDelay: `${index * 0.1}s`}}>
            <div className="flex items-center">
              <div className={`flex-shrink-0 rounded-md p-3 ${item.bgColor}`}>
                <item.icon className={`h-6 w-6 ${item.color}`} />
              </div>
              <div className="ml-4 w-0 flex-1">
                <dt className="text-sm font-medium text-gray-500 truncate">
                  {item.name}
                </dt>
                <dd className="text-lg font-semibold text-gray-900">
                  {item.stat}
                </dd>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="animate-scaleIn">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {quickActions.map((action, index) => (
            <Link
              key={action.name}
              to={action.href}
              className={`${action.color} rounded-xl p-6 shadow-modern hover:shadow-hover transition-all duration-300 group interactive border-animated`}
              style={{animationDelay: `${index * 0.1}s`}}
            >
              <div className="flex items-center">
                <action.icon className="h-8 w-8" />
                <div className="ml-4">
                  <h3 className="text-lg font-semibold">{action.name}</h3>
                  <p className="text-sm opacity-90">{action.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Bills */}
      <div className="card animate-fadeIn border-animated">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900">Recent Bills</h2>
          <Link 
            to="/view-bills" 
            className="text-gulmohar hover:text-gulmohar text-sm font-medium"
          >
            View all →
          </Link>
        </div>
        
        {dashboardData.recentBills.length > 0 ? (
          <div className="overflow-hidden">
            <table className="table">
              <thead>
                <tr>
                  <th>Bill No</th>
                  <th>Customer</th>
                  <th>Room</th>
                  <th>Amount</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {dashboardData.recentBills.map((bill) => (
                  <tr key={bill.id} className="hover:bg-gray-50">
                    <td className="font-medium text-gray-900">{bill.billNumber}</td>
                    <td>{bill.customerName}</td>
                    <td>{bill.roomNumber}</td>
                    <td className="font-semibold">₹{bill.grandTotal.toFixed(2)}</td>
                    <td>{moment(bill.createdAt).format('DD/MM/YYYY')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No bills created yet</p>
            <Link 
              to="/create-bill" 
              className="text-gulmohar hover:text-gulmohar mt-2 inline-block"
            >
              Create your first bill →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
