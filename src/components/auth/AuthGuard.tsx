'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from '@/hooks/useLocale';
import { useLogin } from '@/hooks/useLogin';
import { ProgressSpinner } from 'primereact/progressspinner';
import { isTokenExpired } from '@/utils/tokenUtils';

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function AuthGuard({ children, fallback }: AuthGuardProps) {
  const { isAuthenticated, getStoredUser, refreshToken } = useLogin();
  const router = useRouter();
  const { currentLocale } = useLocale();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = isAuthenticated();
      const user = getStoredUser();
      
      if (!authenticated || !user) {
        console.log('AuthGuard: User not authenticated, redirecting to login');
        router.push(`/${currentLocale}/admin`);
        return;
      }

      // Check if token is expired
      const accessToken = localStorage.getItem('access_token');
      if (accessToken && isTokenExpired(accessToken)) {
        console.log('AuthGuard: Token is expired, attempting refresh...');
        const refreshed = await refreshToken();
        
        if (!refreshed) {
          console.log('AuthGuard: Token refresh failed, redirecting to login');
          router.push(`/${currentLocale}/admin`);
          return;
        }
      }
      
      console.log('AuthGuard: User authenticated, allowing access');
      setIsAuth(true);
      setIsLoading(false);
    };

    // Small delay to ensure hooks are properly initialized
    const timer = setTimeout(checkAuth, 100);
    return () => clearTimeout(timer);
  }, [isAuthenticated, getStoredUser, router, currentLocale]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <ProgressSpinner style={{ width: '50px', height: '50px' }} />
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuth) {
    return fallback || (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <ProgressSpinner style={{ width: '50px', height: '50px' }} />
          <p className="mt-4 text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
