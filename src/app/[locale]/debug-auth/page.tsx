'use client';

import { useState, useEffect, useRef } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { useLogin } from '@/hooks/useLogin';
import { useRouter } from 'next/navigation';
import { useLocale } from '@/hooks/useLocale';
import apiClient from '@/lib/api-client';

export default function DebugAuthPage() {
  const [credentials, setCredentials] = useState({
    username: 'admin',
    password: 'admin123'
  });
  const [tokenInfo, setTokenInfo] = useState<any>(null);
  const [apiTest, setApiTest] = useState<any>(null);
  const { login, isAuthenticated, getStoredUser } = useLogin();
  const router = useRouter();
  const { currentLocale } = useLocale();
  const toast = useRef<Toast>(null);

  useEffect(() => {
    checkTokenStatus();
  }, []);

  const checkTokenStatus = () => {
    if (typeof window !== 'undefined') {
      const accessToken = localStorage.getItem('access_token');
      const refreshToken = localStorage.getItem('refresh_token');
      const userInfo = localStorage.getItem('user_info');
      
      setTokenInfo({
        hasAccessToken: !!accessToken,
        hasRefreshToken: !!refreshToken,
        hasUserInfo: !!userInfo,
        isAuthenticated: isAuthenticated(),
        user: userInfo ? JSON.parse(userInfo) : null,
        accessTokenLength: accessToken?.length || 0
      });
    }
  };

  const handleLogin = async () => {
    try {
      const response = await login(credentials);
      if (response) {
        toast.current?.show({
          severity: 'success',
          summary: 'Login Success',
          detail: 'Successfully logged in!',
          life: 3000
        });
        checkTokenStatus();
      } else {
        toast.current?.show({
          severity: 'error',
          summary: 'Login Failed',
          detail: 'Login failed. Please check credentials.',
          life: 3000
        });
      }
    } catch (error: any) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: error.message || 'Login failed',
        life: 3000
      });
    }
  };

  const testApiCall = async () => {
    try {
      const response = await apiClient.get('/api/v1/categories?limit=5');
      setApiTest({
        success: true,
        data: response,
        timestamp: new Date().toISOString()
      });
      toast.current?.show({
        severity: 'success',
        summary: 'API Test Success',
        detail: 'API call successful!',
        life: 3000
      });
    } catch (error: any) {
      setApiTest({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      });
      toast.current?.show({
        severity: 'error',
        summary: 'API Test Failed',
        detail: error.message || 'API call failed',
        life: 3000
      });
    }
  };

  const testAdminApiCall = async () => {
    try {
      const response = await apiClient.get('/api/v1/admin/posts?page=1&limit=5');
      setApiTest({
        success: true,
        data: response,
        timestamp: new Date().toISOString()
      });
      toast.current?.show({
        severity: 'success',
        summary: 'Admin API Test Success',
        detail: 'Admin API call successful!',
        life: 3000
      });
    } catch (error: any) {
      setApiTest({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      });
      toast.current?.show({
        severity: 'error',
        summary: 'Admin API Test Failed',
        detail: error.message || 'Admin API call failed',
        life: 3000
      });
    }
  };

  const clearTokens = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user_info');
      checkTokenStatus();
      toast.current?.show({
        severity: 'info',
        summary: 'Tokens Cleared',
        detail: 'All authentication tokens have been cleared.',
        life: 3000
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <Card>
          <h1 className="text-2xl font-bold mb-4">Authentication Debug Page</h1>
          
          {/* Login Section */}
          <div className="mb-6 p-4 border-round border-1 surface-border">
            <h2 className="text-xl font-semibold mb-3">Login Test</h2>
            <div className="grid">
              <div className="col-12 md:col-6">
                <label className="block text-900 font-medium mb-2">Username</label>
                <InputText
                  value={credentials.username}
                  onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                  className="w-full"
                />
              </div>
              <div className="col-12 md:col-6">
                <label className="block text-900 font-medium mb-2">Password</label>
                <InputText
                  type="password"
                  value={credentials.password}
                  onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full"
                />
              </div>
            </div>
            <Button
              label="Test Login"
              icon="pi pi-sign-in"
              onClick={handleLogin}
              className="mt-3"
            />
          </div>

          {/* Token Status */}
          <div className="mb-6 p-4 border-round border-1 surface-border">
            <h2 className="text-xl font-semibold mb-3">Token Status</h2>
            {tokenInfo && (
              <div className="grid">
                <div className="col-12 md:col-6">
                  <p><strong>Has Access Token:</strong> {tokenInfo.hasAccessToken ? 'Yes' : 'No'}</p>
                  <p><strong>Has Refresh Token:</strong> {tokenInfo.hasRefreshToken ? 'Yes' : 'No'}</p>
                  <p><strong>Has User Info:</strong> {tokenInfo.hasUserInfo ? 'Yes' : 'No'}</p>
                  <p><strong>Is Authenticated:</strong> {tokenInfo.isAuthenticated ? 'Yes' : 'No'}</p>
                  <p><strong>Token Length:</strong> {tokenInfo.accessTokenLength}</p>
                </div>
                <div className="col-12 md:col-6">
                  {tokenInfo.user && (
                    <div>
                      <p><strong>User:</strong> {tokenInfo.user.first_name} {tokenInfo.user.last_name}</p>
                      <p><strong>Email:</strong> {tokenInfo.user.email}</p>
                      <p><strong>Roles:</strong> {tokenInfo.user.roles?.join(', ') || 'None'}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
            <Button
              label="Refresh Token Status"
              icon="pi pi-refresh"
              onClick={checkTokenStatus}
              className="mt-3"
            />
            <Button
              label="Clear All Tokens"
              icon="pi pi-trash"
              severity="danger"
              onClick={clearTokens}
              className="mt-3 ml-2"
            />
          </div>

          {/* API Tests */}
          <div className="mb-6 p-4 border-round border-1 surface-border">
            <h2 className="text-xl font-semibold mb-3">API Tests</h2>
            <div className="flex gap-2 mb-3">
              <Button
                label="Test Public API"
                icon="pi pi-globe"
                onClick={testApiCall}
                severity="info"
              />
              <Button
                label="Test Admin API"
                icon="pi pi-shield"
                onClick={testAdminApiCall}
                severity="warning"
              />
            </div>
            {apiTest && (
              <div className="p-3 bg-gray-100 border-round">
                <p><strong>Last Test:</strong> {apiTest.timestamp}</p>
                <p><strong>Success:</strong> {apiTest.success ? 'Yes' : 'No'}</p>
                {apiTest.error && <p><strong>Error:</strong> {apiTest.error}</p>}
                {apiTest.data && (
                  <details>
                    <summary>Response Data</summary>
                    <pre className="text-xs bg-white p-2 border-round mt-2 overflow-auto">
                      {JSON.stringify(apiTest.data, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex gap-2">
            <Button
              label="Go to Admin Login"
              icon="pi pi-user"
              onClick={() => router.push(`/${currentLocale}/admin`)}
            />
            <Button
              label="Go to Posts"
              icon="pi pi-file"
              onClick={() => router.push(`/${currentLocale}/admin/posts`)}
            />
          </div>
        </Card>
      </div>
      <Toast ref={toast} />
    </div>
  );
} 