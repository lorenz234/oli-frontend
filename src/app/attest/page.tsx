'use client';

import { useState } from 'react';
import Link from 'next/link';
import AttestationForm from '@/components/attestation/AttestationForm';
import BulkAttestationForm from '@/components/attestation/BulkAttestationForm';

export default function AttestPage() {
  const [mode, setMode] = useState<'single' | 'bulk'>('single');

  return (
    <main className="max-w-7xl mx-auto p-8">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.05)] mb-8">
        <div className="py-6 px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Bulk Attestation Options</h2>
          <p className="text-gray-700 mb-4">
            Need to create multiple attestations? You can bulk attest directly through our UI or use our Python and TypeScript scripts for even larger datasets.
          </p>
          <Link 
            href="https://github.com/openlabelsinitiative/OLI/tree/main/2_label_pool/tooling_write" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Access bulk attestation scripts →
          </Link>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.05)]">
        <div className="border-b border-gray-200">
          <div className="flex justify-between items-center py-6 px-6">
            <h2 className="text-2xl font-bold text-gray-900">Assign Tags to Addresses</h2>
            
            <div className="flex">
              <button
                className={`px-4 py-2 text-sm font-medium ${
                  mode === 'single' 
                    ? 'bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-white rounded-l-lg'
                    : 'text-gray-500 hover:text-gray-700 bg-white rounded-l-lg border border-gray-300'
                }`}
                onClick={() => setMode('single')}
              >
                Single Address
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium ${
                  mode === 'bulk' 
                    ? 'bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-white rounded-r-lg'
                    : 'text-gray-500 hover:text-gray-700 bg-white rounded-r-lg border border-gray-300'
                }`}
                onClick={() => setMode('bulk')}
              >
                Multiple Addresses
              </button>
            </div>
          </div>
        </div>
        
        {mode === 'single' ? (
          <AttestationForm />
        ) : (
          <BulkAttestationForm />
        )}
      </div>
    </main>
  );
}