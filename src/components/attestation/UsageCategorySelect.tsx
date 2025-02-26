// UsageCategorySelect.tsx - Create this as a separate component file
import React from 'react';
import { CATEGORIES } from '../../constants/categories';

interface UsageCategorySelectProps {
  value: string;
  onChange: (value: string) => void;
}

const UsageCategorySelect: React.FC<UsageCategorySelectProps> = ({ value, onChange }) => {
  return (
    <select
      id="usage_category"
      name="usage_category"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900 placeholder-gray-400 bg-gray-50 py-2 pl-3"
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
  );
};

export default UsageCategorySelect;