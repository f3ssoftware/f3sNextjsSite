import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from '@/hooks/useLocale';
import { LoginCredentials } from '@/types/auth';
import { AUTH_CONSTANTS, VALIDATION_MESSAGES } from '@/constants/auth';
import { authService } from '@/services/authService';

export const useAdminLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { currentLocale } = useLocale();

  const handleLogin = useCallback(async (credentials: LoginCredentials): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.login(credentials);
      
      if (response) {
        // Redirect to admin posts page after successful login
        setTimeout(() => {
          router.push(`/${currentLocale}/admin/posts`);
        }, AUTH_CONSTANTS.REDIRECT_DELAY);
        
        return true;
      } else {
        setError(VALIDATION_MESSAGES.INVALID_CREDENTIALS);
        return false;
      }
    } catch (err: any) {
      const errorMessage = err.message || VALIDATION_MESSAGES.LOGIN_FAILED;
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [router, currentLocale]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    handleLogin,
    isLoading,
    error,
    clearError
  };
}; 