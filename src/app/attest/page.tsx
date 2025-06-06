// Attestation Page with URL Parameter Support
// 
// This page supports parametrized URLs for prefilling the attestation form:
//
// URL Parameters:
// - address or contract: The blockchain address/contract to attest (e.g., 0x1234...)
// - chain or chainId: The blockchain network (supports multiple formats):
//   
// Supported Chain Formats:
// 1. Chain ID numbers: 1, 8453, 42161, 10, etc.
// 2. CAIP-2 format: eip155:1, eip155:8453, etc.
// 3. Chain names: ethereum, base, arbitrum, optimism, etc.
// 4. Short names: eth, mainnet, etc.
//
// Example URLs:
// https://openlabelsinitiative.org/attest?address=0x1234567890123456789012345678901234567890&chain=ethereum
// https://openlabelsinitiative.org/attest?contract=0xA0b86a33E6441d1C9FC61e93eAef24fE7b88B24e&chainId=8453
// https://openlabelsinitiative.org/attest?address=0x1234567890123456789012345678901234567890&chain=1
// https://openlabelsinitiative.org/attest?address=0x1234567890123456789012345678901234567890&chain=base
//
// The form will automatically scroll to the single attestation section when parameters are provided.

'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import AttestationForm from '@/components/attestation/AttestationForm';
import BulkAttestationForm from '@/components/attestation/BulkAttestationForm';
import BulkAttestationScripts from '@/components/attestation/BulkAttestationScripts';
import UnlabeledContractsList from '@/components/vibe-attest/UnlabeledContractsList';
import VibeAttestSidebar from '@/components/vibe-attest/VibeAttestSidebar';
import { UnlabeledContract } from '@/types/unlabeledContracts';
import { CHAINS } from '@/constants/chains';

// Chain mapping function to convert various formats to CAIP-2
const mapChainToCAIP2 = (chainInput: string): string | undefined => {
  if (!chainInput) return undefined;
  
  const input = chainInput.toLowerCase().trim();
  
  // Check if it's already in CAIP-2 format (eip155:chainId)
  if (input.startsWith('eip155:')) {
    return chainInput;
  }
  
  // Check if it's a numeric chain ID
  const numericChainId = parseInt(input);
  if (!isNaN(numericChainId)) {
    return `eip155:${numericChainId}`;
  }
  
  // Map common chain names/aliases to CAIP-2 format
  const chainMappings: { [key: string]: string } = {
    // By chain name (lowercase)
    'ethereum': 'eip155:1',
    'eth': 'eip155:1',
    'mainnet': 'eip155:1',
    'base': 'eip155:8453',
    'arbitrum': 'eip155:42161',
    'arbitrum one': 'eip155:42161',
    'optimism': 'eip155:10',
    'op mainnet': 'eip155:10',
    'polygon': 'eip155:137',
    'linea': 'eip155:59144',
    'scroll': 'eip155:534352',
    'zksync': 'eip155:324',
    'zksync era': 'eip155:324',
    'mantle': 'eip155:5000',
    'mode': 'eip155:34443',
    'mode network': 'eip155:34443',
    'taiko': 'eip155:167000',
    'taiko alethia': 'eip155:167000',
    'swell': 'eip155:1923',
    'swellchain': 'eip155:1923',
    'zora': 'eip155:7777777'
  };
  
  // Check direct mapping first
  if (chainMappings[input]) {
    return chainMappings[input];
  }
  
  // Check by chain ID from CHAINS constant
  const foundChain = CHAINS.find(chain => 
    chain.id.toLowerCase() === input ||
    chain.name.toLowerCase() === input ||
    chain.shortName.toLowerCase() === input ||
    chain.caip2.toLowerCase() === chainInput.toLowerCase()
  );
  
  return foundChain?.caip2;
};

