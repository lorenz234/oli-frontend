// ToggleSwitch.tsx
import React from 'react';

interface ToggleSwitchProps {
  isActive: boolean;
  onToggle: () => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ isActive, onToggle }) => {
  return (
    <div 
      className="relative w-60 h-9 rounded-full cursor-pointer overflow-hidden shadow-md bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500"
      onClick={onToggle}
    >      
      {/* Toggle Slider with z-index and positioning */}
      <div 
        className={`absolute top-1 bottom-1 w-[48%] mx-1.5 bg-white rounded-full transition-transform duration-300 ease-in-out z-10 flex items-center justify-center ${
          isActive ? 'transform translate-x-[calc(100%)]' : 'transform translate-x-[-1px]'
        }`}
      >
        {/* Text that moves with the slider */}
        <span className="text-gray-600">
          {isActive ? 'Advanced' : 'Simple'}
        </span>
      </div>
      
      {/* Static background labels */}
      <div className="absolute inset-0 flex items-center justify-between px-6 font-medium text-base">
        <span className={`z-0 ml-2 ${isActive ? 'text-white' : 'opacity-0'}`}>
          Simple
        </span>
        <span className={`z-0 mr-2 ${isActive ? 'opacity-0' : 'text-white'}`}>
          Advanced
        </span>
      </div>
    </div>
  );
};

export default ToggleSwitch;