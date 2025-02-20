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
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
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
                width={200}
                height={100}
                className="object-contain cursor-pointer hover:opacity-90 transition-opacity duration-200"
                onClick={() => window.open('https://ethereum.org/', '_blank')}
              />
            </div>
            <div className="col-span-1 flex justify-center">
                <Image
                    src="/growthepie-logo.png"
                    alt="growthepie"
                    width={200}
                    height={100}
                    className="object-contain cursor-pointer hover:opacity-90 transition-opacity duration-200"
                    onClick={() => window.open('https://growthepie.xyz/', '_blank')}
                />
                </div>
            {/* Add more supporter logos as needed */}
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="bg-indigo-700">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Ready to get started?</span>
            <span className="block">Create your first attestation!</span>
          </h2>
          <Link
            href="/attest"
            className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 sm:w-auto"
          >
            Create Attestation
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;