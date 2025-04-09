'use client';

import React, { useState, useEffect } from 'react';
import { UnlabeledContract } from '@/types/unlabeledContracts';
import AttestationForm from '@/components/attestation/AttestationForm';
import { CHAINS } from '@/constants/chains';

interface VibeAttestSidebarProps {
  contract: UnlabeledContract | null;
  visible: boolean;
  onClose: () => void;
}

const VibeAttestSidebar: React.FC<VibeAttestSidebarProps> = ({ contract, visible, onClose }) => {
  // State to track animation
  const [mounted, setMounted] = useState(false);

  // Set mounted state when component mounts
  useEffect(() => {
    if (visible) {
      setMounted(true);
    }
  }, [visible]);

  // Handle animation completion on close
  const handleTransitionEnd = () => {
    if (!visible) {
      setMounted(false);
    }
  };

  // Don't render anything if not mounted and not visible
  if (!mounted && !visible) {
    return null;
  }

  return (
    <div 
      className={`lg:col-span-1 transition-all duration-300 ease-in-out transform ${
        visible ? 'translate-x-0 opacity-100 max-h-full' : 'translate-x-8 opacity-0 max-h-0 overflow-hidden lg:hidden'
      }`}
      onTransitionEnd={handleTransitionEnd}
    >
      {contract && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-md overflow-hidden h-[calc(100vh-4rem)]">
          <div className="h-full flex flex-col">
            <div className="px-6 py-5 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-200 flex-shrink-0">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  Contract Attestation
                </h2>
                <button 
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                  aria-label="Close"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Add details about this contract
              </p>
            </div>
            
            <div className="p-6 overflow-y-auto flex-grow scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              <div className="flex items-center mb-6 bg-indigo-50 p-3 rounded-lg">
                <div className="bg-indigo-100 rounded-lg p-2 mr-3">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide">Selected Contract</div>
                  <div className="text-sm font-mono mt-1 text-gray-800 font-medium bg-white px-2 py-1 rounded border border-gray-200 shadow-sm">
                    {`${contract.address.slice(0, 6)}...${contract.address.slice(-4)}`}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    Chain: <span className="font-medium">{contract.chain.toUpperCase().replace('_', ' ')}</span>
                  </div>
                </div>
              </div>
              
              {/* Use the original AttestationForm with prefilled data */}
              <AttestationForm 
                prefilledAddress={contract.address} 
                prefilledChainId={CHAINS.find(c => c.id === contract.chain)?.caip2 || `eip155:${contract.chain}`}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VibeAttestSidebar; 