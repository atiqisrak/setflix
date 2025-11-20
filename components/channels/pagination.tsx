"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8 pt-8 border-t border-gray-900">
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-900/50 border border-gray-800 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition flex items-center gap-2 text-sm"
        >
          <ChevronLeft size={18} />
          <span className="hidden sm:inline">Previous</span>
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {/* First page */}
          {currentPage > 4 && totalPages > 7 && (
            <>
              <button
                onClick={() => onPageChange(1)}
                className="px-3 py-2 rounded-lg text-sm font-medium bg-gray-900/50 text-gray-300 hover:bg-gray-800 hover:text-white border border-gray-800 transition"
              >
                1
              </button>
              {currentPage > 5 && (
                <span className="px-2 text-gray-500">...</span>
              )}
            </>
          )}

          {/* Page range around current */}
          {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
            let pageNum: number;
            if (totalPages <= 7) {
              pageNum = i + 1;
            } else if (currentPage <= 4) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 3) {
              pageNum = totalPages - 6 + i;
            } else {
              pageNum = currentPage - 3 + i;
            }

            if (pageNum < 1 || pageNum > totalPages) return null;

            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                  currentPage === pageNum
                    ? "bg-white text-black"
                    : "bg-gray-900/50 text-gray-300 hover:bg-gray-800 hover:text-white border border-gray-800"
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          {/* Last page */}
          {currentPage < totalPages - 3 && totalPages > 7 && (
            <>
              {currentPage < totalPages - 4 && (
                <span className="px-2 text-gray-500">...</span>
              )}
              <button
                onClick={() => onPageChange(totalPages)}
                className="px-3 py-2 rounded-lg text-sm font-medium bg-gray-900/50 text-gray-300 hover:bg-gray-800 hover:text-white border border-gray-800 transition"
              >
                {totalPages}
              </button>
            </>
          )}
        </div>

        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-900/50 border border-gray-800 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition flex items-center gap-2 text-sm"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Page info */}
      <div className="text-gray-400 text-sm">
        Page {currentPage} of {totalPages}
      </div>
    </div>
  );
}
