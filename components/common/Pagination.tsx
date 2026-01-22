"use client";

import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalElements: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  pageSize,
  totalElements,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
      {/* Info text */}
      <div className="text-sm text-gray-700">
        Showing{" "}
        <span className="font-medium">{currentPage * pageSize + 1}</span> to{" "}
        <span className="font-medium">
          {Math.min((currentPage + 1) * pageSize, totalElements)}
        </span>{" "}
        of <span className="font-medium">{totalElements}</span> results
      </div>

      {/* Page buttons */}
      <nav className="inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
        {/* Previous button */}
        <button
          onClick={() => onPageChange(Math.max(0, currentPage - 1))}
          disabled={currentPage === 0}
          className={`px-3 py-2 rounded-l-md border text-sm font-medium ${currentPage === 0
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
            }`}
          aria-label="Previous page"
        >
          Previous
        </button>

        {/* Page numbers with ellipsis */}
        {getPageNumbers(currentPage, totalPages).map((page, idx) =>
          typeof page === "number" ? (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-4 py-2 border text-sm font-medium ${currentPage === page
                ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                }`}
              aria-label={`Page ${page + 1}`}
              aria-current={currentPage === page ? "page" : undefined}
            >
              {page + 1}
            </button>
          ) : (
            <span
              key={`ellipsis-${idx}`}
              className="px-4 py-2 border border-gray-300 bg-white text-gray-700"
            >
              ...
            </span>
          )
        )}

        {/* Next button */}
        <button
          onClick={() => onPageChange(Math.min(totalPages - 1, currentPage + 1))}
          disabled={currentPage === totalPages - 1}
          className={`px-3 py-2 rounded-r-md border text-sm font-medium ${currentPage === totalPages - 1
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
            }`}
          aria-label="Next page"
        >
          Next
        </button>
      </nav>
    </div>
  );
};

// Helper function to generate page numbers with ellipsis
function getPageNumbers(current: number, total: number): (number | string)[] {
  const delta = 2; // Pages to show on each side of current
  const range: (number | string)[] = [];

  for (let i = 0; i < total; i++) {
    if (
      i === 0 || // First page
      i === total - 1 || // Last page
      (i >= current - delta && i <= current + delta) // Near current
    ) {
      range.push(i);
    } else if (range[range.length - 1] !== "...") {
      range.push("...");
    }
  }

  return range;
}
