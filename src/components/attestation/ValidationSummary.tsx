import React, { useEffect, useState } from 'react';
import { ValidationWarning, ProjectData } from '../../types/attestation';
import { fetchProjects, getSmartProjectSuggestions } from '../../utils/projectValidation';
import { getSmartCategorySuggestions, getCategoryDisplayInfo } from '../../utils/categoryValidation';

interface ValidationSummaryProps {
  errors: { [key: string]: string };
  warnings: { [key: string]: ValidationWarning[] };
  rows: any[];
  activeColumns: any[];
  onSuggestionClick: (rowIndex: number, field: string, suggestion: string) => void;
  onClose: () => void;
  onNavigateToField?: (rowIndex: number, field: string) => void;
  isValidationMode?: boolean; // New prop to distinguish between import feedback and validation
}

const ValidationSummary: React.FC<ValidationSummaryProps> = ({
  errors,
  warnings,
  rows,
  activeColumns,
  onSuggestionClick,
  onClose,
  onNavigateToField,
  isValidationMode = false
}) => {
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);

  useEffect(() => {
    const loadProjects = async () => {
      if (projects.length === 0) {
        setIsLoadingProjects(true);
        try {
          const projectData = await fetchProjects();
          setProjects(projectData);
        } catch (error) {
          console.error('Error loading projects:', error);
        } finally {
          setIsLoadingProjects(false);
        }
      }
    };
    loadProjects();
  }, [projects.length]);


  // Collect all errors and warnings
  const allIssues: Array<{
    type: 'error' | 'warning' | 'conversion';
    rowIndex: number;
    field: string;
    fieldName: string;
    message: string;
    suggestions?: string[];
    showAddProjectLink?: boolean;
    similarProjects?: string[];
  }> = [];

  // Process errors
  Object.entries(errors).forEach(([key, message]) => {
    const [rowIndex, field] = key.split('-');
    const fieldName = activeColumns.find(col => col.id === field)?.name || field;
    
    // Check if there are corresponding warnings with suggestions for this error
    const correspondingWarnings = warnings[key] || [];
    const suggestionsFromWarnings = correspondingWarnings.flatMap(w => w.suggestions || []);
    const showAddProjectLink = correspondingWarnings.some(w => w.showAddProjectLink);
    const similarProjects = correspondingWarnings.flatMap(w => w.similarProjects || []);
    
    allIssues.push({
      type: 'error',
      rowIndex: parseInt(rowIndex),
      field,
      fieldName,
      message,
      suggestions: suggestionsFromWarnings.length > 0 ? suggestionsFromWarnings : undefined,
      showAddProjectLink,
      similarProjects: similarProjects.length > 0 ? similarProjects : undefined
    });
  });

  // Process warnings
  // In import mode: show all warnings
  // In validation mode: only show warnings that have suggestions AND don't have corresponding errors
  Object.entries(warnings).forEach(([key, warningList]) => {
    const [rowIndex, field] = key.split('-');
    const fieldName = activeColumns.find(col => col.id === field)?.name || field;
    const hasCorrespondingError = errors[key] !== undefined;
    
    warningList.forEach(warning => {
      // Show warnings if:
      // - In import mode: show all warnings
      // - In validation mode: show warnings with suggestions that don't have corresponding errors
      const shouldShow = !isValidationMode || 
        (!hasCorrespondingError && (warning.suggestions || warning.showAddProjectLink));
      
      if (shouldShow) {
        allIssues.push({
          type: warning.isConversion ? 'conversion' : 'warning',
          rowIndex: parseInt(rowIndex),
          field,
          fieldName,
          message: warning.message,
          suggestions: warning.suggestions,
          showAddProjectLink: warning.showAddProjectLink,
          similarProjects: warning.similarProjects
        });
      }
    });
  });

  const errorCount = allIssues.filter(issue => issue.type === 'error').length;
  const warningCount = allIssues.filter(issue => issue.type === 'warning').length;
  const conversionCount = allIssues.filter(issue => issue.type === 'conversion').length;

  // Show success state if no errors (and no warnings in validation mode)
  if (errorCount === 0 && (isValidationMode || warningCount === 0)) {
    return (
      <div className="mb-3 bg-green-50 border border-green-200 rounded-lg shadow-sm overflow-hidden">
        {/* Success Header */}
        <div className="bg-green-100 border-b border-green-200 px-3 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-5 h-5 bg-green-200 rounded">
                <svg className="w-3 h-3 text-green-700" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
                          <h3 className="text-sm font-medium text-green-800">
              {isValidationMode ? 'Validation Complete' : 'Import Complete'}
            </h3>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-green-200 text-green-800">
                Ready to attest
              </span>
              {conversionCount > 0 && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700">
                  {conversionCount} conversion{conversionCount !== 1 ? 's' : ''}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-green-400 hover:text-green-600 transition-colors p-1 hover:bg-green-200 rounded"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Success Content */}
        <div className="p-3 text-center">
          <div className="flex items-center justify-center mb-2">
            <div className="w-8 h-8 bg-green-200 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-green-700" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <h4 className="text-base font-semibold text-green-800 mb-1">
            🎉 Congratulations! You&apos;re ready to bulk attest
          </h4>
          <p className="text-sm text-green-700">
            All validation checks have passed. You can now proceed with creating your bulk attestations.
          </p>
          {conversionCount > 0 && (
            <p className="text-xs text-blue-700 mt-2">
              {conversionCount} chain ID{conversionCount !== 1 ? 's were' : ' was'} automatically converted during import.
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-3 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      {/* Compact Header */}
      <div className="bg-gray-50 border-b border-gray-200 px-3 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-5 h-5 bg-amber-100 rounded">
              <svg className="w-3 h-3 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-sm font-medium text-gray-800">
              {isValidationMode ? 'Validation Issues' : 'Import Feedback'}
            </h3>
            <div className="flex items-center space-x-1">
              {errorCount > 0 && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700">
                  {errorCount} error{errorCount !== 1 ? 's' : ''}
                </span>
              )}
              {warningCount > 0 && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-700">
                  {warningCount} warning{warningCount !== 1 ? 's' : ''}
                </span>
              )}
              {conversionCount > 0 && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700">
                  {conversionCount} conversion{conversionCount !== 1 ? 's' : ''}
                </span>
              )}
              {errorCount === 0 && warningCount === 0 && conversionCount === 0 && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700">
                  All fixed!
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Compact Content */}
      <div className="p-2">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 max-h-56 overflow-y-auto custom-scrollbar">
          {allIssues.map((issue, index) => {
            const row = rows[issue.rowIndex];
            const address = row?.address || `Row ${issue.rowIndex + 1}`;
            
            return (
              <div
                key={index}
                className={`group relative border rounded-lg p-3 transition-all duration-300 hover:shadow-sm ${
                  issue.type === 'error' 
                    ? 'bg-red-50 border-red-200 hover:bg-red-100'
                    : issue.type === 'conversion'
                    ? 'bg-blue-50 border-blue-200 hover:bg-blue-100'
                    : 'bg-amber-50 border-amber-200 hover:bg-amber-100'
                } ${onNavigateToField ? 'cursor-pointer' : ''}`}
                onClick={() => onNavigateToField && onNavigateToField(issue.rowIndex, issue.field)}
              >
                {/* Compact Issue Header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${
                      issue.type === 'error' ? 'bg-red-500' 
                      : issue.type === 'conversion' ? 'bg-blue-500'
                      : 'bg-amber-500'
                    }`}></div>
                    <span className={`text-xs font-medium ${
                      issue.type === 'error' ? 'text-red-800'
                      : issue.type === 'conversion' ? 'text-blue-800'
                      : 'text-amber-800'
                    }`}>
                      {issue.type === 'error' ? 'Error' 
                       : issue.type === 'conversion' ? 'Converted'
                       : 'Warning'}
                    </span>
                    <span className="text-xs text-gray-500 bg-white px-1.5 py-0.5 rounded border">
                      Row {issue.rowIndex + 1} • {issue.fieldName}
                    </span>
                  </div>
                  {onNavigateToField && (
                    <svg className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  )}
                </div>

                {/* Address and Message */}
                <div className="mb-3">
                  {address && (
                    <div className="mb-1">
                      <span className="inline-block font-mono text-xs text-gray-600 bg-white px-2 py-1 rounded border">
                        {address.length > 16 ? `${address.substring(0, 16)}...` : address}
                      </span>
                    </div>
                  )}
                  <p className={`text-sm ${
                    issue.type === 'error' ? 'text-red-700'
                    : issue.type === 'conversion' ? 'text-blue-700'
                    : 'text-amber-700'
                  }`}>
                    {issue.message}
                  </p>
                </div>

                {/* Compact Actions */}
                <div className="space-y-2">
                  {/* Quick Fix Suggestions */}
                  <div>
                    <div className="text-xs font-medium text-gray-600 mb-1">Quick Fix:</div>
                    <div className="flex flex-wrap gap-1">
                      {issue.suggestions && issue.suggestions.map((suggestion, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSuggestionClick(issue.rowIndex, issue.field, suggestion);
                          }}
                          className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                      
                      {/* Add Project Button always shown in quick fixes for owner_project field */}
                      {issue.field === 'owner_project' && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open('/project', '_blank');
                          }}
                          className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded hover:bg-green-200 transition-colors"
                        >
                          + Add New Project
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Smart suggestions based on real project data */}
                  {!issue.suggestions && !issue.similarProjects && !issue.showAddProjectLink && issue.field === 'owner_project' && (() => {
                    const row = rows[issue.rowIndex];
                    const currentValue = row?.[issue.field] || '';
                    const smartSuggestions = projects.length > 0 ? getSmartProjectSuggestions(currentValue, projects) : [];
                    
                    return smartSuggestions.length > 0 ? (
                      <div>
                        <div className="text-xs font-medium text-gray-600 mb-1">
                          {isLoadingProjects ? 'Loading...' : 'Smart Suggestions:'}
                        </div>
                        {!isLoadingProjects && (
                          <div className="flex flex-wrap gap-1">
                            {smartSuggestions.map((suggestion, i) => (
                              <button
                                key={i}
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onSuggestionClick(issue.rowIndex, issue.field, suggestion);
                                }}
                                className="inline-flex items-center px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 rounded hover:bg-indigo-200 transition-colors"
                              >
                                ★ {suggestion}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : null;
                  })()}

                  {/* Smart suggestions for usage_category */}
                  {!issue.suggestions && issue.field === 'usage_category' && (() => {
                    const row = rows[issue.rowIndex];
                    const currentValue = row?.[issue.field] || '';
                    const smartSuggestions = getSmartCategorySuggestions(currentValue);
                    
                    return smartSuggestions.length > 0 ? (
                      <div>
                        <div className="text-xs font-medium text-gray-600 mb-1">Category Suggestions:</div>
                        <div className="flex flex-wrap gap-1">
                          {smartSuggestions.map((suggestion, i) => {
                            const categoryInfo = getCategoryDisplayInfo(suggestion);
                            return (
                              <button
                                key={i}
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onSuggestionClick(issue.rowIndex, issue.field, suggestion);
                                }}
                                className="inline-flex items-center px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded hover:bg-purple-200 transition-colors"
                                title={categoryInfo?.description || suggestion}
                              >
                                🏷️ {categoryInfo?.name || suggestion}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ) : null;
                  })()}
                </div>
              </div>
            );
          })}
        </div>

        {/* Simple Footer */}
        <div className="mt-2 pt-2 border-t border-gray-200 text-center">
          <span className="text-xs text-gray-500">
            {isValidationMode 
              ? 'Click any issue to navigate • Quick fixes available'
              : 'Review the changes made during import • Click any issue to navigate'
            }
          </span>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f8fafc;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
};

export default ValidationSummary; 