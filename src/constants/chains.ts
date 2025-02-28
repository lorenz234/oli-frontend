// src/constants/chains.ts

export const CHAINS = [
  { id: 'ethereum', name: 'Ethereum', caip2: 'eip155:1' },
  { id: 'base', name: 'Base', caip2: 'eip155:8453' },
  { id: 'optimism', name: 'OP Mainnet', caip2: 'eip155:10' },
  { id: 'arbitrum', name: 'Arbitrum One', caip2: 'eip155:42161' },
  { id: 'linea', name: 'Linea', caip2: 'eip155:59144' },
  { id: 'mode', name: 'Mode Network', caip2: 'eip155:34443' }, 
  { id: 'mantle', name: 'Mantle', caip2: 'eip155:5000' },
  { id: 'scroll', name: 'Scroll', caip2: 'eip155:534352' },
  { id: 'taiko', name: 'Taiko', caip2: 'eip155:167000' },
  { id: 'zksync_era', name: 'ZKsync Era', caip2: 'eip155:324' },
  { id: 'zora', name: 'Zora', caip2: 'eip155:7777777' },
];

export type Chain = 'ethereum' | 'base' | 'optimism' | 'arbitrum' | 'linea' | 'mode' | 'mantle' | 'scroll' | 'taiko' | 'zksync_era' | 'zora';

export const CHAIN_OPTIONS = CHAINS.map(chain => ({
  value: chain.caip2,
  label: chain.name
}));