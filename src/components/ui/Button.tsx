import { forwardRef, type ButtonHTMLAttributes, type ElementType, type ReactNode } from 'react';
import { cn } from '@/utils/cn';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger' | 'gold';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-[var(--text-primary)] text-[var(--bg-primary)] border border-[var(--text-primary)] hover:bg-transparent hover:text-[var(--text-primary)]',
  secondary:
    'bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border-color)] hover:border-[var(--text-primary)]',
  outline:
    'bg-transparent text-[var(--text-primary)] border border-[var(--text-primary)] hover:bg-[var(--text-primary)] hover:text-[var(--bg-primary)]',
  ghost:
    'bg-transparent text-[var(--text-primary)] border border-transparent hover:bg-[var(--bg-secondary)]',
  danger:
    'bg-red-600 text-white border border-red-600 hover:bg-red-700 hover:border-red-700',
  gold: 'bg-[var(--color-noir-gold)] text-[var(--color-noir-black)] border border-[var(--color-noir-gold)] hover:brightness-110',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-9 px-4 text-[11px] tracking-[0.14em]',
  md: 'h-11 px-6 text-xs tracking-[0.16em]',
  lg: 'h-14 px-10 text-xs tracking-[0.2em]',
  icon: 'h-10 w-10',
};

const baseStyles =
  'relative inline-flex items-center justify-center gap-2 font-heading font-semibold uppercase ' +
  'transition-colors duration-200 select-none ' +
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-noir-gold)] ' +
  'disabled:pointer-events-none disabled:opacity-50 active:scale-[0.985]';

export interface ButtonOwnProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  /**
   * Render the button as a different element (e.g. a React Router `Link`) while
   * keeping the visual styling. The child element receives the merged classes.
   */
  asChild?: boolean;
  children?: ReactNode;
}

export type ButtonProps = ButtonOwnProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonOwnProps>;

/**
 * Button with optional `asChild` polymorphism: pass a single element child and
 * its props are forwarded, so `<Button asChild><Link to="/x">…</Link></Button>`
 * renders a styled link rather than a nested button inside a link.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    className,
    variant = 'primary',
    size = 'md',
    loading = false,
    fullWidth = false,
    asChild = false,
    children,
    disabled,
    ...props
  },
  ref
) {
  const classes = cn(
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    fullWidth && 'w-full',
    className
  );

  // asChild mode: merge classes onto the child element and drop button-only props.
  if (asChild && children && typeof children === 'object' && 'type' in children) {
    const child = children as React.ReactElement<{ className?: string; children?: ReactNode }>;
    return (
      <ElementTypeRenderer
        element={child.type as ElementType}
        childProps={child.props}
        classes={classes}
        loading={loading}
      />
    );
  }

  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={classes}
      {...props}
    >
      {loading && (
        <span
          aria-hidden="true"
          className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 animate-spin rounded-full border-2 border-current border-t-transparent"
        />
      )}
      <span className={cn('inline-flex items-center gap-2', loading && 'invisible')}>{children}</span>
    </button>
  );
});

/** Renders an arbitrary element type with merged classes for asChild mode. */
function ElementTypeRenderer({
  element: Element,
  childProps,
  classes,
}: {
  element: ElementType;
  childProps: { className?: string; children?: ReactNode };
  classes: string;
  loading?: boolean;
}) {
  return (
    <Element {...childProps} className={cn(classes, childProps.className)}>
      {childProps.children}
    </Element>
  );
}
