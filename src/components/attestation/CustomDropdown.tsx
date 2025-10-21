// components/attestation/CustomDropdown.tsx
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { isOrbitChain } from '@/constants/chains';

// Enhanced DropdownOption to support grouping and descriptions
interface DropdownOption {
  value: string | number;
  label: string;
  description?: string;
  group?: string;
}

interface CustomDropdownProps {
  id: string;
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
  error?: string;
  showGroups?: boolean; // Option to show or hide group headers
  isProjectDropdown?: boolean; // New prop to identify if this is the Owner Project dropdown
  isChainDropdown?: boolean; // New prop to identify if this is a chain dropdown
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  id,
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  required = false,
  className = '',
  error,
  showGroups = true,
  isProjectDropdown = false,
  isChainDropdown = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Find the selected option label
  const selectedOption = options.find(option => String(option.value) === String(value));
  const displayText = selectedOption ? selectedOption.label : placeholder;

  // Group options by their group property (if present)
  const groupedOptions = options.reduce((groups: Record<string, DropdownOption[]>, option) => {
    const group = option.group || 'Ungrouped';
    if (!groups[group]) {
      groups[group] = [];
    }
    groups[group].push(option);
    return groups;
  }, {});

  // Filter options based on search term
  const filteredOptions = searchTerm.trim() === '' 
    ? options 
    : options.filter(option => 
        option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (option.description && option.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Handle toggling the dropdown
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (isOpen) {
      // Clear search when closing
      setSearchTerm('');
    }
  };

  // Render group headers or just the options
  const renderOptions = () => {
    if (!showGroups || Object.keys(groupedOptions).length <= 1) {
      // Just render all options if there are no groups or we don't want to show them
      return filteredOptions.map(option => renderOption(option));
    } else {
      // Render options with group headers
      return Object.entries(groupedOptions).map(([group, groupOptions]) => {
        // Filter options in this group
        const filteredGroupOptions = groupOptions.filter(option => 
          filteredOptions.some(fOption => String(fOption.value) === String(option.value))
        );
        
        // Only show groups that have options after filtering
        if (filteredGroupOptions.length === 0) return null;

        return (
          <div key={group}>
            <div className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50">
              {group}
            </div>
            {filteredGroupOptions.map(option => renderOption(option))}
          </div>
        );
      });
    }
  };

  // Render a single option
  const renderOption = (option: DropdownOption) => {
    const isOrbit = isChainDropdown && isOrbitChain(String(option.value));
    const isSelected = String(value) === String(option.value);
    
    return (
      <li
        key={String(option.value)}
        id={`${id}-option-${option.value}`}
        role="option"
        aria-selected={isSelected}
        className={`cursor-pointer select-none relative py-2 pl-3 pr-9 ${
          isSelected
            ? 'text-white bg-indigo-600'
            : 'text-gray-900 hover:bg-indigo-100'
        }`}
        onClick={() => {
          onChange(String(option.value));
          setIsOpen(false);
          setSearchTerm('');
        }}
        title={option.description}
      >
        <div className="flex flex-col">
          <span className={`flex items-center gap-2 truncate ${isSelected ? 'font-semibold' : 'font-normal'}`}>
            {option.label}
            {isOrbit && (
              <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${
                isSelected 
                  ? 'bg-white/20 text-white' 
                  : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
              }`}>
                <svg className="w-2.5 h-2.5 mr-0.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor" opacity="0.6"/>
                  <path d="M2 17L12 22L22 17L12 12L2 17Z" fill="currentColor"/>
                </svg>
                Orbit
              </span>
            )}
          </span>
          {option.description && (
            <span className={`text-xs ${
              isSelected ? 'text-indigo-100' : 'text-gray-500'
            }`}>
              {option.description}
            </span>
          )}
        </div>

        {isSelected && (
          <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-white">
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </span>
        )}
      </li>
    );
  };

  // Render project not found message
  const renderProjectNotFound = () => (
    <div className="px-3 py-4 text-sm">
      <p className="font-medium text-gray-700 mb-2">
        Couldn&apos;t find your project?
      </p>
      <ul className="list-disc pl-5 text-gray-600 space-y-1 mb-3">
        <li>Check if you&apos;ve spelled the project name correctly</li>
        <li>Try searching by the project&apos;s GitHub name</li>
        <li>Search with different keywords related to your project</li>
      </ul>
      <p className="text-gray-700 mb-2">
        If you still can&apos;t find your project, you can add it to our directory:
      </p>
      <Link 
        href="/project" 
        className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm font-medium transition-colors"
      >
        Add New Project
      </Link>
    </div>
  );

  return (
    <div ref={dropdownRef} className={`relative ${className}`} style={{ overflow: 'visible !important' }}>
      <button
        type="button"
        id={id}
        className={`w-full px-4 py-2 text-left bg-gray-50 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-700 flex items-center justify-between`}
        onClick={toggleDropdown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className={`block truncate ${!selectedOption ? 'text-gray-400' : 'text-gray-900'}`}>
          {displayText}
        </span>
        <span className="ml-2 pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </span>
      </button>

      {/* Hidden native select for form submission */}
      <select
        id={`${id}-native`}
        name={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="sr-only"
        aria-hidden="true"
      >
        <option value="" disabled>{placeholder}</option>
        {options.map(option => (
          <option key={String(option.value)} value={String(option.value)}>
            {option.label}
          </option>
        ))}
      </select>

      {/* Dropdown menu with absolute positioning */}
      {isOpen && (
        <div 
          className="absolute z-[500] left-0 right-0" 
          style={{ 
            position: 'absolute', 
            top: '100%', 
            left: '0',
            width: '100%',
            minWidth: '320px',
            marginTop: '4px',
            zIndex: 9999
          }}
        >
          <div className="bg-white shadow-lg max-h-60 rounded-md text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
            {/* Search input - sticky at the top with no gap */}
            <div className="px-3 py-2 sticky top-0 z-10 bg-white border-b shadow-sm">
              <input
                ref={inputRef}
                type="text"
                className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            
            <ul tabIndex={-1} role="listbox" aria-labelledby={id} aria-activedescendant={value ? `${id}-option-${value}` : undefined}>
              {filteredOptions.length === 0 ? (
                isProjectDropdown && searchTerm ? 
                renderProjectNotFound() : 
                <li className="px-3 py-2 text-gray-500 text-center">No results found</li>
              ) : (
                renderOptions()
              )}
            </ul>
          </div>
        </div>
      )}
      
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

export default CustomDropdown;