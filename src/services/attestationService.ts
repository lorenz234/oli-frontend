// services/attestationService.ts
import { gql } from '@apollo/client';
import client from '@/lib/apollo-client';

// Define the GraphQL query
export const GET_ATTESTATIONS = gql`
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

// TypeScript interface for the query variables
export interface AttestationsQueryVariables {
  where?: {
    schemaId?: {
      equals?: string;
    };
    attester?: {
      equals?: string;
    };
    recipient?: {
      equals?: string;
    };
    data?: {
      contains?: string;
    };
  };
  take?: number;
  orderBy?: Array<{
    timeCreated?: 'asc' | 'desc';
  }>;
}

// TypeScript interface for the query results
export interface Attestation {
  attester: string;
  decodedDataJson: string;
  timeCreated: string;
  txid: string;
  revoked: boolean;
  revocationTime: string | null;
  isOffchain: boolean;
}

export interface AttestationsQueryResult {
  attestations: Attestation[];
}

// Function to fetch attestations based on contract address
export async function fetchAttestationsByContract(contractAddress: string, cacheBreaker?: { timestamp: number }, limit: number = 50): Promise<Attestation[]> {
  try {
    const variables: AttestationsQueryVariables = {
      where: {
        // Required schema ID from your example
        schemaId: {
          equals: "0xb763e62d940bed6f527dd82418e146a904e62a297b8fa765c9b3e1f0bc6fdd68"
        },
        // Using the contract address as recipient
        recipient: {
          equals: contractAddress
        }
      },
      take: limit,
      orderBy: [{ timeCreated: 'desc' }]
    };

    const { data } = await client.query<AttestationsQueryResult>({
      query: GET_ATTESTATIONS,
      variables,
      fetchPolicy: cacheBreaker ? 'network-only' : 'cache-first'
    });

    return data.attestations;
  } catch (error) {
    console.error('Error fetching attestations:', error);
    throw error;
  }
}

// Function to search attestations with multiple filters
export async function searchAttestations(options: {
  contractAddress?: string;
  recipient?: string;
  dataContains?: string;
  limit?: number;
  cacheBreaker?: { timestamp: number };
}): Promise<Attestation[]> {
  const { contractAddress, recipient, dataContains, limit = 50, cacheBreaker } = options;
  
  try {
    // Always include the required schema ID
    const where: AttestationsQueryVariables['where'] = {
      schemaId: { 
        equals: "0xb763e62d940bed6f527dd82418e146a904e62a297b8fa765c9b3e1f0bc6fdd68" 
      }
    };
    
    if (contractAddress) {
      where.attester = { equals: contractAddress };
    }
    
    if (recipient) {
      where.recipient = { equals: recipient };
    }
    
    if (dataContains) {
      where.data = { contains: dataContains };
    }
    
    const variables: AttestationsQueryVariables = {
      where,
      take: limit,
      orderBy: [{ timeCreated: 'desc' }]
    };

    const { data } = await client.query<AttestationsQueryResult>({
      query: GET_ATTESTATIONS,
      variables,
      fetchPolicy: cacheBreaker ? 'network-only' : 'cache-first'
    });

    return data.attestations;
  } catch (error) {
    console.error('Error searching attestations:', error);
    throw error;
  }
}