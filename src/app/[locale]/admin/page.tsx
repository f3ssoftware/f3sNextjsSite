'use client';

import { useRef } from 'react';
import { Card } from 'primereact/card';
import { Toast } from 'primereact/toast';
import { useAdminLogin } from '@/hooks/useAdminLogin';
import { LoginForm } from '@/components/admin/LoginForm';
import { LoginCredentials } from '@/types/auth';
import { AUTH_CONSTANTS, VALIDATION_MESSAGES } from '@/constants/auth';

export default function AdminLoginPage() {
  const { handleLogin, isLoading, error } = useAdminLogin();
  const toast = useRef<Toast>(null);

  const handleSubmit = async (credentials: LoginCredentials) => {
    try {
      const success = await handleLogin(credentials);
      
      if (success) {
        toast.current?.show({
          severity: 'success',
          summary: 'Success',
          detail: VALIDATION_MESSAGES.LOGIN_SUCCESS,
          life: AUTH_CONSTANTS.TOAST_LIFE.SUCCESS
        });
      } else {
        toast.current?.show({
          severity: 'error',
          summary: 'Login Failed',
          detail: VALIDATION_MESSAGES.INVALID_CREDENTIALS,
          life: AUTH_CONSTANTS.TOAST_LIFE.ERROR
        });
      }
    } catch (error: any) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: error.message || VALIDATION_MESSAGES.LOGIN_FAILED,
        life: AUTH_CONSTANTS.TOAST_LIFE.ERROR
      });
    }
  };

  return (
    <div className="bg-gray-50 flex align-items-center justify-content-center">
      <div className="w-full max-w-md">
        <Card>
          <div className="text-center mb-4">
            <h1 className="text-2xl font-bold text-900 mb-2">Admin Login</h1>
            <p className="text-600">Enter your credentials to access admin panel</p>
          </div>

          <LoginForm 
            onSubmit={handleSubmit}
            isLoading={isLoading}
            error={error}
          />
        </Card>
      </div>

      <Toast ref={toast} />
    </div>
  );
}
