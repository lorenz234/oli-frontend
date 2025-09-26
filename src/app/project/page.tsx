// app/project/page.tsx
import AddProjectForm from '@/components/project/AddProjectForm'
import Link from 'next/link'

export default function AddProjectPage() {
  return (
    <main className="max-w-7xl mx-auto p-8">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.05)] mb-8">
        <div className="py-6 px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Add a Project</h2>
          <p className="text-gray-700 mb-4">
            You couldn&apos;t find your project in our &quot;Owner Project&quot; dropdown? Please double-check and then consider adding your project to the OSS (Open Source Software) directory, which is used by OLI. The project form will generate a YAML file that can be added to the OSS repo via a GitHub pull request.
          </p>
          
          <div className="relative bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 border border-blue-200 rounded-3xl p-6 shadow-lg overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 left-0 w-full h-full bg-white/5"></div>
            </div>
            
            {/* Floating elements */}
            <div className="absolute top-4 left-4 w-12 h-12 bg-white/10 rounded-full blur-xl"></div>
            <div className="absolute bottom-4 right-4 w-16 h-16 bg-white/5 rounded-full blur-2xl"></div>
            
            <div className="relative z-10">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Quick Setup with AI Site Profiler
                  </h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white text-xs font-semibold rounded-full flex items-center justify-center">1</span>
                    <span className="text-sm text-gray-700">Visit our <strong>Site Profiler YAML v7</strong> GPT</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white text-xs font-semibold rounded-full flex items-center justify-center">2</span>
                    <span className="text-sm text-gray-700">Provide your project&apos;s website URL</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white text-xs font-semibold rounded-full flex items-center justify-center">3</span>
                    <span className="text-sm text-gray-700">Copy the generated YAML and paste it in the form below</span>
                  </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4" style={{ marginTop: '20px' }}>
            <Link 
              href="https://chatgpt.com/g/g-68d13e485a608191a57c64d28c6db5f0-site-profiler-yaml-v7"
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 text-white rounded-lg hover:from-blue-600 hover:via-purple-700 hover:to-pink-600 font-medium transition-all shadow-md hover:shadow-lg"
            >
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
              Use Site Profiler GPT →
            </Link>
            <Link 
              href="https://github.com/opensource-observer/oss-directory"
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 text-blue-600 hover:text-blue-800 font-medium border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5z" clipRule="evenodd" />
                <path fillRule="evenodd" d="M7.414 15.414a2 2 0 01-2.828-2.828l3-3a2 2 0 012.828 0 1 1 0 001.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 00-1.414-1.414l-1.5 1.5z" clipRule="evenodd" />
              </svg>
              OSS Directory →
            </Link>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.05)]">
        <div className="flex justify-between items-center pt-6 pb-4 px-8">
          <h2 className="text-2xl font-bold text-gray-900">Project Form</h2>
        </div>
        <AddProjectForm />
      </div>
    </main>
  )
}