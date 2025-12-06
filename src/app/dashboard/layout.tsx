'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import Topbar from '@/components/dashboard/Topbar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLogin, isLoading } = useAuth();
  const router = useRouter();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Check localStorage directly as fallback while AuthContext initializes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const checkLocalStorage = () => {
        const accessToken = localStorage.getItem('accessToken');
        const userData = localStorage.getItem('user');
        return !!(accessToken && userData);
      };

      // Give AuthContext a moment to initialize, then check localStorage
      const timer = setTimeout(() => {
        setIsCheckingAuth(false);
        
        // If AuthContext says not logged in, double-check localStorage
        if (!isLoading && !isLogin) {
          const hasAuth = checkLocalStorage();
          if (!hasAuth) {
            // Store current path for redirect after login
            const currentPath = window.location.pathname;
            router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
          }
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isLogin, isLoading, router]);

  // Also check when AuthContext finishes loading
  useEffect(() => {
    if (!isLoading && !isLogin) {
      // Double-check localStorage before redirecting
      if (typeof window !== 'undefined') {
        const accessToken = localStorage.getItem('accessToken');
        const userData = localStorage.getItem('user');
        
        if (!accessToken || !userData) {
          // Store current path for redirect after login
          const currentPath = window.location.pathname;
          router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
        }
      }
    }
  }, [isLogin, isLoading, router]);

  // Show loading while checking auth or while AuthContext is initializing
  if (isLoading || isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-gray-200">Loading...</div>
      </div>
    );
  }

  // Check localStorage as fallback before redirecting
  if (!isLogin) {
    if (typeof window !== 'undefined') {
      const accessToken = localStorage.getItem('accessToken');
      const userData = localStorage.getItem('user');
      
      // If we have tokens in localStorage, wait a bit more for AuthContext to catch up
      if (accessToken && userData) {
        return (
          <div className="min-h-screen bg-gray-900 flex items-center justify-center">
            <div className="text-gray-200">Loading...</div>
          </div>
        );
      }
    }
    return null; // Will redirect to login
  }

  return (
    <div className="flex h-screen bg-gray-900 font-sans">
      <Sidebar isOpen={isSidebarOpen} />

      <div
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'ml-64' : 'ml-20'
        }`}
      >
        <Topbar onToggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />
        
        <main className="flex-1 p-6 lg:p-10 overflow-y-auto custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
} 