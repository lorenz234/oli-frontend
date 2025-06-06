'use client';

import React from 'react';
import ValidationChecker from './ValidationChecker';
import InputWithCheck from '../attestation/InputWithCheck';

interface ValidatedInputProps {
  id: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder: string;
  label: string;
  fieldType: string;
  tooltip?: string;
  error?: string;
  isTextarea?: boolean;
  rows?: number;
  className?: string;
}

const ValidatedInput: React.FC<ValidatedInputProps> = ({
  id,
  name,
  value,
  onChange,
  placeholder,
  label,
  fieldType,
  tooltip,
  error,
  isTextarea = false,
  rows = 4,
  className = ""
}) => {
  return (
    <div className="mb-6">
      <div className="flex items-center">
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        {tooltip && (
          <div className="group relative inline-block ml-2">
            <svg 
              className="w-4 h-4 text-gray-400 hover:text-gray-500" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
            <div className="invisible group-hover:visible absolute z-10 w-64 p-2 mt-2 text-sm text-gray-600 bg-white border rounded-lg shadow-lg -left-1/2 transform -translate-x-1/2">
              {tooltip}
            </div>
          </div>
        )}
      </div>
      
      <InputWithCheck
        value={!!value}
        isValid={!error}
        error={error}
      >
        {isTextarea ? (
          <textarea
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900 placeholder-gray-400 bg-gray-50 py-2 pl-3 ${className}`}
            rows={rows}
          />
        ) : (
          <input
            type="text"
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900 placeholder-gray-400 bg-gray-50 py-2 pl-3 ${className}`}
          />
        )}
      </InputWithCheck>
      
      <ValidationChecker field={fieldType} value={value} />
    </div>
  );
};

export default ValidatedInput; 