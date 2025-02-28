// src/utils/attestationUtils.ts
import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { ethers } from 'ethers';
import { EAS_CONTRACT_ADDRESS, SCHEMA_DEFINITION } from '../constants/eas';

export const prepareTags = (formData: Record<string, any>) => {
  const tagsObject: { [key: string]: any } = {};
  
  Object.entries(formData)
    .filter(([key, value]) => key !== 'chain_id' && key !== 'address' && 
      (value !== undefined && value !== ''))
    .forEach(([key, value]) => {
      tagsObject[key] = value;
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

export const switchToBaseNetwork = async (ethereum: any) => {
  try {
    // Try to switch to Base
    await ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x2105' }], // 0x2105 is hex for 8453 (Base)
    });
  } catch (switchError: any) {
    // This error code indicates that the chain has not been added to MetaMask
    if (switchError.code === 4902) {
      await ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: '0x2105',
          chainName: 'Base',
          nativeCurrency: {
            name: 'ETH',
            symbol: 'ETH',
            decimals: 18
          },
          rpcUrls: ['https://mainnet.base.org'],
          blockExplorerUrls: ['https://basescan.org']
        }]
      });
    } else {
      throw switchError;
    }
  }
};

export const initializeEAS = async (ethereum: any) => {
  // Initialize provider and signer for Base
  const provider = new ethers.BrowserProvider(ethereum);
  const signer = await provider.getSigner();
  
  // Initialize EAS SDK
  const eas = new EAS(EAS_CONTRACT_ADDRESS, provider as unknown as any);
  eas.connect(signer);
  
  return { eas, signer };
};