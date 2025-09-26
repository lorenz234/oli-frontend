import React from 'react';

interface InfoItem {
  label: string;
  description: string;
}

interface InfoSectionProps {
  title: string;
  items: InfoItem[];
  className?: string;
  itemClassName?: string;
}

const InfoSection: React.FC<InfoSectionProps> = ({ 
  title, 
  items, 
  className = "",
  itemClassName = ""
}) => {
  return (
    <div className={`p-6 sm:p-8 bg-white border-b border-gray-200 ${className}`}>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <div className="grid grid-cols-2 gap-4">
          {items.map(item => (
            <div key={item.label} className={`bg-gray-50 p-4 rounded-lg ${itemClassName}`}>
              <code className="text-sm font-medium text-indigo-600">{item.label}</code>
              <p className="mt-1 text-sm text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InfoSection;
