// src/utils/attestationUtils.ts
import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { EAS_CONTRACT_ADDRESS, SCHEMA_DEFINITION } from '../constants/eas';
import { getWeb3Provider, getSigner } from '@dynamic-labs/ethers-v6';
import { encodeFunctionData } from 'viem';

export const prepareTags = (formData: Record<string, any>) => {
  const tagsObject: { [key: string]: any } = {};
  
  Object.entries(formData)
    .filter(([key, value]) => key !== 'chain_id' && key !== 'address' && 
      (value !== undefined && value !== '' && value !== null))
    .forEach(([key, value]) => {
      // Convert specific fields to integers
      if (key === 'erc20.decimals' || key === 'version') {
        tagsObject[key] = parseInt(value, 10);
      }
      // Format deployment_date to use space instead of T
      else if (key === 'deployment_date' && typeof value === 'string') {
        // Replace the 'T' with a space in the datetime format
        tagsObject[key] = value.replace('T', ' ');
      }
      // Ensure erc_type is always an array of strings or not included if empty
      else if (key === 'erc_type') {
        // If the value is a comma-separated string (which it should be now)
        if (typeof value === 'string' && value.trim() !== '') {
          const ercValues = value
            .split(',')
            .map(item => item.trim())
            .filter(item => item !== '');
            
          if (ercValues.length > 0) {
            tagsObject[key] = ercValues;
          }
        }
        // If it's somehow already an array, ensure all items are strings
        else if (Array.isArray(value)) {
          const validStrings = value
            .map(item => String(item))
            .filter(item => item !== null && item !== undefined && item !== '');
            
          if (validStrings.length > 0) {
            tagsObject[key] = validStrings;
          }
        }
        // If it's a single value and valid, convert to a string and put in an array
        else if (value !== null && value !== undefined && value !== '') {
          tagsObject[key] = [String(value)];
        }
        // If value is empty/null/undefined, don't add it to tagsObject at all
      }
      // Keep other fields as they are
      else {
        tagsObject[key] = value;
      }
    });
    
  return tagsObject;
};

export const prepareEncodedData = (chain_id: string, tagsObject: Record<string, any>) => {
  const schemaEncoder = new SchemaEncoder(SCHEMA_DEFINITION);
  
  return schemaEncoder.encodeData([
    { name: 'chain_id', value: chain_id, type: 'string' },
    { name: 'tags_json', value: JSON.stringify(tagsObject), type: 'string' }
  ]);
};

export const switchToBaseNetwork = async (primaryWallet: any) => {
  try {
    // For Dynamic wallets, switch to Base network (chain ID 8453)
    await primaryWallet.switchNetwork(8453);
  } catch (switchError: any) {
    console.error('Failed to switch to Base network:', switchError);
    throw new Error('Failed to switch to Base network. Please switch manually in your wallet.');
  }
};

export const initializeEAS = async (primaryWallet: any) => {
  // Use Dynamic's ethers integration to get provider and signer
  const provider = await getWeb3Provider(primaryWallet);
  const signer = await getSigner(primaryWallet);
  
  if (!provider || !signer) {
    throw new Error('Failed to get provider or signer from Dynamic wallet');
  }
  
  // Initialize EAS SDK
  const eas = new EAS(EAS_CONTRACT_ADDRESS, provider as unknown as any);
  eas.connect(signer);
  
  return { eas, signer, provider };
};

// Check if sponsored transactions are available (async to get real chain ID)
export const canUseSponsoredTransaction = async (primaryWallet: any): Promise<boolean> => {
  if (!primaryWallet) return false;
  
  try {
    const walletName = primaryWallet?.connector?.name;
    // More secure wallet detection - check for exact matches
    const isCoinbaseSmartWallet = (
      walletName === 'Coinbase' || 
      walletName === 'Coinbase Smart Wallet' ||
      walletName === 'coinbase_smart_wallet' ||
      walletName?.toLowerCase() === 'coinbase'
    ) || false;
    
    // Get actual chain ID from wallet client
    const walletClient = await primaryWallet.getWalletClient();
    const chainId = await walletClient.getChainId();
    const isOnBase = chainId === 8453; // Base chain ID
    
    // Debug logging (development only)
    if (process.env.NODE_ENV === 'development') {
      console.log('Sponsorship check:', {
        isCoinbaseSmartWallet,
        chainId,
        isOnBase,
        canSponsor: isCoinbaseSmartWallet && isOnBase
      });
    }
    
    return isCoinbaseSmartWallet && isOnBase;
  } catch (error) {
    // Log error in development, generic message in production
    if (process.env.NODE_ENV === 'development') {
      console.error('Failed to check sponsorship capabilities:', error);
    } else {
      console.error('Failed to check sponsorship capabilities');
    }
    return false;
  }
};

