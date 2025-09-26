import React from 'react';

interface TagSchema {
  type: string;
  enum?: string[];
  items?: {
    type: string;
    enum?: string[];
    required?: string[];
    properties?: Record<string, any>;
  };
  format?: string;
  minLength?: number;
  maxLength?: number;
  required?: string[];
  properties?: Record<string, any>;
}

interface SchemaDisplayProps {
  schema: TagSchema;
  className?: string;
}

const formatSchemaConstraints = (schema: TagSchema) => {
  const constraints = [];
  
  if (schema.format) {
    constraints.push(`Format: ${schema.format}`);
  }
  
  if (schema.minLength && schema.maxLength) {
    constraints.push(`Length: ${schema.minLength}-${schema.maxLength} characters`);
  } else if (schema.minLength) {
    constraints.push(`Min length: ${schema.minLength} characters`);
  } else if (schema.maxLength) {
    constraints.push(`Max length: ${schema.maxLength} characters`);
  }
  
  if (schema.items && !schema.items.enum) {
    constraints.push(`Array items: ${schema.items.type}`);
  }
  
  if (schema.properties && !(schema.type === 'array' && schema.items?.type === 'object')) {
    const props = Object.keys(schema.properties);
    constraints.push(`Properties: ${props.join(', ')}`);
  }
  
  return constraints.join(' | ');
};

const renderComplexSchema = (schema: TagSchema) => {
  // Handle array of objects (like audit)
  if (schema.type === 'array' && schema.items?.type === 'object' && schema.items.properties) {
    const items = schema.items;
    const properties = items.properties;
    if (!properties) return null;
    
    return (
      <div className="mt-3 p-3 bg-gray-50 rounded-lg border">
        <div className="text-sm font-medium text-gray-700 mb-2">Array of objects with:</div>
        <div className="space-y-1">
          {Object.entries(properties).map(([key, value]: [string, any]) => (
            <div key={key} className="flex items-center gap-2 text-sm">
              <code className="px-2 py-1 bg-white rounded text-gray-800 font-mono text-xs">
                {key}
              </code>
              <span className="text-gray-600">
                {value.type}
                {value.format && (
                  <span className="ml-1 px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                    {value.format}
                  </span>
                )}
              </span>
              {items.required?.includes(key) && (
                <span className="px-1.5 py-0.5 bg-red-100 text-red-700 rounded text-xs font-medium">
                  required
                </span>
              )}
              {value.description && (
                <span className="text-gray-500 text-xs">- {value.description}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  // Handle array with enum values (like erc_type)
  if (schema.type === 'array' && schema.items?.type === 'string' && schema.items.enum) {
    return (
      <div className="mt-3 p-3 bg-gray-50 rounded-lg border">
        <div className="text-sm font-medium text-gray-700 mb-2">Possible values:</div>
        <div className="flex flex-wrap gap-1.5">
          {schema.items.enum.map((value: string) => (
            <span 
              key={value}
              className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-mono hover:bg-purple-200 transition-colors"
            >
              {value}
            </span>
          ))}
        </div>
      </div>
    );
  }
  
  // Handle simple enum values (not in arrays)
  if (schema.enum) {
    return (
      <div className="mt-3 p-3 bg-gray-50 rounded-lg border">
        <div className="text-sm font-medium text-gray-700 mb-2">Possible values:</div>
        <div className="flex flex-wrap gap-1.5">
          {schema.enum.map((value: string) => (
            <span 
              key={value}
              className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-mono hover:bg-green-200 transition-colors"
            >
              {value}
            </span>
          ))}
        </div>
      </div>
    );
  }
  
  return null;
};

const SchemaDisplay: React.FC<SchemaDisplayProps> = ({ schema, className = "" }) => {
  return (
    <div className={className}>
      <div className="flex flex-wrap gap-2">
        <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-sm">
          Type: {schema.type}
        </span>
        {(schema.format || schema.minLength || schema.maxLength || (schema.items && !schema.items.enum && schema.items.type !== 'object') || (schema.properties && !(schema.type === 'array' && schema.items?.type === 'object'))) && (
          <span className="px-2 py-1 bg-green-50 text-green-700 rounded text-sm">
            {formatSchemaConstraints(schema)}
          </span>
        )}
      </div>
      {renderComplexSchema(schema)}
    </div>
  );
};

export default SchemaDisplay;
