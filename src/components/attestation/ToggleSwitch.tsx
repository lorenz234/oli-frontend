// ToggleSwitch.tsx
import React from 'react';

interface ToggleSwitchProps {
  isActive: boolean;
  onToggle: () => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ isActive, onToggle }) => {
  return (
    <div className="flex">
      <button
        className={`px-4 py-2 text-sm font-medium ${
          !isActive 
            ? 'bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-white rounded-l-lg'
            : 'text-gray-500 hover:text-gray-700 bg-white rounded-l-lg border border-gray-300'
        }`}
        onClick={() => isActive && onToggle()}
      >
        Simple
      </button>
      <button
        className={`px-4 py-2 text-sm font-medium ${
          isActive 
            ? 'bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-white rounded-r-lg'
            : 'text-gray-500 hover:text-gray-700 bg-white rounded-r-lg border border-gray-300'
        }`}
        onClick={() => !isActive && onToggle()}
      >
        Advanced
      </button>
    </div>
  );
};

export default ToggleSwitch;