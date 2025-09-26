import React from 'react';

interface DocHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  children?: React.ReactNode;
}

const DocHeader: React.FC<DocHeaderProps> = ({ 
  title, 
  description, 
  actions,
  children 
}) => {
  return (
    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-8 sm:px-8">
      <div className="flex justify-between items-start">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-white">
            {title}
          </h1>
          {description && (
            <p className="text-indigo-100 max-w-2xl">
              {description}
            </p>
          )}
        </div>
        {actions && (
          <div className="flex flex-col gap-3">
            {actions}
          </div>
        )}
      </div>
      {children}
    </div>
  );
};

export default DocHeader;
