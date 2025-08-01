'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export const useAuth = () => {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  const login = async (provider?: string) => {
    try {
      await signIn(provider, { callbackUrl: '/' });
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const logout = async () => {
    try {
      await signOut({ callbackUrl: '/auth/signin' });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const isAuthenticated = status === 'authenticated';
  const isLoading = status === 'loading';

  return {
    session,
    status,
    isAuthenticated,
    isLoading,
    login,
    logout,
    update,
  };
}; 