// src/utils/projectValidation.ts
import { ProjectData, ValidationWarning } from '../types/attestation';

let projects: ProjectData[] = [];
let projectsPromise: Promise<ProjectData[]> | null = null;

const transformProjectData = (data: any): ProjectData[] => {
  if (data && data.data && data.data.data) {
    return data.data.data.map((project: any[]) => {
      const types = data.data.types;
      const projectObj: any = {};
      types.forEach((type: string, index: number) => {
        if (project[index] !== null) {
          projectObj[type] = project[index];
        }
      });
      return projectObj as ProjectData;
    });
  }
  return [];
};

export const fetchProjects = async (): Promise<ProjectData[]> => {
  if (projects.length > 0) {
    return projects;
  }
  if (projectsPromise) {
    return projectsPromise;
  }
  projectsPromise = fetch('https://api.growthepie.xyz/v1/labels/projects.json')
    .then(response => response.json())
    .then(data => {
      projects = transformProjectData(data);
      projectsPromise = null;
      return projects;
    })
    .catch(error => {
      console.error('Error fetching projects:', error);
      projectsPromise = null;
      return [];
    });
  return projectsPromise;
};

const isSimilarValue = (value1: string, value2: string, fieldType: string): boolean => {
  if (!value1 || !value2) return false;
  
  const v1 = value1.toLowerCase().trim();
  const v2 = value2.toLowerCase().trim();
  
  if (v1 === v2) return true;
  
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
      
      if (domain1 === domain2) return true;
      
      const cleanDomain1 = domain1.replace(/^www\./, '');
      const cleanDomain2 = domain2.replace(/^www\./, '');
      if (cleanDomain1 === cleanDomain2) return true;
      
      const domainWithoutTLD1 = cleanDomain1.split('.').slice(0, -1).join('.');
      const domainWithoutTLD2 = cleanDomain2.split('.').slice(0, -1).join('.');
      if (domainWithoutTLD1 && domainWithoutTLD2 && (domainWithoutTLD1 === domainWithoutTLD2)) return true;
    } catch {
      // Ignore URL parsing errors
    }
  }
  
  if (fieldType === 'name' || fieldType === 'display_name') {
    if (v1.includes(v2) || v2.includes(v1)) {
      const lengthRatio = Math.min(v1.length, v2.length) / Math.max(v1.length, v2.length);
      if (lengthRatio > 0.8) return true;
    }
    
    const tokenize = (str: string): string[] => str.split(/[^a-z0-9]+/).filter(token => token.length > 0);
    const tokens1 = tokenize(v1);
    const tokens2 = tokenize(v2);
    
    const commonTokens = tokens1.filter(token => tokens2.includes(token));
    if (commonTokens.length > 0 && commonTokens.length >= Math.min(tokens1.length, tokens2.length) * 0.7) {
      return true;
    }
  }
  
  return false;
};

const findSimilarProjects = (searchValue: string, fieldType: string, projectList: ProjectData[]): ProjectData[] => {
  if (!searchValue || !projectList.length) return [];
  const normalizedSearchValue = searchValue.toLowerCase().trim();
  const fieldMapping: { [key: string]: string } = {
    'name': 'owner_project',
    'display_name': 'display_name',
    'github': 'main_github',
    'website': 'website'
  };
  const apiField = fieldMapping[fieldType];
  if (!apiField) return [];

  const exactMatches = projectList.filter(project => {
    const projectValue = project[apiField];
    if (!projectValue) return false;
    if (Array.isArray(projectValue)) {
      return projectValue.some(val => val && val.toLowerCase() === normalizedSearchValue);
    }
    return projectValue.toLowerCase() === normalizedSearchValue;
  });

  if (exactMatches.length > 0) {
    return exactMatches;
  }

  return projectList.filter(project => {
    const projectValue = project[apiField];
    if (!projectValue) return false;
    if (Array.isArray(projectValue)) {
      return projectValue.some(val => isSimilarValue(val, normalizedSearchValue, fieldType));
    }
    return isSimilarValue(projectValue, normalizedSearchValue, fieldType);
  });
};

const suggestSimilarProjects = (searchValue: string, projectList: ProjectData[]): ProjectData[] => {
  if (!searchValue || !projectList.length) return [];
  const normalizedSearchValue = searchValue.toLowerCase().trim();

  const similarProjects = projectList.filter(project => {
    const isSimilarOwner = isSimilarValue(project.owner_project, normalizedSearchValue, 'name');
    const isSimilarDisplay = isSimilarValue(project.display_name, normalizedSearchValue, 'display_name');
    return isSimilarOwner || isSimilarDisplay;
  });

  return similarProjects.slice(0, 3);
};

export const validateProjectField = async (field: string, value: string, isForCorrection: boolean = false): Promise<ValidationWarning[]> => {
  if (!value) return [];

  const warnings: ValidationWarning[] = [];
  const projects = await fetchProjects();

  if (isForCorrection && field === 'owner_project') {
    const validProjectIds = projects.map(p => p.owner_project);
    if (!validProjectIds.includes(value)) {
      const suggestions = suggestSimilarProjects(value, projects);
      if (suggestions.length > 0) {
        warnings.push({
          message: `Invalid project ID: "${value}".`,
          suggestions: suggestions.map(p => p.owner_project)
        });
      } else {
        warnings.push({
          message: `Invalid project ID: "${value}". Project not found.`,
          showAddProjectLink: true
        });
      }
    }
  } else if (['name', 'display_name', 'github', 'website'].includes(field)) {
    const similarProjects = findSimilarProjects(value, field, projects);
    if (similarProjects.length > 0) {
      const projectNames = similarProjects.map(p => `"${p.display_name}"`).join(', ');
      warnings.push({
        message: `This ${field} is very similar to existing entries in ${projectNames}.`
      });
    }
  }
  return warnings;
};