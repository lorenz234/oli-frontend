// formFields.ts
import React from 'react';
import { ethers } from 'ethers';
import OwnerProjectSelect from '../attestation/OwnerProjectSelect';
import UsageCategorySelect from './UsageCategorySelect';
import { CATEGORIES } from '../../constants/categories';

// Types
export type Chain = 'ethereum' | 'base' | 'optimism' | 'arbitrum';
export type FormMode = 'simple' | 'advanced';
export type FieldType = 'select' | 'text' | 'radio' | 'custom' ;
export type FieldVisibility = 'simple' | 'advanced' | 'both';

export interface ComponentProps {
  value: any;
  onChange: (value: any) => void;
}

export interface FormField {
  id: string;
  label: string;
  type: FieldType;
  tooltipKey: string;
  visibility: FieldVisibility;
  options?: { value: string; label: string }[];
  validator?: (value: any) => string;
  placeholder?: string;
  required?: boolean;
  component?: (props: ComponentProps) => React.ReactNode;
}

export const CHAINS: { id: Chain; name: string; caip2: string }[] = [
  { id: 'ethereum', name: 'Ethereum', caip2: 'eip155:1' },
  { id: 'base', name: 'Base', caip2: 'eip155:8453' },
  { id: 'optimism', name: 'OP Mainnet', caip2: 'eip155:10' },
  { id: 'arbitrum', name: 'Arbitrum One', caip2: 'eip155:42161' },
];

// Form field validators
export const validateAddress = (address: string) => {
  if (!address) return 'Address is required';
  try {
    ethers.getAddress(address);
    return '';
  } catch (error) {
    return 'Invalid EVM address';
  }
};

export const validateContractName = (name: string) => {
  if (name && name.length > 40) return 'Contract name must be 40 characters or less';
  return '';
};

// Define initial form state based on field definitions
export const initialFormState = {
  chain_id: '',
  address: '',
  contract_name: '',
  owner_project: '',
  usage_category: '',
  is_contract: undefined,
  is_factory_contract: undefined,
  is_proxy: undefined,
};

// Define component render functions without JSX directly in TS file
export const renderOwnerProjectSelect = (props: ComponentProps) => {
  return React.createElement(OwnerProjectSelect, {
    value: props.value,
    onChange: props.onChange
  });
};

export const renderUsageCategorySelect = (props: ComponentProps) => {
  return React.createElement(UsageCategorySelect, {
    value: props.value,
    onChange: props.onChange
  });
};

// Define form fields with metadata
export const formFields: FormField[] = [
  {
    id: 'chain_id',
    label: 'Chain',
    type: 'select',
    tooltipKey: 'chain',
    visibility: 'simple',
    options: [
      { value: '', label: 'Select a chain' },
      ...CHAINS.map(chain => ({
        value: chain.caip2,
        label: chain.name
      }))
    ],
    required: true
  },
  {
    id: 'address',
    label: 'Address',
    type: 'text',
    tooltipKey: 'address',
    visibility: 'simple',
    placeholder: '0x...',
    validator: validateAddress,
    required: true
  },
  {
    id: 'contract_name',
    label: 'Contract Name',
    type: 'text',
    tooltipKey: 'contract_name',
    visibility: 'simple',
    validator: validateContractName
  },
  {
    id: 'owner_project',
    label: 'Owner Project',
    type: 'custom',
    tooltipKey: 'owner_project',
    visibility: 'simple',
    component: renderOwnerProjectSelect
  },
  {
    id: 'usage_category',
    label: 'Usage Category',
    type: 'custom',
    tooltipKey: 'usage_category',
    visibility: 'simple',
    component: renderUsageCategorySelect
  },
  {
    id: 'version',
    label: 'Version',
    type: 'text',
    tooltipKey: 'version',
    visibility: 'advanced'
  },
  {
    id: 'is_contract',
    label: 'Is Contract',
    type: 'radio',
    tooltipKey: 'is_contract',
    visibility: 'advanced',
    options: [
      { value: 'true', label: 'Yes' },
      { value: 'false', label: 'No' }
    ]
  },
  {
    id: 'is_factory_contract',
    label: 'Is Factory Contract',
    type: 'radio',
    tooltipKey: 'is_factory_contract',
    visibility: 'advanced',
    options: [
      { value: 'true', label: 'Yes' },
      { value: 'false', label: 'No' }
    ]
  },
  {
    id: 'is_proxy',
    label: 'Is Proxy',
    type: 'radio',
    tooltipKey: 'is_proxy',
    visibility: 'advanced',
    options: [
      { value: 'true', label: 'Yes' },
      { value: 'false', label: 'No' }
    ]
  }
];