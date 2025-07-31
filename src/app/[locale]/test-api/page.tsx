'use client';

import { useEffect, useState } from 'react';
import apiClient from '@/lib/api-client';

export default function TestApiPage() {
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const testApiCall = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await apiClient.get('/api/v1/admin/posts?page=1&limit=10');
      setResult(response);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">API Test Page</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <button
            onClick={testApiCall}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test API Call'}
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <strong>Error:</strong> {error}
          </div>
        )}

        {result && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            <strong>Success!</strong> API call completed successfully.
            <pre className="mt-2 text-sm bg-white p-2 rounded overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Instructions:</h2>
          <ol className="list-decimal list-inside space-y-1">
            <li>First, make sure you&apos;re logged in to get an access token</li>
            <li>Click the &quot;Test API Call&quot; button</li>
            <li>Check the browser&apos;s Network tab to see if the Authorization header is being sent</li>
            <li>The request should go to: <code>http://localhost:8080/api/v1/admin/posts?page=1&limit=10</code></li>
          </ol>
        </div>
      </div>
    </div>
  );
} 