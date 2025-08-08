import { getSession } from 'next-auth/react';
import { isTokenExpired } from '@/utils/tokenUtils';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081';

interface ApiClientOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: any;
  headers?: Record<string, string>;
}

class ApiClient {
  private async getAuthHeaders(): Promise<Record<string, string>> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Try to get token from localStorage (custom auth system)
    if (typeof window !== 'undefined') {
      const accessToken = localStorage.getItem('access_token');
      console.log('API Client - Access token from localStorage:', accessToken ? 'Found' : 'Not found');
      
      if (accessToken) {
        // Check if token is expired
        if (isTokenExpired(accessToken)) {
          console.log('API Client - Token is expired, will need refresh');
          // Don't add expired token to headers, let the request fail and trigger refresh
        } else {
          console.log('API Client - Using valid localStorage token');
          headers['Authorization'] = `Bearer ${accessToken}`;
          return headers;
        }
      }
    }

    // Fallback to NextAuth session token
    try {
      const session = await getSession();
      console.log('API Client - NextAuth session:', session ? 'Found' : 'Not found');
      if (session?.accessToken) {
        console.log('API Client - Using NextAuth access token');
        headers['Authorization'] = `Bearer ${session.accessToken}`;
      } else {
        console.log('API Client - No NextAuth access token found');
      }
    } catch (error) {
      console.warn('Failed to get NextAuth session:', error);
    }

    return headers;
  }

  private async handleAuthError(response: Response): Promise<never> {
    let errorMessage = `API request failed: ${response.status} ${response.statusText}`;
    
    // Try to get more detailed error message from response
    try {
      const errorData = await response.json();
      if (errorData.error) {
        errorMessage = errorData.error;
      } else if (errorData.message) {
        errorMessage = errorData.message;
      }
    } catch (e) {
      // If we can't parse JSON, use the default message
    }

    // Handle specific error cases
    if (response.status === 401) {
      // Clear invalid tokens
      // No longer needed as NextAuth handles session management
    } else if (response.status === 403) {
      errorMessage = 'Access denied. You do not have permission to perform this action.';
    } else if (response.status === 404) {
      errorMessage = 'Resource not found.';
    } else if (response.status >= 500) {
      errorMessage = 'Server error. Please try again later.';
    }

    throw new Error(errorMessage);
  }

  async request<T = any>(
    endpoint: string,
    options: ApiClientOptions = {}
  ): Promise<T> {
    const { method = 'GET', body, headers: customHeaders = {} } = options;
    
    const authHeaders = await this.getAuthHeaders();
    const headers = { ...authHeaders, ...customHeaders };

    const config: RequestInit = {
      method,
      headers,
    };

    if (body && method !== 'GET') {
      config.body = JSON.stringify(body);
    }

    // Ensure endpoint starts with /api/v1
    const normalizedEndpoint = endpoint.startsWith('/api/v1') ? endpoint : `/api/v1${endpoint}`;
    const response = await fetch(`${API_BASE_URL}${normalizedEndpoint}`, config);

    if (!response.ok) {
      return this.handleAuthError(response);
    }

    // Handle empty responses
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    }

    return response.text() as T;
  }

  // Convenience methods
  async get<T = any>(endpoint: string, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET', headers });
  }

  async post<T = any>(endpoint: string, body: any, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, { method: 'POST', body, headers });
  }

  async put<T = any>(endpoint: string, body: any, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, { method: 'PUT', body, headers });
  }

  async delete<T = any>(endpoint: string, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE', headers });
  }

  async patch<T = any>(endpoint: string, body: any, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, { method: 'PATCH', body, headers });
  }
}

export const apiClient = new ApiClient();
export default apiClient; 