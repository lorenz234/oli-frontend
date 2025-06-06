import React from 'react';
import ValidatedInput from '../ValidatedInput';
import InputWithCheck from '../../attestation/InputWithCheck';
import ValidationChecker from '../ValidationChecker';

interface BasicInfoSectionProps {
  formData: any;
  errors: { [key: string]: string };
  handleInputChange: (field: string, value: string) => void;
  handleArrayChange: (fieldName: any, index: number, value: string) => void;
  removeArrayItem: (fieldName: any, index: number) => void;
  PROJECT_DESCRIPTIONS: Record<string, string>;
}

const BasicInfoSection: React.FC<BasicInfoSectionProps & { isClient: boolean }> = ({
  formData,
  errors,
  handleInputChange,
  handleArrayChange,
  removeArrayItem,
  PROJECT_DESCRIPTIONS,
  isClient,
}) => (
  <div>
    {/* Project Name */}
    <ValidatedInput
      id="name"
      name="name"
      value={formData.name}
      onChange={e => handleInputChange('name', e.target.value)}
      placeholder="project-name (lowercase with dashes)"
      label="Project Name"
      fieldType="name"
      tooltip={PROJECT_DESCRIPTIONS['project_name'] || 'The unique identifier for your project'}
      error={errors.name}
    />
    <p className="mt-1 text-xs text-gray-500">
      This will be used as the filename. Use only lowercase letters, numbers, and dashes.
    </p>
    {/* Display Name */}
    <ValidatedInput
      id="display_name"
      name="display_name"
      value={formData.display_name}
      onChange={e => handleInputChange('display_name', e.target.value)}
      placeholder="Project Display Name"
      label="Display Name"
      fieldType="display_name"
      tooltip={PROJECT_DESCRIPTIONS['display_name'] || 'The human-readable name of your project'}
      error={errors.display_name}
    />
    <p className="mt-1 text-xs text-gray-500">
      The human-readable name of the project.
    </p>
    {/* Description */}
    <ValidatedInput
      id="description"
      name="description"
      value={formData.description}
      onChange={e => handleInputChange('description', e.target.value)}
      placeholder="A brief description of the project"
      label="Description"
      fieldType="description"
      tooltip={PROJECT_DESCRIPTIONS['description'] || 'A brief description of the project'}
      error={errors.description}
      isTextarea={true}
      rows={4}
    />
    {/* Websites */}
    <div className="mb-6">
      <div className="flex items-center">
        <label htmlFor="websites" className="block text-sm font-medium text-gray-700">
          Websites
        </label>
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
            {PROJECT_DESCRIPTIONS['websites'] || 'Official website URLs for the project'}
          </div>
        </div>
      </div>
      <div className="space-y-2">
        {formData.websites.map((website: string, index: number) => (
          <div key={`website-${index}`} className="flex items-center gap-2 flex-nowrap">
            <div className="w-full max-w-md">
              <InputWithCheck
                value={!!website}
                isValid={!errors[`website_${index}`]}
                error={errors[`website_${index}`]}
              >
                <input
                  type="url"
                  id={`website-${index}`}
                  name={`website-${index}`}
                  value={website}
                  onChange={e => handleArrayChange('websites', index, e.target.value)}
                  placeholder="https://www.example.com"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900 placeholder-gray-400 bg-gray-50 py-2 pl-3"
                />
              </InputWithCheck>
              {isClient && <ValidationChecker field="website" value={website} />}
            </div>
            {index > 0 && website === '' && formData.websites.length > 1 && (
              <button
                type="button"
                onClick={() => removeArrayItem('websites', index)}
                className="p-1 text-red-500 hover:text-red-700"
                aria-label="Remove website"
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
  </div>
);

export default BasicInfoSection; 