// Component that uses useSearchParams
function AttestPageContent() {
  const searchParams = useSearchParams();
  const [selectedContract, setSelectedContract] = useState<UnlabeledContract | null>(null);
  const [sidebarVisible, setSidebarVisible] = useState<boolean>(false);
  const [vibeAttestVisible, setVibeAttestVisible] = useState<boolean>(false);
  
  // Extract URL parameters for prefilling the form
  const [prefilledAddress, setPrefilledAddress] = useState<string | undefined>(undefined);
  const [prefilledChainId, setPrefilledChainId] = useState<string | undefined>(undefined);
  
  // Create refs for each section
  const singleAttestationRef = useRef<HTMLDivElement>(null);
  const bulkAttestationRef = useRef<HTMLDivElement>(null);
  const bulkScriptsRef = useRef<HTMLDivElement>(null);
  const vibeAttestRef = useRef<HTMLDivElement>(null);

  // Extract URL parameters on component mount
  useEffect(() => {
    // Get address parameter (can be 'address' or 'contract')
    const addressParam = searchParams.get('address') || searchParams.get('contract');
    // Get chain parameter (can be 'chain' or 'chainId')
    const chainParam = searchParams.get('chain') || searchParams.get('chainId');
    
    if (addressParam) {
      setPrefilledAddress(addressParam);
    }
    
    if (chainParam) {
      const mappedChain = mapChainToCAIP2(chainParam);
      if (mappedChain) {
        setPrefilledChainId(mappedChain);
      } else {
        console.warn(`Unable to map chain parameter "${chainParam}" to a supported chain`);
      }
    }
    
    // Handle hash-based routing and auto-scroll
    const handleHashAndParams = () => {
      const hash = window.location.hash.replace('#', '');
      
      // If parameters are provided or hash is single-attestation, scroll to single attestation
      if (addressParam || chainParam || hash === 'single-attestation') {
        setTimeout(() => {
          scrollToElement(singleAttestationRef, 'single-attestation');
        }, 100);
      }
      // Handle other hash sections
      else if (hash === 'bulk-attestation') {
        setTimeout(() => {
          scrollToElement(bulkAttestationRef, 'bulk-attestation');
        }, 100);
      }
      else if (hash === 'bulk-scripts') {
        setTimeout(() => {
          scrollToElement(bulkScriptsRef, 'bulk-scripts');
        }, 100);
      }
      else if (hash === 'vibe-attest') {
        setVibeAttestVisible(true);
        setTimeout(() => {
          scrollToElement(vibeAttestRef, 'vibe-attest');
        }, 100);
      }
    };
    
    handleHashAndParams();
    
    // Listen for hash changes
    const handleHashChange = () => handleHashAndParams();
    window.addEventListener('hashchange', handleHashChange);
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [searchParams]);

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

  // Function to scroll to an element and center it
  const scrollToElement = (elementRef: React.RefObject<any>, hash: string, block: ScrollLogicalPosition = 'center') => {
    // Update URL with hash
    window.history.pushState(null, '', `#${hash}`);
    
    // Scroll the element into view
    if (elementRef.current) {
      setTimeout(() => {
        elementRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: block
        });
      }, 100);
    }
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

  // Check URL hash on load to scroll to right section
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          // If it's the vibe-attest section, open dropdown first
          if (hash === 'vibe-attest') {
            setVibeAttestVisible(true);
            
            // Allow time for the dropdown to fully open
            setTimeout(() => {
              // Scroll to position the first contract near the top
              const contractsList = document.querySelector('.unlabeled-contracts-list');
              if (contractsList) {
                contractsList.scrollIntoView({
                  behavior: 'smooth',
                  block: 'start'
                });
              } else {
                // Fallback to the section header
                element.scrollIntoView({
                  behavior: 'smooth',
                  block: 'start'
                });
              }
            }, 300);
          } else {
            // For other sections, center them
            element.scrollIntoView({
              behavior: 'smooth',
              block: 'center'
            });
          }
        }
      }, 500);
    }
  }, []);

  return (
    <main className="max-w-7xl mx-auto p-8 space-y-16">
      {/* Introduction Section */}
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-gray-900">Attestation Hub</h1>
        <p className="text-gray-700 mb-2">
          Welcome to the OLI Attestation Hub, where you can assign tags to blockchain addresses and smart contracts to improve transparency and discoverability.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Card 1: Single Address Attestation */}
          <div 
            className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.05)] p-6 border-l-4 border-blue-500 cursor-pointer hover:shadow-lg transition-all duration-200 flex flex-col h-full"
            onClick={() => {
              scrollToElement(singleAttestationRef, 'single-attestation');
            }}
          >
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">Single Address Attestation</h3>
            <p className="text-gray-600 mb-2">
              Assign tags to an individual blockchain address or smart contract.
            </p>
            <ul className="mb-4 space-y-1 text-sm text-gray-600 flex-grow">
              <li className="flex items-start">
                <svg className="w-4 h-4 mt-0.5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                One address at a time
              </li>
              <li className="flex items-start">
                <svg className="w-4 h-4 mt-0.5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Multiple tags per address
              </li>
              <li className="flex items-start">
                <svg className="w-4 h-4 mt-0.5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Quick and simple interface
              </li>
            </ul>
            <span className="text-blue-600 font-medium inline-flex items-center mt-auto">
              Go to single attestation
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </span>
          </div>
          
          {/* Card 2: CSV Upload */}
          <div 
            className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.05)] p-6 border-l-4 border-green-500 cursor-pointer hover:shadow-lg transition-all duration-200 flex flex-col h-full"
            onClick={() => {
              scrollToElement(bulkAttestationRef, 'bulk-attestation');
            }}
          >
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">CSV Upload</h3>
            <p className="text-gray-600 mb-2">
              Upload a CSV file with multiple addresses to attest at once.
            </p>
            <ul className="mb-4 space-y-1 text-sm text-gray-600 flex-grow">
              <li className="flex items-start">
                <svg className="w-4 h-4 mt-0.5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Up to 50 attestations at once
              </li>
              <li className="flex items-start">
                <svg className="w-4 h-4 mt-0.5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Easy upload through UI
              </li>
              <li className="flex items-start">
                <svg className="w-4 h-4 mt-0.5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Perfect for analysts and projects
              </li>
            </ul>
            <span className="text-green-600 font-medium inline-flex items-center mt-auto">
              Go to CSV upload
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </span>
          </div>
          
          {/* Card 3: Bulk Attestation Scripts */}
          <div 
            className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.05)] p-6 border-l-4 border-purple-500 cursor-pointer hover:shadow-lg transition-all duration-200 flex flex-col h-full"
            onClick={() => {
              scrollToElement(bulkScriptsRef, 'bulk-scripts');
            }}
          >
            <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">Bulk Attestation Scripts</h3>
            <p className="text-gray-600 mb-2">
              Use our scripts for large-scale attestation needs.
            </p>
            <ul className="mb-4 space-y-1 text-sm text-gray-600 flex-grow">
              <li className="flex items-start">
                <svg className="w-4 h-4 mt-0.5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                50+ attestations support
              </li>
              <li className="flex items-start">
                <svg className="w-4 h-4 mt-0.5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Python & TypeScript options
              </li>
              <li className="flex items-start">
                <svg className="w-4 h-4 mt-0.5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Pipeline integration ready
              </li>
            </ul>
            <span className="text-purple-600 font-medium inline-flex items-center mt-auto">
              Explore scripts
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </span>
          </div>
          
          {/* Card 4: Vibe Attest */}
          <div 
            className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.05)] p-6 border-l-4 border-pink-500 cursor-pointer hover:shadow-lg transition-all duration-200 flex flex-col h-full"
            onClick={() => {
              // First make sure dropdown is open, then scroll to it
              const wasAlreadyOpen = vibeAttestVisible;
              setVibeAttestVisible(true);
              
              // Update URL with hash
              window.history.pushState(null, '', '#vibe-attest');
              
              // Allow time for the dropdown to open before scrolling
              setTimeout(() => {
                if (wasAlreadyOpen) {
                  // If already open, just scroll to position the contracts list at the top
                  const contractsList = document.querySelector('.unlabeled-contracts-list');
                  if (contractsList) {
                    contractsList.scrollIntoView({
                      behavior: 'smooth',
                      block: 'start'
                    });
                  } else {
                    // Fallback to section if list can't be found
                    vibeAttestRef.current?.scrollIntoView({
                      behavior: 'smooth',
                      block: 'start'
                    });
                  }
                } else {
                  // If it wasn't open, first ensure the section is visible
                  vibeAttestRef.current?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                  });
                  
                  // Then after animation completes, scroll to the contracts list
                  setTimeout(() => {
                    const contractsList = document.querySelector('.unlabeled-contracts-list');
                    if (contractsList) {
                      contractsList.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                      });
                    }
                  }, 400);
                }
              }, wasAlreadyOpen ? 100 : 300);
            }}
          >
            <div className="flex items-center justify-center w-12 h-12 bg-pink-100 rounded-full mb-4">
              <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">Discover & Attest</h3>
            <p className="text-gray-600 mb-2">
              Browse high-value unlabeled contracts to attest.
            </p>
            <ul className="mb-4 space-y-1 text-sm text-gray-600 flex-grow">
              <li className="flex items-start">
                <svg className="w-4 h-4 mt-0.5 mr-2 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Curated high-impact contracts
              </li>
              <li className="flex items-start">
                <svg className="w-4 h-4 mt-0.5 mr-2 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Prioritized by transaction volume
              </li>
              <li className="flex items-start">
                <svg className="w-4 h-4 mt-0.5 mr-2 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Ideal for community contributors
              </li>
            </ul>
            <span className="text-pink-600 font-medium inline-flex items-center mt-auto">
              Explore contracts
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </span>
          </div>
        </div>
        
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 mb-8">
          <h3 className="text-lg font-semibold mb-2 flex items-center text-gray-900">
            <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            What is an attestation?
          </h3>
          <p className="text-gray-700">
            Attestations are onchain verifiable statements that assign specific tags or properties to blockchain addresses. 
            By providing attestations, you help create a more transparent blockchain ecosystem where addresses can be 
            identified by their purpose, ownership, or other relevant properties.
          </p>
        </div>
      </div>

      {/* Single Address Attestation Section */}
      <div id="single-attestation" ref={singleAttestationRef} className="max-w-7xl mx-auto bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.05)] overflow-hidden border-t-4 border-blue-500 mt-16">
        <div className="p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Single Address Attestation</h2>
          <p className="text-gray-600 mt-2">
            Use this form to attest a single blockchain address. You can add multiple tags to the same address.
          </p>
        </div>
        <div className="pb-1">
        <AttestationForm 
          prefilledAddress={prefilledAddress}
          prefilledChainId={prefilledChainId}
        />
        </div>
      </div>
      
      {/* Bulk Address Attestation via CSV Section */}
      <div id="bulk-attestation" ref={bulkAttestationRef} className="max-w-7xl mx-auto bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.05)] overflow-hidden border-t-4 border-green-500 mt-16">
        <div className="p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Bulk Address Attestation via CSV</h2>
          <p className="text-gray-600 mt-2">
            Upload a CSV file with multiple addresses to create attestations in bulk. Limited to 50 addresses per upload.
          </p>
        </div>
        <BulkAttestationForm />
      </div>

      {/* Bulk Scripts Section */}
      <div id="bulk-scripts" ref={bulkScriptsRef} className="max-w-7xl mx-auto bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.05)] overflow-hidden border-t-4 border-purple-500 mt-16">
        <div className="p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Bulk Attestation Scripts</h2>
          <p className="text-gray-600 mt-2">
            Use our scripts for large-scale attestation needs.
          </p>
        </div>
        <BulkAttestationScripts />
      </div>

      {/* Vibe Attest Section */}
      <div id="vibe-attest" ref={vibeAttestRef} className="max-w-7xl mx-auto bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.05)] overflow-hidden border-t-4 border-pink-500 mt-16">
        <div className="p-6">
          <button
            onClick={() => setVibeAttestVisible(!vibeAttestVisible)}
            className="w-full flex justify-between items-center text-left py-4 px-4 hover:bg-gray-50 rounded-xl transition-all duration-200 group"
          >
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold text-gray-900">Discover & Attest</h2>
                <span className="text-sm px-2 py-1 bg-blue-50 text-blue-600 rounded-full font-medium">Click to expand</span>
              </div>
              <p className="text-gray-700 mt-2">
                Explore unlabeled smart contracts with high transaction volume and gas spent and help the community by providing attestations.
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
                  <div className="unlabeled-contracts-list">
                    <UnlabeledContractsList 
                      onSelectContract={handleSelectContract}
                      sidebarVisible={sidebarVisible} 
                    />
                  </div>
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

// Main export with Suspense wrapper
export default function AttestPage() {
  return (
    <Suspense fallback={
      <main className="max-w-7xl mx-auto p-8 space-y-16">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-200 h-64 rounded-2xl"></div>
            ))}
          </div>
        </div>
      </main>
    }>
      <AttestPageContent />
    </Suspense>
  );
}