'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Menu, X, LogOut, Home, Briefcase, MessageCircle, BarChart3 } from 'lucide-react';

const Header = () => {
  const { isLogin, isLoading, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Set initial state to prevent flicker on mount
    setScrolled(window.scrollY > 10);
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    window.location.reload();
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const isActive = (path: string) => pathname === path;

  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/project", label: "Projects", icon: Briefcase },
    { path: "/contact", label: "Contact", icon: MessageCircle },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-150 ease-in-out ${
      scrolled 
        ? 'bg-gray-900 backdrop-blur-md shadow-lg border-b border-gray-700' 
        : 'bg-gray-900/80 backdrop-blur-sm border-b border-gray-800/60'
    }`}>
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Link href="/" className="text-2xl font-bold tracking-wide cursor-pointer text-gray-100 hover:text-white transition-colors duration-200">
              Shahan Ahmed
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 font-medium ${
                    isActive(item.path)
                      ? 'text-white bg-blue-600 shadow-soft'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {/* Auth Section */}
            {!isLoading && isLogin && (
              <div className="flex items-center space-x-4 ml-4 pl-4 border-l border-gray-700">
                <Link
                  href="/dashboard"
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-700 text-gray-200 hover:bg-gray-600 transition-all duration-200 font-medium"
                >
                  <BarChart3 size={18} />
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition-all duration-200 font-medium"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors duration-200"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {menuOpen && (
          <div className="mt-4 lg:hidden animate-slide-down">
            <div className="bg-gray-800 rounded-xl shadow-large border border-gray-700 p-6">
              <nav className="space-y-3">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      href={item.path}
                      onClick={toggleMenu}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 font-medium ${
                        isActive(item.path)
                          ? 'text-white bg-blue-600'
                          : 'text-gray-300 hover:text-white hover:bg-gray-700'
                      }`}
                    >
                      <Icon size={20} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}

                {/* Mobile Auth Section */}
                {!isLoading && isLogin && (
                  <div className="pt-3 border-t border-gray-700">
                    <div className="space-y-3">
                      <Link
                        href="/dashboard"
                        onClick={toggleMenu}
                        className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-gray-700 text-gray-200 font-medium"
                      >
                        <BarChart3 size={20} />
                        <span>Dashboard</span>
                      </Link>
                      <button
                        onClick={() => { handleLogout(); toggleMenu(); }}
                        className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-500/10 font-medium"
                      >
                        <LogOut size={20} />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header; 