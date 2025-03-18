// UsageCategorySelect.tsx
import React from 'react';
import { CATEGORIES } from '../../constants/categories';
import CustomDropdown from './CustomDropdown';

interface UsageCategorySelectProps {
  value: string;
  onChange: (value: string) => void;
}

const UsageCategorySelect: React.FC<UsageCategorySelectProps> = ({ value, onChange }) => {
  // Format options for CustomDropdown
  const formattedOptions = CATEGORIES.flatMap(mainCategory => 
    mainCategory.categories.map(category => ({
      value: category.category_id,
      label: category.name,
      description: category.description || '',
      group: mainCategory.main_category_name // Use main_category_name as the group
    }))
  );
  
  return (
    <CustomDropdown
      id="usage_category"
      value={value}
      onChange={onChange}
      options={formattedOptions}
      placeholder="Select a category"
      showGroups={true} // Enable group headers
    />
  );
};

export default UsageCategorySelect;