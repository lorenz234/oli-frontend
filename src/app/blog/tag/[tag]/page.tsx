import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Tag } from 'lucide-react';
import { getBlogPostsByTag, getAllTags, paginateBlogPosts } from '@/lib/blog';
import BlogCard from '@/components/blog/BlogCard';
import BlogPagination from '@/components/blog/BlogPagination';
import BlogCTA from '@/components/blog/BlogCTA';

interface TagPageProps {
  params: Promise<{
    tag: string;
  }>;
  searchParams: Promise<{
    page?: string;
  }>;
}

// Generate static params for all tags at build time
export async function generateStaticParams() {
  const tags = getAllTags();
  return tags.map((tag) => ({
    tag: tag.toLowerCase(),
  }));
}

// Generate metadata for each tag page
export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { tag: tagParam } = await params;
  const tag = decodeURIComponent(tagParam);
  const tagPosts = getBlogPostsByTag(tag);

  if (tagPosts.length === 0) {
    return {
      title: 'Tag Not Found',
      description: 'The requested tag could not be found.',
    };
  }

  const formattedTag = tag.charAt(0).toUpperCase() + tag.slice(1);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://openlabelsinitiative.org';
  const pageUrl = `${baseUrl}/blog/tag/${tag}`;

  return {
    title: `${formattedTag} Articles - OLI Blog`,
    description: `Explore all articles tagged with "${formattedTag}" from the Open Labels Initiative blog. Find insights and updates on this topic.`,
    openGraph: {
      title: `${formattedTag} Articles - OLI Blog`,
      description: `Explore all articles tagged with "${formattedTag}" from the Open Labels Initiative blog.`,
      url: pageUrl,
      siteName: 'Open Labels Initiative',
      images: [
        {
          url: `${baseUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: `${formattedTag} Articles`,
        }
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${formattedTag} Articles - OLI Blog`,
      description: `Explore all articles tagged with "${formattedTag}" from the Open Labels Initiative blog.`,
      creator: '@open_labels',
      images: [`${baseUrl}/og-image.png`],
    },
  };
}

export default async function TagPage({ params, searchParams }: TagPageProps) {
  const { tag: tagParam } = await params;
  const tag = decodeURIComponent(tagParam);
  const { page } = await searchParams;
  const currentPage = parseInt(page || '1', 10);
  const tagPosts = getBlogPostsByTag(tag);

  if (tagPosts.length === 0) {
    notFound();
  }

  const { posts: paginatedPosts, pagination } = paginateBlogPosts(
    tagPosts,
    currentPage,
    9 // 9 posts per page for tag pages
  );

  const formattedTag = tag.charAt(0).toUpperCase() + tag.slice(1);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl">
                <Tag className="w-12 h-12 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {formattedTag} Articles
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              {pagination.totalPosts} article{pagination.totalPosts !== 1 ? 's' : ''} tagged with &ldquo;{formattedTag}&rdquo;
            </p>

            <Link
              href="/blog"
              className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg text-white hover:bg-white/20 transition-all duration-200"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to all articles
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Articles grid */}
        <section>
          {paginatedPosts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {paginatedPosts.map((post) => (
                  <BlogCard key={post.slug} post={post} />
                ))}
              </div>

              {/* Pagination */}
              <div className="mb-12">
                <BlogPagination 
                  pagination={pagination} 
                  baseUrl={`/blog/tag/${tag}`}
                />
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No articles found for this tag.</p>
            </div>
          )}
        </section>

        {/* Related tags */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Explore Other Topics</h2>
          <div className="flex flex-wrap gap-3">
            {getAllTags()
              .filter(t => t.toLowerCase() !== tag.toLowerCase())
              .slice(0, 10)
              .map((relatedTag) => (
                <Link
                  key={relatedTag}
                  href={`/blog/tag/${relatedTag.toLowerCase()}`}
                  className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm font-medium text-gray-700 transition-colors"
                >
                  <Tag className="w-4 h-4 mr-2" />
                  {relatedTag}
                </Link>
              ))}
          </div>
        </section>

        {/* CTA section */}
        <BlogCTA 
          title="Interested in Contributing?"
          description="Join the OLI community and help build the future of decentralized address labeling."
        />
      </div>
    </div>
  );
}
