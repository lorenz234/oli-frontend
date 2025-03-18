// src/constants/chains.ts

export const CHAINS = [
  { id: 'arbitrum', name: 'Arbitrum One', caip2: 'eip155:42161' },
  { id: 'base', name: 'Base', caip2: 'eip155:8453' },
  { id: 'ethereum', name: 'Ethereum', caip2: 'eip155:1' },
  { id: 'linea', name: 'Linea', caip2: 'eip155:59144' },
  { id: 'mantle', name: 'Mantle', caip2: 'eip155:5000' },
  { id: 'mode', name: 'Mode Network', caip2: 'eip155:34443' }, 
  { id: 'optimism', name: 'OP Mainnet', caip2: 'eip155:10' },
  { id: 'scroll', name: 'Scroll', caip2: 'eip155:534352' },
  { id: 'swell', name: 'Swellchain', caip2: 'eip155:1923' },
  { id: 'taiko', name: 'Taiko', caip2: 'eip155:167000' },
  { id: 'zksync_era', name: 'ZKsync Era', caip2: 'eip155:324' },
  { id: 'zora', name: 'Zora', caip2: 'eip155:7777777' },
];

export type Chain = 
  | 'arbitrum' 
  | 'base' 
  | 'ethereum' 
  | 'linea' 
  | 'mantle' 
  | 'mode' 
  | 'optimism' 
  | 'scroll' 
  | 'swell' 
  | 'taiko' 
  | 'zksync_era' 
  | 'zora';

export const CHAIN_OPTIONS = CHAINS.map(chain => ({
  value: chain.caip2,
  label: chain.name
}));
