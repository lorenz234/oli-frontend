'use client';

import React, { useState } from 'react';
import { fetchAttestationsByContract, Attestation } from '@/services/attestationService';

// Helper function to format timestamp to readable date
const formatTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Helper function to extract chain ID from attestation
const extractChainId = (attestation: Attestation): string | undefined => {
  try {
    const fields = JSON.parse(attestation.decodedDataJson);
    const chainIdField = fields.find((field: any) => field.name === 'chain_id');
    if (chainIdField && chainIdField.value && chainIdField.value.value) {
      return chainIdField.value.value;
    }
    return undefined;
  } catch (e) {
    console.warn('Could not extract chain ID:', e);
    return undefined;
  }
};

// Helper function to parse tag data from attestation data
const parseTagsFromAttestation = (attestation: Attestation & { timeCreated: number | string }) => {
  const tags: Record<string, any>[] = [];
  
  try {
    // Parse the decodedDataJson string which contains an array of fields
    const fields = JSON.parse(attestation.decodedDataJson);
    
    if (!Array.isArray(fields)) {
      console.warn('Expected decodedDataJson to be an array of fields');
      return tags;
    }
    
    // Look for the tags_json field specifically
    const tagsField = fields.find(field => field.name === 'tags_json');
    
    if (tagsField && tagsField.value && typeof tagsField.value.value === 'string') {
      try {
        // Parse the nested JSON string in the tags_json field
        const tagsObject = JSON.parse(tagsField.value.value);
        
        // Convert each key-value pair in the tags object to a tag
        Object.entries(tagsObject).forEach(([key, value]) => {
          tags.push({
            id: `${attestation.txid || attestation.timeCreated}-${key}`,
            name: `${key}: ${value}`,
            category: 'Contract Tag',
            createdAt: Number(attestation.timeCreated),
            rawValue: value
          });
        });
      } catch (e) {
        console.warn('Could not parse tags_json value:', e);
      }
    } else {
      // If no tags_json field found, extract other fields as tags
      fields.forEach(field => {
        if (field.name && field.value) {
          let displayValue = '';
          
          if (typeof field.value.value === 'string') {
            // Truncate long values
            displayValue = field.value.value.length > 30 
              ? field.value.value.substring(0, 30) + '...' 
              : field.value.value;
          } else {
            displayValue = JSON.stringify(field.value.value);
          }
          
          tags.push({
            id: `${attestation.txid || attestation.timeCreated}-${field.name}`,
            name: `${field.name}: ${displayValue}`,
            category: 'Attestation Field',
            createdAt: Number(attestation.timeCreated),
            rawValue: field.value.value
          });
        }
      });
    }
  } catch (e) {
    console.error('Error parsing attestation data:', e);
  }
  
  return tags;
};

interface ParsedAttestation {
  attester: string;
  timeCreated: number;
  txid: string;
  isOffchain: boolean;
  tags: Record<string, any>[];
  chainId?: string;
}

