// src/constants/networks.ts

import ENSRegistry from './contracts/ENSRegistry';
import PublicResolver from './contracts/PublicResolver';
import ReverseRegistrar from './contracts/ReverseRegistrar';

export interface NetworkConfig {
  name: string;
  rpcUrl: string;
  subgraphApi?: string;
  contracts: {
    ensRegistry: `0x${string}`;
    reverseRegistrar: `0x${string}`;
    publicResolver: `0x${string}`;
  };
  abis: {
    reverseRegistrar: any;
    ensRegistry: any;
    publicResolver: any;
  };
}

export const NETWORKS: Record<number, NetworkConfig> = {
  1: { // Ethereum
    name: 'Ethereum',
    rpcUrl: 'https://rpc.mevblocker.io/fast',
    subgraphApi: 'https://api.thegraph.com/subgraphs/name/ensdomains/ens',
    contracts: {
      ensRegistry: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
      reverseRegistrar: '0xa58E81fe9b61B5c3fE2AFD33CF304c454AbFc7Cb',
      publicResolver: '0x231b0Ee14048e9dCcD1d247744d114a4EB5E8E63',
    },
    abis: {
      reverseRegistrar: ReverseRegistrar,
      ensRegistry: ENSRegistry,
      publicResolver: PublicResolver,
    }
  },
  59144: { // Linea
    name: 'Linea',
    rpcUrl: 'https://linea.drpc.org',
    subgraphApi: 'https://gateway.thegraph.com/api/subgraphs/id/G5YH6BWrybbfua5sngRQ7Ku1LRCVx4qf5zjkqWG9FSuV',
    contracts: {
      ensRegistry: '0x50130b669B28C339991d8676FA73CF122a121267',
      reverseRegistrar: '0x08D3fF6E65f680844fd2465393ff6f0d742b67D5',
      publicResolver: '0x86c5AED9F27837074612288610fB98ccC1733126',
    },
    abis: {
      reverseRegistrar: ReverseRegistrar,
      ensRegistry: ENSRegistry,
      publicResolver: PublicResolver,
    }
  },
  8453: { // Base
    name: 'Base',
    rpcUrl: 'https://base.llamarpc.com',
    subgraphApi: 'https://api.alpha.blue.ensnode.io/subgraph',
    contracts: {
      ensRegistry: '0xB94704422c2a1E396835A571837Aa5AE53285a95',
      reverseRegistrar: '0x79EA96012eEa67A83431F1701B3dFf7e37F9E282',
      publicResolver: '0xC6d566A56A1aFf6508b41f6c90ff131615583BCD',
    },
    abis: {
      reverseRegistrar: ReverseRegistrar,
      ensRegistry: ENSRegistry,
      publicResolver: PublicResolver,
    }
  },
};
