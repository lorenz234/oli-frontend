'use client';

import React, { useState } from 'react';
import { fetchAttestationsByContract, Attestation } from '@/services/attestationService';

// Helper function to parse tag data from attestation data
const parseTagsFromAttestations = (attestations: Attestation[]) => {
  const allTags: Record<string, any>[] = [];
  
  attestations.forEach(attestation => {
    try {
      // Parse the decodedDataJson string which contains an array of fields
      const fields = JSON.parse(attestation.decodedDataJson);
      
      if (!Array.isArray(fields)) {
        console.warn('Expected decodedDataJson to be an array of fields');
        return;
      }
      
      // Look for the tags_json field specifically
      const tagsField = fields.find(field => field.name === 'tags_json');
      
      if (tagsField && tagsField.value && typeof tagsField.value.value === 'string') {
        try {
          // Parse the nested JSON string in the tags_json field
          const tagsObject = JSON.parse(tagsField.value.value);
          
          // Convert each key-value pair in the tags object to a tag
          Object.entries(tagsObject).forEach(([key, value]) => {
            allTags.push({
              id: `${attestation.txid}-${key}`,
              name: `${key}: ${value}`,
              category: 'Contract Tag',
              createdAt: attestation.timeCreated,
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
            
            allTags.push({
              id: `${attestation.txid}-${field.name}`,
              name: `${field.name}: ${displayValue}`,
              category: 'Attestation Field',
              createdAt: attestation.timeCreated,
              rawValue: field.value.value
            });
          }
        });
      }
    } catch (e) {
      console.error('Error parsing attestation data:', e);
    }
  });
  
  return allTags;
};

const ExploreTab = () => {
  const [contractAddress, setContractAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [tags, setTags] = useState<any[]>([]);
  const [contractData, setContractData] = useState<{
    address: string, 
    tags: any[],
    attestationCount?: number,
    attester?: string
  } | null>(null);

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContractAddress(e.target.value);
    // Clear previous results when input changes
    if (contractData) {
      setContractData(null);
      setTags([]);
      setError('');
    }
  };

  const fetchContractTags = async () => {
    if (!contractAddress.trim()) {
      setError('Please enter a contract address');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      // Fetch attestations from the GraphQL API using the contract address as the recipient
      const attestations = await fetchAttestationsByContract(contractAddress);
      
      if (attestations.length === 0) {
        setError('No attestations found for this address as recipient');
        setContractData(null);
        setTags([]);
        setIsLoading(false);
        return;
      }
      
      // For debugging - log the first attestation's data
      if (attestations.length > 0) {
        console.log('First attestation decodedDataJson (sample):', 
          attestations[0].decodedDataJson.length > 100 
            ? attestations[0].decodedDataJson.substring(0, 100) + '...' 
            : attestations[0].decodedDataJson
        );
      }
      
      // Extract tags from attestations
      const extractedTags = parseTagsFromAttestations(attestations);
      
      // Get the attester from the first attestation (assuming all attestations have the same attester)
      const attester = attestations.length > 0 ? attestations[0].attester : undefined;
      
      setContractData({
        address: contractAddress,
        tags: extractedTags,
        // Store the raw attestation count for display
        attestationCount: attestations.length,
        // Store the attester
        attester
      });
      setTags(extractedTags);
    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching data');
      setContractData(null);
      setTags([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Group tags by category
  const groupedTags = tags.reduce<{[key: string]: any[]}>((acc, tag) => {
    const category = tag.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(tag);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-1 text-gray-900">Check a Contract</h2>
          <p className="text-sm text-gray-500">
            Enter a contract address to view all attestations where this address is the recipient
          </p>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter contract address (0x...)"
            value={contractAddress}
            onChange={handleAddressChange}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button 
            onClick={fetchContractTags}
            disabled={isLoading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
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

      {contractData && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-1 flex items-center">
              <span className="mr-2 text-gray-900">Contract</span>
              <code className="text-sm bg-gray-100 text-gray-500 px-2 py-1 rounded">
                {contractData.address}
              </code>
            </h2>
            <div className="flex justify-between text-sm text-gray-500 mb-4">
              <p>
                {contractData.attestationCount || 0} attestation{(contractData.attestationCount || 0) !== 1 ? 's' : ''} found
              </p>
              <p>
                {tags.length} extracted tag{tags.length !== 1 ? 's' : ''} 
              </p>
            </div>
            
            {/* Attester Information */}
            {contractData.attester && (
                <div className="flex items-center px-3 py-1 bg-gray-100 rounded-md border border-gray-200">
                  <span className="text-sm font-medium text-gray-500 mr-2">Attested by:</span>
                  <code className="text-sm font-mono text-gray-500">
                    {contractData.attester.substring(0, 6)}...
                    {contractData.attester.substring(contractData.attester.length - 4)}
                  </code>
                </div>
              )}
          </div>
          
          {tags.length > 0 ? (
            <div className="space-y-2">
              {Object.entries(groupedTags).map(([category, categoryTags]) => (
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
                          return (
                            <div 
                              key={tag.id}
                              className="inline-flex items-center px-3 py-1 rounded-md bg-indigo-50 border border-indigo-100"
                            >
                              <span className="text-xs font-medium text-gray-500 mr-2">{key}:</span>
                              <span className="text-sm text-indigo-700">{tag.rawValue}</span>
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
              ))}
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-100 rounded-md p-4 text-yellow-800">
              <p className="font-medium">Attestations found, but no tags could be extracted</p>
              <p className="text-sm mt-1">The attestation data may be in a format that couldn't be parsed as tags.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ExploreTab;