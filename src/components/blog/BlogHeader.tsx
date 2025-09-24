import Link from 'next/link';
import { Search, BookOpen, Sparkles } from 'lucide-react';

interface BlogHeaderProps {
  showSearch?: boolean;
}

export default function BlogHeader({ showSearch = true }: BlogHeaderProps) {
  return (
    <div className="relative bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 py-20 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-white/5"></div>
      </div>
      
      {/* Floating elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          <div className="flex justify-center mb-8">
            <div className="p-6 bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 shadow-2xl">
              <BookOpen className="w-16 h-16 text-white" />
            </div>
          </div>
          
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-white mb-4 tracking-tight">
              OLI Blog
            </h1>
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="w-6 h-6 text-yellow-300" />
              <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
                Insights, updates, and deep dives into the world of decentralized address labeling
              </p>
              <Sparkles className="w-6 h-6 text-yellow-300" />
            </div>
          </div>

          {showSearch && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Search blog posts..."
                  className="w-full sm:w-96 px-6 py-4 pl-12 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all duration-200"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/70 group-focus-within:text-white transition-colors" />
              </div>
            </div>
          )}

          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/blog/tag/technical"
              className="px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full text-white/90 hover:bg-white/20 transition-all duration-200 text-sm font-medium border border-white/20 hover:border-white/30"
            >
              Technical
            </Link>
            <Link
              href="/blog/tag/announcement"
              className="px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full text-white/90 hover:bg-white/20 transition-all duration-200 text-sm font-medium border border-white/20 hover:border-white/30"
            >
              Announcements
            </Link>
            <Link
              href="/blog/tag/research"
              className="px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full text-white/90 hover:bg-white/20 transition-all duration-200 text-sm font-medium border border-white/20 hover:border-white/30"
            >
              Research
            </Link>
            <Link
              href="/blog/tag/community"
              className="px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full text-white/90 hover:bg-white/20 transition-all duration-200 text-sm font-medium border border-white/20 hover:border-white/30"
            >
              Community
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
