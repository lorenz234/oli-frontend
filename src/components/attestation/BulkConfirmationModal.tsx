import React from 'react';

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

  // Helper function to get chain label from chain ID
  const getChainLabel = (chainId: string) => {
    const chain = chainOptions.find(c => c.value === chainId);
    return chain ? chain.label : chainId;
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full m-4 max-h-[80vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4 text-black">Confirm Bulk Attestation</h2>
        
        <div className="mb-4">
          <p className="text-gray-600">
            You are about to create {data.length} attestation{data.length !== 1 ? 's' : ''}.
            Please review the details below before confirming.
          </p>
        </div>
        
        <div className="space-y-4">
          {data.map((item, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium text-gray-700">Attestation {index + 1}</h3>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                  {getChainLabel(item.chain_id)}
                </span>
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
          ))}
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
            className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-md hover:opacity-90"
          >
            Confirm All Attestations
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkConfirmationModal;