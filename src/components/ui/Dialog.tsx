import { useEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import { X } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useFocusTrap, useEscapeKey, useScrollLock } from '@/hooks/useUi';

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children?: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeStyles = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-2xl',
};

export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  className,
}: DialogProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleId = useRef(`dialog-title-${Math.random().toString(36).slice(2)}`).current;

  useScrollLock(open);
  useEscapeKey(open, onClose);
  useFocusTrap(containerRef, open);

  useEffect(() => {
    if (!open) return;
    // Move focus into the dialog when it opens.
    const timer = window.setTimeout(() => {
      containerRef.current
        ?.querySelector<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        ?.focus();
    }, 40);
    return () => window.clearTimeout(timer);
  }, [open]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            aria-hidden="true"
          />
          <motion.div
            ref={containerRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? titleId : undefined}
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              'relative z-10 w-full border border-[var(--border-color)] bg-[var(--bg-primary)] shadow-2xl',
              sizeStyles[size],
              className
            )}
          >
            {title && (
              <div className="flex items-start justify-between gap-4 border-b border-[var(--border-color)] px-6 py-5">
                <div>
                  <h2 id={titleId} className="font-heading text-lg font-bold text-[var(--text-primary)]">
                    {title}
                  </h2>
                  {description && (
                    <p className="mt-1 text-sm text-[var(--text-muted)]">{description}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close dialog"
                  className="shrink-0 rounded-none p-1 text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            )}
            {children && <div className="px-6 py-5">{children}</div>}
            {footer && (
              <div className="flex items-center justify-end gap-3 border-t border-[var(--border-color)] px-6 py-4">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
