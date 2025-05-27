import React, { useState, useEffect } from 'react';
import yaml from 'js-yaml';

interface TagDefinition {
  tag_id: string;
  name: string;
  description: string;
  type: string;
  value_set?: string[] | string;
  creator: string;
}

interface Category {
  category_id: string;
  name: string;
  description: string;
  examples?: string;
}

interface TagDefinitionsYaml {
  version: string;
  tags: TagDefinition[];
}

interface CategoryDefinitionsYaml {
  version: string;
  categories: Category[];
}

interface CategoryGroup {
  name: string;
  categories: Category[];
}



const formatValueSet = (valueSet: string[] | string) => {
  if (Array.isArray(valueSet)) {
    return `Values: ${valueSet.join(', ')}`;
  }
  
  // Check if it's a URL
  if (valueSet.startsWith('http')) {
    return (
      <a 
        href={valueSet}
        target="_blank"
        rel="noopener noreferrer"
        className="text-green-700 hover:text-green-800 underline flex items-center"
      >
        View value set
        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </a>
    );
  }
  
  return `Values: ${valueSet}`;
};

const formatExamples = (examples?: string) => {
  if (!examples) return null;
  
  return examples.split('\n').map((line, index) => {
    const trimmedLine = line.trim();
    if (trimmedLine.startsWith('-')) {
      // Check if line contains a URL
      const urlMatch = trimmedLine.match(/(https?:\/\/[^\s]+)/);
      if (urlMatch) {
        const [url] = urlMatch;
        const text = trimmedLine.replace(url, '').replace('-', '').trim();
        return (
          <li key={index} className="ml-4 list-disc">
            {text}
            <a 
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:text-indigo-800 ml-1"
            >
              {new URL(url).hostname}
            </a>
          </li>
        );
      }
      return <li key={index} className="ml-4 list-disc">{trimmedLine.substring(1).trim()}</li>;
    }
    return <p key={index} className="mb-2">{trimmedLine}</p>;
  });
};

