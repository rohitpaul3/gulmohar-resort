import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  X, 
  LayoutDashboard, 
  FileText, 
  Eye, 
  BarChart3, 
  DollarSign 
} from 'lucide-react';
import Logo from './Logo';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Create Bill', href: '/create-bill', icon: FileText },
  { name: 'View Bills', href: '/view-bills', icon: Eye },
  { name: 'Monthly Summary', href: '/monthly-summary', icon: BarChart3 },
  { name: 'Expenditures', href: '/expenditures', icon: DollarSign },
];

const classNames = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();

  return (
    <>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="relative z-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="fixed inset-0 bg-gray-900/80" />
          
          <div className="fixed inset-0 flex">
            <div className="relative mr-16 flex w-full max-w-xs flex-1">
              <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                <button
                  type="button"
                  className="-m-2.5 p-2.5"
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className="sr-only">Close sidebar</span>
                  <X className="h-6 w-6 text-white" />
                </button>
              </div>
              
              {/* Sidebar component for mobile */}
              <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white/90 backdrop-blur-lg px-6 pb-4 animate-slideInLeft">
                <div className="flex h-16 shrink-0 items-center">
                  <Logo className="h-12 w-auto" showText={false} />
                </div>
                <nav className="flex flex-1 flex-col">
                  <ul className="flex flex-1 flex-col gap-y-7">
                    <li>
                      <ul className="-mx-2 space-y-1">
                        {navigation.map((item, index) => (
                          <li key={item.name} className="animate-fadeIn" style={{animationDelay: `${index * 0.1}s`}}>
                            <Link
                              to={item.href}
                              className={classNames(
                                location.pathname === item.href
                                  ? 'bg-gradient-to-r from-gulmohar-50 to-gulmohar-100 text-gulmohar shadow-sm'
                                  : 'text-gray-700 hover:text-gulmohar hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100',
                                'group flex gap-x-3 rounded-xl p-3 text-sm leading-6 font-semibold transition-all duration-300 transform hover:scale-105 interactive'
                              )}
                              onClick={() => setSidebarOpen(false)}
                            >
                              <item.icon
                                className={classNames(
                                  location.pathname === item.href
                                    ? 'text-gulmohar'
                                    : 'text-gray-400 group-hover:text-gulmohar',
                                  'h-6 w-6 shrink-0'
                                )}
                              />
                              {item.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white/90 backdrop-blur-lg px-6 pb-4 animate-slideInLeft">
          <div className="flex h-16 shrink-0 items-center">
            <Logo className="h-12 w-auto" showText={false} />
          </div>
          <nav className="flex flex-1 flex-col">
            <ul className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul className="-mx-2 space-y-1">
                  {navigation.map((item, index) => (
                    <li key={item.name} className="animate-fadeIn" style={{animationDelay: `${index * 0.1}s`}}>
                      <Link
                        to={item.href}
                        className={classNames(
                          location.pathname === item.href
                            ? 'bg-gradient-to-r from-gulmohar-50 to-gulmohar-100 text-gulmohar shadow-sm'
                            : 'text-gray-700 hover:text-gulmohar hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100',
                          'group flex gap-x-3 rounded-xl p-3 text-sm leading-6 font-semibold transition-all duration-300 transform hover:scale-105 interactive'
                        )}
                      >
                        <item.icon
                          className={classNames(
                            location.pathname === item.href
                              ? 'text-gulmohar'
                              : 'text-gray-400 group-hover:text-gulmohar',
                            'h-6 w-6 shrink-0'
                          )}
                        />
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
