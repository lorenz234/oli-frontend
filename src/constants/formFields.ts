// src/constants/formFields.ts
import React from 'react';
import OwnerProjectSelect from '../components/attestation/OwnerProjectSelect';
import UsageCategorySelect from '../components/attestation/UsageCategorySelect';
import { FormField, FieldValue } from '../types/attestation';
import { validateAddress, validateContractName } from '../utils/validation';
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