'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Toast } from 'primereact/toast';

interface LoadingContextType {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  showLoading: () => void;
  hideLoading: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};

interface LoadingProviderProps {
  children: React.ReactNode;
}

export const LoadingProvider: React.FC<LoadingProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);

  const showLoading = () => setIsLoading(true);
  const hideLoading = () => setIsLoading(false);

  // Show loading on navigation
  useEffect(() => {
    const handleStart = () => {
      showLoading();
    };

    const handleComplete = () => {
      hideLoading();
    };

    // Listen for navigation events
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', handleStart);
      window.addEventListener('load', handleComplete);
      
      // Listen for Next.js navigation events
      const originalPushState = history.pushState;
      const originalReplaceState = history.replaceState;
      
      history.pushState = function(...args) {
        showLoading();
        return originalPushState.apply(history, args);
      };
      
      history.replaceState = function(...args) {
        showLoading();
        return originalReplaceState.apply(history, args);
      };
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('beforeunload', handleStart);
        window.removeEventListener('load', handleComplete);
      }
    };
  }, []);

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading, showLoading, hideLoading }}>
      {children}
      
      {/* Global Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 flex flex-col items-center space-y-4">
            <ProgressSpinner 
              style={{ width: '50px', height: '50px' }} 
              strokeWidth="4"
              animationDuration=".5s"
            />
            <p className="text-gray-600 font-medium">Loading...</p>
          </div>
        </div>
      )}
      
      <Toast ref={(el) => setToast(el)} />
    </LoadingContext.Provider>
  );
};

