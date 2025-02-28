// src/constants/chains.ts

export const CHAINS = [
  { id: 'ethereum', name: 'Ethereum', caip2: 'eip155:1' },
  { id: 'base', name: 'Base', caip2: 'eip155:8453' },
  { id: 'optimism', name: 'OP Mainnet', caip2: 'eip155:10' },
  { id: 'arbitrum', name: 'Arbitrum One', caip2: 'eip155:42161' },
  { id: 'linea', name: 'Linea', caip2: 'eip155:59144' },
  { id: 'mode', name: 'Mode Network', caip2: 'eip155:34443' }, 
];

export type Chain = 'ethereum' | 'base' | 'optimism' | 'arbitrum' | 'linea' | 'mode';

export const CHAIN_OPTIONS = CHAINS.map(chain => ({
  value: chain.caip2,
  label: chain.name
}));