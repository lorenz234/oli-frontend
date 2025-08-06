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

export const resolveEnsName = async (address: string, chainName: string): Promise<string | null> => {
  const chainId = getChainIdFromChainName(chainName);
  if (!chainId) return null;

  const network = NETWORKS[chainId];
  if (!network) return null;

  const provider = new ethers.JsonRpcProvider(network.rpcUrl);

  try {
    // 1. Standard reverse lookup (primary name)
    const primaryName = await provider.lookupAddress(address);
    if (primaryName) {
      return primaryName;
    }

    // 2. L2-specific reverse lookup via contracts
    if (chainId === 59144 || chainId === 8453) {
      try {
        const reverseRegistrar = new ethers.Contract(network.contracts.reverseRegistrar, network.abis.reverseRegistrar, provider);
        const node = await reverseRegistrar.node(address);

        if (node === '0x0000000000000000000000000000000000000000000000000000000000000000') {
          return null;
        }

        const publicResolver = new ethers.Contract(network.contracts.publicResolver, network.abis.publicResolver, provider);
        const name = await publicResolver.name(node);

        if (name) {
          return name;
        }
      } catch (error) {
        console.error(`L2 ENS lookup failed for ${address} on chain ${chainId}:`, error);
      }
    }

    // 3. Fallback to The Graph for forward resolution on Ethereum
    if (network.subgraphApi) {
      try {
        const query = `
          query getDomains($address: String!) {
            domains(first: 1, where: { resolvedAddress: $address }) {
              name
            }
          }
        `;
        const response = await fetch(network.subgraphApi, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query,
            variables: { address: address.toLowerCase() },
          }),
        });

        if (!response.ok) {
          throw new Error(`Subgraph API request failed with status ${response.status}`);
        }

        const data = await response.json();
        if (data.data.domains && data.data.domains.length > 0) {
          return data.data.domains[0].name;
        }
      } catch (error) {
        console.error(`Failed to fetch from subgraph API for ${network.name}:`, error);
      }
    }

    return null;
  } catch (error) {
    console.error(`Error resolving ENS name for ${address} on chain ${chainId}:`, error);
    return null;
  }
};

export const getEnscribeUrl = (address: string, chain: string, ensName?: string | null): string => {
  const chainId = getChainIdFromChainName(chain.toLowerCase());
  
  // Default to Ethereum if chain is not found, or handle as an error
  const enscribeChainId = chainId === 59144 ? '59144' : chainId === 8453 ? '8453' : '1';

  if (ensName) {
    return `https://app.enscribe.xyz/explore/${enscribeChainId}/${address}`;
  }
  return `https://app.enscribe.xyz/nameContract?address=${address}&chain=${enscribeChainId}`;
};
