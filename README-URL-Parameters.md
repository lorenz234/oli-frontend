# OLI URL Parameters Documentation

## Attestation Form URL Parameters

The Open Labels Initiative (OLI) attestation form supports parametrized URLs that allow external websites to deep-link to the form with prefilled chain and address values.

### Base URL

```
https://www.openlabelsinitiative.org/attest
```

### Supported Parameters

### Address Parameters
- `address`: The blockchain address or smart contract address to attest
- `contract`: Alternative parameter name for the address (same functionality)

### Chain Parameters  
- `chain`: The blockchain network (supports multiple formats - see below)
- `chainId`: Alternative parameter name for the chain (same functionality)

## Supported Chain Formats

The form accepts chain information in multiple formats for maximum compatibility:

### 1. Numeric Chain IDs
Standard EVM chain IDs:
- `1` - Ethereum Mainnet
- `8453` - Base
- `42161` - Arbitrum One
- `10` - OP Mainnet
- `137` - Polygon
- `59144` - Linea
- `534352` - Scroll
- `324` - ZKsync Era
- `5000` - Mantle
- `34443` - Mode Network
- `167000` - Taiko Alethia
- `1923` - Swellchain
- `7777777` - Zora

### 2. Chain Names
Full network names (case-insensitive):
- `ethereum` - Ethereum Mainnet
- `base` - Base
- `arbitrum` or `arbitrum one` - Arbitrum One
- `optimism` or `op mainnet` - OP Mainnet
- `polygon` - Polygon
- `linea` - Linea
- `scroll` - Scroll
- `zksync` or `zksync era` - ZKsync Era
- `mantle` - Mantle
- `mode` or `mode network` - Mode Network
- `taiko` or `taiko alethia` - Taiko Alethia
- `swellchain` or `swell` - Swellchain
- `zora` - Zora

### 3. Short Names/Aliases
Common abbreviations:
- `eth` or `mainnet` - Ethereum Mainnet

### 4. CAIP-2 Format
For advanced users:
- `eip155:1` - Ethereum Mainnet
- `eip155:8453` - Base
- etc.

## Example URLs

### Using address and chain name
```
https://www.openlabelsinitiative.org/attest?address=0x1234567890123456789012345678901234567890&chain=ethereum
```

### Using contract parameter and numeric chain ID
```
https://www.openlabelsinitiative.org/attest?contract=0xA0b86a33E6441d1C9FC61e93eAef24fE7b88B24e&chainId=8453
```

### Using various chain formats
```
# Base network using chain name
https://www.openlabelsinitiative.org/attest?address=0x1234567890123456789012345678901234567890&chain=base

# Base network using chain ID
https://www.openlabelsinitiative.org/attest?address=0x1234567890123456789012345678901234567890&chain=8453

# Arbitrum using full name
https://www.openlabelsinitiative.org/attest?address=0x1234567890123456789012345678901234567890&chain=arbitrum%20one
```

### Hash-based routing (optional)
You can also include hash fragments to ensure the form section is visible:
```
https://www.openlabelsinitiative.org/attest?address=0x1234567890123456789012345678901234567890&chain=base#single-attestation
```

## Behavior

When parameters are provided:
1. The form automatically scrolls to the single attestation section
2. The chain dropdown is prefilled and locked (non-editable) when a valid chain is provided
3. The address field is prefilled with the provided address
4. Users can still fill in additional optional fields like contract name, owner project, etc.
5. All standard form validation applies

## Integration Examples

### JavaScript
```javascript
// Generate a URL for a specific contract
const generateAttestationURL = (address, chain) => {
  const baseURL = 'https://www.openlabelsinitiative.org/attest';
  const params = new URLSearchParams({
    address: address,
    chain: chain
  });
  return `${baseURL}?${params.toString()}`;
};

// Examples
const url1 = generateAttestationURL('0x1234567890123456789012345678901234567890', 'base');
const url2 = generateAttestationURL('0xA0b86a33E6441d1C9FC61e93eAef24fE7b88B24e', '8453');
```

### HTML
```html
<!-- Direct link -->
<a href="https://www.openlabelsinitiative.org/attest?address=0x1234567890123456789012345678901234567890&chain=base">
  Attest this contract on OLI
</a>

<!-- Button -->
<button onclick="window.open('https://www.openlabelsinitiative.org/attest?address=0x1234567890123456789012345678901234567890&chain=ethereum', '_blank')">
  Create Attestation
</button>
```

### React
```jsx
const AttestationLink = ({ address, chain, children }) => {
  const url = `https://www.openlabelsinitiative.org/attest?address=${encodeURIComponent(address)}&chain=${encodeURIComponent(chain)}`;
  
  return (
    <a href={url} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
};

// Usage
<AttestationLink address="0x1234567890123456789012345678901234567890" chain="base">
  Attest on OLI
</AttestationLink>
```

## Error Handling

- If an invalid chain parameter is provided, a warning is logged to the console and the chain field remains empty
- If an invalid address format is provided, the standard form validation will show an error when the user attempts to submit
- If no parameters are provided, the form behaves normally with empty fields

## Notes

- All parameters are case-insensitive for chain names
- Addresses should be valid Ethereum-style addresses (0x prefixed, 40 hex characters)
- URL encoding is recommended for special characters
- The form supports all existing functionality even when prefilled via URL parameters 

## Search Page URL Parameters

### Base URL

```
https://www.openlabelsinitiative.org/search
```

### Supported Parameters

#### Address Parameters
- `address`: The blockchain address or smart contract address to search for
- `contract`: Alternative parameter name for the address (same functionality)

#### Chain Parameters  
- `chain`: The blockchain network (supports same formats as attestation form)
- `chainId`: Alternative parameter name for the chain (same functionality)

### Example URLs

#### Basic address search
```
https://www.openlabelsinitiative.org/search?address=0x1234567890123456789012345678901234567890
```

#### Search with specific chain
```
https://www.openlabelsinitiative.org/search?address=0x1234567890123456789012345678901234567890&chain=base
```

#### Using chain ID
```
https://www.openlabelsinitiative.org/search?address=0x1234567890123456789012345678901234567890&chainId=8453
```

### Integration Examples

#### JavaScript
```javascript
// Generate a URL for searching a specific address
const generateSearchURL = (address, chain = '') => {
  const baseURL = 'https://www.openlabelsinitiative.org/search';
  const params = new URLSearchParams({ address });
  if (chain) params.append('chain', chain);
  return `${baseURL}?${params.toString()}`;
};

// Examples
const url1 = generateSearchURL('0x1234567890123456789012345678901234567890');
const url2 = generateSearchURL('0x1234567890123456789012345678901234567890', 'base');
```

#### React
```jsx
const SearchLink = ({ address, chain, children }) => {
  const params = new URLSearchParams({ address });
  if (chain) params.append('chain', chain);
  const url = `https://www.openlabelsinitiative.org/search?${params.toString()}`;
  
  return (
    <a href={url} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
};

// Usage
<SearchLink address="0x1234567890123456789012345678901234567890" chain="base">
  Search on OLI
</SearchLink>
```

### Behavior

When parameters are provided:
1. The search is automatically executed for the provided address
2. If a chain is specified, results are filtered to show attestations on that chain
3. The address field is prefilled with the provided address
4. Users can modify the search parameters and execute new searches
5. All standard validation applies to the address format

### Error Handling

- If an invalid chain parameter is provided, all chains will be shown in the results
- If an invalid address format is provided, the search will show appropriate validation errors
- If no parameters are provided, the search page loads with empty fields ready for user input 