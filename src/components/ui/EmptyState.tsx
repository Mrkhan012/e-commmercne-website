import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

export interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  message: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, message, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-4 border border-dashed border-[var(--border-color)] px-6 py-16 text-center',
        className
      )}
    >
      {icon && (
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--bg-secondary)] text-[var(--text-muted)]">
          {icon}
        </div>
      )}
      <h3 className="font-heading text-lg font-semibold text-[var(--text-primary)]">{title}</h3>
      <p className="max-w-sm text-sm leading-relaxed text-[var(--text-muted)]">{message}</p>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
