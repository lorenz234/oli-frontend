// components/attestation/BulkConfirmationModal.tsx

import React from 'react';
import { CHAINS } from '../../constants/chains';

interface BulkConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  data: any[];
  chainOptions: { value: string; label: string }[];
}

const BulkConfirmationModal: React.FC<BulkConfirmationModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  data,
  chainOptions
}) => {
  if (!isOpen || !data || data.length === 0) return null;

  // Helper function to get chain info and validation status
  const getChainInfo = (chainId: string) => {
    const chainOption = chainOptions.find(c => c.value === chainId);
    const validChain = CHAINS.find(c => c.caip2 === chainId);
    
    return {
      label: chainOption ? chainOption.label : chainId,
      isValid: !!validChain,
      originalValue: chainId
    };
  };
  
  // Check if there are any invalid chains
  const hasInvalidChains = data.some(item => !getChainInfo(item.chain_id).isValid);
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full m-4 max-h-[80vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4 text-black">Confirm Bulk Attestation</h2>
        
        <div className="mb-4">
          <p className="text-gray-600">
            You are about to create {data.length} attestation{data.length !== 1 ? 's' : ''}.
            Please review the details below before confirming.
          </p>
          {hasInvalidChains && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div>
                  <h4 className="font-medium text-red-800">Invalid Chains Detected</h4>
                  <p className="text-sm text-red-700">
                    Some attestations contain invalid chain identifiers. These will fail during submission.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="space-y-4">
          {data.map((item, index) => {
            const chainInfo = getChainInfo(item.chain_id);
            return (
              <div key={index} className={`border rounded-lg p-4 ${
                chainInfo.isValid ? 'border-gray-200' : 'border-red-300 bg-red-50'
              }`}>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-gray-700">Attestation {index + 1}</h3>
                  <div className="flex items-center space-x-2">
                    {!chainInfo.isValid && (
                      <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    )}
                    <span className={`text-xs px-2 py-1 rounded ${
                      chainInfo.isValid 
                        ? 'bg-gray-100 text-gray-600' 
                        : 'bg-red-100 text-red-700 font-medium'
                    }`}>
                      {chainInfo.label}
                      {!chainInfo.isValid && ' (Invalid)'}
                    </span>
                  </div>
                </div>
              
                <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500">Address</p>
                  <p className="text-sm font-mono text-gray-700 break-all">{item.address}</p>
                </div>
                
                <div>
                  <p className="text-xs text-gray-500">Tags</p>
                  <div className="text-sm text-gray-700 bg-gray-50 p-2 rounded-md overflow-x-auto">
                    <pre className="text-xs">
                      {JSON.stringify(item.tagsObject, null, 2)}
                    </pre>
                  </div>
                </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={hasInvalidChains}
            className={`px-4 py-2 text-sm font-medium text-white rounded-md transition-all ${
              hasInvalidChains
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 hover:opacity-90'
            }`}
          >
            {hasInvalidChains ? 'Fix Invalid Chains First' : 'Confirm All Attestations'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkConfirmationModal;