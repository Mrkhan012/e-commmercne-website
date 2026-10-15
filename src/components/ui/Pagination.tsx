import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
  className?: string;
}

export function Pagination({ page, totalPages, onChange, className }: PaginationProps) {
  if (totalPages <= 1) return null;

  // Build a compact page list with ellipses.
  const pages: (number | 'ellipsis')[] = [];
  const push = (value: number | 'ellipsis') => {
    if (pages[pages.length - 1] !== value) pages.push(value);
  };

  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= page - 1 && i <= page + 1)
    ) {
      push(i);
    } else if (pages[pages.length - 1] !== 'ellipsis') {
      push('ellipsis');
    }
  }

  const navButton =
    'flex h-10 w-10 items-center justify-center border border-[var(--border-color)] text-[var(--text-primary)] transition-colors hover:border-[var(--text-primary)] disabled:pointer-events-none disabled:opacity-40';

  return (
    <nav aria-label="Pagination" className={cn('flex items-center justify-center gap-2', className)}>
      <button
        type="button"
        className={navButton}
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {pages.map((item, index) =>
        item === 'ellipsis' ? (
          <span key={`ellipsis-${index}`} className="px-1 text-[var(--text-muted)]" aria-hidden="true">
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            onClick={() => onChange(item)}
            aria-label={`Page ${item}`}
            aria-current={item === page ? 'page' : undefined}
            className={cn(
              'flex h-10 min-w-10 items-center justify-center border px-3 font-heading text-xs font-semibold transition-colors',
              item === page
                ? 'border-[var(--text-primary)] bg-[var(--text-primary)] text-[var(--bg-primary)]'
                : 'border-[var(--border-color)] text-[var(--text-primary)] hover:border-[var(--text-primary)]'
            )}
          >
            {item}
          </button>
        )
      )}

      <button
        type="button"
        className={navButton}
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}
