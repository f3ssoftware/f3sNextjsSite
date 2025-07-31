'use client';

import { useState, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { LoginCredentials } from '@/types/auth';
import { ValidationUtils, ValidationError } from '@/utils/validation';

interface LoginFormProps {
  onSubmit: (credentials: LoginCredentials) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export const LoginForm: React.FC<LoginFormProps> = ({ 
  onSubmit, 
  isLoading, 
  error 
}) => {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    username: '',
    password: ''
  });
  const [validationErrors, setValidationErrors] = useState<ValidationError>({});

  // Clear validation errors when error prop changes
  useEffect(() => {
    if (error) {
      setValidationErrors({});
    }
  }, [error]);

  const validateForm = (): boolean => {
    const errors = ValidationUtils.validateLoginCredentials(credentials);
    setValidationErrors(errors);
    return !ValidationUtils.hasErrors(errors);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      await onSubmit(credentials);
    }
  };

  const handleInputChange = (field: keyof LoginCredentials, value: string) => {
    setCredentials(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear validation error for this field when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="field">
        <label htmlFor="username" className="block text-900 font-medium mb-2">
          Username
        </label>
        <InputText
          id="username"
          value={credentials.username}
          onChange={(e) => handleInputChange('username', e.target.value)}
          className={ValidationUtils.getInputClassName('username', validationErrors)}
          placeholder="Enter username"
          disabled={isLoading}
          required
        />
        {validationErrors.username && (
          <small className="p-error block mt-1">{validationErrors.username}</small>
        )}
      </div>

      <div className="field">
        <label htmlFor="password" className="block text-900 font-medium mb-2">
          Password
        </label>
        <InputText
          id="password"
          type="password"
          value={credentials.password}
          onChange={(e) => handleInputChange('password', e.target.value)}
          className={ValidationUtils.getInputClassName('password', validationErrors)}
          placeholder="Enter password"
          disabled={isLoading}
          required
        />
        {validationErrors.password && (
          <small className="p-error block mt-1">{validationErrors.password}</small>
        )}
      </div>

      {error && (
        <div className="p-3 bg-red-50 border-round border-1 border-red-200">
          <small className="text-red-600">{error}</small>
        </div>
      )}

      <Button
        type="submit"
        label="Login"
        icon="pi pi-sign-in"
        className="w-full"
        loading={isLoading}
        disabled={isLoading}
      />
    </form>
  );
}; 