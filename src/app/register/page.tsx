'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { User, Lock, Mail } from 'lucide-react';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const validatePassword = (password: string) => {
    // Minimum 6 characters with at least one letter and one number
    const regex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;
    return regex.test(password);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError(false);

    // Validate password
    if (!validatePassword(formData.password)) {
      setError(true);
      setMessage('Password must be at least 6 characters with both letters and numbers');
      setLoading(false);
      return;
    }

    try {
      const response = await apiClient.register(formData.name, formData.email, formData.password);
      
      if (response.success) {
        setMessage('Registration successful! Please login.');
        setFormData({ name: '', email: '', password: '' });
        
        // Navigate to login page after successful registration
        setTimeout(() => {
          router.push('/login');
        }, 1500);
      } else {
        setError(true);
        setMessage(response.message || 'Registration failed');
      }
    } catch (err: any) {
      setError(true);
      setMessage(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-200">Register</h2>

        {message && (
          <div className={`mb-4 text-center text-sm font-medium ${
            error ? 'text-red-500' : 'text-green-500'
          }`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-semibold text-gray-300">Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-3 py-2 border border-gray-600 rounded-md outline-none bg-gray-700 text-gray-200 focus:border-blue-500"
                placeholder="Your full name"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 font-semibold text-gray-300">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
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
            <p className="text-xs text-gray-400 mt-1">
              Password must be at least 6 characters with both letters and numbers
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p className="mt-4 text-center text-gray-400">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-400 hover:text-blue-300">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage; 