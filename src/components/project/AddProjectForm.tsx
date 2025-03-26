'use client';

import React, { useState } from 'react';
import { PROJECT_DESCRIPTIONS } from '@/constants/projectDescriptions';
import InputWithCheck from '../attestation/InputWithCheck';
import Notification from '../attestation/Notification';

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

const AddProjectForm = () => {
    const [formData, setFormData] = useState<ProjectFormData>({
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
    });
  
    const [errors, setErrors] = useState<{[key: string]: string}>({});
    const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [generatedYaml, setGeneratedYaml] = useState<string | null>(null);
    const [activeSection, setActiveSection] = useState<string>('basic');

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

  const generateYaml = () => {
    // Start with version
    let yaml = `version: 7\n`;
    yaml += `name: ${formData.name}\n`;
    yaml += `display_name: ${formData.display_name}\n`;
    
    if (formData.description) {
      yaml += `description: ${formData.description}\n`;
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
    addUrlsSection('websites', formData.websites);
    
    // Add social media
    console.log(formData.social);
    if (formData.social.discord.length > 1 || formData.social.telegram.length > 1 || formData.social.twitter.length > 1) {
        yaml += 'social:\n';
        const addSocialSection = (platform: 'twitter' | 'telegram' | 'discord') => {
            const filteredPlatform = formData.social[platform].filter(item => item.url.trim());
            
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
    addUrlsSection('github', formData.github);
    
    // Add package managers
    addUrlsSection('npm', formData.npm);
    addUrlsSection('crates', formData.crates);
    addUrlsSection('pypi', formData.pypi);
    addUrlsSection('go', formData.go);
    
    // Add Open Collective
    if (formData.open_collective.trim()) {
      yaml += `open_collective: ${formData.open_collective}\n`;
    }
    
    // Add DefiLlama
    addUrlsSection('defillama', formData.defillama);
    
    // Add comments
    if (formData.comments.trim()) {
      yaml += `comments: |\n  ${formData.comments.replace(/\n/g, '\n  ')}\n`;
    }
    
    return yaml;
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

// Create a tooltip component from the FormLabel logic
const Tooltip = ({ content }: { content: string }) => (
    <div className="group relative inline-block ml-2">
      <svg 
        className="w-4 h-4 text-gray-400 hover:text-gray-500" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
        />
      </svg>
      <div className="invisible group-hover:visible absolute z-10 w-64 p-2 mt-2 text-sm text-gray-600 bg-white border rounded-lg shadow-lg -left-1/2 transform -translate-x-1/2">
        {content}
      </div>
    </div>
  );

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
      
      {/* Section Navigation */}
      <div className="flex overflow-x-auto px-6 mb-4">
        {sections.map(section => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`px-4 py-2 mr-2 text-sm font-medium rounded-md ${
              activeSection === section.id
                ? 'bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {section.label}
          </button>
        ))}
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4 px-6 py-2 pr-10">
        {/* Basic Info Section */}
        {activeSection === 'basic' && (
          <div>
            {/* Project Name */}
            <div className="mb-6">
              <div className="flex items-center">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Project Name
                </label>
                <Tooltip content={PROJECT_DESCRIPTIONS['project_name'] || 'The unique identifier for your project'} />
              </div>
              <InputWithCheck
                value={!!formData.name}
                isValid={!errors.name}
                error={errors.name}
              >
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="project-name (lowercase with dashes)"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900 placeholder-gray-400 bg-gray-50 py-2 pl-3"
                />
              </InputWithCheck>
              <p className="mt-1 text-xs text-gray-500">
                This will be used as the filename. Use only lowercase letters, numbers, and dashes.
              </p>
            </div>
            
            {/* Display Name */}
            <div className="mb-6">
              <div className="flex items-center">
                <label htmlFor="display_name" className="block text-sm font-medium text-gray-700">
                  Display Name
                </label>
                <Tooltip content={PROJECT_DESCRIPTIONS['display_name'] || 'The human-readable name of your project'} />
              </div>
              <InputWithCheck
                value={!!formData.display_name}
                isValid={!errors.display_name}
                error={errors.display_name}
              >
                <input
                  type="text"
                  id="display_name"
                  name="display_name"
                  value={formData.display_name}
                  onChange={(e) => handleInputChange('display_name', e.target.value)}
                  placeholder="Project Display Name"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900 placeholder-gray-400 bg-gray-50 py-2 pl-3"
                />
              </InputWithCheck>
              <p className="mt-1 text-xs text-gray-500">
                The human-readable name of the project.
              </p>
            </div>
            
            {/* Description */}
            <div className="mb-6">
              <div className="flex items-center">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <Tooltip content={PROJECT_DESCRIPTIONS['description'] || 'A brief description of the project'} />
              </div>
              <InputWithCheck
                value={!!formData.description}
                isValid={!errors.description}
                error={errors.description}
              >
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="A brief description of the project"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900 placeholder-gray-400 bg-gray-50 py-2 pl-3"
                  rows={4}
                />
              </InputWithCheck>
            </div>
            
            {/* Websites */}
            <div className="mb-6">
              <div className="flex items-center">
                <label htmlFor="websites" className="block text-sm font-medium text-gray-700">
                  Websites
                </label>
                <Tooltip content={PROJECT_DESCRIPTIONS['websites'] || 'Official website URLs for the project'} />
              </div>
              
              <div className="space-y-2">
                {formData.websites.map((website, index) => (
                  <div key={`website-${index}`} className="flex items-center gap-2 flex-nowrap">
                    <div className="w-full max-w-md">
                    <InputWithCheck
                      value={!!website}
                      isValid={!errors[`website_${index}`]}
                      error={errors[`website_${index}`]}
                    >
                      <input
                        type="url"
                        id={`website-${index}`}
                        name={`website-${index}`}
                        value={website}
                        onChange={(e) => handleArrayChange('websites', index, e.target.value)}
                        placeholder="https://www.example.com"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900 placeholder-gray-400 bg-gray-50 py-2 pl-3"
                      />
                    </InputWithCheck>
                    </div>
                    
                    {index > 0 && website === '' && formData.websites.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem('websites', index)}
                        className="p-1 text-red-500 hover:text-red-700"
                        aria-label="Remove website"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                        </svg>
                      </button>
                    )}
                  </div>
                
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Social Section */}
        {activeSection === 'social' && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Social Media</h3>
            
            {/* Twitter */}
            <div className="mb-6">
              <div className="flex items-center">
                <label htmlFor="twitter" className="block text-sm font-medium text-gray-700">
                  Twitter
                </label>
                <Tooltip content={PROJECT_DESCRIPTIONS['twitter'] || 'Twitter/X account URLs'} />
              </div>
              
              <div className="space-y-2">
                {formData.social.twitter.map((twitter, index) => (
                  <div key={`twitter-${index}`} className="flex items-center gap-2">
                    <div className="w-full max-w-md">
                    <InputWithCheck
                      value={!!twitter.url}
                      isValid={!errors[`twitter_${index}`]}
                      error={errors[`twitter_${index}`]}
                    >
                      <input
                        type="url"
                        id={`twitter-${index}`}
                        name={`twitter-${index}`}
                        value={twitter.url}
                        onChange={(e) => handleSocialChange('twitter', index, e.target.value)}
                        placeholder="https://x.com/username"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900 placeholder-gray-400 bg-gray-50 py-2 pl-3"
                      />
                    </InputWithCheck>
                    </div>
                    
                    {index > 0 && twitter.url === '' && formData.social.twitter.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSocial('twitter', index)}
                        className="p-1 text-red-500 hover:text-red-700"
                        aria-label="Remove Twitter"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Telegram */}
            <div className="mb-6">
              <div className="flex items-center">
                <label htmlFor="telegram" className="block text-sm font-medium text-gray-700">
                  Telegram
                </label>
                <Tooltip content={PROJECT_DESCRIPTIONS['telegram'] || 'Telegram channel or group URLs'} />
              </div>
              
              <div className="space-y-2">
                {formData.social.telegram.map((telegram, index) => (
                  <div key={`telegram-${index}`} className="flex items-center gap-2">
                    <div className="w-full max-w-md">
                    <InputWithCheck
                      value={!!telegram.url}
                      isValid={!errors[`telegram_${index}`]}
                      error={errors[`telegram_${index}`]}
                    >
                      <input
                        type="url"
                        id={`telegram-${index}`}
                        name={`telegram-${index}`}
                        value={telegram.url}
                        onChange={(e) => handleSocialChange('telegram', index, e.target.value)}
                        placeholder="https://t.me/username"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900 placeholder-gray-400 bg-gray-50 py-2 pl-3"
                      />
                    </InputWithCheck>
                    </div>
                    
                    {index > 0 && telegram.url === '' && formData.social.telegram.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSocial('telegram', index)}
                        className="p-1 text-red-500 hover:text-red-700"
                        aria-label="Remove Telegram"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Discord */}
            <div className="mb-6">
              <div className="flex items-center">
                <label htmlFor="discord" className="block text-sm font-medium text-gray-700">
                  Discord
                </label>
                <Tooltip content={PROJECT_DESCRIPTIONS['discord'] || 'Discord server invite links'} />
              </div>
              
              <div className="space-y-2">
                {formData.social.discord.map((discord, index) => (
                  <div key={`discord-${index}`} className="flex items-center gap-2">
                    <div className="w-full max-w-md">
                    <InputWithCheck
                      value={!!discord.url}
                      isValid={!errors[`discord_${index}`]}
                      error={errors[`discord_${index}`]}
                    >
                      <input
                        type="url"
                        id={`discord-${index}`}
                        name={`discord-${index}`}
                        value={discord.url}
                        onChange={(e) => handleSocialChange('discord', index, e.target.value)}
                        placeholder="https://discord.com/invite/..."
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900 placeholder-gray-400 bg-gray-50 py-2 pl-3"
                      />
                    </InputWithCheck>
                    </div>
                    
                    {index > 0 && discord.url === '' && formData.social.discord.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSocial('discord', index)}
                        className="p-1 text-red-500 hover:text-red-700"
                        aria-label="Remove Discord"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

    {/* Development Section */}
    {activeSection === 'development' && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Development Resources</h3>
            
            {/* GitHub */}
            <div className="mb-6">
              <div className="flex items-center">
                <label htmlFor="github" className="block text-sm font-medium text-gray-700">
                  GitHub Repositories
                </label>
                <Tooltip content="GitHub URLs for the project. Organizations or individual repositories." />
              </div>
              
              <div className="space-y-2">
                {formData.github.map((github, index) => (
                  <div key={`github-${index}`} className="flex items-center gap-2">
                    <div className="w-full max-w-md">
                    <InputWithCheck
                      value={!!github}
                      isValid={!errors[`github_${index}`]}
                      error={errors[`github_${index}`]}
                    >
                      <input
                        type="url"
                        id={`github-${index}`}
                        name={`github-${index}`}
                        value={github}
                        onChange={(e) => handleArrayChange('github', index, e.target.value)}
                        placeholder="https://github.com/username/repo"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900 placeholder-gray-400 bg-gray-50 py-2 pl-3"
                      />
                    </InputWithCheck>
                    </div>
                    
                    {index > 0 && github === '' && formData.github.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem('github', index)}
                        className="p-1 text-red-500 hover:text-red-700"
                        aria-label="Remove GitHub"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {/* NPM Packages */}
            <div className="mb-6">
              <div className="flex items-center">
                <label htmlFor="npm" className="block text-sm font-medium text-gray-700">
                  NPM Packages
                </label>
                <Tooltip content="NPM package URLs" />
              </div>
              
              <div className="space-y-2">
                {formData.npm.map((npm, index) => (
                  <div key={`npm-${index}`} className="flex items-center gap-2">
                    <div className="w-full max-w-md">
                    <InputWithCheck
                      value={!!npm}
                      isValid={!errors[`npm_${index}`]}
                      error={errors[`npm_${index}`]}
                    >
                      <input
                        type="url"
                        id={`npm-${index}`}
                        name={`npm-${index}`}
                        value={npm}
                        onChange={(e) => handleArrayChange('npm', index, e.target.value)}
                        placeholder="https://www.npmjs.com/package/package-name"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900 placeholder-gray-400 bg-gray-50 py-2 pl-3"
                      />
                    </InputWithCheck>
                    </div>
                    
                    {index > 0 && npm === '' && formData.npm.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem('npm', index)}
                        className="p-1 text-red-500 hover:text-red-700"
                        aria-label="Remove NPM"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Crates (Rust) */}
            <div className="mb-6">
              <div className="flex items-center">
                <label htmlFor="crates" className="block text-sm font-medium text-gray-700">
                  Rust Crates
                </label>
                <Tooltip content="Rust crates package URLs" />
              </div>
              
              <div className="space-y-2">
                {formData.crates.map((crate, index) => (
                  <div key={`crate-${index}`} className="flex items-center gap-2">
                    <div className="w-full max-w-md">
                    <InputWithCheck
                      value={!!crate}
                      isValid={!errors[`crates_${index}`]}
                      error={errors[`crates_${index}`]}
                    >
                      <input
                        type="url"
                        id={`crate-${index}`}
                        name={`crate-${index}`}
                        value={crate}
                        onChange={(e) => handleArrayChange('crates', index, e.target.value)}
                        placeholder="https://crates.io/crates/package-name"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900 placeholder-gray-400 bg-gray-50 py-2 pl-3"
                      />
                    </InputWithCheck>
                    </div>
                    
                    {index > 0 && crate === '' && formData.crates.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem('crates', index)}
                        className="p-1 text-red-500 hover:text-red-700"
                        aria-label="Remove Rust Crate"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {/* PyPI (Python) */}
            <div className="mb-6">
              <div className="flex items-center">
                <label htmlFor="pypi" className="block text-sm font-medium text-gray-700">
                  Python Packages (PyPI)
                </label>
                <Tooltip content="Python package URLs from PyPI" />
              </div>
              
              <div className="space-y-2">
                {formData.pypi.map((pypi, index) => (
                  <div key={`pypi-${index}`} className="flex items-center gap-2">
                    <div className="w-full max-w-md">
                    <InputWithCheck
                      value={!!pypi}
                      isValid={!errors[`pypi_${index}`]}
                      error={errors[`pypi_${index}`]}
                    >
                      <input
                        type="url"
                        id={`pypi-${index}`}
                        name={`pypi-${index}`}
                        value={pypi}
                        onChange={(e) => handleArrayChange('pypi', index, e.target.value)}
                        placeholder="https://pypi.org/project/package-name"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900 placeholder-gray-400 bg-gray-50 py-2 pl-3"
                      />
                    </InputWithCheck>
                    </div>
                    
                    {index > 0 && pypi === '' && formData.pypi.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem('pypi', index)}
                        className="p-1 text-red-500 hover:text-red-700"
                        aria-label="Remove PyPI Package"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Go Modules */}
            <div className="mb-6">
              <div className="flex items-center">
                <label htmlFor="go" className="block text-sm font-medium text-gray-700">
                  Go Modules
                </label>
                <Tooltip content="Go module URLs" />
              </div>
              
              <div className="space-y-2">
                {formData.go.map((go, index) => (
                  <div key={`go-${index}`} className="flex items-center gap-2">
                    <div className="w-full max-w-md">
                    <InputWithCheck
                      value={!!go}
                      isValid={!errors[`go_${index}`]}
                      error={errors[`go_${index}`]}
                    >
                      <input
                        type="url"
                        id={`go-${index}`}
                        name={`go-${index}`}
                        value={go}
                        onChange={(e) => handleArrayChange('go', index, e.target.value)}
                        placeholder="https://pkg.go.dev/module-path"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900 placeholder-gray-400 bg-gray-50 py-2 pl-3"
                      />
                    </InputWithCheck>
                    </div>
                    
                    {index > 0 && go === '' && formData.go.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem('go', index)}
                        className="p-1 text-red-500 hover:text-red-700"
                        aria-label="Remove Go Module"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Open Collective */}
            <div className="mb-6">
              <div className="flex items-center">
                <label htmlFor="open_collective" className="block text-sm font-medium text-gray-700">
                  Open Collective
                </label>
                <Tooltip content="The Open Collective URL for the project" />
              </div>
              <div className="w-full max-w-md">
              <InputWithCheck
                value={!!formData.open_collective}
                isValid={!errors.open_collective}
                error={errors.open_collective}
              >
                <input
                  type="url"
                  id="open_collective"
                  name="open_collective"
                  value={formData.open_collective}
                  onChange={(e) => handleInputChange('open_collective', e.target.value)}
                  placeholder="https://opencollective.com/project-name"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900 placeholder-gray-400 bg-gray-50 py-2 pl-3"
                />
              </InputWithCheck>
              </div>
            </div>
          </div>
        )}
    
    {/* Additional Section */}
    {activeSection === 'additional' && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Information</h3>
            
            {/* DefiLlama */}
            <div className="mb-6">
              <div className="flex items-center">
                <label htmlFor="defillama" className="block text-sm font-medium text-gray-700">
                  DefiLlama URLs
                </label>
                <Tooltip content="DefiLlama URLs for the project" />
              </div>
              
              <div className="space-y-2">
                {formData.defillama.map((defillama, index) => (
                  <div key={`defillama-${index}`} className="flex items-center gap-2">
                    <div className="w-full max-w-md">
                    <InputWithCheck
                      value={!!defillama}
                      isValid={!errors[`defillama_${index}`]}
                      error={errors[`defillama_${index}`]}
                    >
                      <input
                        type="url"
                        id={`defillama-${index}`}
                        name={`defillama-${index}`}
                        value={defillama}
                        onChange={(e) => handleArrayChange('defillama', index, e.target.value)}
                        placeholder="https://defillama.com/protocol/..."
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900 placeholder-gray-400 bg-gray-50 py-2 pl-3"
                      />
                    </InputWithCheck>
                    </div>
                    
                    {index > 0 && defillama === '' && formData.defillama.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem('defillama', index)}
                        className="p-1 text-red-500 hover:text-red-700"
                        aria-label="Remove DefiLlama URL"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
             {/* Comments */}
             <div className="mb-6">
              <div className="flex items-center">
                <label htmlFor="comments" className="block text-sm font-medium text-gray-700">
                  Comments
                </label>
                <Tooltip content="Any additional comments or information about the project" />
              </div>
              <InputWithCheck
                value={!!formData.comments}
                isValid={!errors.comments}
                error={errors.comments}
              >
                <textarea
                  id="comments"
                  name="comments"
                  value={formData.comments}
                  onChange={(e) => handleInputChange('comments', e.target.value)}
                  placeholder="Additional notes or comments for the maintainers"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900 placeholder-gray-400 bg-gray-50 py-2 pl-3"
                  rows={4}
                />
              </InputWithCheck>
            </div>
          </div>
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
  Create Pull Request on GitHub
</a>
)}
        </div>
      </form>
    </>
  );
};

export default AddProjectForm;