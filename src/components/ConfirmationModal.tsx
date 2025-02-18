const ConfirmationModal = ({ isOpen, onClose, onConfirm, data }) => {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-lg w-full m-4">
          <h2 className="text-xl font-semibold mb-4 text-black">Confirm Attestation</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-700">Chain</h3>
              <p className="text-sm text-gray-600">{data.chain_id}</p>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-700">Address</h3>
              <p className="text-sm text-gray-600 break-all">{data.address}</p>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-700">Tags</h3>
              <pre className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md overflow-x-auto">
                {JSON.stringify(data.tagsObject, null, 2)}
              </pre>
            </div>
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
              Confirm
            </button>
          </div>
        </div>
      </div>
    );
  };

export default ConfirmationModal;