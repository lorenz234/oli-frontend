'use client';

import React, { useState, useEffect } from 'react';
// Removed unused Search import
import { Combobox } from '@headlessui/react';
import Image from 'next/image';
import Link from 'next/link';

// Define a type for the raw project item from the API
type RawProjectItem = [
  string, // owner_project
  string, // display_name
  string | null, // description
  string | null, // main_github
  string | null, // twitter
  string | null, // website
  string | null, // logo_path
  string | null, // sub_category
  string | null  // main_category
];

type Project = {
  owner_project: string;
  display_name: string;
  description: string | null;
  main_github: string | null;
  twitter: string | null;
  website: string | null;
  logo_path: string | null;
  sub_category: string | null;
  main_category: string | null;
};

const OwnerProjectSelect = ({ 
  value, 
  onChange 
}: { 
  value: string; 
  onChange: (value: string) => void;
}) => {
  const [query, setQuery] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      if (query.length < 3) {
        return;
      }

      setLoading(true);
      setError(null);
      try {
        // Add cache-busting parameters to ensure fresh data on every request
        const timestamp = Date.now();
        const response = await fetch(`https://api.growthepie.xyz/v1/labels/projects.json?t=${timestamp}`, {
          cache: 'no-store', // Prevent browser caching
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });
        const rawData = await response.json();
        
        // Transform the data structure with proper typing
        const transformedProjects = rawData.data.data.map((item: RawProjectItem) => ({
          owner_project: item[0],
          display_name: item[1],
          description: item[2],
          main_github: item[3],
          twitter: item[4],
          website: item[5],
          logo_path: item[6],
          sub_category: item[7],
          main_category: item[8]
        }));

        // Filter based on search term
        const filteredProjects = transformedProjects.filter((project:Project) => 
          project.display_name.toLowerCase().includes(query.toLowerCase()) ||
          project.owner_project.toLowerCase().includes(query.toLowerCase())
        );

        setProjects(filteredProjects);
      } catch (err) {
        setError('Failed to fetch projects');
        console.error('Error fetching projects:', err);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchProjects, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  // Function to build the logo URL
  const getLogoUrl = (logoPath: string | null) => {
    if (!logoPath) return null;
    return `https://api.growthepie.xyz/v1/apps/logos/${logoPath}`;
  };

  // Project not found component
  const ProjectNotFound = () => (
    <div className="p-4 text-sm">
      <p className="font-medium text-gray-700 mb-2">
        Couldn&apos;t find your project?
      </p>
      <ul className="list-disc pl-5 text-gray-600 space-y-1 mb-3">
        <li>Check if you&apos;ve spelled the project name correctly</li>
        <li>Try searching by the project&apos;s GitHub name</li>
        <li>Search with different keywords related to your project</li>
      </ul>
      <p className="text-gray-700 mb-2">
        If you still can&apos;t find your project, you can add it to our directory:
      </p>
      <Link 
        href="/project" 
        className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm font-medium transition-colors"
      >
        Add New Project
      </Link>
    </div>
  );

  return (
    <Combobox value={value} onChange={onChange}>
      <div className="relative">
        <Combobox.Input
          className="w-full rounded-md border-gray-300 py-2 pl-3 pr-10 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm text-gray-900 bg-gray-50"
          onChange={(event) => setQuery(event.target.value)}
          displayValue={(projectName: string) => projectName}
          placeholder="Search for a project (min. 3 characters)"
        />
        
        {query.length > 2 && (
          <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {loading ? (
              <div className="p-2 text-sm text-gray-500">Loading...</div>
            ) : error ? (
              <div className="p-2 text-sm text-red-500">{error}</div>
            ) : projects.length === 0 ? (
              <ProjectNotFound />
            ) : (
              projects.map((project) => (
                <Combobox.Option
                  key={project.owner_project}
                  value={project.owner_project}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-3 pr-9 ${
                      active ? 'bg-indigo-100 text-black' : 'text-gray-900'
                    }`
                  }
                >
                  {({ selected }) => (
                    <div className="flex items-center space-x-3">                      
                        <div className="flex-shrink-0 w-5 h-5 relative">
                        {project.logo_path && (
                          <Image
                            src={getLogoUrl(project.logo_path) || ''}
                            alt={`${project.display_name} logo`}
                            width={20}
                            height={20}
                            className="object-contain"
                          />
                        )}
                        </div>
                      <div>
                        <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                          {project.display_name}
                        </span>
                        <div className="text-xs mt-0.5 text-gray-500">
                          {[project.website, project.twitter, project.sub_category]
                            .filter(value => value)
                            .join(' | ')}
                        </div>
                        <div className="text-xs mt-0.5 text-gray-500">
                        {project.description && (
                            project.description.length > 190 
                            ? `${project.description.slice(0, 190)}...`
                            : project.description
                        )}
                        </div>
                      </div>
                    </div>
                  )}
                </Combobox.Option>
              ))
            )}
          </Combobox.Options>
        )}
      </div>
    </Combobox>
  );
};

export default OwnerProjectSelect;