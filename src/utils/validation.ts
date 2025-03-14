// src/utils/validation.ts
import { ethers } from 'ethers';
import { FieldValue } from '../types/attestation';
import { VALID_CATEGORY_IDS } from '../constants/categories';

export const validateAddress = (address: FieldValue): string => {
  if (!address) return 'Address is required';
  try {
    ethers.getAddress(address as string);
    return '';
  } catch {
    return 'Invalid EVM address';
  }
};

export const validateAddress_empty = (address: FieldValue): string => {
  if (!address) return ''; // Return empty string instead of error message when address is empty
  try {
    ethers.getAddress(address as string);
    return '';
  } catch {
    return 'Invalid EVM address';
  }
};

export const validateContractName = (name: FieldValue): string => {
  if (name && typeof name === 'string' && name.length > 40) 
    return 'Contract name must be 40 characters or less';
  return '';
};

export const validateChain = (value: string, validOptions: {value: string}[]): string | null => {
  return validOptions.some(option => option.value === value) 
    ? null 
    : 'Invalid chain value';
};

export const validateCategory = (value: string): string | null => {
  return !value || VALID_CATEGORY_IDS.includes(value) 
    ? null 
    : 'Invalid category';
};

export const validateBoolean = (value: string): string | null => {
  return value === '' || value === 'true' || value === 'false' 
    ? null 
    : 'Must be true or false';
};

export const validateTxHash = (txHash: FieldValue): string => {
  if (!txHash) return '';
  
  const hashStr = txHash as string;
  // Check if it matches the Ethereum transaction hash format: 0x followed by 64 hex characters
  const txHashRegex = /^0x[a-fA-F0-9]{64}$/;
  
  if (!txHashRegex.test(hashStr)) {
    return 'Invalid transaction hash format';
  }
  
  return '';
};

export const validateURL = (url: FieldValue): string => {
  if (!url) return '';
  
  const urlStr = url as string;
  
  // Check if the URL starts with https:// or www.
  if (!urlStr.startsWith('https://') && !urlStr.startsWith('www.')) {
    return 'URL must start with https:// or www.';
  }
  
  // Optional: More comprehensive URL validation
  try {
    // For strings starting with www., prepend https:// for URL validation
    const urlToCheck = urlStr.startsWith('www.') ? `https://${urlStr}` : urlStr;
    new URL(urlToCheck);
    return '';
  } catch (e) {
    return 'Invalid URL format';
  }
  
  return '';
};