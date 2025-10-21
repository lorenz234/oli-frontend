// src/components/OrbitChainBadge.tsx
import React from 'react';
import { isOrbitChain, getOrbitChainMetadata } from '@/constants/chains';

interface OrbitChainBadgeProps {
  caip2: string;
  showTooltip?: boolean;
  variant?: 'compact' | 'default' | 'detailed';
  className?: string;
}

export const OrbitChainBadge: React.FC<OrbitChainBadgeProps> = ({ 
  caip2, 
  showTooltip = true,
  variant = 'default',
  className = ''
}) => {
  const isOrbit = isOrbitChain(caip2);
  
  if (!isOrbit) {
    return null;
  }

  const metadata = getOrbitChainMetadata(caip2);
  
  if (!metadata) {
    return null;
  }

  const tooltipText = `Arbitrum Orbit Chain • Parent: ${metadata.parentChain} • Layer ${metadata.layer}`;

  if (variant === 'compact') {
    return (
      <span 
        className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 ${className}`}
        title={showTooltip ? tooltipText : undefined}
      >
        Orbit
      </span>
    );
  }

  if (variant === 'detailed') {
    return (
      <div className={`inline-flex flex-col gap-1 ${className}`}>
        <span 
          className="inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
          title={showTooltip ? tooltipText : undefined}
        >
          <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor" opacity="0.6"/>
            <path d="M2 17L12 22L22 17L12 12L2 17Z" fill="currentColor"/>
          </svg>
          Arbitrum Orbit
        </span>
        <span className="text-xs text-gray-600 dark:text-gray-400">
          {metadata.parentChain} • L{metadata.layer}
        </span>
      </div>
    );
  }

  // Default variant
  return (
    <span 
      className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gradient-to-r from-blue-500 to-cyan-500 text-white ${className}`}
      title={showTooltip ? tooltipText : undefined}
    >
      <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor" opacity="0.6"/>
        <path d="M2 17L12 22L22 17L12 12L2 17Z" fill="currentColor"/>
      </svg>
      Orbit
    </span>
  );
};

export default OrbitChainBadge;

