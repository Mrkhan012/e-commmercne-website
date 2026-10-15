import type { HTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

export type BadgeVariant = 'default' | 'sale' | 'new' | 'best' | 'trending' | 'gold' | 'outline';

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-[var(--text-primary)] text-[var(--bg-primary)]',
  sale: 'bg-red-600 text-white',
  new: 'bg-[var(--color-noir-gold)] text-[var(--color-noir-black)]',
  best: 'bg-[var(--color-noir-charcoal)] text-[var(--color-noir-ivory)]',
  trending: 'bg-purple-600 text-white',
  gold: 'border border-[var(--color-noir-gold)] text-[var(--color-noir-gold)]',
  outline: 'border border-[var(--border-color)] text-[var(--text-secondary)]',
};

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export function Badge({ className, variant = 'default', children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-1 font-heading text-[10px] font-bold uppercase tracking-[0.14em]',
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
