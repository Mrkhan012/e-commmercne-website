import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/utils/cn';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: ReactNode;
  error?: string;
  count?: number;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, error, count, id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    return (
      <div className="w-full">
        <div className="flex items-center gap-3">
          <input
            ref={ref}
            type="checkbox"
            id={inputId}
            aria-invalid={error ? 'true' : undefined}
            className={cn(
              'h-4 w-4 shrink-0 cursor-pointer appearance-none border border-[var(--border-color)] bg-[var(--bg-primary)]',
              'transition-colors checked:border-[var(--color-noir-gold)] checked:bg-[var(--color-noir-gold)]',
              'checked:after:block checked:after:h-full checked:after:w-full checked:after:text-center',
              'checked:after:text-[10px] checked:after:font-bold checked:after:leading-[13px] checked:after:text-[var(--color-noir-black)]',
              'checked:after:content-["✓"]',
              'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-noir-gold)]',
              'disabled:cursor-not-allowed disabled:opacity-50',
              className
            )}
            {...props}
          />
          {label && (
            <label
              htmlFor={inputId}
              className="cursor-pointer text-sm text-[var(--text-primary)] select-none"
            >
              {label}
              {count !== undefined && (
                <span className="ml-2 text-xs text-[var(--text-muted)]">({count})</span>
              )}
            </label>
          )}
        </div>
        {error && (
          <p role="alert" className="mt-1 text-xs text-red-500">
            {error}
          </p>
        )}
      </div>
    );
  }
);
Checkbox.displayName = 'Checkbox';
