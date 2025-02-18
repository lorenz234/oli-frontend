// app/attest/page.tsx
import AttestationForm from '@/components/attestation/AttestationForm'

export default function AttestPage() {
  return (
    <main className="max-w-3xl mx-auto p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.05)]">
        <div className="flex justify-between items-center p-8">
          <h2 className="text-2xl font-bold text-gray-900">Add New Attestation</h2>
        </div>
        <AttestationForm />
      </div>
    </main>
  )
}