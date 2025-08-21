import { Metadata } from 'next';
import { getAllBlogPosts, getFeaturedBlogPosts, paginateBlogPosts } from '@/lib/blog';
import BlogHeader from '@/components/blog/BlogHeader';
import BlogCard from '@/components/blog/BlogCard';
import BlogPagination from '@/components/blog/BlogPagination';
import BlogCTA from '@/components/blog/BlogCTA';


interface BlogPageProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

export const metadata: Metadata = {
  title: 'OLI Blog - Open Labels Initiative Insights',
  description: 'Stay updated with the latest insights, technical deep dives, and announcements from the Open Labels Initiative team.',
  openGraph: {
    title: 'OLI Blog - Open Labels Initiative Insights',
    description: 'Stay updated with the latest insights, technical deep dives, and announcements from the Open Labels Initiative team.',
    url: 'https://openlabelsinitiative.org/blog',
    siteName: 'Open Labels Initiative',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'OLI Blog',
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OLI Blog - Open Labels Initiative Insights',
    description: 'Stay updated with the latest insights, technical deep dives, and announcements from the Open Labels Initiative team.',
    creator: '@open_labels',
    images: ['/og-image.png'],
  },
  alternates: {
    types: {
      'application/rss+xml': '/blog/rss.xml',
    },
  },
};

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const { page } = await searchParams;
  const currentPage = parseInt(page || '1', 10);
  const allPosts = getAllBlogPosts();
  const featuredPosts = getFeaturedBlogPosts();
  
  // For pagination, use all posts (including featured ones)
  const { posts: paginatedPosts, pagination } = paginateBlogPosts(
    allPosts,
    currentPage,
    6 // 6 posts per page
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <BlogHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-16">
        {/* Featured posts section - only show on first page */}
        {featuredPosts.length > 0 && currentPage === 1 && (
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-gray-900">Featured Articles</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              {featuredPosts.slice(0, 2).map((post) => (
                <BlogCard key={post.slug} post={post} featured />
              ))}
            </div>
            {featuredPosts.length > 2 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredPosts.slice(2).map((post) => (
                  <BlogCard key={post.slug} post={post} featured />
                ))}
              </div>
            )}
          </section>
        )}

        {/* Regular posts section */}
        <section>
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-gray-900">
                {currentPage === 1 && featuredPosts.length > 0 
                  ? 'Latest Articles' 
                  : 'All Articles'
                }
              </h2>
            </div>
            <div className="px-4 py-2 bg-gray-100 rounded-full">
              <p className="text-sm font-medium text-gray-700">
                {pagination.totalPosts} articles
              </p>
            </div>
          </div>

          {paginatedPosts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                {paginatedPosts.map((post) => (
                  <BlogCard key={post.slug} post={post} />
                ))}
              </div>

              {/* Pagination */}
              <div className="mb-16">
                <BlogPagination 
                  pagination={pagination} 
                  baseUrl="/blog" 
                />
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No articles found</h3>
                <p className="text-gray-600">Check back later for new content.</p>
              </div>
            </div>
          )}
        </section>

        {/* CTA section */}
        <BlogCTA />
      </div>
    </div>
  );
}
