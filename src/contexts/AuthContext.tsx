'use client';

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { verifyAccessToken } from '@/lib/auth';

interface User {
  _id: string;
  name: string;
  email: string;
  role?: string;
  [key: string]: unknown;
}

interface AuthContextType {
  isLogin: boolean;
  isLoading: boolean;
  user: User | null;
  login: (token: string, refreshToken: string, userData: User) => void;
  logout: () => void;
  refreshToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Check if token is expired or will expire soon (within 2 minutes)
function isTokenExpiredOrExpiringSoon(token: string): boolean {
  try {
    const decoded = verifyAccessToken(token);
    if (!decoded) return true;
    
    // Token is valid, but we can't check expiration from client side easily
    // So we'll rely on API responses to tell us when token is expired
    return false;
  } catch {
    return true;
  }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Check token validity on mount and periodically
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    const checkAuth = () => {
      const accessToken = localStorage.getItem('accessToken');
      const userData = localStorage.getItem('user');

      if (accessToken && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          
          // Verify token is still valid
          if (isTokenExpiredOrExpiringSoon(accessToken)) {
            // Token expired, try to refresh
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
              // Will be handled by API client on next request
              setIsLogin(false);
              setUser(null);
            } else {
              // No refresh token, clear auth
              localStorage.removeItem('accessToken');
              localStorage.removeItem('user');
              setIsLogin(false);
              setUser(null);
            }
          } else {
            setIsLogin(true);
            setUser(parsedUser);
          }
        } catch (error) {
          console.error('Error parsing user data:', error);
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          setIsLogin(false);
          setUser(null);
        }
      } else {
        setIsLogin(false);
        setUser(null);
      }
    };

    checkAuth();
    setIsLoading(false);

    // Check token validity every 5 minutes
    const interval = setInterval(checkAuth, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const login = useCallback((token: string, refreshToken: string, userData: User) => {
    localStorage.setItem('accessToken', token);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setIsLogin(true);
    setUser(userData);
  }, []);

  const refreshToken = useCallback(async (): Promise<boolean> => {
    if (isRefreshing) return false;
    
    const storedRefreshToken = localStorage.getItem('refreshToken');
    if (!storedRefreshToken) {
      return false;
    }

    setIsRefreshing(true);
    
    try {
      const response = await fetch('/api/user/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken: storedRefreshToken }),
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const data = await response.json();
      
      if (data.success && data.data) {
        localStorage.setItem('accessToken', data.data.accessToken);
        if (data.data.refreshToken) {
          localStorage.setItem('refreshToken', data.data.refreshToken);
        }
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error refreshing token:', error);
      // Clear auth on refresh failure
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      setIsLogin(false);
      setUser(null);
      return false;
    } finally {
      setIsRefreshing(false);
    }
  }, [isRefreshing]);

  const logout = useCallback(async () => {
    // Clear localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    localStorage.removeItem('email');
    localStorage.removeItem('userId');
    
    // Call logout API (non-blocking)
    try {
      await fetch('/api/user/logout', { method: 'POST' });
    } catch (error) {
      console.error('Error calling logout API:', error);
    }
    
    setIsLogin(false);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ isLogin, isLoading, user, login, logout, refreshToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 