// src/utils/ens.ts
import { ethers } from 'ethers';
import { NETWORKS } from '@/constants/networks';


const getChainIdFromChainName = (chainName: string): number | undefined => {
  const name = chainName.toLowerCase();
  if (name.includes('ethereum')) return 1;
  if (name.includes('linea')) return 59144;
  if (name.includes('base')) return 8453;
  return undefined;
};

export interface EnsResolution {
  name: string;
  method: 'primary' | 'l2' | 'subgraph';
}

export interface EnsState {
  resolution: EnsResolution | null;
  loading: boolean;
  error: string | null;
}

const ENS_CACHE = new Map<string, { resolution: EnsResolution | null; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const timeoutPromise = <T>(promise: Promise<T>, timeout: number): Promise<T> => {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error('Request timeout'));
    }, timeout);

    promise
      .then(resolve)
      .catch(reject)
      .finally(() => clearTimeout(timer));
  });
};

export const resolveEnsName = async (address: string, chainName: string): Promise<EnsResolution | null> => {
  const cacheKey = `${address.toLowerCase()}-${chainName.toLowerCase()}`;
  
  // Check cache first
  const cached = ENS_CACHE.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.resolution;
  }

  const chainId = getChainIdFromChainName(chainName);
  if (!chainId) return null;

  const network = NETWORKS[chainId];
  if (!network) return null;

  const provider = new ethers.JsonRpcProvider(network.rpcUrl);

  try {
    // 1. Standard reverse lookup (primary name) - Fast, timeout in 3s
    try {
      const primaryName = await timeoutPromise(provider.lookupAddress(address), 3000);
      if (primaryName) {
        const result = { name: primaryName, method: 'primary' as const };
        ENS_CACHE.set(cacheKey, { resolution: result, timestamp: Date.now() });
        return result;
      }
    } catch (error) {
      console.debug(`Primary ENS lookup timeout/failed for ${address}:`, error);
    }

    // 2. L2-specific reverse lookup via contracts - Medium timeout 4s
    if ((chainId === 59144 || chainId === 8453) && network.contracts?.reverseRegistrar && network.abis?.reverseRegistrar) {
      try {
        const reverseRegistrar = new ethers.Contract(network.contracts.reverseRegistrar, network.abis.reverseRegistrar, provider);
        const node = await timeoutPromise(reverseRegistrar.node(address), 4000);

        if (node !== '0x0000000000000000000000000000000000000000000000000000000000000000') {
          const publicResolver = new ethers.Contract(network.contracts.publicResolver, network.abis.publicResolver, provider);
          const name = await timeoutPromise(publicResolver.name(node), 4000);

          if (name) {
            const result = { name, method: 'l2' as const };
            ENS_CACHE.set(cacheKey, { resolution: result, timestamp: Date.now() });
            return result;
          }
        }
      } catch (error) {
        console.debug(`L2 ENS lookup timeout/failed for ${address} on chain ${chainId}:`, error);
      }
    }

    // 3. Fallback to The Graph for forward resolution - Longer timeout 6s
    if (network.subgraphApi) {
      try {
        const query = `
          query getDomains($address: String!) {
            domains(first: 1, where: { resolvedAddress: $address }) {
              name
            }
          }
        `;
        const response = await timeoutPromise(
          fetch(network.subgraphApi, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              query,
              variables: { address: address.toLowerCase() },
            }),
          }),
          6000
        );

        if (!response.ok) {
          throw new Error(`Subgraph API request failed with status ${response.status}`);
        }

        const data = await response.json();
        if (data.data.domains && data.data.domains.length > 0) {
          const result = { name: data.data.domains[0].name, method: 'subgraph' as const };
          ENS_CACHE.set(cacheKey, { resolution: result, timestamp: Date.now() });
          return result;
        }
      } catch (error) {
        console.debug(`Subgraph ENS lookup timeout/failed for ${network.name}:`, error);
      }
    }

    // Cache null result to avoid repeated lookups
    ENS_CACHE.set(cacheKey, { resolution: null, timestamp: Date.now() });
    return null;
  } catch (error) {
    console.error(`Error resolving ENS name for ${address} on chain ${chainId}:`, error);
    // Cache null result for shorter duration on errors
    ENS_CACHE.set(cacheKey, { resolution: null, timestamp: Date.now() - CACHE_DURATION + 60000 }); // Cache for 1 minute on error
    return null;
  }
};

export const getEnscribeUrl = (address: string, chain: string, ensName?: string | null, method?: 'primary' | 'l2' | 'subgraph'): string => {
  const chainId = getChainIdFromChainName(chain.toLowerCase());
  
  // Default to Ethereum if chain is not found, or handle as an error
  const enscribeChainId = chainId === 59144 ? '59144' : chainId === 8453 ? '8453' : '1';

  if (ensName && method === 'subgraph') {
    return `https://app.enscribe.xyz/explore/${enscribeChainId}/${address}`; 
  }
  if (ensName) {
    return `https://app.enscribe.xyz/explore/${enscribeChainId}/${address}`;
  }
  return `https://app.enscribe.xyz/nameContract?address=${address}&chain=${enscribeChainId}`;
};
