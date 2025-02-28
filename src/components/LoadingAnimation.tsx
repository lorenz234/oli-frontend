import React from 'react';

const LoadingAnimation = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="flex items-center justify-center mb-4">
        <div className="relative">
          {/* Gradient circle background */}
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center animate-pulse">
            {/* Inner spinning circle */}
            <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-transparent border-t-white border-r-white animate-spin"></div>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col items-center">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Loading</h3>
        <p className="text-sm text-gray-600">Fetching the latest data...</p>
      </div>
    </div>
  );
};

export default LoadingAnimation;