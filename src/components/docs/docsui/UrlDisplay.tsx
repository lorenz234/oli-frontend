import React, { useState } from 'react';

interface UrlDisplayProps {
  url: string;
  label?: string;
  className?: string;
  showCopyButton?: boolean;
}

const UrlDisplay: React.FC<UrlDisplayProps> = ({ 
  url, 
  label, 
  className = "",
  showCopyButton = true
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  return (
    <div className={`bg-gray-900 border border-gray-700 rounded-lg overflow-hidden ${className}`}>
      <div className="flex items-center">
        <div className="flex-1 p-4">
          {label && (
            <div className="text-sm font-medium text-gray-300 mb-2">{label}</div>
          )}
          <code className="block text-sm text-gray-100 break-all font-mono">
            {url}
          </code>
        </div>
        <div className="flex items-center gap-2 px-4">
          {showCopyButton && (
            <button
              onClick={handleCopy}
              className="inline-flex items-center px-3 py-1.5 bg-gray-800 text-gray-300 text-sm rounded hover:bg-gray-700 transition-colors"
              title="Copy URL"
            >
              {copied ? (
                <>
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy
                </>
              )}
            </button>
          )}
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-3 py-1.5 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700 transition-colors"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Open
          </a>
        </div>
      </div>
    </div>
  );
};

export default UrlDisplay;