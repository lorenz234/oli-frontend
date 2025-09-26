import React from 'react';
import CodeBlock from './CodeBlock';

const convertToGitHubBlobUrl = (rawUrl: string): string => {
  console.log('🔄 [YAML_VIEWER] Converting GitHub URL:', rawUrl);
  
  // Convert raw.githubusercontent.com URLs to github.com blob URLs
  if (rawUrl.includes('raw.githubusercontent.com')) {
    // Format: https://raw.githubusercontent.com/owner/repo/branch/path/file
    // Convert to: https://github.com/owner/repo/blob/branch/path/file
    const convertedUrl = rawUrl
      .replace('raw.githubusercontent.com', 'github.com')
      .replace(/^(https:\/\/github\.com\/[^\/]+\/[^\/]+)\/([^\/]+)\/(.*)$/, '$1/blob/$2/$3');
    console.log('✅ [YAML_VIEWER] Converted raw.githubusercontent.com URL to:', convertedUrl);
    return convertedUrl;
  }
  
  // Handle URLs that already have /raw/ in the path
  if (rawUrl.includes('/raw/')) {
    const convertedUrl = rawUrl.replace('/raw/', '/blob/');
    console.log('✅ [YAML_VIEWER] Converted /raw/ URL to:', convertedUrl);
    return convertedUrl;
  }
  
  // Return as-is if no conversion needed
  console.log('➡️ [YAML_VIEWER] URL returned as-is (no conversion needed):', rawUrl);
  return rawUrl;
};

interface YamlViewerProps {
  title: string;
  description: string;
  content: string;
  githubUrl?: string;
  className?: string;
}

const YamlViewer: React.FC<YamlViewerProps> = ({ 
  title, 
  description, 
  content, 
  githubUrl,
  className = ""
}) => {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="prose prose-lg max-w-none">
        <h1>{title}</h1>
        <p className="text-gray-600">{description}</p>
      </div>

      {/* YAML Content */}
      <div>
        <CodeBlock 
          language="yaml" 
          title="Configuration File"
        >
          {content}
        </CodeBlock>
      </div>

      {/* Footer with GitHub link */}
      {githubUrl && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-blue-700">
              View the latest version of this file on GitHub:
            </div>
            <a 
              href={convertToGitHubBlobUrl(githubUrl)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
            >
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
              View on GitHub
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default YamlViewer;
