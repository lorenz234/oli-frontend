import React, { useState } from 'react';
import CodeBlock from './CodeBlock';

interface CodeExample {
  language: string;
  title: string;
  code: string;
}

interface CodeExamplesProps {
  examples: CodeExample[];
  defaultLanguage?: string;
  className?: string;
}

const CodeExamples: React.FC<CodeExamplesProps> = ({ 
  examples, 
  defaultLanguage,
  className = ""
}) => {
  const [activeExample, setActiveExample] = useState(() => {
    if (defaultLanguage) {
      const defaultIndex = examples.findIndex(ex => ex.language === defaultLanguage);
      return defaultIndex >= 0 ? defaultIndex : 0;
    }
    return 0;
  });

  if (examples.length === 0) {
    return null;
  }

  if (examples.length === 1) {
    const example = examples[0];
    return (
      <div className={className}>
        <CodeBlock 
          language={example.language}
          title={example.title}
        >
          {example.code}
        </CodeBlock>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 mb-4">
        {examples.map((example, index) => (
          <button
            key={index}
            onClick={() => setActiveExample(index)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeExample === index
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {example.title}
          </button>
        ))}
      </div>

      {/* Code Content */}
      <CodeBlock 
        language={examples[activeExample].language}
        title={examples[activeExample].title}
      >
        {examples[activeExample].code}
      </CodeBlock>
    </div>
  );
};

export default CodeExamples;
