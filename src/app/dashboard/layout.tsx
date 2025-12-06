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

  useEffect(() => {
    if (!isLoading && !isLogin) {
      // Store current path for redirect after login
      const currentPath = window.location.pathname;
      router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
    }
  }, [isLogin, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-gray-200">Loading...</div>
      </div>
    );
  }

  if (!isLogin) {
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