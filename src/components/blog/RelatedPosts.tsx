import Link from 'next/link';
import { format } from 'date-fns';
import { Clock, ArrowRight, Tag } from 'lucide-react';
import { BlogPostMeta } from '@/lib/blog';

interface RelatedPostsProps {
  posts: BlogPostMeta[];
  title?: string;
}

export default function RelatedPosts({ 
  posts, 
  title = "Related Articles" 
}: RelatedPostsProps) {
  if (posts.length === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl p-10 my-16 border border-gray-100">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
        <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {posts.map((post) => (
          <article
            key={post.slug}
            className="bg-white rounded-2xl p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group border border-gray-100"
          >
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200"
                >
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </span>
              ))}
            </div>

            {/* Title */}
            <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
              <Link href={`/blog/${post.slug}`}>
                {post.title}
              </Link>
            </h3>

            {/* Excerpt */}
            <p className="text-gray-600 text-sm mb-5 line-clamp-3 leading-relaxed">
              {post.excerpt}
            </p>

            {/* Meta */}
            <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1.5 text-gray-400" />
                <span className="font-medium">{post.readingTime} min read</span>
              </div>
              <time dateTime={post.date} className="font-medium">
                {format(new Date(post.date), 'MMM d, yyyy')}
              </time>
            </div>

            {/* Read more */}
            <div className="pt-3 border-t border-gray-100">
              <Link
                href={`/blog/${post.slug}`}
                className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors group/link"
              >
                Read more
                <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-200 group-hover/link:translate-x-1" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
