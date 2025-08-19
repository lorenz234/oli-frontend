import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PaginationInfo } from '@/lib/blog';

interface BlogPaginationProps {
  pagination: PaginationInfo;
  baseUrl: string; // e.g., '/blog' or '/blog/tag/technical'
}

export default function BlogPagination({ pagination, baseUrl }: BlogPaginationProps) {
  const { currentPage, totalPages, hasNextPage, hasPreviousPage } = pagination;

  if (totalPages <= 1) {
    return null;
  }

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    
    // Adjust if we're near the end
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();

  const getPageUrl = (page: number) => {
    if (page === 1) {
      return baseUrl;
    }
    return `${baseUrl}?page=${page}`;
  };

  return (
    <div className="flex items-center justify-between bg-white px-6 py-6 rounded-2xl shadow-sm border border-gray-100">
      <div className="flex flex-1 justify-between sm:hidden">
        {/* Mobile pagination */}
        {hasPreviousPage ? (
          <Link
            href={getPageUrl(currentPage - 1)}
            className="relative inline-flex items-center rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
          >
            Previous
          </Link>
        ) : (
          <span className="relative inline-flex items-center rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-400 cursor-not-allowed">
            Previous
          </span>
        )}
        
        {hasNextPage ? (
          <Link
            href={getPageUrl(currentPage + 1)}
            className="relative ml-3 inline-flex items-center rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
          >
            Next
          </Link>
        ) : (
          <span className="relative ml-3 inline-flex items-center rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-400 cursor-not-allowed">
            Next
          </span>
        )}
      </div>
      
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-600">
            Page <span className="font-semibold text-gray-900">{currentPage}</span> of{' '}
            <span className="font-semibold text-gray-900">{totalPages}</span>
          </p>
        </div>
        
        <div>
          <nav className="isolate inline-flex -space-x-px rounded-xl shadow-sm" aria-label="Pagination">
            {/* Previous button */}
            {hasPreviousPage ? (
              <Link
                href={getPageUrl(currentPage - 1)}
                className="relative inline-flex items-center rounded-l-xl px-3 py-2 text-gray-400 border border-gray-200 hover:bg-gray-50 hover:text-gray-600 transition-all duration-200"
              >
                <span className="sr-only">Previous</span>
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              </Link>
            ) : (
              <span className="relative inline-flex items-center rounded-l-xl px-3 py-2 text-gray-300 border border-gray-200 bg-gray-50 cursor-not-allowed">
                <span className="sr-only">Previous</span>
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              </span>
            )}
            
            {/* Show first page if not in visible range */}
            {pageNumbers[0] > 1 && (
              <>
                <Link
                  href={getPageUrl(1)}
                  className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 border border-gray-200 hover:bg-gray-50 transition-all duration-200"
                >
                  1
                </Link>
                {pageNumbers[0] > 2 && (
                  <span className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-500 border border-gray-200">
                    ...
                  </span>
                )}
              </>
            )}
            
            {/* Page numbers */}
            {pageNumbers.map((page) => (
              <Link
                key={page}
                href={getPageUrl(page)}
                className={`relative inline-flex items-center px-4 py-2 text-sm font-medium border transition-all duration-200 ${
                  page === currentPage
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white border-blue-600 shadow-lg'
                    : 'text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                }`}
                aria-current={page === currentPage ? 'page' : undefined}
              >
                {page}
              </Link>
            ))}
            
            {/* Show last page if not in visible range */}
            {pageNumbers[pageNumbers.length - 1] < totalPages && (
              <>
                {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
                  <span className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-500 border border-gray-200">
                    ...
                  </span>
                )}
                <Link
                  href={getPageUrl(totalPages)}
                  className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 border border-gray-200 hover:bg-gray-50 transition-all duration-200"
                >
                  {totalPages}
                </Link>
              </>
            )}
            
            {/* Next button */}
            {hasNextPage ? (
              <Link
                href={getPageUrl(currentPage + 1)}
                className="relative inline-flex items-center rounded-r-xl px-3 py-2 text-gray-400 border border-gray-200 hover:bg-gray-50 hover:text-gray-600 transition-all duration-200"
              >
                <span className="sr-only">Next</span>
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </Link>
            ) : (
              <span className="relative inline-flex items-center rounded-r-xl px-3 py-2 text-gray-300 border border-gray-200 bg-gray-50 cursor-not-allowed">
                <span className="sr-only">Next</span>
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </span>
            )}
          </nav>
        </div>
      </div>
    </div>
  );
}