const TagDocumentation: React.FC = () => {
  const [tagDefinitions, setTagDefinitions] = useState<TagDefinition[]>([]);
  const [categoryGroups, setCategoryGroups] = useState<CategoryGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState(false);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedCreator, setSelectedCreator] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'categories'>('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tagResponse, categoryResponse] = await Promise.all([
          fetch('https://raw.githubusercontent.com/openlabelsinitiative/OLI/main/1_data_model/tags/tag_definitions.yml'),
          fetch('https://raw.githubusercontent.com/openlabelsinitiative/OLI/main/1_data_model/tags/valuesets/usage_category.yml')
        ]);

        const [tagText, categoryText] = await Promise.all([
          tagResponse.text(),
          categoryResponse.text()
        ]);

        const tagData = yaml.load(tagText) as TagDefinitionsYaml;
        const categoryData = yaml.load(categoryText) as CategoryDefinitionsYaml;

        // Parse category groups from YAML comments
        const lines = categoryText.split('\n');
        const groups: CategoryGroup[] = [];
        let currentGroupName: string | null = null;
        let currentCategories: Category[] = [];

        // First pass: find all group headers and their line numbers
        const groupHeaders = lines.reduce((acc, line, index) => {
          const groupMatch = line.match(/^[\s]*#[\s]*(.*Categories)[\s]*$/);
          if (groupMatch) {
            acc.push({
              name: groupMatch[1].trim(),
              lineNumber: index
            });
          }
          return acc;
        }, [] as Array<{ name: string; lineNumber: number }>);

        // Second pass: associate categories with their groups
        categoryData.categories.forEach(category => {
          const categoryLine = lines.findIndex(line => line.includes(`category_id: ${category.category_id}`));
          
          // Find the appropriate group for this category
          const groupIndex = groupHeaders.findIndex((header, index) => {
            const nextHeader = groupHeaders[index + 1];
            return categoryLine > header.lineNumber && 
                   (!nextHeader || categoryLine < nextHeader.lineNumber);
          });

          if (groupIndex >= 0) {
            const groupName = groupHeaders[groupIndex].name;
            const existingGroup = groups.find(g => g.name === groupName);
            if (existingGroup) {
              existingGroup.categories.push(category);
            } else {
              groups.push({
                name: groupName,
                categories: [category]
              });
            }
          }
        });

        setTagDefinitions(tagData.tags || []);
        setCategoryGroups(groups);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load documentation. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const uniqueTypes = Array.from(new Set(tagDefinitions.map(tag => tag.type)));
  const uniqueCreators = Array.from(new Set(tagDefinitions.map(tag => tag.creator)));

  const filteredTags = tagDefinitions.filter(tag => {
    const matchesSearch = tag.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tag.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tag.tag_id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = !selectedType || tag.type === selectedType;
    const matchesCreator = !selectedCreator || tag.creator === selectedCreator;

    return matchesSearch && matchesType && matchesCreator;
  });

  const renderCategoryGroup = (group: CategoryGroup) => (
    <div key={group.name} className="border border-gray-100 rounded-lg p-4">
      <h4 className="text-sm font-medium text-gray-900 mb-3">{group.name}</h4>
      <div className="space-y-4">
        {group.categories.map(category => (
          <div key={category.category_id} className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-start justify-between mb-2">
              <h5 className="text-sm font-medium text-gray-900">{category.name}</h5>
              <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
                {category.category_id}
              </code>
            </div>
            <p className="text-sm text-gray-600 mb-2">{category.description}</p>
            {category.examples && (
              <div className="mt-2">
                <h6 className="text-xs font-medium text-gray-700 mb-1">Examples:</h6>
                <div className="text-xs text-gray-600">
                  {formatExamples(category.examples)}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderTagContent = (tag: TagDefinition) => {
    if (tag.tag_id === 'usage_category') {
      return (
        <div>
          <p className="text-gray-600 mb-3">{tag.description}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-sm">
              Type: {tag.type}
            </span>
            <button
              onClick={() => setExpandedCategories(!expandedCategories)}
              className="px-2 py-1 bg-green-50 text-green-700 rounded text-sm flex items-center hover:bg-green-100"
            >
              {expandedCategories ? 'Hide Categories' : 'View Categories'}
              <svg
                className={`w-4 h-4 ml-1 transform transition-transform ${
                  expandedCategories ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
          {expandedCategories && (
            <div className="mt-4 space-y-6">
              {categoryGroups.map(renderCategoryGroup)}
            </div>
          )}
        </div>
      );
    }

    return (
      <div>
        <p className="text-gray-600 mb-3">{tag.description}</p>
        <div className="flex flex-wrap gap-2">
          <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-sm">
            Type: {tag.type}
          </span>
          {tag.value_set && (
            <span className="px-2 py-1 bg-green-50 text-green-700 rounded text-sm">
              {formatValueSet(tag.value_set)}
            </span>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading documentation...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg flex items-center">
        <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-8 sm:px-8">
          <div className="flex justify-between items-start">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold text-white">Data Model Documentation</h1>
              <p className="text-indigo-100 max-w-2xl">
                The Open Labels Initiative provides a standardized framework for labeling blockchain addresses.
              </p>
            </div>
            <a 
              href="https://github.com/openlabelsinitiative/OLI/tree/main/1_data_model"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors backdrop-blur-sm"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
              View on GitHub
            </a>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6 p-6 sm:p-8 bg-white">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Core Components</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'address', desc: 'Hexadecimal public address of a smart contract or EOA' },
                { label: 'chain_id', desc: 'CAIP-2 identifier (includes EIP-155)' },
                { label: 'tag_id', desc: 'Unique identifier for the tag concept' },
                { label: 'value', desc: 'The content/value of the applied tag' }
              ].map(item => (
                <div key={item.label} className="bg-gray-50 p-4 rounded-lg">
                  <code className="text-sm font-medium text-indigo-600">{item.label}</code>
                  <p className="mt-1 text-sm text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Value Sets</h3>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-600 mb-4">Tags can have predefined value sets that are either:</p>
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 relative mt-1">
                    <div className="absolute inset-0 bg-indigo-100 rounded-full"></div>
                    <div className="absolute inset-1 bg-indigo-500 rounded-full"></div>
                  </div>
                  <p className="ml-3 text-gray-700">Internal (maintained in OLI repository)</p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 relative mt-1">
                    <div className="absolute inset-0 bg-purple-100 rounded-full"></div>
                    <div className="absolute inset-1 bg-purple-500 rounded-full"></div>
                  </div>
                  <p className="ml-3 text-gray-700">External (maintained in other repositories)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
          <div className="flex gap-4">
            <select
              value={selectedType || ''}
              onChange={(e) => setSelectedType(e.target.value || null)}
              className="block w-full pl-3 pr-10 py-2.5 bg-gray-50 border border-gray-200 
                focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 
                rounded-lg text-gray-900 cursor-pointer hover:bg-gray-100 transition-colors"
            >
              <option value="">All Types</option>
              {uniqueTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <select
              value={selectedCreator || ''}
              onChange={(e) => setSelectedCreator(e.target.value || null)}
              className="block w-full pl-3 pr-10 py-2.5 bg-gray-50 border border-gray-200 
                focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 
                rounded-lg text-gray-900 cursor-pointer hover:bg-gray-100 transition-colors"
            >
              <option value="">All Creators</option>
              {uniqueCreators.map(creator => (
                <option key={creator} value={creator}>{creator}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="space-y-6">
        {activeTab === 'all' ? (
          <div className="grid gap-6">
            {filteredTags.map((tag) => (
              <div 
                key={tag.tag_id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:border-indigo-300 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{tag.name}</h3>
                    <code className="mt-1 inline-block text-sm bg-gray-100 px-2 py-1 rounded text-gray-600">
                      {tag.tag_id}
                    </code>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium">
                      {tag.type}
                    </span>
                  </div>
                </div>
                {renderTagContent(tag)}
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Created by: {tag.creator}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">Category Groups</h3>
              <button
                onClick={() => setExpandedCategories(!expandedCategories)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                {expandedCategories ? 'Collapse All' : 'Expand All'}
              </button>
            </div>
            <div className="space-y-6">
              {categoryGroups.map(renderCategoryGroup)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TagDocumentation; 