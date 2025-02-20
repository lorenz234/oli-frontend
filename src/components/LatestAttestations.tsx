'use client';

import React, { useState, useEffect } from 'react';
import { gql } from '@apollo/client';
import client from '@/lib/apollo-client';

const LATEST_ATTESTATIONS_QUERY = gql`
  query Attestations($where: AttestationWhereInput, $take: Int, $orderBy: [AttestationOrderByWithRelationInput!]) {
    attestations(where: $where, take: $take, orderBy: $orderBy) {
      attester
      decodedDataJson
      timeCreated
      txid
      revoked
      revocationTime
      isOffchain
    }
  }
`;

// Helper function to format timestamp
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
const extractChainId = (attestation: any): string | undefined => {
  try {
    const fields = JSON.parse(attestation.decodedDataJson);
    const chainIdField = fields.find((field: any) => field.name === 'chain_id');
    if (chainIdField?.value?.value) {
      return chainIdField.value.value;
    }
    return undefined;
  } catch (e) {
    return undefined;
  }
};

// Helper function to parse tags from attestation
const parseTagsFromAttestation = (attestation: any) => {
  try {
    const fields = JSON.parse(attestation.decodedDataJson);
    const tagsField = fields.find((field: any) => field.name === 'tags_json');
    if (tagsField?.value?.value) {
      return JSON.parse(tagsField.value.value);
    }
    return null;
  } catch (e) {
    return null;
  }
};

const LatestAttestations: React.FC = () => {
  const [attestations, setAttestations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLatestAttestations = async () => {
      try {
        const { data } = await client.query({
          query: LATEST_ATTESTATIONS_QUERY,
          variables: {
            where: {
              schemaId: {
                equals: "0xb763e62d940bed6f527dd82418e146a904e62a297b8fa765c9b3e1f0bc6fdd68"
              }
            },
            take: 10,
            orderBy: [
              {
                timeCreated: "desc"
              }
            ]
          }
        });

        setAttestations(data.attestations);
      } catch (err) {
        console.error('Error fetching attestations:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch attestations');
      } finally {
        setLoading(false);
      }
    };

    fetchLatestAttestations();
  }, []);

  if (loading) return <div className="text-center py-4">Loading latest attestations...</div>;
  if (error) return <div className="text-red-500 text-center py-4">Error: {error}</div>;

  return (
    <div className="mt-12 max-w-4xl mx-auto p-8 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.05)]">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Latest Attestations</h2>
      
      <div className="space-y-4">
        {attestations.map((attestation, index) => {
          const tags = parseTagsFromAttestation(attestation);
          const chainId = extractChainId(attestation);
          
          return (
            <div 
              key={`${attestation.timeCreated}-${index}`}
              className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors duration-200"
              onClick={() => window.open(`https://base.easscan.org/attestation/by_tx/${attestation.txid}`, '_blank')}
              style={{ cursor: 'pointer' }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="flex items-center px-3 py-1 bg-gray-100 rounded-md border border-gray-200">
                    <span className="text-sm font-medium text-gray-500 mr-2">Attester:</span>
                    <code className="text-sm font-mono text-gray-500">
                      {attestation.attester.substring(0, 6)}...
                      {attestation.attester.substring(attestation.attester.length - 4)}
                    </code>
                  </div>
                  
                  {chainId && (
                    <span className="px-2 py-0.5 text-xs font-medium bg-blue-50 text-blue-600 rounded-full">
                      chain_id: {chainId}
                    </span>
                  )}
                  
                  {attestation.isOffchain && (
                    <span className="px-2 py-0.5 text-xs font-medium bg-purple-50 text-purple-600 rounded-full">
                      Offchain
                    </span>
                  )}
                </div>
                
                <div className="text-sm text-gray-500">
                  {formatTimestamp(Number(attestation.timeCreated))}
                </div>
              </div>

              {tags && (
                <div className="flex flex-wrap gap-2">
                  {Object.entries(tags).map(([key, value]) => (
                    <div 
                      key={key}
                      className="inline-flex items-center px-3 py-1 rounded-md bg-indigo-50 border border-indigo-100"
                    >
                      <span className="text-xs font-medium text-gray-500 mr-2">{key}:</span>
                      <span className="text-sm text-indigo-700">
                        {typeof value === 'boolean' ? String(value) : value}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LatestAttestations;