import React from 'react';

interface Section {
  id: string;
  label: string;
}

interface SectionNavigationProps {
  sections: Section[];
  activeSection: string;
  setActiveSection: (id: string) => void;
}

const SectionNavigation: React.FC<SectionNavigationProps> = ({
  sections,
  activeSection,
  setActiveSection,
}) => (
  <div className="w-full flex justify-center mb-8">
    <div className="inline-flex flex-wrap items-center gap-2 px-4 py-2 bg-white/90 rounded-2xl shadow border border-gray-100">
      {sections.map(section => (
        <button
          key={section.id}
          onClick={() => setActiveSection(section.id)}
          className={`relative px-6 py-2 rounded-xl font-semibold text-base transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400/50
            ${
              activeSection === section.id
                ? 'bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-white shadow-lg border-0 scale-105'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:shadow-md'
            }
          `}
          style={{ minWidth: 110 }}
          aria-current={activeSection === section.id ? 'page' : undefined}
        >
          <span className="z-10 relative">{section.label}</span>
          {/* Animated underline for active tab */}
          {activeSection === section.id && (
            <span className="absolute left-1/2 -translate-x-1/2 bottom-1 w-2/3 h-1 rounded-full bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 animate-pulse" />
          )}
        </button>
      ))}
    </div>
  </div>
);

export default SectionNavigation; 