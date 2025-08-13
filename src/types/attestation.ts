// src/types/attestation.ts

export type FieldValue = string | number | boolean | (string | number | boolean)[] | null | undefined;

export type FormMode = 'simple' | 'advanced';

export interface RowData {
  [key: string]: string;
  chain_id: string;
  address: string;
  contract_name: string;
  owner_project: string;
  usage_category: string;
  is_contract: string;
}

export interface AttestationResult {
  address: string;
  success: boolean;
  uid: string;
}

export interface ColumnDefinition {
  id: string;
  name: string;
  required: boolean;
  validator?: (value: FieldValue) => string | null;
  needsCustomValidation?: boolean;
  type?: string;
}

export interface NotificationType {
  message: string;
  type: 'success' | 'error' | 'warning';
}

export interface ConfirmationData {
  chain_id: string;
  address: string;
  tagsObject: { [key: string]: string | boolean | number };
}

export interface ValidationWarning {
  message: string;
  suggestions?: string[];
  showAddProjectLink?: boolean;
  similarProjects?: string[];
  isConversion?: boolean;
  isError?: boolean;
}

export interface ProjectData {
  owner_project: string;
  display_name: string;
  main_github?: string;
  website?: string;
  [key: string]: any;
}

export interface FormField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select' | 'multiselect' | 'radio' | 'custom';
  required?: boolean;
  placeholder?: string;
  options?: { value: string | number; label: string }[];
  validator?: (value: FieldValue) => string | null;
  visibility: 'simple' | 'advanced' | 'both';
  tooltipKey?: string; // Add this line
  component?: React.FC<{ value: FieldValue; onChange: (value: FieldValue) => void }>;
}