import React from 'react';

interface SidebarSection {
  id: string;
  title: string;
  githubUrl?: string;
  children?: SidebarSection[];
  isClickable?: boolean;
}

interface DocSidebarProps {
  sections: SidebarSection[];
  activeSection: string;
  onSectionChange: (sectionId: string) => void;
  title?: string;
}

const DocSidebar: React.FC<DocSidebarProps> = ({ 
  sections, 
  activeSection, 
  onSectionChange,
  title = "Documentation"
}) => {
  const renderSection = (section: SidebarSection, level = 0): React.ReactNode => {
    const isActive = activeSection === section.id;
    const hasChildren = section.children && section.children.length > 0;
    const isClickable = section.isClickable !== false; // Default to true if not specified
    
    // Define styling based on nesting level and clickable state
    const levelStyles = {
      0: { // Top level
        button: `w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
          isActive ? 'bg-indigo-50 text-indigo-700 font-medium' : 
          isClickable ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-50' : 
          'text-gray-400 cursor-not-allowed'
        }`,
        container: 'ml-0'
      },
      1: { // Second level
        button: `w-full text-left px-2 py-1 rounded text-xs transition-colors ${
          isActive ? 'bg-indigo-50 text-indigo-600' : 
          isClickable ? 'text-gray-500 hover:text-gray-700' : 
          'text-gray-400'
        }`,
        container: 'ml-4 mt-1'
      },
      2: { // Third level
        button: `w-full text-left px-2 py-1 rounded text-xs transition-colors ${
          isActive ? 'bg-blue-50 text-blue-600' : 
          isClickable ? 'text-gray-400 hover:text-gray-600' : 
          'text-gray-300 cursor-not-allowed'
        }`,
        container: 'ml-6 mt-1'
      }
    };
    
    const style = levelStyles[level as keyof typeof levelStyles] || levelStyles[2];
    
    return (
      <div key={section.id}>
        {isClickable ? (
          <button
            onClick={() => onSectionChange(section.id)}
            className={style.button}
          >
            <div className="flex items-center justify-between">
              <span>{section.title}</span>
              {level === 0 && section.githubUrl && (
                <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          </button>
        ) : (
          <div className={style.button}>
            <div className="flex items-center justify-between">
              <span>{section.title}</span>
              {level === 0 && section.githubUrl && (
                <svg className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          </div>
        )}
        
        {/* Recursively render children */}
        {hasChildren && (
          <div className={`${style.container} space-y-1`}>
            {section.children!.map((child) => renderSection(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  // Filter to get only top-level sections (those without a parent in the current sections array)
  const topLevelSections = sections.filter(section => 
    !sections.some(s => s.children?.some(c => c.id === section.id))
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 sticky top-8">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">{title}</h2>
        <nav className="space-y-2">
          {topLevelSections.map((section) => renderSection(section))}
        </nav>
      </div>
    </div>
  );
};

export default DocSidebar;
