'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Menu, Bell, Search, User, ChevronDown } from 'lucide-react';

interface TopbarProps {
  onToggleSidebar: () => void;
}

const Topbar = ({ onToggleSidebar }: TopbarProps) => {
  const { user } = useAuth();
  const email = user?.email || 'user@example.com';

  return (
    <div className="bg-gray-800 h-20 flex items-center justify-between px-6 lg:px-10 border-b border-gray-700">
      {/* Sidebar Toggle & Search */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors duration-200"
        >
          <Menu size={20} className="text-gray-300" />
        </button>
        
        <div className="relative hidden md:block">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full lg:w-80 pl-11 pr-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-200"
          />
        </div>
      </div>

      {/* Right side icons & User */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-gray-700 transition-colors duration-200">
          <Bell size={20} className="text-gray-300" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User Dropdown */}
        <div className="relative">
          <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-700 transition-colors duration-200">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white font-semibold">
              {email ? email.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="hidden lg:block text-left">
              <p className="font-semibold text-sm text-gray-200">
                {email}
              </p>
              <p className="text-xs text-gray-400">Admin</p>
            </div>
            <ChevronDown size={16} className="text-gray-400 hidden lg:block" />
          </button>
          {/* Dropdown menu can be added here */}
        </div>
      </div>
    </div>
  );
};

export default Topbar;