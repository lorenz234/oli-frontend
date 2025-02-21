// components/FormLabel.tsx
import React from 'react';
import Tooltip from './Tooltip';
import { TAG_DESCRIPTIONS } from '../constants/tagDescriptions';

interface FormLabelProps {
  htmlFor: string;
  label: string;
  tooltipKey?: keyof typeof TAG_DESCRIPTIONS;
  className?: string;
}

const FormLabel: React.FC<FormLabelProps> = ({ 
  htmlFor, 
  label, 
  tooltipKey,
  className = "block text-sm font-medium text-gray-700" 
}) => {
  return (
    <div className="flex items-center">
      <label htmlFor={htmlFor} className={className}>
        {label}
      </label>
      {tooltipKey && TAG_DESCRIPTIONS[tooltipKey] && (
        <Tooltip content={TAG_DESCRIPTIONS[tooltipKey]} />
      )}
    </div>
  );
};

export default FormLabel;