'use client';

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';

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

// Check if token exists and has basic structure (client-side only check)
// We can't verify JWT tokens in the browser without exposing the secret
// So we just check if the token exists and has the right format
// Actual validation will happen on the server side via API calls
function isTokenValidFormat(token: string): boolean {
  if (!token || typeof token !== 'string') return false;
  
  // Basic JWT format check (3 parts separated by dots)
  const parts = token.split('.');
  if (parts.length !== 3) return false;
  
  // Token exists and has correct format
  // Actual expiration will be checked by the server
  return true;
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Initialize state from localStorage immediately if available (client-side only)
  const getInitialAuthState = () => {
    if (typeof window === 'undefined') {
      return { isLogin: false, user: null };
    }
    
    const accessToken = localStorage.getItem('accessToken');
    const userData = localStorage.getItem('user');
    
    if (accessToken && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        // Don't verify token expiration here - just check if it exists
        // Token validation will happen on API calls
        return { isLogin: true, user: parsedUser };
      } catch {
        return { isLogin: false, user: null };
      }
    }
    
    return { isLogin: false, user: null };
  };

  const initialState = getInitialAuthState();
  const [isLogin, setIsLogin] = useState(initialState.isLogin);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(initialState.user);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Check token validity on mount and periodically
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') {
      setIsLoading(false);
      return;
    }

    const checkAuth = () => {
      const accessToken = localStorage.getItem('accessToken');
      const userData = localStorage.getItem('user');

      if (accessToken && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          
          // Check if token has valid format (client-side only)
          // Actual token validation happens on server via API calls
          if (isTokenValidFormat(accessToken)) {
            setIsLogin(true);
            setUser(parsedUser);
          } else {
            // Invalid token format, clear auth
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            setIsLogin(false);
            setUser(null);
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

    // Check immediately and set loading to false
    checkAuth();
    setIsLoading(false);
    
    // In production, sometimes the initial check might miss localStorage
    // Do an additional check after a short delay to ensure we catch it
    const doubleCheck = setTimeout(() => {
      const accessToken = localStorage.getItem('accessToken');
      const userData = localStorage.getItem('user');
      
      if (accessToken && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          if (isTokenValidFormat(accessToken)) {
            // Force update auth state if we have valid tokens
            setIsLogin(true);
            setUser(parsedUser);
          }
        } catch (error) {
          // Ignore errors in double check
        }
      }
    }, 300);
    
    // Check token validity every 5 minutes
    const interval = setInterval(checkAuth, 5 * 60 * 1000);
    
    return () => {
      clearTimeout(doubleCheck);
      clearInterval(interval);
    };
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