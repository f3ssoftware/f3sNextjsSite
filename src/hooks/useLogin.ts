'use client';

import { useState, useCallback } from 'react';
import apiClient from '@/lib/api-client';

interface LoginFormData {
  username: string;
  password: string;
}

interface LoginResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  user: {
    id: string;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    roles: string[];
  };
}

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (credentials: LoginFormData): Promise<LoginResponse | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response: LoginResponse = await apiClient.post('/api/v1/auth/login', credentials);
      
      // Store tokens in localStorage
      localStorage.setItem('access_token', response.access_token);
      localStorage.setItem('refresh_token', response.refresh_token);
      localStorage.setItem('user_info', JSON.stringify(response.user));
      
      return response;
    } catch (err: any) {
      const errorMessage = err.message || 'Login failed. Please check your credentials.';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshToken = useCallback(async (): Promise<boolean> => {
    if (typeof window === 'undefined') return false;
    
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) return false;

    try {
      const response = await apiClient.post('/api/v1/auth/refresh', {
        refresh_token: refreshToken
      });
      
      localStorage.setItem('access_token', response.access_token);
      localStorage.setItem('refresh_token', response.refresh_token);
      return true;
    } catch (err) {
      // If refresh fails, clear all tokens
      logout();
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user_info');
      window.location.reload();
    }
  }, []);

  const getStoredUser = useCallback(() => {
    if (typeof window !== 'undefined') {
      const userInfo = localStorage.getItem('user_info');
      return userInfo ? JSON.parse(userInfo) : null;
    }
    return null;
  }, []);

  const isAuthenticated = useCallback(() => {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('access_token');
    }
    return false;
  }, []);

  const getValidToken = useCallback(async (): Promise<string | null> => {
    if (typeof window === 'undefined') return null;
    
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) return null;

    // Try to refresh token if needed (you can add token expiration check here)
    const refreshed = await refreshToken();
    if (refreshed) {
      return localStorage.getItem('access_token');
    }
    
    return accessToken;
  }, [refreshToken]);

  return {
    login,
    logout,
    refreshToken,
    getStoredUser,
    isAuthenticated,
    getValidToken,
    isLoading,
    error,
  };
}; 