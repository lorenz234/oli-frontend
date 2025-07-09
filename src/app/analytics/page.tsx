import DonutChart from '@/components/DonutChart';
import LatestAttestations from '@/components/LatestAttestations';

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
      <main className="flex-grow py-16 px-4">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Analytics Dashboard</h1>
            <p className="text-gray-600 text-lg">
              Get an overview of what's inside the OLI Label Pool. See label distributions, attestation activity and community contributions across the ecosystem.
            </p>
          </div>
          
          <DonutChart />
          <LatestAttestations />
        </div>
      </main>
    </div>
  );
}