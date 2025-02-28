// src/constants/chains.ts
export type Chain = 'ethereum' | 'base' | 'optimism' | 'arbitrum';

export const CHAINS = [
  { id: 'ethereum', name: 'Ethereum', caip2: 'eip155:1' },
  { id: 'base', name: 'Base', caip2: 'eip155:8453' },
  { id: 'optimism', name: 'OP Mainnet', caip2: 'eip155:10' },
  { id: 'arbitrum', name: 'Arbitrum One', caip2: 'eip155:42161' },
];

export const CHAIN_OPTIONS = CHAINS.map(chain => ({
  value: chain.caip2,
  label: chain.name
}));