const SearchTab = () => {
  const [contractAddress, setContractAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [attestations, setAttestations] = useState<ParsedAttestation[]>([]);

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContractAddress(e.target.value);
    // Clear previous results when input changes
    if (attestations.length > 0) {
      setAttestations([]);
      setError('');
    }
  };

  const fetchContractAttestations = async () => {
    if (!contractAddress.trim()) {
      setError('Please enter a contract address');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      // Fetch attestations from the GraphQL API
      const rawAttestations = await fetchAttestationsByContract(contractAddress);
      
      if (rawAttestations.length === 0) {
        setError('No attestations found for this address as recipient');
        setAttestations([]);
        setIsLoading(false);
        return;
      }
      
      // Process each attestation
      const parsedAttestations = rawAttestations.map(attestation => {
        return {
          attester: attestation.attester,
          timeCreated: Number(attestation.timeCreated), // Convert to number
          txid: attestation.txid,
          isOffchain: attestation.isOffchain,
          tags: parseTagsFromAttestation(attestation),
          chainId: extractChainId(attestation)
        };
      });
      
      setAttestations(parsedAttestations);
    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching data');
      setAttestations([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Count total tags across all attestations
  const totalTags = attestations.reduce((count, attestation) => count + attestation.tags.length, 0);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-[0_8px_30px_rgb(0,0,0,0.05)]">
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-1 text-gray-900">Search Tags for an Address</h2>
          <p className="text-sm text-gray-500">
            Enter an address to view all attested tags for this address
          </p>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter address (0x...)"
            value={contractAddress}
            onChange={handleAddressChange}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button 
            onClick={fetchContractAttestations}
            disabled={isLoading}
            className="px-4 py-2 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-white rounded-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading
              </span>
            ) : (
              <span className="flex items-center">
                <svg className="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Search
              </span>
            )}
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
            {error}
          </div>
        )}
      </div>

      {attestations.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-1 flex items-center">
              <span className="mr-2 text-gray-900">Contract</span>
              <code className="text-sm bg-gray-100 text-gray-500 px-2 py-1 rounded">
                {contractAddress}
              </code>
            </h2>
            <div className="flex justify-between text-sm text-gray-500 mb-4">
              <p>
                {attestations.length} attestation{attestations.length !== 1 ? 's' : ''} found
              </p>
              <p>
                {totalTags} extracted tag{totalTags !== 1 ? 's' : ''} 
              </p>
            </div>
          </div>
          
          <div className="space-y-8">
            {(() => {
              // Group attestations by chain
              const attestationsByChain: Record<string, ParsedAttestation[]> = {};
              
              attestations.forEach(attestation => {
                const chainKey = attestation.chainId || 'Unknown Chain';
                if (!attestationsByChain[chainKey]) {
                  attestationsByChain[chainKey] = [];
                }
                attestationsByChain[chainKey].push(attestation);
              });
              
              // Sort chains by name for consistent display
              return Object.entries(attestationsByChain)
                .sort(([chainA], [chainB]) => chainA.localeCompare(chainB))
                .map(([chainId, chainAttestations]) => (
                  <div key={chainId} className="border-t pt-4 first:border-t-0 first:pt-0">
                    <h3 className="text-lg font-medium mb-3 flex items-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-blue-50 text-blue-700 mr-2">
                        chain_id: {chainId}
                      </span>
                      <span className="text-gray-500 text-sm font-normal">
                        {chainAttestations.length} attestation{chainAttestations.length !== 1 ? 's' : ''}
                      </span>
                    </h3>
                    
                    <div className="space-y-4">
                      {chainAttestations.map((attestation, index) => (
                        <div 
                          key={`${attestation.timeCreated}-${index}`} 
                          className="border border-gray-200 rounded-lg p-4"
                        >
                          <div className="mb-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center mb-2">
                                <div className="flex items-center px-3 py-1 bg-gray-100 rounded-md border border-gray-200">
                                  <span className="text-sm font-medium text-gray-500 mr-2">Attested by:</span>
                                  <code className="text-sm font-mono text-gray-500">
                                    {attestation.attester.substring(0, 6)}...
                                    {attestation.attester.substring(attestation.attester.length - 4)}
                                  </code>
                                </div>
                                
                                {attestation.isOffchain && (
                                  <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-purple-50 text-purple-600 rounded-full">
                                    Offchain
                                  </span>
                                )}
                              </div>
                              
                              <div className="text-sm text-gray-500">
                                {formatTimestamp(attestation.timeCreated)}
                              </div>
                            </div>
                            
                            <p className="text-xs text-gray-500 mt-1">
                              {attestation.tags.length} tag{attestation.tags.length !== 1 ? 's' : ''}
                            </p>
                          </div>
                          
                          {attestation.tags.length > 0 ? (
                            <div className="space-y-2">
                              {(() => {
                                const groupedTags = attestation.tags.reduce<{[key: string]: any[]}>((acc, tag) => {
                                  const category = tag.category || 'Uncategorized';
                                  if (!acc[category]) {
                                    acc[category] = [];
                                  }
                                  acc[category].push(tag);
                                  return acc;
                                }, {});
                              
                                return Object.entries(groupedTags).map(([category, categoryTags]) => (
                                  <div key={category}>
                                    <h3 className="text-sm font-medium mb-2 flex items-center text-gray-700">
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
                                      </svg>
                                      {category}
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                      {category === 'Contract Tag' 
                                        ? categoryTags.map((tag) => {
                                            // For contract tags, display them in a cleaner format
                                            const [key, value] = tag.name.split(': ');
                                            
                                            // Special handling for boolean values
                                            const displayValue = tag.rawValue === true || tag.rawValue === false 
                                              ? String(tag.rawValue) // Convert boolean to string
                                              : tag.rawValue;
                                              
                                            return (
                                              <div 
                                                key={tag.id}
                                                className="inline-flex items-center px-3 py-1 rounded-md bg-indigo-50 border border-indigo-100"
                                              >
                                                <span className="text-xs font-medium text-gray-500 mr-2">{key}:</span>
                                                <span className="text-sm text-indigo-700">{displayValue}</span>
                                              </div>
                                            );
                                          })
                                        : categoryTags.map((tag) => (
                                            <span 
                                              key={tag.id}
                                              className="px-2 py-1 text-xs bg-indigo-50 text-indigo-700 rounded-full"
                                            >
                                              {tag.name}
                                            </span>
                                          ))
                                      }
                                    </div>
                                  </div>
                                ));
                              })()}
                            </div>
                          ) : (
                            <div className="bg-yellow-50 border border-yellow-100 rounded-md p-3 text-yellow-800">
                              <p className="text-sm">No tags could be extracted from this attestation</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ));
            })()}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchTab;