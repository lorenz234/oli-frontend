// src/constants/formFields.ts
import React from 'react';
import OwnerProjectSelect from '../components/attestation/OwnerProjectSelect';
import UsageCategorySelect from '../components/attestation/UsageCategorySelect';
import { FormField, FieldValue } from '../types/attestation';
import { 
  validateAddress, 
  validateContractName,
  validateTxHash,
  validateURL,
  validateAddress_empty
} from '../utils/validation';
import { CHAINS } from './chains';

// Define component render functions without JSX directly in TS file
export const renderOwnerProjectSelect = (props: { value: FieldValue; onChange: (value: FieldValue) => void }) => {
  return React.createElement(OwnerProjectSelect, {
    value: props.value as string,
    onChange: props.onChange
  });
};

export const renderUsageCategorySelect = (props: { value: FieldValue; onChange: (value: FieldValue) => void }) => {
  return React.createElement(UsageCategorySelect, {
    value: props.value as string,
    onChange: props.onChange
  });
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
  is_eoa: undefined,
  deployment_tx: '',
  deployer_address: '',
  deployment_date: '',
  is_safe_contract: undefined,
  erc_type: '',
  erc20_name: '',
  erc20_symbol: '',
  erc20_decimals: '',
  erc721_name: '',
  erc721_symbol: '',
  erc1155_name: '',
  erc1155_symbol: '',
  version: '',
  audit: '',
  contract_monitored: '',
  source_code_verified: '',
  paymaster_category: '',
  is_bundler: undefined,
  is_paymaster: undefined,
  _comment: '',
  _source: ''
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
    type: 'number',
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
  },
  {
    id: 'is_eoa',
    label: 'Is EOA',
    type: 'radio',
    tooltipKey: 'is_eoa',
    visibility: 'advanced',
    options: [
      { value: 'true', label: 'Yes' },
      { value: 'false', label: 'No' }
    ]
  },
  {
    id: 'deployment_tx',
    label: 'Deployment Transaction',
    type: 'text',
    tooltipKey: 'deployment_tx',
    visibility: 'advanced',
    placeholder: '0x...',
    validator: validateTxHash
  },
  {
    id: 'deployer_address',
    label: 'Deployer Address',
    type: 'text',
    tooltipKey: 'deployer_address',
    visibility: 'advanced',
    placeholder: '0x...',
    validator: validateAddress_empty
  },
  {
    id: 'deployment_date',
    label: 'Deployment Date',
    type: 'date',
    tooltipKey: 'deployment_date',
    visibility: 'advanced'
  },
  {
    id: 'is_safe_contract',
    label: 'Is Multisig',
    type: 'radio',
    tooltipKey: 'is_safe_contract',
    visibility: 'advanced',
    options: [
      { value: 'true', label: 'Yes' },
      { value: 'false', label: 'No' }
    ]
  },
  {
    id: 'erc_type',
    label: 'ERC Type',
    type: 'multiselect',
    tooltipKey: 'erc_type',
    visibility: 'advanced',
    options: [
      { value: 'ERC20', label: 'ERC20' },
      { value: 'ERC173', label: 'ERC173' },
      { value: 'ERC223', label: 'ERC223' },
      { value: 'ERC621', label: 'ERC621' },
      { value: 'ERC677', label: 'ERC677' },
      { value: 'ERC721', label: 'ERC721' },
      { value: 'ERC777', label: 'ERC777' },
      { value: 'ERC827', label: 'ERC827' },
      { value: 'ERC884', label: 'ERC884' },
      { value: 'ERC918', label: 'ERC918' },
      { value: 'ERC948', label: 'ERC948' },
      { value: 'ERC965', label: 'ERC965' },
      { value: 'ERC998', label: 'ERC998' },
      { value: 'ERC1155', label: 'ERC1155' },
      { value: 'ERC1203', label: 'ERC1203' },
      { value: 'ERC1400', label: 'ERC1400' },
      { value: 'ERC1404', label: 'ERC1404' },
      { value: 'ERC1594', label: 'ERC1594' },
      { value: 'ERC1643', label: 'ERC1643' },
      { value: 'ERC1644', label: 'ERC1644' },
      { value: 'ERC1820', label: 'ERC1820' },
      { value: 'ERC4626', label: 'ERC4626' }
    ]
  },
  {
    id: 'erc20.name',
    label: 'ERC20 Name',
    type: 'text',
    tooltipKey: 'erc20.name',
    visibility: 'advanced'
  },
  {
    id: 'erc20.symbol',
    label: 'ERC20 Symbol',
    type: 'text',
    tooltipKey: 'erc20.symbol',
    visibility: 'advanced'
  },
  {
    id: 'erc20.decimals',
    label: 'ERC20 Decimals',
    type: 'number',
    tooltipKey: 'erc20.decimals',
    visibility: 'advanced'
  },
  {
    id: 'erc721.name',
    label: 'ERC721 Name',
    type: 'text',
    tooltipKey: 'erc721.name',
    visibility: 'advanced'
  },
  {
    id: 'erc721.symbol',
    label: 'ERC721 Symbol',
    type: 'text',
    tooltipKey: 'erc721.symbol',
    visibility: 'advanced'
  },
  {
    id: 'erc1155.name',
    label: 'ERC1155 Name',
    type: 'text',
    tooltipKey: 'erc1155.name',
    visibility: 'advanced'
  },
  {
    id: 'erc1155.symbol',
    label: 'ERC1155 Symbol',
    type: 'text',
    tooltipKey: 'erc1155.symbol',
    visibility: 'advanced'
  },
  {
    id: 'audit',
    label: 'Audit',
    type: 'text',
    tooltipKey: 'audit',
    visibility: 'advanced',
    placeholder: 'https://... Link to audit report',
    validator: validateURL
  },
  {
    id: 'contract_monitored',
    label: 'Smart Contract Monitoring',
    type: 'text',
    tooltipKey: 'contract_monitored',
    visibility: 'advanced',
    placeholder: 'https://... Link to monitoring information',
    validator: validateURL
  },
  {
    id: 'source_code_verified',
    label: 'Verified Source Code',
    type: 'text',
    tooltipKey: 'source_code_verified',
    visibility: 'advanced',
    placeholder: 'https://... Link to verified source code',
    validator: validateURL
  },
  {
    id: 'paymaster_category',
    label: 'Paymaster Category',
    type: 'select',
    tooltipKey: 'paymaster_category',
    visibility: 'advanced',
    options: [
      { value: '', label: 'Select a category' },
      { value: 'verifying', label: 'Verifying' },
      { value: 'token', label: 'Token' },
      { value: 'verifying_and_token', label: 'Verifying and Token' }
    ]
  },
  {
    id: 'is_bundler',
    label: 'Is Bundler',
    type: 'radio',
    tooltipKey: 'is_bundler',
    visibility: 'advanced',
    options: [
      { value: 'true', label: 'Yes' },
      { value: 'false', label: 'No' }
    ]
  },
  {
    id: 'is_paymaster',
    label: 'Is Paymaster',
    type: 'radio',
    tooltipKey: 'is_paymaster',
    visibility: 'advanced',
    options: [
      { value: 'true', label: 'Yes' },
      { value: 'false', label: 'No' }
    ]
  },
  {
    id: '_comment',
    label: 'Comment',
    type: 'text',
    tooltipKey: '',
    visibility: 'simple'
  },
  {
    id: '_source',
    label: 'Source',
    type: 'text',
    tooltipKey: '',
    visibility: 'simple'
  }
];