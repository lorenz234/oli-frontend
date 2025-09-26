import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = "Loading...", 
  size = 'md',
  className = ""
}) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8', 
    lg: 'h-12 w-12'
  };

  return (
    <div className={`flex items-center justify-center py-12 ${className}`}>
      <div className="text-center">
        <div className={`animate-spin rounded-full border-b-2 border-indigo-600 mx-auto ${sizeClasses[size]}`}></div>
        {message && (
          <span className="ml-3 text-gray-600">{message}</span>
        )}
      </div>
    </div>
  );
};

export default LoadingSpinner;
