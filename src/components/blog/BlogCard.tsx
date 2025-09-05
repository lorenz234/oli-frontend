'use client';

import Link from 'next/link';
import { format } from 'date-fns';
import { Clock, User, Tag, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import { BlogPostMeta } from '@/lib/blog';
import { useState } from 'react';

interface BlogCardProps {
  post: BlogPostMeta;
  featured?: boolean;
}

export default function BlogCard({ post, featured = false }: BlogCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const cardClasses = featured
    ? "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border border-blue-200/50 shadow-lg"
    : "bg-white border border-gray-100 shadow-sm hover:shadow-lg";

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  // Calculate how many tags to show initially (fit in one line)
  const maxTagsPerLine = 2; // Reduced to ensure "+X more" fits on same line
  const initialTagsToShow = Math.min(maxTagsPerLine, post.tags.length);
  const hasMoreTags = post.tags.length > maxTagsPerLine;

  return (
    <article className={`${cardClasses} rounded-2xl overflow-hidden transition-all duration-300 transform hover:-translate-y-1 group ${isExpanded ? 'h-auto' : 'h-full'} flex flex-col`}>
      <div className="p-6 flex flex-col h-full">
        {/* Featured badge */}
        {featured && (
          <div className="mb-4">
            <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white shadow-sm">
              ✨ Featured Article
            </span>
          </div>
        )}

        {/* Tags - Always at top, strictly one line */}
        <div className="mb-4">
          <div className="flex items-center gap-2 overflow-hidden">
            {post.tags.slice(0, isExpanded ? post.tags.length : initialTagsToShow).map((tag) => (
              <Link
                key={tag}
                href={`/blog/tag/${encodeURIComponent(tag.toLowerCase())}`}
                className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 border border-gray-100 flex-shrink-0"
              >
                <Tag className="w-3 h-3 mr-1 flex-shrink-0" />
                <span className="truncate">{tag}</span>
              </Link>
            ))}
            {!isExpanded && hasMoreTags && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-500 border border-gray-100 flex-shrink-0">
                +{post.tags.length - initialTagsToShow} more
              </span>
            )}
          </div>
        </div>

        {/* Title and Excerpt */}
        <div className={`mb-5 ${isExpanded ? 'flex-grow-0' : 'flex-grow'}`}>
          <h3 className={`font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-200 ${isExpanded ? 'text-xl' : 'text-xl line-clamp-2'}`}>
            <Link 
              href={`/blog/${post.slug}`}
              className="hover:text-blue-600 transition-colors"
            >
              {post.title}
            </Link>
          </h3>
          <p className={`text-gray-600 text-sm leading-relaxed ${isExpanded ? '' : 'line-clamp-3'}`}>
            {post.excerpt}
          </p>
        </div>

        {/* Meta information */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <User className="w-4 h-4 mr-1.5 text-gray-400" />
              <span className="font-medium">{post.author}</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1.5 text-gray-400" />
              <span>{post.readingTime} min read</span>
            </div>
          </div>
          <time dateTime={post.date} className="font-medium">
            {format(new Date(post.date), 'MMM d, yyyy')}
          </time>
        </div>

        {/* Expand/Collapse and Read more section */}
        <div className="pt-3 border-t border-gray-100 mt-auto">
          <div className="flex items-center justify-between">
            <Link
              href={`/blog/${post.slug}`}
              className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors group/link"
            >
              Read full article
              <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-200 group-hover/link:translate-x-1" />
            </Link>
            
            <button
              onClick={toggleExpanded}
              className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-md hover:bg-gray-100"
              aria-label={isExpanded ? 'Collapse article details' : 'Expand article details'}
            >
              {isExpanded ? (
                <>
                  <span className="mr-1">Show less</span>
                  <ChevronUp className="w-4 h-4" />
                </>
              ) : (
                <>
                  <span className="mr-1">Show more</span>
                  <ChevronDown className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
