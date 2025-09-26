import React from 'react';

interface FilterOption {
  value: string;
  label: string;
}

interface SearchFilterProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  searchPlaceholder?: string;
  filters?: {
    label: string;
    value: string | null;
    onChange: (value: string | null) => void;
    options: FilterOption[];
  }[];
  className?: string;
}

const SearchFilter: React.FC<SearchFilterProps> = ({ 
  searchTerm, 
  onSearchChange,
  searchPlaceholder = "Search...",
  filters = [],
  className = ""
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 ${className}`}>
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg 
                focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 
                placeholder-gray-400 text-gray-900 transition-colors"
            />
            <svg
              className="absolute left-3 top-3 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        {filters.length > 0 && (
          <div className="flex gap-4">
            {filters.map((filter, index) => (
              <select
                key={index}
                value={filter.value || ''}
                onChange={(e) => filter.onChange(e.target.value || null)}
                className="block w-full pl-3 pr-10 py-2.5 bg-gray-50 border border-gray-200 
                  focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 
                  rounded-lg text-gray-900 cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <option value="">{filter.label}</option>
                {filter.options.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchFilter;
