// app/project/page.tsx
import AddProjectForm from '@/components/project/AddProjectForm'
import Link from 'next/link'

export default function AddProjectPage() {
  return (
    <main className="max-w-3xl mx-auto p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.05)] mb-8">
        <div className="py-6 px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Add a New Project</h2>
          <p className="text-gray-700 mb-4">
            You couldn't find you project in our -Owner Project- dropdown? Please double check and then consider adding your project to the OSS (Open Source Software) directory which is used by OLI. The project from will generate a YAML file that can be added to the OSS repo via a GitHub pull request.
          </p>
          <Link 
            href="https://github.com/opensource-observer/oss-directory"
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Learn more about the OSS directory on GitHub →
          </Link>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.05)]">
        <div className="flex justify-between items-center pt-6 pb-4 px-8">
          <h2 className="text-2xl font-bold text-gray-900">Project Form</h2>
        </div>
        <AddProjectForm />
      </div>
    </main>
  )
}