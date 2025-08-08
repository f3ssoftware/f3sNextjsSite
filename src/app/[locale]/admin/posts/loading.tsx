import React from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Card } from 'primereact/card';

export default function Loading() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-full max-w-md">
        <div className="flex flex-col items-center space-y-4">
          <ProgressSpinner 
            style={{ width: '50px', height: '50px' }} 
            strokeWidth="4"
            animationDuration=".5s"
          />
          <p className="text-gray-600">Loading posts...</p>
        </div>
      </Card>
    </div>
  );
}

