// src/types/orbitChain.ts

export interface OrbitChainAPI {
  id: string;
  title: string;
  entityType: 'OrbitChain';
  slug: string;
  categoryId: string;
  images: {
    logoUrl: string;
    bannerUrl: string;
  };
  description: string;
  isFeaturedOnOrbitPage: boolean;
  links: {
    website: string | null;
    discord: string | null;
    twitter: string | null;
    github: string | null;
    news: string | null;
    docs: string | null;
  };
  chain: {
    chainId: number | null;
    layer: number | null;
    token: string;
    tokenAddress: string | null;
    parentChain: string;
    deployerTeam: string | null;
    status: 'Mainnet' | 'Testnet' | 'In development';
    type: string | null;
    bridgeUrl: string | null;
    rpcUrl: string | null;
    blockExplorerUrl: string | null;
    gasFee: string;
  };
  color: {
    primary: string;
    secondary: string;
  };
  teamMembers: any[];
}

export interface OrbitChainResponse {
  meta: {
    timestamp: string;
  };
  content: OrbitChainAPI[];
}

export interface ProcessedOrbitChain {
  id: string;
  name: string;
  shortName: string;
  caip2: string;
  chainId: number;
  isOrbitChain: true;
  orbitMetadata: {
    parentChain: string;
    deployerTeam: string | null;
    status: string;
    layer: number | null;
    category: string;
  };
  colors: {
    light: [string, string];
    dark: [string, string];
    darkTextOnBackground: boolean;
  };
  logo: {
    body: string;
    width: number;
    height?: number;
  } | null;
  description: string;
  links?: {
    website?: string;
    twitter?: string;
    blockExplorer?: string;
    bridge?: string;
  };
}

