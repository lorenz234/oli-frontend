'use client';

import type { FC } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

// Interface for project types
interface Project {
  name: string;
  url: string;
  color: string; // For gradient colors
}

const HomePage: FC = () => {
  // State to store projects from GitHub README
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // Function to fetch projects from the GitHub README
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // Fetch README directly from GitHub using the provided endpoint
        const response = await fetch('https://raw.githubusercontent.com/openlabelsinitiative/OLI/refs/heads/main/README.md');
        const readmeContent = await response.text();
        
        // Find the Products Using OLI section
        const productsSection = findProductsSection(readmeContent);
        
        // Parse the projects from that section
        const parsedProjects = parseProjects(productsSection);
        
        setProjects(parsedProjects);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setLoading(false);
        // No fallback - if fetch fails, projects array will remain empty
      }
    };

    // Function to find the "Products Using OLI" section in the README
    function findProductsSection(text: string): string {
      const productsSectionRegex = /## Products Using OLI\s+([\s\S]*?)(?=##|$)/;
      const match = text.match(productsSectionRegex);
      
      if (match && match[1]) {
        return match[1].trim();
      }
      
      return "";
    }

    // Function to parse projects from the section text
    function parseProjects(sectionText: string): Project[] {
      if (!sectionText) return [];
      
      const projects = [];
      // Match markdown list items with links: "- [Project Name](URL) - Description"
      const projectRegex = /- \[(.*?)\]\((.*?)\)(?: - (.*))?/g;
      
      let match;
      // Use the gradient from "Using the OLI Label Pool" section
      const uniformColor = "from-blue-400 via-purple-500 to-pink-500";
      
      while ((match = projectRegex.exec(sectionText)) !== null) {
        const name = match[1].trim();
        const url = match[2].trim();
        
        projects.push({
          name,
          url,
          color: uniformColor
        });
      }
      
      return projects;
    }

    fetchProjects();
  }, []);
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - CHANGED BACKGROUND TO GRAY-50 */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
          {/* Much larger OLI Logo */}
          <div className="flex justify-center mb-12">
            <Image
              src="/oli-logo.png"
              alt="Open Labels Initiative Logo"
              width={800}
              height={800}
              className="object-contain"
            />
          </div>
          {/* Removed the "Open Labels Initiative" text */}
          <p className="mt-6 max-w-md mx-auto text-xl text-gray-500 sm:text-2xl md:text-3xl md:max-w-3xl">
          A Standardized Framework and Data Model for Address Labeling
          </p>
          <div className="mt-8 mx-auto sm:flex sm:justify-center">
            {/* GitHub Repository Button */}
            <div>
              <a
                href="https://github.com/openlabelsinitiative/OLI"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center px-8 py-3 text-base font-medium rounded-md text-white bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 hover:opacity-90 md:py-4 md:text-lg md:px-10 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <svg className="h-6 w-6 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
                GitHub Repository
              </a>
            </div>
            {/* Community Calls Button */}
            <div className="mt-3 sm:mt-0 sm:ml-3">
              <a
                href="https://calendar.google.com/calendar/u/3?cid=MmQ0MzYxNzQ3ZGFiY2M3ZDJkZjk0NjZiYmY3MmNmZDUwZTNjMjE2OTQ4YzgyNmI4OTBmYjYyN2VmNGRjNjQ4OEBncm91cC5jYWxlbmRhci5nb29nbGUuY29t"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center px-8 py-3 border border-gray-300 font-medium rounded-md text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                Join Community Calls
              </a>
            </div>
          </div>
        </div>
        </div>
      </div>



      {/* The 3 Pillars Section - CHANGED BACKGROUND TO GRADIENT */}
      <div className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white">
              Three Pillars of OLI
            </h2>
          </div>
          <div className="mt-12 grid gap-8 grid-cols-1 md:grid-cols-3">
            <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900">Data Model</h3>
                <p className="mt-2 text-base text-gray-500">
                A standardized data model for address labels ensures seamless synchronization across databases and alignment on value sets, creating a common foundation for collaboration.
                </p>
                <a href="https://github.com/openlabelsinitiative/OLI/tree/main/1_data_model" target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center text-indigo-600 hover:text-indigo-500">
                  Learn more
                  <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900">Label Pool</h3>
                <p className="mt-2 text-base text-gray-500">
                Contribute and access a shared pool of raw labels using EAS attestations. Reduce labelling redundancy, streamline collaboration and ensure permanent accessibility for all.
                </p>
                <a href="https://github.com/openlabelsinitiative/OLI/tree/main/2_label_pool" target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center text-indigo-600 hover:text-indigo-500">
                  Learn more
                  <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900">Label Confidence</h3>
                <p className="mt-2 text-base text-gray-500">
                Specialised trust algorithms verify and refine raw labels, transforming them into reliable, use-case-specific data for analytics, security and more.
                </p>
                <a href="https://github.com/openlabelsinitiative/OLI/tree/main/3_label_confidence" target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center text-indigo-600 hover:text-indigo-500">
                  Learn more
                  <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Watch Our Explainer
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              Learn everything about the Open Labels Initiative in just 12 minutes
            </p>
          </div>
          <div className="flex justify-center">
            <div className="rounded-xl overflow-hidden shadow-xl">
              <iframe 
                src="https://platform.twitter.com/embed/Tweet.html?id=1894841403022209504" 
                width="550"
                height="620"
                allowFullScreen
                frameBorder="0"
              ></iframe>
            </div>
          </div>
        </div>
      </div>

    {/* Call to Action Section */}
    <div className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
    <div className="max-w-7xl mx-auto text-center py-12 px-4 sm:py-12 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-white mb-12">
        <span className="block">Using the OLI Label Pool</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Search Card */}
        <Link
            href="/search"
            className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group"
        >
            <div className="flex flex-col items-center">
            <div className="h-12 w-12 text-indigo-600 mb-4">
                <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
                >
                <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                />
                </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-indigo-600">
                Search Contracts
            </h3>
            <p className="text-gray-600">
                Explore and discover labeled smart contracts. Find detailed information about EVM addresses.
            </p>
            </div>
        </Link>

        {/* Attest Card */}
        <Link
            href="/attest"
            className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group"
        >
            <div className="flex flex-col items-center">
            <div className="h-12 w-12 text-indigo-600 mb-4">
                <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
                >
                <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
                </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-indigo-600">
                Create Attestations
            </h3>
            <p className="text-gray-600">
                Contribute to the ecosystem by creating attestations for contracts you know about.
            </p>
            </div>
        </Link>

        {/* Analytics Card */}
        <Link
            href="/analytics"
            className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group"
        >
            <div className="flex flex-col items-center">
            <div className="h-12 w-12 text-indigo-600 mb-4">
                <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
                >
                <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
                </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-indigo-600">
                Analytics
            </h3>
            <p className="text-gray-600">
                View statistics and leaderboards of attestors and explore trending labels.
            </p>
            </div>
        </Link>
        </div>
    </div>
    </div>

    {/* Products Built Using OLI Section */}
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Products Built Using OLI
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            Discover projects leveraging the Label Pool
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {loading ? (
            // Loading state
            <div className="col-span-3 text-center py-8">
              <p className="text-gray-500">Loading projects...</p>
            </div>
          ) : (
            // Display projects dynamically
            <>
              {projects.map((project, index) => (
                <a 
                  key={index}
                  href={project.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className={`h-48 bg-gradient-to-br ${project.color} relative`}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-white bg-opacity-20 rounded-lg p-4 transform group-hover:scale-105 transition-all duration-300">
                        <div className="text-white text-center">
                          <div className="text-2xl font-bold mb-1">{project.name.split(' ')[0]}</div>
                          <div className="text-sm">Visit website</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{project.name}</h3>
                  </div>
                </a>
              ))}

              {/* Add Your Project Card - Always shown at the end */}
              <a 
                href="https://github.com/openlabelsinitiative/OLI?tab=readme-ov-file#products-using-oli" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group"
              >
                <div className="h-48 bg-gray-50 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-gray-100 rounded-lg p-6 transform group-hover:scale-105 transition-all duration-300">
                      <div className="text-gray-700 text-center">
                        <div className="flex items-center justify-center mb-2">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8 mr-2 text-indigo-600">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          <span className="text-xl font-bold">Add Yours</span>
                        </div>
                        <div className="mt-2 text-sm">
                          Join the OLI ecosystem
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            </>
          )}
        </div>
      </div>
    </div>

      {/* Supporters Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-12">
            Supported By
          </h2>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-2">
            <div className="col-span-1 flex justify-center">
              <Image
                src="/eth-foundation-logo.png"
                alt="Ethereum Foundation"
                width={240}
                height={120}
                className="object-contain cursor-pointer hover:opacity-90 transition-opacity duration-200"
                onClick={() => window.open('https://ethereum.org/', '_blank')}
              />
            </div>
            <div className="col-span-1 flex justify-center">
                <Image
                    src="/growthepie-logo.png"
                    alt="growthepie"
                    width={240}
                    height={120}
                    className="object-contain cursor-pointer hover:opacity-90 transition-opacity duration-200"
                    onClick={() => window.open('https://growthepie.xyz/', '_blank')}
                />
                </div>
            {/* Add more supporter logos as needed */}
          </div>
        </div>
      </div>

    </div>
  );
};

export default HomePage;