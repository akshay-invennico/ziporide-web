import { ChevronLeft, ChevronRight } from 'lucide-react';
import React from 'react';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
}) => {
  if (totalPages <= 1) return null;

  const getPages = (): (number | '...')[] => {
    const pages: (number | '...')[] = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    pages.push(1);

    if (currentPage > 3) {
      pages.push('...');
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) {
      pages.push('...');
    }

    pages.push(totalPages);

    return pages;
  };

  return (
    <div
      className={`p-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-end gap-4 ${className}`}
    >
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
          className="p-1.5 rounded-full border border-gray-200 text-black hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="h-[24px] w-[24px] cursor-pointer" />
        </button>

        <div className="flex items-center gap-1">
          {getPages().map((page, idx) => {
            if (page === '...') {
              return (
                <span key={`ellipsis-${idx}`} className="text-gray-400 px-1">
                  ...
                </span>
              );
            }
            return (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                aria-label={`Page ${page}`}
                aria-current={currentPage === page ? 'page' : undefined}
                className={`min-w-[32px] h-8 flex items-center cursor-pointer justify-center rounded-lg text-[14px] font-semibold transition-colors ${
                  currentPage === page
                    ? 'bg-teal-50 text-[#1DAFA1] border border-[#1DAFA1]'
                    : 'text-gray-600 hover:bg-gray-50 border border-transparent'
                }`}
              >
                {page}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next page"
          className="p-1.5 rounded-full border border-gray-200 text-black hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="h-[24px] w-[24px] cursor-pointer" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
