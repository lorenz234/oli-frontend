import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getBlogPost, getBlogSlugs, getRelatedBlogPosts, generateBlogPostStructuredData } from '@/lib/blog';
import BlogContent from '@/components/blog/BlogContent';
import RelatedPosts from '@/components/blog/RelatedPosts';
import BlogCTA from '@/components/blog/BlogCTA';


interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate static params for all blog posts at build time
export async function generateStaticParams() {
  const slugs = getBlogSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

// Generate metadata for each blog post
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'The requested blog post could not be found.',
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://openlabelsinitiative.org';
  const postUrl = `${baseUrl}/blog/${slug}`;

  return {
    title: post.seo.title || post.title,
    description: post.seo.description || post.excerpt,
    keywords: post.seo.keywords?.join(', ') || post.tags.join(', '),
    authors: [{ name: post.author }],
    openGraph: {
      title: post.seo.title || post.title,
      description: post.seo.description || post.excerpt,
      url: postUrl,
      siteName: 'Open Labels Initiative',
      images: [
        {
          url: `${baseUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: post.title,
        }
      ],
      locale: 'en_US',
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.seo.title || post.title,
      description: post.seo.description || post.excerpt,
      creator: '@open_labels',
      images: [`${baseUrl}/og-image.png`],
    },
    alternates: {
      canonical: postUrl,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = getRelatedBlogPosts(slug, 3);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://openlabelsinitiative.org';

  // Generate structured data for the blog post
  const structuredData = generateBlogPostStructuredData(post, baseUrl);

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      <BlogContent post={post} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Related posts */}
        {relatedPosts.length > 0 && (
          <RelatedPosts posts={relatedPosts} />
        )}



        {/* CTA - minimal variant for blog posts */}
        <BlogCTA 
          mb-10
          variant="minimal"
          title="Explore the OLI Ecosystem"
          description="Ready to dive deeper into decentralized address labeling?"
        />
      </div>
    </>
  );
}
