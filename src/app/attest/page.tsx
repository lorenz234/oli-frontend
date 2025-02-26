// app/attest/page.tsx
import AttestationForm from '@/components/attestation/AttestationForm'
import Link from 'next/link'

export default function AttestPage() {
  return (
    <main className="max-w-3xl mx-auto p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.05)] mb-8">
        <div className="py-6 px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Bulk Attestation Options</h2>
          <p className="text-gray-700 mb-4">
            Need to create multiple attestations? You can bulk attest onchain or offchain using our Python and TypeScript scripts. More tooling is in the making!
          </p>
          <Link 
            href="https://github.com/openlabelsinitiative/OLI/tree/main/2_label_pool/tooling_write" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Access bulk attestation tools →
          </Link>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.05)]">
        <div className="flex justify-between items-center py-6 px-8">
          <h2 className="text-2xl font-bold text-gray-900">Assign Tags to a Single Address by Attesting</h2>
        </div>
        <AttestationForm />
      </div>
    </main>
  )
}