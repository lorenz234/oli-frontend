import React from 'react';

interface TagCardProps {
  title: string;
  tagId: string;
  type: string;
  creator: string;
  children: React.ReactNode;
  className?: string;
}

const TagCard: React.FC<TagCardProps> = ({ 
  title, 
  tagId, 
  type, 
  creator, 
  children,
  className = ""
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:border-indigo-300 transition-colors ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          <code className="mt-1 inline-block text-sm bg-gray-100 px-2 py-1 rounded text-gray-600">
            {tagId}
          </code>
        </div>
        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium">
            {type}
          </span>
        </div>
      </div>
      
      {children}
      
      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-4 text-sm text-gray-500">
        <span className="flex items-center">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Created by: {creator}
        </span>
      </div>
    </div>
  );
};

export default TagCard;
