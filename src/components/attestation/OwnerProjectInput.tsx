// components/attestation/OwnerProjectInput.tsx
import React from 'react';
import { ValidationWarning } from '../../types/attestation';
import Link from 'next/link';

interface OwnerProjectInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  warnings: ValidationWarning[] | undefined;
  onSuggestionClick: (suggestion: string) => void;
  validProjects: string[];
  isLoadingProjects: boolean;
  error?: string;
  baseInputClasses: string;
}

const OwnerProjectInput: React.FC<OwnerProjectInputProps> = ({
  value,
  onChange,
  warnings,
  onSuggestionClick,
  validProjects,
  isLoadingProjects,
  error,
  baseInputClasses,
}) => {
  const hasExactMatch = value && validProjects.includes(value);

  return (
    <div className="relative w-full">
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={onChange}
          className={baseInputClasses}
          list="valid-projects"
        />
        {isLoadingProjects ? (
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            <div className="animate-spin h-4 w-4 border-2 border-indigo-500 rounded-full border-t-transparent" />
          </div>
        ) : (
          hasExactMatch && (
            <div className="absolute right-2 top-1/2 -translate-y-1/2 text-green-500">✓</div>
          )
        )}
        <datalist id="valid-projects">
          {validProjects.map(project => (
            <option key={project} value={project} />
          ))}
        </datalist>
      </div>
      
      {error && <div className="absolute inset-x-0 bottom-0 h-0.5 bg-red-500" />}

      {warnings && warnings.length > 0 && (
        <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded-md text-left">
          {warnings.map((warning, index) => (
            <div key={index} className="mb-2 last:mb-0">
              <p className="text-xs text-amber-800 mb-1">{warning.message}</p>
              {warning.suggestions && warning.suggestions.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {warning.suggestions.map((suggestion, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => onSuggestionClick(suggestion)}
                      className="px-2 py-1 text-xs bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 transition-colors"
                    >
                      Use &quot;{suggestion}&quot;
                    </button>
                  ))}
                </div>
              )}
              {warning.showAddProjectLink && (
                <Link 
                  href="/project" 
                  className="text-xs text-indigo-600 hover:text-indigo-800 underline mt-1 inline-block"
                >
                  Add New Project
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OwnerProjectInput;
