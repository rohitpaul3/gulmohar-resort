import React from 'react';
import { Menu } from 'lucide-react';
import Logo from './Logo';

const Header = ({ setSidebarOpen }) => {
  return (
    <div className="sticky top-0 z-40 lg:mx-auto lg:max-w-7xl lg:px-8 animate-fadeIn">
      <div className="flex h-16 items-center gap-x-4 border-b border-gray-200 bg-white/80 backdrop-filter backdrop-blur-lg px-4 shadow-modern sm:gap-x-6 sm:px-6 lg:px-0 lg:shadow-none">
        <button
          type="button"
          className="-m-2.5 p-2.5 text-gray-700 lg:hidden interactive transform-hover"
          onClick={() => setSidebarOpen(true)}
        >
          <span className="sr-only">Open sidebar</span>
          <Menu className="h-6 w-6" />
        </button>

        {/* Separator */}
        <div className="h-6 w-px bg-gray-200 lg:hidden" />

        <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
          <div className="relative flex flex-1 items-center animate-slideInLeft">
            <Logo className="h-10 w-auto lg:hidden transform-hover" />
          </div>
          <div className="flex items-center gap-x-4 lg:gap-x-6">
            <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" />
            
            {/* User info */}
            <div className="flex items-center text-sm text-gray-900 animate-slideInRight">
              <span className="sr-only">Admin</span>
              <div className="flex items-center interactive">
                <div className="h-8 w-8 rounded-full gradient-primary flex items-center justify-center shadow-modern">
                  <span className="text-white text-sm font-medium">A</span>
                </div>
                <span className="ml-2 hidden lg:block">Admin</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
