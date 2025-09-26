import React from 'react';

const convertToGitHubBlobUrl = (rawUrl: string): string => {
  console.log('🔄 [ERROR_DISPLAY] Converting GitHub URL:', rawUrl);
  
  // Convert raw.githubusercontent.com URLs to github.com blob URLs
  if (rawUrl.includes('raw.githubusercontent.com')) {
    // Format: https://raw.githubusercontent.com/owner/repo/branch/path/file
    // Convert to: https://github.com/owner/repo/blob/branch/path/file
    const convertedUrl = rawUrl
      .replace('raw.githubusercontent.com', 'github.com')
      .replace(/^(https:\/\/github\.com\/[^\/]+\/[^\/]+)\/([^\/]+)\/(.*)$/, '$1/blob/$2/$3');
    console.log('✅ [ERROR_DISPLAY] Converted raw.githubusercontent.com URL to:', convertedUrl);
    return convertedUrl;
  }
  
  // Handle URLs that already have /raw/ in the path
  if (rawUrl.includes('/raw/')) {
    const convertedUrl = rawUrl.replace('/raw/', '/blob/');
    console.log('✅ [ERROR_DISPLAY] Converted /raw/ URL to:', convertedUrl);
    return convertedUrl;
  }
  
  // Return as-is if no conversion needed
  console.log('➡️ [ERROR_DISPLAY] URL returned as-is (no conversion needed):', rawUrl);
  return rawUrl;
};

interface ErrorDisplayProps {
  message: string;
  className?: string;
  onRetry?: () => void;
  githubUrl?: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ 
  message, 
  className = "",
  onRetry,
  githubUrl
}) => {
  return (
    <div className={`bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg ${className}`}>
      <div className="flex items-start">
        <svg className="w-6 h-6 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div className="flex-1">
          <p className="font-medium">{message}</p>
          <div className="mt-3 flex gap-3">
            {onRetry && (
              <button
                onClick={onRetry}
                className="text-sm bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded transition-colors"
              >
                Try Again
              </button>
            )}
            {githubUrl && (
              <a 
                href={convertToGitHubBlobUrl(githubUrl)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded transition-colors"
              >
                View on GitHub
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorDisplay;
