type Category = {
    category_id: string;
    name: string;
    description: string;
  };
  type MainCategory = {
    main_category_name: string;
    categories: Category[];
  };

export const CATEGORIES: MainCategory[] = [
  {
    main_category_name: 'CeFi',
    categories: [
      { category_id: 'mev', name: 'MEV', description: 'MEV and arbitrage bots' },
      { category_id: 'trading', name: 'Trading', description: 'Contracts whose primary objective is to trade tokens or NFTs based on arbitrage, MEV (Miner Extractable Value) or market-making strategies.' },
      { category_id: 'cex', name: 'Centralized Exchange', description: 'Contracts or wallets under the control of centralized exchanges.' }
    ]
  },
  {
    main_category_name: 'DeFi',
    categories: [
      { category_id: 'dex', name: 'Decentralized Exchange', description: 'Contracts whose primary focus is on routing token swaps through liquidity pools (LPs).' },
      { category_id: 'lending', name: 'Lending', description: 'Contracts that enable lending with the use of collateral.' },
      { category_id: 'derivative', name: 'Derivative Exchange', description: 'Contracts that facilitate the trading of derivatives.' },
      { category_id: 'staking', name: 'Staking', description: 'Contracts where the primary activity is staking tokens or LP positions.' },
      { category_id: 'index', name: 'Index', description: 'Crypto indexes that represent market performance.' },
      { category_id: 'rwa', name: 'Real World Assets', description: 'Contracts for tangible asset management.' },
      { category_id: 'insurance', name: 'Insurance', description: 'Contracts that provide risk management and insurance coverage.' },
      { category_id: 'custody', name: 'Custody', description: 'Services for secure storage and management of digital assets.' },
      { category_id: 'yield_vaults', name: 'Yield Vaults', description: 'Protocols that specialize in building vaults that maximize yields.' }
    ]
  },
  {
    main_category_name: 'NFT',
    categories: [
      { category_id: 'nft_fi', name: 'NFT Finance', description: 'Contracts that involve the financialization of NFTs.' },
      { category_id: 'nft_marketplace', name: 'NFT Marketplace', description: 'Platform contracts for the sale or minting of NFTs.' },
      { category_id: 'non_fungible_tokens', name: 'Non-Fungible Tokens', description: 'Contracts that mostly adhere to the ERC721 or ERC1155 token standard.' }
    ]
  },
  {
    main_category_name: 'Social',
    categories: [
      { category_id: 'community', name: 'Community', description: 'Contracts for social interactions and education.' },
      { category_id: 'gambling', name: 'Gambling', description: 'Contracts that govern games of chance.' },
      { category_id: 'gaming', name: 'Gaming', description: 'Contracts integrated into digital games.' },
      { category_id: 'governance', name: 'Governance', description: 'Platforms for managing voting and treasury.' }
    ]
  },
  {
    main_category_name: 'Token Transfers',
    categories: [
      { category_id: 'native_transfer', name: 'Native Transfer', description: 'All native token transfers.' },
      { category_id: 'stablecoin', name: 'Stablecoin', description: 'ERC20 token contracts pegged to fiat.' },
      { category_id: 'fungible_tokens', name: 'Fungible Tokens', description: 'Standard ERC20 token contracts.' }
    ]
  },
  {
    main_category_name: 'Utility',
    categories: [
      { category_id: 'middleware', name: 'Middleware', description: 'Contracts for protocol interoperability.' },
      { category_id: 'erc4337', name: 'Account Abstraction (ERC4337)', description: 'Contracts for account abstraction.' },
      { category_id: 'inscriptions', name: 'Inscriptions', description: 'Contracts for inscribing calldata.' },
      { category_id: 'oracle', name: 'Oracle', description: 'Contracts that feed external data.' },
      { category_id: 'depin', name: 'Decentralized Physical Infrastructure', description: 'Infrastructure for decentralized operations.' },
      { category_id: 'developer_tools', name: 'Developer Tool', description: 'Contracts for development support.' },
      { category_id: 'identity', name: 'Identity', description: 'Contracts for digital identification.' },
      { category_id: 'privacy', name: 'Privacy', description: 'Contracts for enhanced privacy.' },
      { category_id: 'airdrop', name: 'Airdrop', description: 'Contracts for token distribution.' },
      { category_id: 'payments', name: 'Payments', description: 'Contracts for transactions and payments.' },
      { category_id: 'donation', name: 'Donation', description: 'Contracts for fundraising.' },
      { category_id: 'cybercrime', name: 'Cybercrime', description: 'Malicious contracts and exploits.' },
      { category_id: 'contract_deplyoment', name: 'Contract Deployments', description: 'Contracts for deployments.' },
      { category_id: 'other', name: 'Others', description: 'Miscellaneous utility contracts.' }
    ]
  },
  {
    main_category_name: 'Cross-Chain',
    categories: [
      { category_id: 'cc_communication', name: 'Cross-Chain Communication', description: 'Contracts for cross-chain data exchange.' },
      { category_id: 'bridge', name: 'Bridge', description: 'Contracts for cross-chain transfers.' },
      { category_id: 'settlement', name: 'Settlement & DA', description: 'Contracts for L2/L3 operations.' }
    ]
  }
];

// Get all valid category IDs
export const VALID_CATEGORY_IDS = CATEGORIES.flatMap(mainCategory => 
  mainCategory.categories.map(category => category.category_id)
);

// Create a mapping of category IDs to their display info
export const CATEGORY_MAP: { [key: string]: { name: string; description: string; mainCategory: string } } = {};
CATEGORIES.forEach(mainCategory => {
  mainCategory.categories.forEach(category => {
    CATEGORY_MAP[category.category_id] = {
      name: category.name,
      description: category.description,
      mainCategory: mainCategory.main_category_name
    };
  });
});