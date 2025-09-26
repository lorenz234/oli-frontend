import React from 'react';

interface DocContentProps {
  children: React.ReactNode;
  className?: string;
}

const DocContent: React.FC<DocContentProps> = ({ children, className = "" }) => {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden ${className}`}>
      {children}
    </div>
  );
};

interface DocContentBodyProps {
  children: React.ReactNode;
  className?: string;
}

export const DocContentBody: React.FC<DocContentBodyProps> = ({ children, className = "" }) => {
  return (
    <div className={`p-6 ${className}`}>
      {children}
    </div>
  );
};

export default DocContent;
