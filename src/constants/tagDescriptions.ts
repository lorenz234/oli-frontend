// constants/tagDescriptions.ts
export const TAG_DESCRIPTIONS = {
    chain: "The chain that the contract is deployed on.",
    contract_name: "This tag refers to the fundamental descriptor that provides a clear and immediate understanding of an address's purpose or role. It should offer a straightforward one-word detailed definition into the functionality of the address. For example, the Uniswap router contract would have the contract_name = 'router'.",
    is_eoa: "Is the account an Externally Owned Account (EOA)?",
    is_contract: "Is the address a contract?",
    is_factory_contract: "Is the address a factory contract? Does it have functions which are able to deploy another contract?",
    is_proxy: "Is the contract a proxy contract?",
    owner_project: "The project that owns the contract or eoa. Link to project registry https://github.com/opensource-observer/oss-directory.",
    usage_category: "The category of usage for the contract.",
  } as const;