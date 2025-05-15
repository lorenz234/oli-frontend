'use client';

import React, { useEffect, useState } from 'react';

interface ValidationCheckerProps {
  field: string;
  value: string;
}

interface ProjectData {
  owner_project: string;
  display_name: string;
  main_github?: string;
  website?: string;
  [key: string]: any;
}

const ValidationChecker: React.FC<ValidationCheckerProps> = ({ field, value }) => {
  const [warnings, setWarnings] = useState<string[]>([]);
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    // Fetch projects data when component mounts
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('https://api.growthepie.xyz/v1/labels/projects.json');
        const data = await response.json();
        
        // Transform the data into a more usable format - similar to OwnerProjectSelect
        if (data && data.data && data.data.data) {
          const projectsData = data.data.data.map((project: any[]) => {
            // Based on the API response structure where types are defined in data.types
            const types = data.data.types;
            const projectObj: ProjectData = {
              owner_project: '',
              display_name: ''
            };
            
            types.forEach((type: string, index: number) => {
              if (project[index] !== null) {
                projectObj[type] = project[index];
              }
            });
            
            return projectObj;
          });
          
          setProjects(projectsData);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    if (!value) {
      setWarnings([]);
      setHasChecked(false);
      return;
    }

    const findSimilarProjects = (searchValue: string, fieldType: string): ProjectData[] => {
      if (!searchValue || !projects.length) return [];
      const normalizedSearchValue = searchValue.toLowerCase().trim();
      const fieldMapping: { [key: string]: string } = {
        'name': 'owner_project',
        'display_name': 'display_name',
        'github': 'main_github',
        'website': 'website'
      };
      const apiField = fieldMapping[fieldType];
      if (!apiField) return [];
      // First, find exact matches
      const exactMatches = projects.filter(project => {
        const projectValue = project[apiField];
        if (!projectValue) return false;
        if (Array.isArray(projectValue)) {
          return projectValue.some(val => 
            val && val.toLowerCase() === normalizedSearchValue
          );
        }
        return projectValue.toLowerCase() === normalizedSearchValue;
      });
      if (exactMatches.length > 0) {
        return exactMatches;
      }
      // Then find similar matches with different strategies
      return projects.filter(project => {
        const projectValue = project[apiField];
        if (!projectValue) return false;
        // Handle array values (like multiple websites)
        if (Array.isArray(projectValue)) {
          return projectValue.some(val => isSimilarValue(val, normalizedSearchValue, fieldType));
        }
        return isSimilarValue(projectValue, normalizedSearchValue, fieldType);
      });
    };

    const newWarnings: string[] = [];

    // Check based on field type
    if (field === 'description') {
      // Check 1: Description length
      if (value.length > 500) {
        newWarnings.push(`Description exceeds maximum length of 500 characters (${value.length}/500)`);
      }
      
      // Check 2: Special characters
      if (value.includes(':') || value.includes("'")) {
        newWarnings.push("Description contains ':' or ''' characters which may cause YAML parsing issues");
      }
    } else if (['name', 'display_name', 'github', 'website'].includes(field) && projects.length > 0) {
      // Find similar projects using our search function
      const similarProjects = findSimilarProjects(value, field);
      
      if (similarProjects.length > 0) {
        // Check if any are exact matches
        const fieldMapping: { [key: string]: string } = {
          'name': 'owner_project',
          'display_name': 'display_name',
          'github': 'main_github',
          'website': 'website'
        };
        
        const apiField = fieldMapping[field];
        const exactMatches = similarProjects.filter(project => {
          const projectValue = project[apiField];
          if (Array.isArray(projectValue)) {
            return projectValue.some(val => val && val.toLowerCase() === value.toLowerCase());
          }
          return projectValue && projectValue.toLowerCase() === value.toLowerCase();
        });
        
        if (exactMatches.length > 0) {
          const projectNames = exactMatches.map(p => `"${p.display_name}"`).join(', ');
          newWarnings.push(`This ${field} already exists for project ${projectNames}`);
        } else {
          const projectNames = similarProjects.map(p => `"${p.display_name}"`).join(', ');
          newWarnings.push(`This ${field} is very similar to existing entries in ${projectNames}`);
        }
      }
    }

    setWarnings(newWarnings);
    setHasChecked(true);
  }, [field, value, projects]);

  // Check if two values are similar based on field type
  const isSimilarValue = (value1: string, value2: string, fieldType: string): boolean => {
    if (!value1 || !value2) return false;
    
    const v1 = value1.toLowerCase().trim();
    const v2 = value2.toLowerCase().trim();
    
    // Exact match
    if (v1 === v2) return true;
    
    // For URLs, compare domains
    if (fieldType === 'website' || fieldType === 'github') {
      try {
        const getDomain = (url: string): string => {
          try {
            const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
            return urlObj.hostname;
          } catch {
            return url;
          }
        };
        
        const domain1 = getDomain(v1);
        const domain2 = getDomain(v2);
        
        // Same domain
        if (domain1 === domain2) return true;
        
        // Domain without www
        const cleanDomain1 = domain1.replace(/^www\./, '');
        const cleanDomain2 = domain2.replace(/^www\./, '');
        if (cleanDomain1 === cleanDomain2) return true;
        
        // Domain without TLD
        const domainWithoutTLD1 = cleanDomain1.split('.').slice(0, -1).join('.');
        const domainWithoutTLD2 = cleanDomain2.split('.').slice(0, -1).join('.');
        if (domainWithoutTLD1 && domainWithoutTLD2 && 
            (domainWithoutTLD1 === domainWithoutTLD2)) return true;
      } catch {
        // URL parsing failed, continue with other checks
      }
    }
    
    // For project names and display names
    if (fieldType === 'name' || fieldType === 'display_name') {
      // One is contained in the other
      if (v1.includes(v2) || v2.includes(v1)) {
        // If one is a substring of the other and they're similar in length
        const lengthRatio = Math.min(v1.length, v2.length) / Math.max(v1.length, v2.length);
        if (lengthRatio > 0.8) return true;
      }
      
      // Tokenize and compare words
      const tokenize = (str: string): string[] => 
        str.split(/[^a-z0-9]+/).filter(token => token.length > 0);
      
      const tokens1 = tokenize(v1);
      const tokens2 = tokenize(v2);
      
      // If they share significant tokens
      const commonTokens = tokens1.filter(token => tokens2.includes(token));
      if (commonTokens.length > 0 && 
          commonTokens.length >= Math.min(tokens1.length, tokens2.length) * 0.7) {
        return true;
      }
      
      // Check for small edit distance in short strings
      if (v1.length < 10 && v2.length < 10) {
        let differences = 0;
        const maxDifferences = 1;
        
        // Simple character-by-character comparison for short strings
        for (let i = 0; i < Math.min(v1.length, v2.length); i++) {
          if (v1[i] !== v2[i]) differences++;
          if (differences > maxDifferences) break;
        }
        
        differences += Math.abs(v1.length - v2.length);
        if (differences <= maxDifferences) return true;
      }
    }
    
    return false;
  };

  return (
    <div className="mt-1">
      {isLoading && field !== 'description' && (
        <div className="text-xs text-gray-500">Checking for duplicates...</div>
      )}
      
      {warnings.length > 0 && (
        <div className="mt-1 text-sm text-amber-600">
          {warnings.map((warning, index) => (
            <div key={index} className="flex items-start mb-1">
              <svg className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
              </svg>
              <span>{warning}</span>
            </div>
          ))}
        </div>
      )}
      
      {hasChecked && warnings.length === 0 && !isLoading && (
        <div className="text-xs text-green-600">
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
            </svg>
            <span>Validation passed</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ValidationChecker; 