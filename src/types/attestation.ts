// src/types/attestation.ts
export type FieldValue = string | boolean | undefined;
export type FormMode = 'simple' | 'advanced';
export type FieldType = 'select' | 'text' | 'radio' | 'custom' | 'date' | 'number' | 'multiselect';
export type FieldVisibility = 'simple' | 'advanced' | 'both';

export interface ComponentProps {
  value: FieldValue;
  onChange: (value: FieldValue) => void;
}

export interface FormField {
  id: string;
  label: string;
  type: FieldType;
  tooltipKey: string;
  visibility: FieldVisibility;
  options?: { value: string | number; label: string }[];  // Allow string or number
  validator?: (value: FieldValue) => string;
  placeholder?: string;
  required?: boolean;
  component?: (props: ComponentProps) => React.ReactNode;
  multiple?: boolean;
}

export interface NotificationType {
  message: string;
  type: 'success' | 'error' | 'warning';
}

export interface ConfirmationData {
  chain_id: string;
  address: string;
  tagsObject: { [key: string]: any };
}