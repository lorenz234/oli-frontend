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

const TagDocumentation: React.FC = () => {
  const [tagDefinitions, setTagDefinitions] = useState<TagDefinition[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'tags' | 'categories'>('tags');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch tag definitions
        const tagResponse = await fetch('https://raw.githubusercontent.com/openlabelsinitiative/OLI/main/1_data_model/tags/tag_definitions.yml');
        const tagText = await tagResponse.text();
        const tagData = yaml.load(tagText) as TagDefinitionsYaml;

        // Fetch category definitions
        const categoryResponse = await fetch('https://raw.githubusercontent.com/openlabelsinitiative/OLI/main/1_data_model/tags/valuesets/category_definitions.yml');
        const categoryText = await categoryResponse.text();
        const categoryData = yaml.load(categoryText) as CategoryDefinitionsYaml;

        setTagDefinitions(tagData.tags);
        setCategories(categoryData.categories);
        setLoading(false);
      } catch (err) {
        setError('Failed to load documentation. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredTags = tagDefinitions.filter(tag =>
    tag.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tag.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tag.tag_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.category_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-semibold text-gray-900">Data Model Documentation</h2>
            <a 
              href="https://github.com/openlabelsinitiative/OLI/tree/main/1_data_model"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
              View on GitHub
            </a>
          </div>
          <div className="space-y-4 text-gray-600">
            <p>
              The Open Labels Initiative provides a standardized framework for labeling blockchain addresses. 
              Each label consists of a pre-defined <code className="px-1 py-0.5 bg-gray-100 rounded text-sm">tag_id</code> with 
              a <code className="px-1 py-0.5 bg-gray-100 rounded text-sm">value</code> assigned to 
              an <code className="px-1 py-0.5 bg-gray-100 rounded text-sm">address</code> & <code className="px-1 py-0.5 bg-gray-100 rounded text-sm">chain_id</code> combination.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Core Components</h3>
                <ul className="space-y-2 text-sm">
                  <li><strong>address:</strong> Hexadecimal public address of a smart contract or EOA</li>
                  <li><strong>chain_id:</strong> CAIP-2 identifier (includes EIP-155)</li>
                  <li><strong>tag_id:</strong> Unique identifier for the tag concept</li>
                  <li><strong>value:</strong> The content/value of the applied tag</li>
                </ul>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Value Sets</h3>
                <p className="text-sm">
                  Some tags have predefined value sets that can be either:
                </p>
                <ul className="space-y-1 text-sm mt-2">
                  <li>• Internal (maintained in OLI repository)</li>
                  <li>• External (maintained in other repositories)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Tab Navigation */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveTab('tags')}
                className={`px-4 py-2 rounded-md ${
                  activeTab === 'tags'
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Tags ({tagDefinitions.length})
              </button>
              <button
                onClick={() => setActiveTab('categories')}
                className={`px-4 py-2 rounded-md ${
                  activeTab === 'categories'
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Categories ({categories.length})
              </button>
            </div>
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {activeTab === 'tags' ? (
            <div className="grid gap-6">
              {filteredTags.map((tag) => (
                <div key={tag.tag_id} className="border border-gray-200 rounded-lg p-4 hover:border-indigo-200 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-medium text-gray-900">{tag.name}</h3>
                    <code className="text-sm bg-gray-100 px-2 py-1 rounded text-gray-600">
                      {tag.tag_id}
                    </code>
                  </div>
                  <p className="text-gray-600 mb-3">{tag.description}</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-sm">
                      Type: {tag.type}
                    </span>
                    {tag.value_set && (
                      <span className="px-2 py-1 bg-green-50 text-green-700 rounded text-sm">
                        {typeof tag.value_set === 'string' && tag.tag_id === 'oli.usage_category' ? (
                          <button 
                            onClick={() => {
                              setActiveTab('categories');
                              setSearchTerm('');
                            }}
                            className="text-green-700 hover:text-green-800 underline"
                          >
                            View all categories
                          </button>
                        ) : (
                          Array.isArray(tag.value_set) 
                            ? `Values: ${tag.value_set.join(', ')}`
                            : `Values: ${tag.value_set}`
                        )}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid gap-6">
              {filteredCategories.map((category) => (
                <div key={category.category_id} className="border border-gray-200 rounded-lg p-4 hover:border-indigo-200 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-medium text-gray-900">{category.name}</h3>
                    <code className="text-sm bg-gray-100 px-2 py-1 rounded text-gray-600">
                      {category.category_id}
                    </code>
                  </div>
                  <p className="text-gray-600 mb-3">{category.description}</p>
                  {category.examples && (
                    <div className="mt-2">
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Examples:</h4>
                      <div className="bg-gray-50 rounded p-3 text-sm text-gray-600 whitespace-pre-wrap">
                        {category.examples}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TagDocumentation; 