import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/utils/cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: ReactNode;
  leading?: ReactNode;
  trailing?: ReactNode;
  containerClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, leading, trailing, containerClassName, id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const errorId = `${inputId}-error`;
    const hintId = `${inputId}-hint`;

    return (
      <div className={cn('w-full', containerClassName)}>
        {label && (
          <label
            htmlFor={inputId}
            className="mb-2 block font-heading text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--text-secondary)]"
          >
            {label}
          </label>
        )}
        <div
          className={cn(
            'relative flex items-center border bg-[var(--bg-primary)] transition-colors',
            error ? 'border-red-500' : 'border-[var(--border-color)] focus-within:border-[var(--color-noir-gold)] focus-within:ring-1 focus-within:ring-[var(--color-noir-gold)]'
          )}
        >
          {leading && (
            <span className="pointer-events-none absolute left-4 text-[var(--text-muted)]" aria-hidden="true">
              {leading}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            aria-invalid={error ? 'true' : undefined}
            aria-describedby={cn(error && errorId, hint && hintId) || undefined}
            className={cn(
              'h-12 w-full bg-transparent px-4 text-sm text-[var(--text-primary)]',
              'placeholder:text-[var(--text-muted)]',
              'focus:outline-none',
              leading && 'pl-11',
              trailing && 'pr-11',
              className
            )}
            {...props}
          />
          {trailing && <span className="absolute right-3 text-[var(--text-muted)]">{trailing}</span>}
        </div>
        {error && (
          <p id={errorId} role="alert" className="mt-1.5 text-xs text-red-500">
            {error}
          </p>
        )}
        {!error && hint && (
          <p id={hintId} className="mt-1.5 text-xs text-[var(--text-muted)]">
            {hint}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';
