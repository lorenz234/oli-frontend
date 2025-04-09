'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AttestationForm from '@/components/attestation/AttestationForm';
import BulkAttestationForm from '@/components/attestation/BulkAttestationForm';
import UnlabeledContractsList from '@/components/vibe-attest/UnlabeledContractsList';
import VibeAttestSidebar from '@/components/vibe-attest/VibeAttestSidebar';
import { UnlabeledContract } from '@/types/unlabeledContracts';

export default function AttestPage() {
  const [mode, setMode] = useState<'single' | 'bulk'>('single');
  const [selectedContract, setSelectedContract] = useState<UnlabeledContract | null>(null);
  const [sidebarVisible, setSidebarVisible] = useState<boolean>(false);
  const [vibeAttestVisible, setVibeAttestVisible] = useState<boolean>(false);

  const handleSelectContract = (contract: UnlabeledContract) => {
    setSelectedContract(contract);
    setSidebarVisible(true);
  };

  const clearSelectedContract = () => {
    setSidebarVisible(false);
    
    // Delay clearing the contract data until after the transition
    setTimeout(() => {
      setSelectedContract(null);
    }, 300);
  };

  // Handle window resize for mobile view
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024 && sidebarVisible) {
        // On mobile, scroll to the top when sidebar opens
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [sidebarVisible]);

  // Get the appropriate page title based on the current mode
  const getPageTitle = () => {
    switch(mode) {
      case 'single':
        return 'Assign Tags to Addresses';
      case 'bulk':
        return 'Bulk Tag Assignment';
      default:
        return 'Assign Tags to Addresses';
    }
  };

  return (
    <main className="max-w-7xl mx-auto p-8 space-y-8">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.05)]">
        <div className="py-6 px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Bulk Attestation Options</h2>
          <p className="text-gray-700 mb-4">
            Need to submit more than 50 attestations programmatically as part of your data pipeline? You can use our Python and TypeScript scripts for larger datasets and pipelines. Offchain attestations are also possible (0 gas fees).
          </p>
          <Link 
            href="https://github.com/openlabelsinitiative/OLI/tree/main/2_label_pool/tooling_write" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Access bulk attestation scripts →
          </Link>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.05)]">
        <div className="border-b border-gray-200">
          <div className="flex justify-between items-center py-6 px-6">
            <h2 className="text-2xl font-bold text-gray-900">{getPageTitle()}</h2>
            
            <div className="flex">
              <button
                className={`px-4 py-2 text-sm font-medium ${
                  mode === 'single' 
                    ? 'bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-white'
                    : 'text-gray-500 hover:text-gray-700 bg-white border border-gray-300'
                } rounded-l-lg ${mode === 'single' ? '' : 'border-r-0'}`}
                onClick={() => setMode('single')}
              >
                Single Address
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium ${
                  mode === 'bulk' 
                    ? 'bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-white'
                    : 'text-gray-500 hover:text-gray-700 bg-white border border-gray-300'
                } rounded-r-lg`}
                onClick={() => setMode('bulk')}
              >
                Multiple Addresses
              </button>
            </div>
          </div>
        </div>
        
        {mode === 'single' ? (
          <AttestationForm />
        ) : (
          <BulkAttestationForm />
        )}
      </div>

      {/* New Vibe Attest Section */}
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.05)]">
        <div className="p-6">
          <button
            onClick={() => setVibeAttestVisible(!vibeAttestVisible)}
            className="w-full flex justify-between items-center text-left p-4 hover:bg-gray-50 rounded-xl transition-all duration-200 group border-2 border-transparent hover:border-gray-100"
          >
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold text-gray-900">Not sure what to attest?</h2>
                <span className="text-sm px-2 py-1 bg-blue-50 text-blue-600 rounded-full font-medium">Click to expand</span>
              </div>
              <p className="text-gray-700 mt-2">
                Explore popular unlabeled smart contracts and help the community by providing attestations.
              </p>
            </div>
            <div className={`transform transition-transform duration-200 ${vibeAttestVisible ? 'rotate-180' : ''} bg-gray-50 p-2 rounded-full group-hover:bg-gray-100`}>
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>

          {vibeAttestVisible && (
            <div className="mt-6 border-t pt-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 transition-all duration-300">
                <div className={`transition-all duration-300 ease-in-out ${sidebarVisible ? 'lg:col-span-8' : 'lg:col-span-12'}`}>
                  <UnlabeledContractsList 
                    onSelectContract={handleSelectContract}
                    sidebarVisible={sidebarVisible} 
                  />
                </div>
                
                <div className={`transition-all duration-300 ease-in-out ${sidebarVisible ? 'lg:col-span-4 block' : 'lg:col-span-0 hidden'} relative`}>
                  <div className="sticky top-8">
                    <VibeAttestSidebar 
                      contract={selectedContract}
                      visible={sidebarVisible}
                      onClose={clearSelectedContract}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}