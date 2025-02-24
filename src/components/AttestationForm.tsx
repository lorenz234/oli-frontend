'use client';

import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import OwnerProjectSelect from './OwnerProjectSelect';
import ConfirmationModal from './ConfirmationModal';
import InputWithCheck from './InputWithCheck';
import FormLabel from './FormLabel';
import { CATEGORIES } from '../constants/categories';

// Types
type Chain = 'ethereum' | 'base' | 'optimism' | 'arbitrum';

const CHAINS: { id: Chain; name: string; caip2: string }[] = [
  { id: 'ethereum', name: 'Ethereum', caip2: 'eip155:1' },
  { id: 'base', name: 'Base', caip2: 'eip155:8453' },
  { id: 'optimism', name: 'OP Mainnet', caip2: 'eip155:10' },
  { id: 'arbitrum', name: 'Arbitrum One', caip2: 'eip155:42161' },
];

// EAS Constants
const EAS_CONTRACT_ADDRESS = "0x4200000000000000000000000000000000000021"; // Update with your contract address
const SCHEMA_UID = "0xb763e62d940bed6f527dd82418e146a904e62a297b8fa765c9b3e1f0bc6fdd68"; // Update with your schema UID

// Simple Notification component
const Notification = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg ${
      type === 'error' ? 'bg-red-500' : 'bg-green-500'
    } text-white max-w-md z-50 transition-opacity duration-300`}>
      <div className="flex justify-between items-center">
        <p>{message}</p>
        <button 
          onClick={onClose}
          className="ml-4 text-white hover:text-gray-200"
        >
          ×
        </button>
      </div>
    </div>
  );
};

const AttestationForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmationData, setConfirmationData] = useState(null); 
  const [formData, setFormData] = useState({
    chain_id: '',
    address: '',
    contract_name: '',
    owner_project: '',
    usage_category: '',
    is_contract: undefined as boolean | undefined,
    is_factory_contract: undefined as boolean | undefined,
    is_proxy: undefined as boolean | undefined
  });

  const [errors, setErrors] = useState({
    address: '',
    contractName: ''
  });

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
  };

  const validateAddress = (address: string) => {
    if (!address) return 'Address is required';
    try {
      // Updated to use ethers v6 address validation
      ethers.getAddress(address);
      return '';
    } catch (error) {
      return 'Invalid EVM address';
    }
  };

  const validateContractName = (name: string) => {
    if (name && name.length > 40) return 'Contract name must be 40 characters or less';
    return '';
  };

  const getInputClassName = (value: any) => {
  const baseClasses = "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900";
  
  // Add a light purple/blue background if the field has a value
  return value ? 
    `${baseClasses} bg-indigo-50` : 
    `${baseClasses} bg-gray-50`;
};

  const submitAttestation = async () => {
    // Initialize SchemaEncoder with your schema
    const schemaEncoder = new SchemaEncoder('string chain_id,string tags_json');
      
    // Create tags_json object
    const tagsObject: { [key: string]: any } = {};

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
      } catch (switchError) {
        // This error code indicates that the chain has not been added to MetaMask
        if (switchError.code === 4902) {
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
      
      // Initialize EAS SDK
      const eas = new EAS(EAS_CONTRACT_ADDRESS, provider);
      eas.connect(signer);

      /// Submit the attestation
      const tx = await eas.attest({
        schema: SCHEMA_UID,
        data: {
          recipient: formData.address,
          expirationTime: 0n,
          revocable: true,
          data: encodedData,
        },
      });

      // Wait for the transaction
      const newAttestationUID = await tx.wait();

      showNotification(`Attestation created successfully! UID: ${newAttestationUID}`);

      // Reset form
      setFormData({
        chain_id: '',
        address: '',
        contract_name: '',
        owner_project: '',
        usage_category: '',
        is_contract: undefined,
        is_factory_contract: undefined,
        is_proxy: undefined
      });

    } catch (error) {
      console.error('Error submitting attestation:', error);
      showNotification(error.message || "Failed to submit attestation", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Only validate mandatory fields
    const addressError = validateAddress(formData.address);
    
    setErrors({
      address: addressError,
      contractName: ''
    });
  
    if (addressError || !formData.chain_id) {
      if (!formData.chain_id) {
        showNotification("Please select a chain", "error");
      }
      return;
    }
  
    // Create tags object for preview
    const tagsObject = {};
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear errors when user types
    if (name === 'address') {
      setErrors(prev => ({ ...prev, address: validateAddress(value) }));
    }
    if (name === 'contractName') {
      setErrors(prev => ({ ...prev, contractName: validateContractName(value) }));
    }
  };

  const inputClassName = "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900 placeholder-gray-400 bg-gray-50 py-2 pl-3";

  return (
    <>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      <form onSubmit={handleSubmit} className="space-y-6 p-6 pr-10">
      {/* Chain Selection */}
      <div>
        <FormLabel
          htmlFor="chain"
          label="Chain"
          tooltipKey='chain'
        />
      <InputWithCheck value={formData.chain_id}>
        <select
          id="chain_id"
          name="chain_id"
          value={formData.chain_id}
          onChange={handleChange}
          required
          className={inputClassName}
        >
          <option value="">Select a chain</option>
          {CHAINS.map(chain => (
            <option key={chain.id} value={chain.caip2}>
              {chain.name}
            </option>
          ))}
          </select>
      </InputWithCheck>
      </div>

      {/* Address Input */}
      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
          Address
        </label>
        <InputWithCheck 
          value={formData.address} 
          isValid={!errors.address}
          error={errors.address}
        >
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="0x..."
            className={inputClassName}
          />
        </InputWithCheck>
      </div>

      {/* Contract Name Input */}
      <div>
        <FormLabel
          htmlFor="contract_name"
          label="Contract Name"
          tooltipKey="contract_name"
        />
        <InputWithCheck 
          value={formData.contract_name}
          isValid={!errors.contractName}
        >
          <input
            type="text"
            id="contract_name"
            name="contract_name"
            value={formData.contract_name}
            onChange={handleChange}
            maxLength={40}
            className={inputClassName}
          />
        </InputWithCheck>
      </div>

      {/* Owner Project Selection */}
      <div>
        <FormLabel
          htmlFor="owner_project"
          label="Owner Project"
          tooltipKey="owner_project"
        />
        <InputWithCheck value={formData.owner_project}>
          <OwnerProjectSelect
            value={formData.owner_project}
            onChange={(value) => setFormData(prev => ({ ...prev, owner_project: value }))}
          />
        </InputWithCheck>
      </div>

      {/* Usage Category Selection */}
      <div>
        <FormLabel
          htmlFor="usage_category"
          label="Usage Category"
          tooltipKey="usage_category"
        />
        <InputWithCheck value={formData.usage_category}>
        <select
          id="usage_category"
          name="usage_category"
          value={formData.usage_category}
          onChange={handleChange}
          className={inputClassName}
        >
          <option value="">Select a category</option>
          {CATEGORIES.map(mainCategory => (
            <optgroup key={mainCategory.main_category_name} label={mainCategory.main_category_name}>
              {mainCategory.categories.map(category => (
                <option 
                  key={category.category_id} 
                  value={category.category_id}
                  title={category.description}
                >
                  {category.name}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
        </InputWithCheck>
      </div>

      {/* Is Contract Selection */}
      <div>
        <FormLabel
          htmlFor="is_contract"
          label="Is Contract"
          tooltipKey="is_contract"
        />
        <InputWithCheck value={formData.is_contract !== undefined}>
        <div className="flex gap-4 mt-1">
          <div className="flex items-center">
            <input
              type="radio"
              id="contract-true"
              name="is_contract"
              value="true"
              checked={formData.is_contract === true}
              onChange={(e) => setFormData(prev => ({ ...prev, is_contract: e.target.value === 'true' }))}
              className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="contract-true" className="ml-2 block text-sm text-gray-700">
              Yes
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="radio"
              id="contract-false"
              name="isContract"
              value="false"
              checked={formData.is_contract === false}
              onChange={(e) => setFormData(prev => ({ ...prev, is_contract: e.target.value === 'true' }))}
              className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="contract-false" className="ml-2 block text-sm text-gray-700">
              No
            </label>
          </div>
        </div>
        </InputWithCheck>
      </div>

       {/* Is Factory Contract Selection */}
       <div>
        <FormLabel
          htmlFor="is_factory_contract"
          label="Is Factory Contract"
          tooltipKey="is_factory_contract"
        />
        <InputWithCheck value={formData.is_factory_contract !== undefined}>
        <div className="flex gap-4 mt-1">
          <div className="flex items-center">
            <input
              type="radio"
              id="factory-contract-true"
              name="isFactoryContract"
              value="true"
              checked={formData.is_factory_contract === true}
              onChange={(e) => setFormData(prev => ({ ...prev, is_factory_contract: e.target.value === 'true' }))}
              className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="facrory-contract-true" className="ml-2 block text-sm text-gray-700">
              Yes
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="radio"
              id="factory-contract-false"
              name="isFactoryContract"
              value="false"
              checked={formData.is_factory_contract === false}
              onChange={(e) => setFormData(prev => ({ ...prev, is_factory_contract: e.target.value === 'true' }))}
              className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="factory-contract-false" className="ml-2 block text-sm text-gray-700">
              No
            </label>
          </div>
        </div>
        </InputWithCheck>
      </div>

      {/* Is Proxy */}
      <div>
        <FormLabel
          htmlFor="is_proxy"
          label="Is Proxy"
          tooltipKey="is_proxy"
        />
        <InputWithCheck value={formData.is_proxy !== undefined}>
        <div className="flex gap-4 mt-1">
          <div className="flex items-center">
            <input
              type="radio"
              id="proxy-true"
              name="isProxy"
              value="true"
              checked={formData.is_proxy === true}
              onChange={(e) => setFormData(prev => ({ ...prev, is_proxy: e.target.value === 'true' }))}
              className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="proxy-true" className="ml-2 block text-sm text-gray-700">
              Yes
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="radio"
              id="proxy-false"
              name="isProxy"
              value="false"
              checked={formData.is_proxy === false}
              onChange={(e) => setFormData(prev => ({ ...prev, is_proxy: e.target.value === 'true' }))}
              className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="proxy-false" className="ml-2 block text-sm text-gray-700">
              No
            </label>
          </div>
        </div>
        </InputWithCheck>
      </div>
          
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
      {/* Add this just before the closing </> */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmSubmission}
        data={confirmationData}
      />
    </>
  );
};

export default AttestationForm;