import { useRef, useState, type ReactNode } from 'react';
import { cn } from '@/utils/cn';
import { useClickOutside, useEscapeKey } from '@/hooks/useUi';

export interface DropdownProps {
  trigger: ReactNode;
  children: ReactNode | ((close: () => void) => ReactNode);
  align?: 'left' | 'right';
  className?: string;
  panelClassName?: string;
}

export function Dropdown({
  trigger,
  children,
  align = 'right',
  className,
  panelClassName,
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useClickOutside(containerRef, open, () => setOpen(false));
  useEscapeKey(open, () => setOpen(false));

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <div
        onClick={() => setOpen((prev) => !prev)}
        role="button"
        tabIndex={0}
        aria-expanded={open}
        aria-haspopup="true"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setOpen((prev) => !prev);
          }
        }}
        className="cursor-pointer"
      >
        {trigger}
      </div>
      <div
        className={cn(
          'absolute top-[calc(100%+0.5rem)] z-50 min-w-48 border border-[var(--border-color)] bg-[var(--bg-primary)] shadow-xl',
          'origin-top transition-all duration-150',
          open
            ? 'pointer-events-auto scale-100 opacity-100'
            : 'pointer-events-none scale-95 opacity-0',
          align === 'right' ? 'right-0' : 'left-0',
          panelClassName
        )}
        role="menu"
        aria-hidden={!open}
      >
        {typeof children === 'function' ? children(() => setOpen(false)) : children}
      </div>
    </div>
  );
}

export interface DropdownItemProps {
  onClick?: () => void;
  children: ReactNode;
  icon?: ReactNode;
  destructive?: boolean;
}

export function DropdownItem({ onClick, children, icon, destructive }: DropdownItemProps) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition-colors',
        destructive
          ? 'text-red-500 hover:bg-red-500/10'
          : 'text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
      )}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </button>
  );
}

export function DropdownDivider() {
  return <div className="my-1 border-t border-[var(--border-color)]" />;
}
