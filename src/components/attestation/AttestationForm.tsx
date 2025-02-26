'use client';

import React, { useState } from 'react';
import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { ethers } from 'ethers';
import ConfirmationModal from '../attestation/ConfirmationModal';
import InputWithCheck from '../attestation/InputWithCheck';
import FormLabel from '../attestation/FormLabel';
import ToggleSwitch from './ToggleSwitch';
import Notification from './Notification';
import { 
  formFields, 
  initialFormState, 
  FormField, 
  FormMode 
} from './formFields';  // Import named exports directly
import { TAG_DESCRIPTIONS } from '../../constants/tagDescriptions';
// Import shared ethereum type
import '../../types/ethereum';

// Define FieldValue type to match what validator expects
type FieldValue = string | boolean | undefined;

const EAS_CONTRACT_ADDRESS = "0x4200000000000000000000000000000021";
const SCHEMA_UID = "0xb763e62d940bed6f527dd82418e146a904e62a297b8fa765c9b3e1f0bc6fdd68";

// Define types for error and notification states
interface ErrorState {
  [key: string]: string;
}

interface NotificationState {
  message: string;
  type: 'success' | 'error';
}

interface ConfirmationDataState {
  chain_id: string;
  address: string;
  tagsObject: Record<string, unknown>;
}

// Create a FormData interface with an index signature to allow string indexing
interface FormData {
  chain_id: string;
  address: string;
  contract_name: string;
  owner_project: string;
  usage_category: string;
  is_contract: boolean | undefined;
  is_factory_contract: boolean | undefined;
  is_proxy: boolean | undefined;
  version?: string;
  [key: string]: string | boolean | undefined | unknown; // Allow unknown values too
}


const AttestationForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<NotificationState | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmationData, setConfirmationData] = useState<ConfirmationDataState | null>(null);
  const [formMode, setFormMode] = useState<FormMode>('simple');
  const [formData, setFormData] = useState<FormData>(initialFormState);
  const [errors, setErrors] = useState<ErrorState>({});

  // Filter fields based on current form mode
  const getVisibleFields = () => {
    if (formMode === 'advanced') {
      // In advanced mode, show all fields
      return formFields;
    } else {
      // In simple mode, only show 'simple' or 'both' fields
      return formFields.filter(field => {
        return field.visibility === 'both' || field.visibility === 'simple';
      });
    }
  };

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
  };

  const submitAttestation = async () => {
    // Initialize SchemaEncoder with your schema
    const schemaEncoder = new SchemaEncoder('string chain_id,string tags_json');
      
    // Create tags_json object
    const tagsObject: Record<string, unknown> = {};

    Object.entries(formData)
    .filter(([key, value]) => key !== 'chain_id' && key !== 'address' && 
      (value !== undefined && value !== ''))
    .forEach(([key, value]) => {
      tagsObject[key] = value;
    });
    console.log('Tags object:', tagsObject);

    const encodedData = schemaEncoder.encodeData([
      { name: 'chain_id', value: formData.chain_id, type: 'string' },
      { name: 'tags_json', value: JSON.stringify(tagsObject), type: 'string' }
    ]);

    if (!window.ethereum) {
      showNotification("Please connect your wallet first", "error");
      return;
    }

    try {
      // Switch to Base network first
      try {
        // Try to switch to Base
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x2105' }], // 0x2105 is hex for 8453 (Base)
        });
      } catch (switchError: unknown) {
        // This error code indicates that the chain has not been added to MetaMask
        if (switchError && typeof switchError === 'object' && 'code' in switchError && switchError.code === 4902) {
          await window.ethereum.request({
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

      // Initialize provider and signer for Base
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      // Initialize EAS SDK with the contract address as a string
      // For EAS SDK 2.7.0, the constructor takes a string address
      const eas = new EAS(EAS_CONTRACT_ADDRESS);
      
      // Connect the signer separately 
      eas.connect(signer);

      /// Submit the attestation
      const tx = await eas.attest({
        schema: SCHEMA_UID,
        data: {
          recipient: formData.address,
          expirationTime: BigInt(0), // Using BigInt() instead of 0n literal
          revocable: true,
          data: encodedData,
        },
      });

      // Wait for the transaction
      const newAttestationUID = await tx.wait();

      showNotification(`Attestation created successfully! UID: ${newAttestationUID}`);

      // Reset form
      setFormData(initialFormState);

    } catch (error) {
      console.error('Error submitting attestation:', error);
      showNotification(
        error instanceof Error ? error.message : "Failed to submit attestation", 
        "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all visible fields
    const newErrors: ErrorState = {};
    let hasError = false;
    
    getVisibleFields().forEach(field => {
      if (field.validator) {
        // Type assertion to ensure the validator gets the right type
        const fieldValue = formData[field.id] as FieldValue;
        const error = field.validator(fieldValue);
        if (error) {
          newErrors[field.id] = error;
          hasError = true;
        }
      }
      
      // Check required fields
      if (field.required && (!formData[field.id] || formData[field.id] === '')) {
        newErrors[field.id] = `${field.label} is required`;
        hasError = true;
      }
    });
    
    setErrors(newErrors);
    
    if (hasError) {
      return;
    }
  
    // Create tags object for preview
    const tagsObject: Record<string, unknown> = {};
    Object.entries(formData)
      .filter(([key, value]) => key !== 'chain_id' && key !== 'address' && 
        (value !== undefined && value !== ''))
      .forEach(([key, value]) => {
        tagsObject[key] = value;
      });
  
    // Set confirmation data and open modal
    setConfirmationData({
      chain_id: formData.chain_id,
      address: formData.address,
      tagsObject
    });
    setIsModalOpen(true);
  };

  const handleConfirmSubmission = async () => {
    setIsModalOpen(false);
    setIsSubmitting(true);
    await submitAttestation();
  };

  const handleChange = (fieldId: string, value: unknown) => {
    // Safe way to update the form data with proper typing
    setFormData(prev => {
      const updated = { ...prev };
      updated[fieldId] = value;
      return updated;
    });
    
    // Clear errors when user changes input
    if (errors[fieldId]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };

  const toggleFormMode = () => {
    setFormMode(prev => prev === 'simple' ? 'advanced' : 'simple');
  };

  // Define a Field type that correctly types the tooltipKey
  interface TypedField extends Omit<FormField, 'tooltipKey'> {
    tooltipKey: keyof typeof TAG_DESCRIPTIONS;
  }

  const renderField = (field: FormField) => {
    const commonInputClassName = "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900 placeholder-gray-400 bg-gray-50 py-2 pl-3";
    
    // Type assertion to correctly type the tooltipKey
    const typedField = field as unknown as TypedField;
    
    return (
      <div key={field.id} className="mb-6">
        <FormLabel
          htmlFor={field.id}
          label={field.label}
          tooltipKey={typedField.tooltipKey}
        />
        
        <InputWithCheck
          value={formData[field.id] !== undefined && formData[field.id] !== ''}
          isValid={!errors[field.id]}
          error={errors[field.id]}
        >
          {field.type === 'text' && (
            <input
              type="text"
              id={field.id}
              name={field.id}
              value={formData[field.id] as string || ''}
              onChange={(e) => handleChange(field.id, e.target.value)}
              placeholder={field.placeholder}
              className={commonInputClassName}
            />
          )}
          
          {field.type === 'select' && (
            <select
              id={field.id}
              name={field.id}
              value={formData[field.id] as string || ''}
              onChange={(e) => handleChange(field.id, e.target.value)}
              required={field.required}
              className={commonInputClassName}
            >
              {field.options?.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )}
          
          {field.type === 'radio' && (
            <div className="flex gap-4 mt-1">
              {field.options?.map(option => (
                <div className="flex items-center" key={option.value}>
                  <input
                    type="radio"
                    id={`${field.id}-${option.value}`}
                    name={field.id}
                    value={option.value}
                    checked={formData[field.id] === (option.value === 'true')}
                    onChange={(e) => handleChange(field.id, e.target.value === 'true')}
                    className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor={`${field.id}-${option.value}`} className="ml-2 block text-sm text-gray-700">
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          )}
          
          {field.type === 'custom' && field.component && (
            field.component({
              value: formData[field.id] as FieldValue,
              onChange: (value: unknown) => handleChange(field.id, value)
            })
          )}
        </InputWithCheck>
      </div>
    );
  };

  return (
    <>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      
      <div className="flex justify-center">
        <ToggleSwitch 
          isActive={formMode === 'advanced'} 
          onToggle={toggleFormMode} 
        />
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4 p-6 pr-10">
        {getVisibleFields().map(renderField)}
          
        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center px-5 py-2.5 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-white rounded-xl hover:opacity-90 transition-opacity duration-200 text-sm font-semibold disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </>
            ) : (
              'Create Attestation'
            )}
          </button>
        </div>
      </form>
      
      {confirmationData && (
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmSubmission}
        data={confirmationData}
      />
      )}
    </>
  );
};

export default AttestationForm;