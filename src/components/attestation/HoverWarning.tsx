import React, { memo, useState, useRef } from 'react';
import { ValidationWarning } from '../../types/attestation';
import Link from 'next/link';

interface HoverWarningProps {
  warnings: ValidationWarning[];
  onSuggestionClick: (suggestion: string) => void;
  children: React.ReactNode;
}

const HoverWarning = memo<HoverWarningProps>(({ 
  warnings, 
  onSuggestionClick,
  children 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);

  const calculatePosition = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const popupWidth = 320;
      const popupHeight = 200; // Approximate height
      
      let left = rect.left;
      let top = rect.bottom + 5;
      
      // Adjust if popup would go off the right edge
      if (left + popupWidth > window.innerWidth) {
        left = window.innerWidth - popupWidth - 10;
      }
      
      // Adjust if popup would go off the bottom edge
      if (top + popupHeight > window.innerHeight) {
        top = rect.top - popupHeight - 5;
      }
      
      setPopupPosition({ top, left });
    }
  };

  const handleMouseEnter = () => {
    calculatePosition();
    setIsVisible(true);
  };

  if (!warnings.length) {
    return <>{children}</>;
  }

  return (
    <div 
      ref={triggerRef}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      
      {/* Warning indicator - Yellow question mark */}
      <div className="absolute top-2 right-8 text-yellow-400 font-bold text-sm">?</div>

      {/* Hover popup */}
      {isVisible && (
        <div 
          className="fixed bg-white border border-amber-300 rounded-lg shadow-xl p-3 w-80 max-w-sm" 
          style={{
            zIndex: 9999,
            left: `${popupPosition.left}px`,
            top: `${popupPosition.top}px`
          }}
        >
          {warnings.map((warning, index) => (
            <div key={index} className={index > 0 ? 'mt-3 pt-3 border-t border-amber-200' : ''}>
              <div className="flex items-start gap-2">
                <svg className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div className="flex-1">
                  <p className="text-sm text-gray-800 font-medium">{warning.message}</p>
                  
                  {warning.suggestions && warning.suggestions.length > 0 && (
                    <div className="mt-2 space-y-1">
                      <p className="text-xs text-gray-600">Quick fixes:</p>
                      {warning.suggestions.map((suggestion, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => {
                            onSuggestionClick(suggestion);
                            setIsVisible(false);
                          }}
                          className="block w-full text-left px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors border border-blue-200"
                        >
                          Use &quot;{suggestion}&quot;
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {warning.showAddProjectLink && (
                    <div className="mt-2">
                      <Link 
                        href="/project" 
                        target="_blank"
                        className="inline-flex items-center px-3 py-2 text-sm bg-green-50 text-green-700 rounded hover:bg-green-100 transition-colors border border-green-200"
                        onClick={() => setIsVisible(false)}
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Add New Project
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

HoverWarning.displayName = 'HoverWarning';

export default HoverWarning;