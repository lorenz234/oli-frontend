import React, { useState, useRef, useEffect } from 'react';
import { formFields } from '../../constants/formFields';
import { Plus } from 'lucide-react';

interface BulkFieldSelectorProps {
  currentFields: string[];
  onAddField: (fieldId: string) => void;
  onRemoveField: (fieldId: string) => void;
}

const BulkFieldSelector: React.FC<BulkFieldSelectorProps> = ({ 
  currentFields, 
  onAddField
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter out fields that are already added and only show advanced fields
  const availableFields = formFields.filter(
    field => 
      !currentFields.includes(field.id) && 
      field.visibility === 'advanced'
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (availableFields.length === 0) {
    return null;
  }

  const handleFieldSelect = (fieldId: string) => {
    onAddField(fieldId);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
      >
        <Plus className="w-4 h-4 mr-1.5" />
        Add Field
      </button>
      {isOpen && (
        <div className="absolute z-10 w-64 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
          <div className="max-h-64 overflow-y-auto">
            {availableFields.map((field) => (
              <button
                key={field.id}
                onClick={() => handleFieldSelect(field.id)}
                className="block w-full px-4 py-2.5 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
              >
                <span className="text-sm text-gray-900">{field.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BulkFieldSelector; 