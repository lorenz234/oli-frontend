'use client';
import React, { useState } from 'react';
import Notification from '../attestation/Notification';
import ProjectTabs from './ui/ProjectTabs';
import SectionNavigation from './ui/SectionNavigation';
import BasicInfoSection from './sections/BasicInfoSection';
import SocialSection from './sections/SocialSection';
import DevelopmentSection from './sections/DevelopmentSection';
import AdditionalSection from './sections/AdditionalSection';
import { PROJECT_DESCRIPTIONS } from '@/constants/projectDescriptions';

interface ProjectFormData {
  name: string;
  display_name: string;
  description: string;
  websites: string[];
  social: {
    twitter: { url: string }[];
    telegram: { url: string }[];
    discord: { url: string }[];
  };
  github: string[];
  npm: string[];
  crates: string[];
  pypi: string[];
  go: string[];
  open_collective: string;
  defillama: string[];
  comments: string;
}

const initialFormData: ProjectFormData = {
  name: '',
  display_name: '',
  description: '',
  websites: [''],
  social: {
    twitter: [{ url: '' }],
    telegram: [{ url: '' }],
    discord: [{ url: '' }],
  },
  github: [''],
  npm: [''],
  crates: [''],
  pypi: [''],
  go: [''],
  open_collective: '',
  defillama: [''],
  comments: ''
};

