'use client';

import { useAuth } from '@/contexts/AuthContext';
import HomePage from '@/components/HomePage';

export default function Home() {
  const { isLogin } = useAuth();

  return (
    <HomePage />
  );
}