// Coinbase Paymaster configuration
const COINBASE_PAYMASTER_URL = process.env.NEXT_PUBLIC_COINBASE_PAYMASTER_URL || 'https://api.developer.coinbase.com/rpc/v1/base/hyKHUTPE7kd0VnvFqYsMiAUjvg1wshR3';

// Create sponsored attestation using Wagmi sendCalls
export const createSponsoredAttestation = async (
  primaryWallet: any, 
  attestationData: {
    schema: string;
    recipient: string;
    expirationTime: bigint;
    revocable: boolean;
    data: string;
  }
) => {
  if (!(await canUseSponsoredTransaction(primaryWallet))) {
    throw new Error('Sponsored transactions not available for this wallet/network');
  }

  // Get wallet client for sendCalls
  const walletClient = await primaryWallet.getWalletClient();
  
  // Encode the EAS attest function call
  const encodedData = encodeFunctionData({
    abi: [
      {
        name: 'attest',
        type: 'function',
        inputs: [
          {
            name: 'request',
            type: 'tuple',
            components: [
              { name: 'schema', type: 'bytes32' },
              { name: 'data', type: 'tuple', components: [
                { name: 'recipient', type: 'address' },
                { name: 'expirationTime', type: 'uint64' },
                { name: 'revocable', type: 'bool' },
                { name: 'refUID', type: 'bytes32' },
                { name: 'data', type: 'bytes' },
                { name: 'value', type: 'uint256' }
              ]}
            ]
          }
        ],
        outputs: [{ name: '', type: 'bytes32' }]
      }
    ],
    functionName: 'attest',
    args: [{
      schema: attestationData.schema,
      data: {
        recipient: attestationData.recipient,
        expirationTime: attestationData.expirationTime,
        revocable: attestationData.revocable,
        refUID: '0x0000000000000000000000000000000000000000000000000000000000000000',
        data: attestationData.data,
        value: BigInt(0)
      }
    }]
  });

  // Use sendCalls with paymaster capabilities
  try {
    const result = await walletClient.sendCalls({
      calls: [{
        to: EAS_CONTRACT_ADDRESS,
        data: encodedData,
        value: BigInt(0)
      }],
      capabilities: {
        paymasterService: {
          url: COINBASE_PAYMASTER_URL
        }
      }
    });
    
    return result;
  } catch (error) {
    // Log detailed error in development, generic in production
    if (process.env.NODE_ENV === 'development') {
      console.error('Sponsored transaction failed:', error);
      throw error;
    } else {
      console.error('Sponsored transaction failed');
      throw new Error('Transaction failed to process');
    }
  }
};

// Create sponsored bulk attestation using Wagmi sendCalls
export const createSponsoredBulkAttestation = async (
  primaryWallet: any, 
  attestationsData: Array<{
    recipient: string;
    expirationTime: bigint;
    revocable: boolean;
    data: string;
  }>,
  schemaUID: string
) => {
  if (!(await canUseSponsoredTransaction(primaryWallet))) {
    throw new Error('Sponsored transactions not available for this wallet/network');
  }

  // Get wallet client for sendCalls
  const walletClient = await primaryWallet.getWalletClient();
  
  // Encode the EAS multiAttest function call
  const encodedData = encodeFunctionData({
    abi: [
      {
        name: 'multiAttest',
        type: 'function',
        inputs: [
          {
            name: 'multiRequests',
            type: 'tuple[]',
            components: [
              { name: 'schema', type: 'bytes32' },
              { name: 'data', type: 'tuple[]', components: [
                { name: 'recipient', type: 'address' },
                { name: 'expirationTime', type: 'uint64' },
                { name: 'revocable', type: 'bool' },
                { name: 'refUID', type: 'bytes32' },
                { name: 'data', type: 'bytes' },
                { name: 'value', type: 'uint256' }
              ]}
            ]
          }
        ],
        outputs: [{ name: '', type: 'bytes32[]' }]
      }
    ],
    functionName: 'multiAttest',
    args: [[{
      schema: schemaUID,
      data: attestationsData.map(attestation => ({
        recipient: attestation.recipient,
        expirationTime: attestation.expirationTime,
        revocable: attestation.revocable,
        refUID: '0x0000000000000000000000000000000000000000000000000000000000000000',
        data: attestation.data,
        value: BigInt(0)
      }))
    }]]
  });

  // Use sendCalls with paymaster capabilities
  try {
    const result = await walletClient.sendCalls({
      calls: [{
        to: EAS_CONTRACT_ADDRESS,
        data: encodedData,
        value: BigInt(0)
      }],
      capabilities: {
        paymasterService: {
          url: COINBASE_PAYMASTER_URL
        }
      }
    });
    
    return result;
  } catch (error) {
    // Log detailed error in development, generic in production
    if (process.env.NODE_ENV === 'development') {
      console.error('Sponsored bulk transaction failed:', error);
      throw error;
    } else {
      console.error('Sponsored bulk transaction failed');
      throw new Error('Bulk transaction failed to process');
    }
  }
};