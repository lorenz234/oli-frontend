import React from 'react';
import InputWithCheck from '../../attestation/InputWithCheck';
import ValidationChecker from '../ValidationChecker';

interface DevelopmentSectionProps {
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

const DevelopmentSection: React.FC<DevelopmentSectionProps & { isClient: boolean }> = ({
  formData,
  errors,
  handleInputChange,
  handleArrayChange,
  removeArrayItem,
  isClient,
}) => (
  <div>
    <h3 className="text-lg font-medium text-gray-900 mb-4">Development Resources</h3>
    {/* GitHub */}
    <div className="mb-6">
      <div className="flex items-center">
        <label htmlFor="github" className="block text-sm font-medium text-gray-700">
          GitHub Repositories
        </label>
        <Tooltip content="GitHub URLs for the project. Organizations or individual repositories." />
      </div>
      <div className="space-y-2">
        {formData.github.map((github: string, index: number) => (
          <div key={`github-${index}`} className="flex items-center gap-2">
            <div className="w-full max-w-md">
              <InputWithCheck
                value={!!github}
                isValid={!errors[`github_${index}`]}
                error={errors[`github_${index}`]}
              >
                <input
                  type="url"
                  id={`github-${index}`}
                  name={`github-${index}`}
                  value={github}
                  onChange={e => handleArrayChange('github', index, e.target.value)}
                  placeholder="https://github.com/username/repo"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900 placeholder-gray-400 bg-gray-50 py-2 pl-3"
                />
              </InputWithCheck>
              {isClient && <ValidationChecker field="github" value={github} />}
            </div>
            {index > 0 && github === '' && formData.github.length > 1 && (
              <button
                type="button"
                onClick={() => removeArrayItem('github', index)}
                className="p-1 text-red-500 hover:text-red-700"
                aria-label="Remove GitHub"
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
    {/* NPM Packages */}
    <div className="mb-6">
      <div className="flex items-center">
        <label htmlFor="npm" className="block text-sm font-medium text-gray-700">
          NPM Packages
        </label>
        <Tooltip content="NPM package URLs" />
      </div>
      <div className="space-y-2">
        {formData.npm.map((npm: string, index: number) => (
          <div key={`npm-${index}`} className="flex items-center gap-2">
            <div className="w-full max-w-md">
              <InputWithCheck
                value={!!npm}
                isValid={!errors[`npm_${index}`]}
                error={errors[`npm_${index}`]}
              >
                <input
                  type="url"
                  id={`npm-${index}`}
                  name={`npm-${index}`}
                  value={npm}
                  onChange={e => handleArrayChange('npm', index, e.target.value)}
                  placeholder="https://www.npmjs.com/package/package-name"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900 placeholder-gray-400 bg-gray-50 py-2 pl-3"
                />
              </InputWithCheck>
            </div>
            {index > 0 && npm === '' && formData.npm.length > 1 && (
              <button
                type="button"
                onClick={() => removeArrayItem('npm', index)}
                className="p-1 text-red-500 hover:text-red-700"
                aria-label="Remove NPM"
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
    {/* Crates (Rust) */}
    <div className="mb-6">
      <div className="flex items-center">
        <label htmlFor="crates" className="block text-sm font-medium text-gray-700">
          Rust Crates
        </label>
        <Tooltip content="Rust crates package URLs" />
      </div>
      <div className="space-y-2">
        {formData.crates.map((crate: string, index: number) => (
          <div key={`crate-${index}`} className="flex items-center gap-2">
            <div className="w-full max-w-md">
              <InputWithCheck
                value={!!crate}
                isValid={!errors[`crates_${index}`]}
                error={errors[`crates_${index}`]}
              >
                <input
                  type="url"
                  id={`crate-${index}`}
                  name={`crate-${index}`}
                  value={crate}
                  onChange={e => handleArrayChange('crates', index, e.target.value)}
                  placeholder="https://crates.io/crates/package-name"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900 placeholder-gray-400 bg-gray-50 py-2 pl-3"
                />
              </InputWithCheck>
            </div>
            {index > 0 && crate === '' && formData.crates.length > 1 && (
              <button
                type="button"
                onClick={() => removeArrayItem('crates', index)}
                className="p-1 text-red-500 hover:text-red-700"
                aria-label="Remove Rust Crate"
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
    {/* PyPI (Python) */}
    <div className="mb-6">
      <div className="flex items-center">
        <label htmlFor="pypi" className="block text-sm font-medium text-gray-700">
          Python Packages (PyPI)
        </label>
        <Tooltip content="Python package URLs from PyPI" />
      </div>
      <div className="space-y-2">
        {formData.pypi.map((pypi: string, index: number) => (
          <div key={`pypi-${index}`} className="flex items-center gap-2">
            <div className="w-full max-w-md">
              <InputWithCheck
                value={!!pypi}
                isValid={!errors[`pypi_${index}`]}
                error={errors[`pypi_${index}`]}
              >
                <input
                  type="url"
                  id={`pypi-${index}`}
                  name={`pypi-${index}`}
                  value={pypi}
                  onChange={e => handleArrayChange('pypi', index, e.target.value)}
                  placeholder="https://pypi.org/project/package-name"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900 placeholder-gray-400 bg-gray-50 py-2 pl-3"
                />
              </InputWithCheck>
            </div>
            {index > 0 && pypi === '' && formData.pypi.length > 1 && (
              <button
                type="button"
                onClick={() => removeArrayItem('pypi', index)}
                className="p-1 text-red-500 hover:text-red-700"
                aria-label="Remove PyPI Package"
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
    {/* Go Modules */}
    <div className="mb-6">
      <div className="flex items-center">
        <label htmlFor="go" className="block text-sm font-medium text-gray-700">
          Go Modules
        </label>
        <Tooltip content="Go module URLs" />
      </div>
      <div className="space-y-2">
        {formData.go.map((go: string, index: number) => (
          <div key={`go-${index}`} className="flex items-center gap-2">
            <div className="w-full max-w-md">
              <InputWithCheck
                value={!!go}
                isValid={!errors[`go_${index}`]}
                error={errors[`go_${index}`]}
              >
                <input
                  type="url"
                  id={`go-${index}`}
                  name={`go-${index}`}
                  value={go}
                  onChange={e => handleArrayChange('go', index, e.target.value)}
                  placeholder="https://pkg.go.dev/module-path"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900 placeholder-gray-400 bg-gray-50 py-2 pl-3"
                />
              </InputWithCheck>
            </div>
            {index > 0 && go === '' && formData.go.length > 1 && (
              <button
                type="button"
                onClick={() => removeArrayItem('go', index)}
                className="p-1 text-red-500 hover:text-red-700"
                aria-label="Remove Go Module"
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
    {/* Open Collective */}
    <div className="mb-6">
      <div className="flex items-center">
        <label htmlFor="open_collective" className="block text-sm font-medium text-gray-700">
          Open Collective
        </label>
        <Tooltip content="The Open Collective URL for the project" />
      </div>
      <div className="w-full max-w-md">
        <InputWithCheck
          value={!!formData.open_collective}
          isValid={!errors.open_collective}
          error={errors.open_collective}
        >
          <input
            type="url"
            id="open_collective"
            name="open_collective"
            value={formData.open_collective}
            onChange={e => handleInputChange('open_collective', e.target.value)}
            placeholder="https://opencollective.com/project-name"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900 placeholder-gray-400 bg-gray-50 py-2 pl-3"
          />
        </InputWithCheck>
      </div>
    </div>
  </div>
);

export default DevelopmentSection; 