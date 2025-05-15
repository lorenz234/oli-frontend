import React from 'react';

interface ProjectTabsProps {
  projects: { display_name: string }[];
  activeProjectIndex: number;
  switchProject: (index: number) => void;
  removeProject: (index: number) => void;
  addNewProject: () => void;
}

const ProjectTabs: React.FC<ProjectTabsProps> = ({
  projects,
  activeProjectIndex,
  switchProject,
  removeProject,
  addNewProject,
}) => (
  <div className="w-full flex justify-center mt-2 mb-8">
    <div className="inline-flex flex-wrap items-center gap-2 px-4 py-2 bg-white/90 rounded-2xl shadow-md border border-gray-100">
      {projects.map((project, index) => (
        <div key={`project-tab-${index}`} className="relative group">
          <button
            onClick={() => switchProject(index)}
            className={`transition-all duration-200 px-5 py-2 rounded-xl shadow-sm font-semibold flex items-center gap-2 border focus:outline-none focus:ring-2 focus:ring-blue-400/50
              ${
                activeProjectIndex === index
                  ? 'bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-white border-transparent scale-105 shadow-lg z-10'
                  : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:shadow-md'
              }
            `}
            style={{ minWidth: 110 }}
            aria-current={activeProjectIndex === index ? 'page' : undefined}
          >
            <span className="truncate max-w-[90px]">
              {project.display_name || `Project ${index + 1}`}
            </span>
            {/* Remove button, only show on hover and if more than 1 project */}
            {projects.length > 1 && (
              <button
                onClick={e => {
                  e.stopPropagation();
                  removeProject(index);
                }}
                className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150 text-white bg-red-400 hover:bg-red-600 rounded-full p-1 focus:outline-none focus:ring-2 focus:ring-red-300"
                aria-label={`Remove project ${index + 1}`}
                tabIndex={-1}
                type="button"
                style={{ marginLeft: 4 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </button>
        </div>
      ))}
      {/* Add Project Button, visually integrated */}
      <div className="relative group">
        <button
          onClick={addNewProject}
          className="bg-gradient-to-r from-green-400 to-green-600 text-white rounded-full shadow-md w-10 h-10 flex items-center justify-center text-xl font-bold transition-transform duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-green-400/60 border-2 border-white -ml-1"
          aria-label="Add Project"
          type="button"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
          </svg>
        </button>
        <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-max px-3 py-1.5 rounded-lg bg-gray-900 text-white text-xs shadow-lg opacity-0 group-hover:opacity-100 group-hover:translate-y-1 transition-all duration-200 pointer-events-none z-20">
          Add New Project
        </div>
      </div>
    </div>
  </div>
);

export default ProjectTabs; 