const AddProjectForm = () => {
    const [projects, setProjects] = useState<ProjectFormData[]>([{...initialFormData}]);
    const [activeProjectIndex, setActiveProjectIndex] = useState<number>(0);
    const [formData, setFormData] = useState<ProjectFormData>(initialFormData);
  
    const [errors, setErrors] = useState<{[key: string]: string}>({});
    const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [generatedYaml, setGeneratedYaml] = useState<string | null>(null);
    const [activeSection, setActiveSection] = useState<string>('basic');
    const [generatedYamls, setGeneratedYamls] = useState<{[key: number]: string}>({});

    const addNewProject = () => {
      setProjects(prev => [...prev, {...initialFormData}]);
      // Save current project data
      updateProjectData(activeProjectIndex);
      // Set the new project as active
      setActiveProjectIndex(projects.length);
      // Reset form data for the new project
      setFormData({...initialFormData});
      setGeneratedYaml(null);
      setErrors({});
      setActiveSection('basic');
    };

    const switchProject = (index: number) => {
      // Save current project data
      updateProjectData(activeProjectIndex);
      // Switch to selected project
      setActiveProjectIndex(index);
      setFormData({...projects[index]});
      setGeneratedYaml(generatedYamls[index] || null);
      setErrors({});
    };

    const removeProject = (index: number) => {
      if (projects.length <= 1) {
        setNotification({
          message: 'Cannot remove the only project. At least one project is required.',
          type: 'error'
        });
        return;
      }

      const newProjects = projects.filter((_, idx) => idx !== index);
      setProjects(newProjects);

      // Update generated YAMLs
      const newGeneratedYamls = {...generatedYamls};
      delete newGeneratedYamls[index];
      
      // Remap keys for remaining projects
      const remappedYamls: {[key: number]: string} = {};
      Object.keys(newGeneratedYamls).forEach((key) => {
        const numKey = parseInt(key);
        if (numKey > index) {
          remappedYamls[numKey - 1] = newGeneratedYamls[numKey];
        } else {
          remappedYamls[numKey] = newGeneratedYamls[numKey];
        }
      });
      
      setGeneratedYamls(remappedYamls);

      // If removing the active project, switch to the first one
      if (index === activeProjectIndex) {
        const newIndex = index === 0 ? 0 : index - 1;
        setActiveProjectIndex(newIndex);
        setFormData({...newProjects[newIndex]});
        setGeneratedYaml(remappedYamls[newIndex] || null);
      } else if (index < activeProjectIndex) {
        // If removing a project before the active one, adjust the active index
        setActiveProjectIndex(activeProjectIndex - 1);
      }
    };

    const updateProjectData = (index: number) => {
      setProjects(prev => {
        const updated = [...prev];
        updated[index] = {...formData};
        return updated;
      });
      
      if (generatedYaml) {
        setGeneratedYamls(prev => ({
          ...prev,
          [index]: generatedYaml
        }));
      }
    };

    const generateAllYamls = () => {
      // Save current project data first
      updateProjectData(activeProjectIndex);
      
      // Generate YAML for all projects
      const allYamls: {[key: number]: string} = {};
      
      projects.forEach((project, index) => {
        try {
          const yaml = generateYamlForProject(project);
          allYamls[index] = yaml;
        } catch (error) {
          console.error(`Error generating YAML for project ${index}:`, error);
        }
      });
      
      setGeneratedYamls(allYamls);
      return allYamls;
    };

    const generateGitHubPrUrl = () => {
        if (!formData.name || !generatedYaml) return '';
        
        // Get the first letter of the project name (lowercase)
        const firstLetter = formData.name.charAt(0).toLowerCase();
        
        // URL encode the YAML content
        const encodedContent = encodeURIComponent(generatedYaml);
        
        // Construct the file path for the commit WITHOUT trailing slash
        const fileName = `${formData.name}.yaml`;
        const fileDir = `data/projects/${firstLetter}`;
        
        // Construct a commit message
        const commitMessage = encodeURIComponent(`Add ${formData.display_name} project`);
        
        // Build the GitHub URL - using the pattern GitHub expects
        return `https://github.com/opensource-observer/oss-directory/new/main/${fileDir}?filename=${fileName}&value=${encodedContent}&message=${commitMessage}&description=Adding%20project%20via%20Open%20Labels%20Initiative%20form`;
    };

    const generateMultipleGitHubPrUrl = () => {
      const allYamls = generateAllYamls();
      
      // Create a combined description for all projects
      const projectNames = projects.map(p => p.display_name).join(', ');
      const commitMessage = encodeURIComponent(`Add multiple projects: ${projectNames}`);
      
      // Create a combined content with all YAMLs
      const combinedContent = Object.values(allYamls).join('\n---\n');
      const encodedContent = encodeURIComponent(combinedContent);
      
      // Use a special filename for multiple projects
      return `https://github.com/opensource-observer/oss-directory/new/main/data/projects?filename=multiple-projects.yaml&value=${encodedContent}&message=${commitMessage}&description=Adding%20multiple%20projects%20via%20Open%20Labels%20Initiative%20form`;
    };

const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    // Basic validation for required fields
    if (!formData.name.trim()) {
      newErrors.name = 'Project name is required';
    } else if (!/^[a-z0-9-]+$/.test(formData.name)) {
      newErrors.name = 'Project name must contain only lowercase letters, numbers, and dashes';
    }
    
    if (!formData.display_name.trim()) {
      newErrors.display_name = 'Display name is required';
    }
    
    // Validate URLs
    const validateUrls = (urls: string[], prefix: string) => {
      urls.forEach((url, index) => {
        if (url && !isValidUrl(url)) {
          newErrors[`${prefix}_${index}`] = 'Please enter a valid URL';
        }
      });
    };

    validateUrls(formData.websites, 'website');
    validateUrls(formData.github, 'github');
    validateUrls(formData.npm, 'npm');
    validateUrls(formData.crates, 'crates');
    validateUrls(formData.pypi, 'pypi');
    validateUrls(formData.go, 'go');
    validateUrls(formData.defillama, 'defillama');

    if (formData.open_collective && !isValidUrl(formData.open_collective)) {
      newErrors.open_collective = 'Please enter a valid URL';
    }

    // Validate social URLs
    ['twitter', 'telegram', 'discord'].forEach(platform => {
        formData.social[platform as keyof typeof formData.social].forEach((social, index) => {
        if (social.url && !isValidUrl(social.url)) {
            newErrors[`${platform}_${index}`] = `Please enter a valid ${platform} URL`;
        }
        });
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Generate YAML
      const yaml = generateYaml();
      setGeneratedYaml(yaml);
      
      // Update the current project in the projects array
      updateProjectData(activeProjectIndex);
      
      // Store the generated YAML
      setGeneratedYamls(prev => ({
        ...prev,
        [activeProjectIndex]: yaml
      }));
      
      setNotification({
        message: 'YAML generated successfully! You can now create a Pull Request.',
        type: 'success'
      });
      
    } catch (error) {
      setNotification({
        message: error instanceof Error ? error.message : 'Error generating YAML',
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClearForm = () => {
    // Create a deep copy of the initialFormData to ensure we're not using the same reference
    const freshFormData = JSON.parse(JSON.stringify(initialFormData));
    setFormData(freshFormData);
    setErrors({});
    setNotification({
        message: 'Form cleared successfully!',
        type: 'success'
      });
    setGeneratedYaml(null); // Also clear the generated YAML
    
    // Update the current project in the projects array
    setProjects(prev => {
      const updated = [...prev];
      updated[activeProjectIndex] = freshFormData;
      return updated;
    });
    
    // Remove from generated YAMLs
    setGeneratedYamls(prev => {
      const updated = {...prev};
      delete updated[activeProjectIndex];
      return updated;
    });
  };

  const generateYamlForProject = (projectData: ProjectFormData) => {
    // Start with version
    let yaml = `version: 7\n`;
    yaml += `name: ${projectData.name}\n`;
    yaml += `display_name: ${projectData.display_name}\n`;
    
    if (projectData.description) {
      yaml += `description: ${projectData.description}\n`;
    }
    
    // Helper function to add array of URLs with a specific format
    const addUrlsSection = (sectionName: string, urls: string[]) => {
      const filteredUrls = urls.filter(url => url.trim());
      if (filteredUrls.length > 0) {
        yaml += `${sectionName}:\n`;
        filteredUrls.forEach(url => {
          yaml += `- url: ${url}\n`;
        });
      }
    };
    
    // Add websites
    addUrlsSection('websites', projectData.websites);
    
    // Add social media
    if (projectData.social.discord.length > 1 || projectData.social.telegram.length > 1 || projectData.social.twitter.length > 1) {
        yaml += 'social:\n';
        const addSocialSection = (platform: 'twitter' | 'telegram' | 'discord') => {
            const filteredPlatform = projectData.social[platform].filter(item => item.url.trim());
            
            if (filteredPlatform.length > 0) {
            yaml += `  ${platform}:\n`;
            filteredPlatform.forEach(item => {
                yaml += `  - url: ${item.url}\n`;
            });
            }
        };
        
        ['twitter', 'telegram', 'discord'].forEach(platform => {
            addSocialSection(platform as 'twitter' | 'telegram' | 'discord');
        });
    }
    
    // Add GitHub
    addUrlsSection('github', projectData.github);
    
    // Add package managers
    addUrlsSection('npm', projectData.npm);
    addUrlsSection('crates', projectData.crates);
    addUrlsSection('pypi', projectData.pypi);
    addUrlsSection('go', projectData.go);
    
    // Add Open Collective
    if (projectData.open_collective.trim()) {
      yaml += `open_collective: ${projectData.open_collective}\n`;
    }
    
    // Add DefiLlama
    addUrlsSection('defillama', projectData.defillama);
    
    // Add comments
    if (projectData.comments.trim()) {
      yaml += `comments: |\n  ${projectData.comments.replace(/\n/g, '\n  ')}\n`;
    }
    
    return yaml;
  };

  const generateYaml = () => {
    return generateYamlForProject(formData);
  };

// Generic handler for text inputs
const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Define a type that includes only the array properties of ProjectFormData
type ArrayFields = Extract<keyof ProjectFormData, 'websites' | 'github' | 'npm' | 'crates' | 'pypi' | 'go' | 'defillama'>;

// Update the handleArrayChange function with proper typing
const handleArrayChange = (fieldName: ArrayFields, index: number, value: string) => {
  setFormData(prev => {
    const updatedArray = [...prev[fieldName]];
    updatedArray[index] = value;
    
    // Add new empty field if last field is being filled
    if (index === updatedArray.length - 1 && value.trim()) {
      updatedArray.push('');
    }
    
    return {
      ...prev,
      [fieldName]: updatedArray
    };
  });
  
  // Clear error for this field
  if (errors[`${fieldName}_${index}`]) {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[`${fieldName}_${index}`];
      return newErrors;
    });
  }
};

  // Handler for social media URLs
  const handleSocialChange = (platform: 'twitter' | 'telegram' | 'discord', index: number, value: string) => {
    const updatedSocial = { ...formData.social };
    updatedSocial[platform][index].url = value;
    
    // Add new empty field if last field is being filled
    if (index === updatedSocial[platform].length - 1 && value.trim()) {
      updatedSocial[platform].push({ url: '' });
    }
    
    setFormData(prev => ({
      ...prev,
      social: updatedSocial
    }));
    
    // Clear error for this field
    if (errors[`${platform}_${index}`]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[`${platform}_${index}`];
        return newErrors;
      });
    }
  };

 // Use the same ArrayFields type we defined earlier
// If you didn't add the type earlier, add it here:
// type ArrayFields = Extract<keyof ProjectFormData, 'websites' | 'github' | 'npm' | 'crates' | 'pypi' | 'go' | 'defillama'>;
const removeArrayItem = (fieldName: ArrayFields, index: number) => {
    setFormData(prev => {
      const updatedArray = prev[fieldName].filter((_, i) => i !== index);
      // Ensure there's always at least one empty field
      return {
        ...prev,
        [fieldName]: updatedArray.length ? updatedArray : ['']
      };
    });
  };

  const removeSocial = (platform: 'twitter' | 'telegram' | 'discord', index: number) => {
    const updatedSocial = { ...formData.social };
    updatedSocial[platform] = updatedSocial[platform].filter((_, i) => i !== index);
    
    // Ensure there's always at least one empty field
    if (updatedSocial[platform].length === 0) {
      updatedSocial[platform].push({ url: '' });
    }
    
    setFormData(prev => ({
      ...prev,
      social: updatedSocial
    }));
  };

  // Form section navigation
  const sections = [
    { id: 'basic', label: 'Basic Info' },
    { id: 'social', label: 'Social' },
    { id: 'development', label: 'Development' },
    { id: 'additional', label: 'Additional' }
  ];
  
  return (
    <>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      {/* Card Wrapper */}
      <div className="max-w-3xl mx-auto mt-8 mb-12 bg-white/80 shadow-2xl rounded-3xl border border-gray-100 backdrop-blur-lg">
        {/* Project Tabs */}
        <ProjectTabs
          projects={projects}
          activeProjectIndex={activeProjectIndex}
          switchProject={switchProject}
          removeProject={removeProject}
          addNewProject={addNewProject}
        />
        {/* Section Navigation */}
        <SectionNavigation
          sections={sections}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />
        <form onSubmit={handleSubmit} className="space-y-8 px-8 py-8">
          {/* Section Divider and Header */}
          {activeSection === 'basic' && (
            <>
              <h2 className="text-2xl font-bold text-blue-600 mb-6 border-b border-blue-100 pb-2">Basic Info</h2>
              <BasicInfoSection
                formData={formData}
                errors={errors}
                handleInputChange={handleInputChange}
                handleArrayChange={handleArrayChange}
                removeArrayItem={removeArrayItem}
                PROJECT_DESCRIPTIONS={PROJECT_DESCRIPTIONS}
              />
            </>
          )}
          {activeSection === 'social' && (
            <>
              <h2 className="text-2xl font-bold text-purple-600 mb-6 border-b border-purple-100 pb-2">Social</h2>
              <SocialSection
                formData={formData}
                errors={errors}
                handleSocialChange={handleSocialChange}
                removeSocial={removeSocial}
                PROJECT_DESCRIPTIONS={PROJECT_DESCRIPTIONS}
              />
            </>
          )}
          {activeSection === 'development' && (
            <>
              <h2 className="text-2xl font-bold text-pink-600 mb-6 border-b border-pink-100 pb-2">Development</h2>
              <DevelopmentSection
                formData={formData}
                errors={errors}
                handleInputChange={handleInputChange}
                handleArrayChange={handleArrayChange}
                removeArrayItem={removeArrayItem}
              />
            </>
          )}
          {activeSection === 'additional' && (
            <>
              <h2 className="text-2xl font-bold text-green-600 mb-6 border-b border-green-100 pb-2">Additional</h2>
              <AdditionalSection
                formData={formData}
                errors={errors}
                handleInputChange={handleInputChange}
                handleArrayChange={handleArrayChange}
                removeArrayItem={removeArrayItem}
              />
            </>
          )}
          {/* Preview YAML */}
          {generatedYaml && (
            <div className="mb-6 border border-gray-200 rounded-md p-4 bg-gray-50">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Generated YAML Preview:</h3>
              <pre className="text-xs text-gray-600 overflow-x-auto whitespace-pre-wrap">
                {generatedYaml}
              </pre>
            </div>
          )}
          {/* Submit Button */}
          <div>
          <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center px-5 py-2.5 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-white rounded-xl hover:opacity-90 transition-opacity duration-200 text-sm font-semibold disabled:opacity-50"
              >
              {isSubmitting ? (
                  <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating YAML...
                  </>
              ) : (
                  'Generate YAML Preview'
              )}
              </button>
              <button
                  type="button"
                  onClick={handleClearForm}
                  className="mt-2 w-full flex justify-center px-5 py-2.5 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors duration-200 text-sm font-semibold"
              >
                  Clear All Fields
              </button>
            
            {/* GitHub PR Button - Only visible after YAML is generated */}
{generatedYaml && (
  <a
    href={generateGitHubPrUrl()}
    target="_blank"
    rel="noopener noreferrer"
    className="mt-4 w-full flex justify-center items-center px-5 py-2.5 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-white rounded-xl hover:opacity-90 transition-colors duration-200 text-sm font-semibold"
  >
    <svg 
      className="w-5 h-5 mr-2" 
      viewBox="0 0 24 24" 
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
    </svg>
    Create Pull Request for This Project
  </a>
)}

{/* Submit Multiple Projects Button - Only visible when multiple projects have YAMLs */}
{Object.keys(generatedYamls).length > 1 && (
  <a
    href={generateMultipleGitHubPrUrl()}
    target="_blank"
    rel="noopener noreferrer"
    className="mt-4 w-full flex justify-center items-center px-5 py-2.5 bg-gradient-to-r from-green-400 to-green-600 text-white rounded-xl hover:opacity-90 transition-colors duration-200 text-sm font-semibold"
  >
    <svg 
      className="w-5 h-5 mr-2" 
      viewBox="0 0 24 24" 
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
    </svg>
    Create Pull Request for All Projects ({Object.keys(generatedYamls).length})
  </a>
)}
          </div>
        </form>
      </div>
    </>
  );
};

export default AddProjectForm;