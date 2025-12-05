'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { User, Lock } from 'lucide-react';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(false);
  const searchParams = useSearchParams();
  const { login } = useAuth();

  // Note: Middleware handles redirecting authenticated users away from login page

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError(false);

    try {
      const response = await apiClient.login(formData.email, formData.password) as {
        success?: boolean;
        data?: {
          accessToken: string;
          email: string;
          userId: string;
          name?: string;
          role?: string;
        };
        message?: string;
      };
      
      if (response.success && response.data) {
        login(response.data.accessToken, {
          _id: response.data.userId,
          name: response.data.name || '',
          email: response.data.email,
          role: response.data.role || 'user'
        });
        
        setMessage('Login successful! Redirecting...');
        
        // Get redirect URL or default to dashboard
        const redirect = searchParams.get('redirect') || '/dashboard';
        
        // The cookie is set by the API response headers
        // Use a full page reload to ensure cookie is sent with the request
        // The middleware will verify the cookie and allow access
        setTimeout(() => {
          window.location.href = redirect;
        }, 300);
      } else {
        setError(true);
        setMessage(response.message || 'Login failed');
      }
    } catch (err: unknown) {
      setError(true);
      setMessage(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-200">Login</h2>

        {message && (
          <div className={`mb-4 text-center text-sm font-medium ${
            error ? 'text-red-500' : 'text-green-500'
          }`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-semibold text-gray-300">Email</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-3 py-2 border border-gray-600 rounded-md outline-none bg-gray-700 text-gray-200 focus:border-blue-500"
                placeholder="your.email@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 font-semibold text-gray-300">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-3 py-2 border border-gray-600 rounded-md outline-none bg-gray-700 text-gray-200 focus:border-blue-500"
                placeholder="Your password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="mt-4 text-center text-gray-400">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-blue-400 hover:text-blue-300">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

const LoginPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
        <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md">
          <div className="text-gray-200 text-center">Loading...</div>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
};

export default LoginPage; 