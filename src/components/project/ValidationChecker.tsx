'use client';

import React, { useEffect, useState } from 'react';

import { validateProjectField } from '../../utils/projectValidation';

interface ValidationCheckerProps {
  field: string;
  value: string;
}

const ValidationChecker: React.FC<ValidationCheckerProps> = ({ field, value }) => {
  const [warnings, setWarnings] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkValidation = async () => {
      if (!value) {
        setWarnings([]);
        return;
      }
      
      setIsLoading(true);
      const newWarnings = await validateProjectField(field, value);
      setWarnings(newWarnings.map(warning => warning.message));
      setIsLoading(false);
    };

    checkValidation();
  }, [field, value]);

  return (
    <div className="mt-1">
      {isLoading && field !== 'description' && (
        <div className="text-xs text-gray-500">Checking for duplicates...</div>
      )}
      
      {warnings.length > 0 && (
        <div className="mt-1 text-sm text-amber-600">
          {warnings.map((warning, index) => (
            <div key={index} className="flex items-start mb-1">
              <svg className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
              </svg>
              <span>{warning}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ValidationChecker; 