'use client';

import type { FC } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const HomePage: FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            Open Labels Initiative
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            A standardized framework and data model for EVM address labeling
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
              <a
                href="https://calendar.google.com/calendar/u/3?cid=MmQ0MzYxNzQ3ZGFiY2M3ZDJkZjk0NjZiYmY3MmNmZDUwZTNjMjE2OTQ4YzgyNmI4OTBmYjYyN2VmNGRjNjQ4OEBncm91cC5jYWxlbmRhci5nb29nbGUuY29t"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent font-medium rounded-md text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
              >
                Join Community Calls
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* The 3 Pillars Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              The 3 Pillars of OLI
            </h2>
          </div>
          <div className="mt-12 grid gap-8 grid-cols-1 md:grid-cols-3">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900">Data Model</h3>
                <p className="mt-2 text-base text-gray-500">
                  We all speak the same language when it comes to labels. This framework allows us to easily sync labels between different databases and align on the valuesets.
                </p>
                <a href="https://github.com/openlabelsinitiative/OLI/tree/main/1_data_model" target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center text-indigo-600 hover:text-indigo-500">
                  Learn more
                  <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900">Label Pool</h3>
                <p className="mt-2 text-base text-gray-500">
                  A publicly accessible database of attested labels. Raw and simple. We use attestations to collect labels from anyone out there willing to share labels.
                </p>
                <a href="https://github.com/openlabelsinitiative/OLI/tree/main/2_label_pool" target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center text-indigo-600 hover:text-indigo-500">
                  Learn more
                  <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900">Label Confidence</h3>
                <p className="mt-2 text-base text-gray-500">
                  Use-case optimized trust algorithms applied to the raw labels. This way raw labels become useful labels, optimized for analytics, security, or other use-cases.
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

    {/* Call to Action Section */}
    <div className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
    <div className="max-w-7xl mx-auto text-center py-12 px-4 sm:py-12 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-white mb-12">
        <span className="block">Start Using the OLI Label Pool</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Search Card */}
        <Link
            href="/search"
            className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-200 group"
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
            className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-200 group"
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
            className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-200 group"
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