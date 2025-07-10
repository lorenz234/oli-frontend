import React from 'react';
import Link from 'next/link';

const BulkAttestationScripts = () => {
  return (
    <div className="py-6 px-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Developer Tools & SDKs</h2>
      <p className="text-gray-700 mb-6">
        For handling larger datasets or integrating with your data pipeline, we provide several script options.
        Choose the one that best fits your use case and technical requirements.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Python Pip Package Card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-full">
          <div className="bg-blue-50 p-4 border-b border-gray-200">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Python Pip Package</h3>
                <p className="text-sm text-gray-600">pip install oli-python</p>
              </div>
            </div>
          </div>
          <div className="p-4 flex-grow flex flex-col">
            <ul className="mb-4 space-y-2 text-sm text-gray-700 flex-grow">
              <li className="flex items-start">
                <svg className="w-4 h-4 mt-0.5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Easy installation via pip
              </li>
              <li className="flex items-start">
                <svg className="w-4 h-4 mt-0.5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Complete OLI integration for Python projects
              </li>
              <li className="flex items-start">
                <svg className="w-4 h-4 mt-0.5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Comprehensive documentation available
              </li>
            </ul>
            
            <div className="flex flex-col gap-2 mt-auto">
              <Link 
                href="https://github.com/openlabelsinitiative/oli-python" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center"
              >
                <span>GitHub Repository</span>
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
              </Link>
              <Link 
                href="https://pypi.org/project/oli-python/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center"
              >
                <span>PyPI Package</span>
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
              </Link>
            </div>
          </div>
        </div>
        
        {/* TypeScript Bulk Offchain Attestation Uploader Card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-full">
          <div className="bg-purple-50 p-4 border-b border-gray-200">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">TypeScript: Bulk Offchain Attestation Script</h3>
                <p className="text-sm text-gray-600">For TypeScript/JavaScript developers</p>
              </div>
            </div>
          </div>
          <div className="p-4 flex-grow flex flex-col">
            <ul className="mb-4 space-y-2 text-sm text-gray-700 flex-grow">
              <li className="flex items-start">
                <svg className="w-4 h-4 mt-0.5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Bulk attest and upload labels from CSV files
              </li>
              <li className="flex items-start">
                <svg className="w-4 h-4 mt-0.5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Signs attestations before submitting to EAS IPFS
              </li>
              <li className="flex items-start">
                <svg className="w-4 h-4 mt-0.5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Validates OLI-compliant Data Model format
              </li>
              <li className="flex items-start">
                <svg className="w-4 h-4 mt-0.5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Signature validation by EAS IPFS server
              </li>
            </ul>
            
            <Link 
              href="https://github.com/openlabelsinitiative/OLI/tree/main/2_label_pool/tooling_write/typescript" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-purple-600 hover:text-purple-800 font-medium inline-flex items-center mt-auto"
            >
              <span>Access script</span>
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </Link>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
        <h3 className="text-base font-semibold text-gray-900 mb-2">When to use these tools?</h3>
        <p className="text-gray-700 mb-3">
          These tools are ideal when you need to submit more than 50 attestations or want to integrate attestation into your 
          existing data pipeline. The Python package provides a complete SDK while the TypeScript script offers a ready-to-use solution for CSV-based workflows.
        </p>
        <Link 
          href="https://github.com/openlabelsinitiative/OLI/tree/main/2_label_pool/tooling_write" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center"
        >
          View GitHub Repository
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default BulkAttestationScripts; 