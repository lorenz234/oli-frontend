'use client';

import React, { useState } from 'react';
import { CookiePreferencesModal } from './index';

const CookieSettingsButton: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="text-gray-500 hover:text-gray-700 text-sm"
      >
        Cookie Settings
      </button>
      
      <CookiePreferencesModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
};

export default CookieSettingsButton;
