// constants/tagDescriptions.ts

export const TAG_DESCRIPTIONS = {
  chain: "The chain that the contract is deployed on.",
  contract_name: "This tag refers to the fundamental descriptor that provides a clear and immediate understanding of an address's purpose or role. It should offer a straightforward one-word detailed definition into the functionality of the address. For example, the Uniswap router contract would have the contract_name = 'router'.",
  is_eoa: "Is the account an Externally Owned Account (EOA)?",
  is_contract: "Is the address a contract?",
  is_factory_contract: "Is the address a factory contract? Does it have functions which are able to deploy another contract?",
  deployment_tx: "The transaction that deployed the contract.",
  deployer_address: "The address that deployed the contract.",
  owner_project: "The project that owns the contract or eoa. Link to project registry https://github.com/opensource-observer/oss-directory.",
  deployment_date: "The date the contract was deployed.",
  is_proxy: "Is the contract a proxy contract?",
  is_safe_contract: "Is the address a Safe or Multisig contract?",
  erc_type: "Array of all ERC standards the contract implements.",
  "erc20.name": "The name of the token assigned through the ERC20 standard.",
  "erc20.symbol": "The symbol of the token assigned through the ERC20 standard.",
  "erc20.decimals": "The number of decimals of the token assigned through the ERC20 standard.",
  "erc721.name": "The name of the collection assigned through the ERC721 standard.",
  "erc721.symbol": "The symbol of the collection assigned through the ERC721 standard.",
  "erc1155.name": "The name of the collection assigned through the ERC1155 standard.",
  "erc1155.symbol": "The symbol of the collection assigned through the ERC1155 standard.",
  usage_category: "The category of usage for the contract.",
  version: "The release version of the dApp (i.e. 2 for Uniswap v2 contracts).",
  audit: "Link to information on security audit or audit report.",
  contract_monitored: "Link to information on whether the contract is actively monitored by smart contract monitoring services.",
  source_code_verified: "Link to verified source code, e.g., through a source code verification service or block explorer."
} as const;