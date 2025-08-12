// components/attestation/OwnerProjectInput.tsx
import React, { memo } from 'react';

interface OwnerProjectInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  validProjects: string[];
  isLoadingProjects: boolean;
  error?: string;
  baseInputClasses: string;
}

const OwnerProjectInput = memo<OwnerProjectInputProps>(({
  value,
  onChange,
  validProjects,
  isLoadingProjects,
  error,
  baseInputClasses,
}) => {
  const hasExactMatch = value && validProjects.includes(value);

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={value}
        onChange={onChange}
        className={baseInputClasses}
        list="valid-projects"
      />
      {isLoadingProjects ? (
        <div className="absolute right-8 top-1/2 -translate-y-1/2">
          <div className="animate-spin h-4 w-4 border-2 border-indigo-500 rounded-full border-t-transparent" />
        </div>
      ) : (
        hasExactMatch && (
          <div className="absolute right-8 top-1/2 -translate-y-1/2 text-green-500">✓</div>
        )
      )}
      <datalist id="valid-projects">
        {validProjects.map(project => (
          <option key={project} value={project} />
        ))}
      </datalist>
      
      {error && <div className="absolute inset-x-0 -bottom-1 h-0.5 bg-red-500" />}
    </div>
  );
});

OwnerProjectInput.displayName = 'OwnerProjectInput';

export default OwnerProjectInput;
