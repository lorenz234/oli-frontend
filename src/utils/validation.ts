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