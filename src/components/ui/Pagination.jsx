import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Editorial Pagination
 * Space Mono uppercase numbers and subtle 1px dividers
 */
export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  pageSize,
}) {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-2 border-t border-border font-mono text-[11px] uppercase tracking-technical text-muted">
      <div>
        SHOWING <span className="text-foreground">{startItem}–{endItem}</span> OF <span className="text-foreground">{totalItems}</span>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="p-1.5 border-hairline border-border disabled:opacity-30 hover:border-foreground hover:text-foreground transition-colors"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <span className="px-3 py-1 text-foreground border-hairline border-border bg-surface-hover/50">
          PAGE {currentPage} / {totalPages}
        </span>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="p-1.5 border-hairline border-border disabled:opacity-30 hover:border-foreground hover:text-foreground transition-colors"
          aria-label="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
