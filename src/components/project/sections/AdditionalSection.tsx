import React from 'react';
import InputWithCheck from '../../attestation/InputWithCheck';

interface AdditionalSectionProps {
  formData: any;
  errors: { [key: string]: string };
  handleInputChange: (field: string, value: string) => void;
  handleArrayChange: (fieldName: any, index: number, value: string) => void;
  removeArrayItem: (fieldName: any, index: number) => void;
}

const Tooltip = ({ content }: { content: string }) => (
  <div className="group relative inline-block ml-2">
    <svg 
      className="w-4 h-4 text-gray-400 hover:text-gray-500" 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
      />
    </svg>
    <div className="invisible group-hover:visible absolute z-10 w-64 p-2 mt-2 text-sm text-gray-600 bg-white border rounded-lg shadow-lg -left-1/2 transform -translate-x-1/2">
      {content}
    </div>
  </div>
);

const AdditionalSection: React.FC<AdditionalSectionProps> = ({
  formData,
  errors,
  handleInputChange,
  handleArrayChange,
  removeArrayItem,
}) => (
  <div>
    <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Information</h3>
    {/* DefiLlama */}
    <div className="mb-6">
      <div className="flex items-center">
        <label htmlFor="defillama" className="block text-sm font-medium text-gray-700">
          DefiLlama URLs
        </label>
        <Tooltip content="DefiLlama URLs for the project" />
      </div>
      <div className="space-y-2">
        {formData.defillama.map((defillama: string, index: number) => (
          <div key={`defillama-${index}`} className="flex items-center gap-2">
            <div className="w-full max-w-md">
              <InputWithCheck
                value={!!defillama}
                isValid={!errors[`defillama_${index}`]}
                error={errors[`defillama_${index}`]}
              >
                <input
                  type="url"
                  id={`defillama-${index}`}
                  name={`defillama-${index}`}
                  value={defillama}
                  onChange={e => handleArrayChange('defillama', index, e.target.value)}
                  placeholder="https://defillama.com/protocol/..."
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900 placeholder-gray-400 bg-gray-50 py-2 pl-3"
                />
              </InputWithCheck>
            </div>
            {index > 0 && defillama === '' && formData.defillama.length > 1 && (
              <button
                type="button"
                onClick={() => removeArrayItem('defillama', index)}
                className="p-1 text-red-500 hover:text-red-700"
                aria-label="Remove DefiLlama URL"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
    {/* Comments */}
    <div className="mb-6">
      <div className="flex items-center">
        <label htmlFor="comments" className="block text-sm font-medium text-gray-700">
          Comments
        </label>
        <Tooltip content="Any additional comments or information about the project" />
      </div>
      <InputWithCheck
        value={!!formData.comments}
        isValid={!errors.comments}
        error={errors.comments}
      >
        <textarea
          id="comments"
          name="comments"
          value={formData.comments}
          onChange={e => handleInputChange('comments', e.target.value)}
          placeholder="Additional notes or comments for the maintainers"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900 placeholder-gray-400 bg-gray-50 py-2 pl-3"
          rows={4}
        />
      </InputWithCheck>
    </div>
  </div>
);

export default AdditionalSection; 