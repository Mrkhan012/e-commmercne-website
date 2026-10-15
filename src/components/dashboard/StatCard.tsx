import type { ReactNode } from 'react';
import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface StatCardProps {
  label: string;
  value: string;
  change?: number;
  icon?: ReactNode;
  hint?: string;
  className?: string;
}

export function StatCard({ label, value, change, icon, hint, className }: StatCardProps) {
  const hasChange = typeof change === 'number';
  const isPositive = (change ?? 0) > 0;
  const isNeutral = (change ?? 0) === 0;

  return (
    <div
      className={cn(
        'flex flex-col gap-3 border border-[var(--border-color)] bg-[var(--bg-card)] p-5',
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="font-heading text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
          {label}
        </p>
        {icon && (
          <span className="flex h-8 w-8 items-center justify-center bg-[var(--bg-secondary)] text-[var(--color-noir-gold)]">
            {icon}
          </span>
        )}
      </div>

      <p className="font-heading text-2xl font-bold tracking-tight text-[var(--text-primary)] lg:text-3xl">
        {value}
      </p>

      {hasChange && (
        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              'flex items-center gap-0.5 text-xs font-semibold',
              isNeutral
                ? 'text-[var(--text-muted)]'
                : isPositive
                  ? 'text-emerald-500'
                  : 'text-red-500'
            )}
          >
            {isNeutral ? (
              <Minus className="h-3 w-3" />
            ) : isPositive ? (
              <ArrowUpRight className="h-3 w-3" />
            ) : (
              <ArrowDownRight className="h-3 w-3" />
            )}
            {Math.abs(change!).toFixed(1)}%
          </span>
          <span className="text-[11px] text-[var(--text-muted)]">vs previous period</span>
        </div>
      )}

      {hint && !hasChange && <p className="text-[11px] text-[var(--text-muted)]">{hint}</p>}
    </div>
  );
}
