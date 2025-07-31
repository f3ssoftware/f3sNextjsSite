'use client';

import { useAuth } from '@/hooks/useAuth';

export default function AuthStatus() {
  const { session, isAuthenticated, isLoading, login, logout } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
        <span className="text-sm text-gray-600">Loading...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center space-x-4">
        <span className="text-sm text-gray-600">Not signed in</span>
        <button
          onClick={() => login('keycloak')}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
          <span className="text-white text-sm font-medium">
            {session?.user?.name?.charAt(0) || 'U'}
          </span>
        </div>
        <div className="text-sm">
          <p className="font-medium text-gray-900">{session?.user?.name}</p>
          <p className="text-gray-500">{session?.user?.email}</p>
        </div>
      </div>
      <button
        onClick={() => logout()}
        className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 focus:outline-none"
      >
        Sign Out
      </button>
    </div>
  );
} 