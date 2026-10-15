import type { ReactNode } from 'react';
import { Checkbox } from '@/components/ui/Checkbox';
import { Skeleton } from '@/components/ui/Skeleton';
import { Pagination } from '@/components/ui/Pagination';
import { EmptyState } from '@/components/ui/EmptyState';
import { cn } from '@/utils/cn';

export interface DataTableColumn<T> {
  key: string;
  header: string;
  render?: (row: T) => ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
  /** Hide this column below the `md` breakpoint to keep mobile tables readable. */
  hideOnMobile?: boolean;
}

export interface DataTableProps<T extends { id: string }> {
  columns: DataTableColumn<T>[];
  data: T[];
  loading?: boolean;
  selectable?: boolean;
  selectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  emptyTitle?: string;
  emptyMessage?: string;
  className?: string;
}

export function DataTable<T extends { id: string }>({
  columns,
  data,
  loading = false,
  selectable = false,
  selectedIds = [],
  onSelectionChange,
  page,
  totalPages,
  onPageChange,
  emptyTitle = 'No results',
  emptyMessage = 'Nothing to show here yet.',
  className,
}: DataTableProps<T>) {
  const allSelected = data.length > 0 && selectedIds.length === data.length;

  const toggleAll = () => {
    if (!onSelectionChange) return;
    onSelectionChange(allSelected ? [] : data.map((row) => row.id));
  };

  const toggleOne = (id: string) => {
    if (!onSelectionChange) return;
    onSelectionChange(
      selectedIds.includes(id) ? selectedIds.filter((i) => i !== id) : [...selectedIds, id]
    );
  };

  if (loading) {
    return (
      <div className={cn('space-y-3', className)}>
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        message={emptyMessage}
        className={cn('border-0', className)}
      />
    );
  }

  const alignClass = (align?: 'left' | 'center' | 'right') =>
    align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : 'text-left';

  return (
    <div className={className}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse">
          <thead>
            <tr className="border-b border-[var(--border-color)]">
              {selectable && (
                <th className="w-10 px-3 py-3">
                  <Checkbox
                    checked={allSelected}
                    onChange={toggleAll}
                    aria-label="Select all rows"
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.key}
                  style={{ width: column.width }}
                  className={cn(
                    'px-3 py-3 font-heading text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]',
                    alignClass(column.align),
                    column.hideOnMobile && 'hidden md:table-cell'
                  )}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr
                key={row.id}
                className={cn(
                  'border-b border-[var(--border-color)] transition-colors last:border-0',
                  selectedIds.includes(row.id) ? 'bg-[var(--bg-secondary)]' : 'hover:bg-[var(--bg-secondary)]/60'
                )}
              >
                {selectable && (
                  <td className="px-3 py-3">
                    <Checkbox
                      checked={selectedIds.includes(row.id)}
                      onChange={() => toggleOne(row.id)}
                      aria-label={`Select row`}
                    />
                  </td>
                )}
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={cn(
                      'px-3 py-3.5 text-sm text-[var(--text-primary)]',
                      alignClass(column.align),
                      column.hideOnMobile && 'hidden md:table-cell'
                    )}
                  >
                    {column.render
                      ? column.render(row)
                      : String((row as Record<string, unknown>)[column.key] ?? '—')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {page !== undefined && totalPages !== undefined && onPageChange && totalPages > 1 && (
        <div className="mt-4 flex justify-end">
          <Pagination page={page} totalPages={totalPages} onChange={onPageChange} />
        </div>
      )}
    </div>
  );
}
