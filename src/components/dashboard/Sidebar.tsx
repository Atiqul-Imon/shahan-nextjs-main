'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  Code,
  Settings,
  LogOut,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar = ({ isOpen }: SidebarProps) => {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Overview' },
    { to: '/dashboard/projects', icon: Briefcase, label: 'Projects' },
    { to: '/dashboard/snippets', icon: Code, label: 'Snippets' },
  ];

  const bottomNavItems = [
    { to: '/dashboard/settings', icon: Settings, label: 'Settings' },
    { to: '/logout', icon: LogOut, label: 'Logout' },
  ];

  return (
    <div
      className={`fixed top-0 left-0 h-full bg-gray-800 border-r border-gray-700 flex flex-col transition-all duration-300 ease-in-out ${
        isOpen ? 'w-64' : 'w-20'
      }`}
    >
      {/* Logo */}
      <div className="flex items-center justify-center h-20 border-b border-gray-700">
        <div className={`flex items-center space-x-2 transition-all duration-200 ${!isOpen && 'justify-center'}`}>
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-glow">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          {isOpen && (
            <span className="text-xl font-bold text-gray-200">Dashboard</span>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.to}
            href={item.to}
            className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 hover:bg-gray-700 hover:text-white ${
              isActive(item.to)
                ? 'bg-gray-700 text-white font-semibold'
                : 'text-gray-300'
            } ${!isOpen && 'justify-center'}`}
            title={isOpen ? '' : item.label}
          >
            <item.icon size={20} />
            {isOpen && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>

      {/* Bottom Navigation */}
      <div className="px-4 py-6 border-t border-gray-700 space-y-2">
        {bottomNavItems.map((item) => (
          <Link
            key={item.to}
            href={item.to}
            className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 text-gray-300 hover:bg-gray-700 hover:text-white ${
              !isOpen && 'justify-center'
            }`}
            title={isOpen ? '' : item.label}
          >
            <item.icon size={20} />
            {isOpen && <span>{item.label}</span>}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;