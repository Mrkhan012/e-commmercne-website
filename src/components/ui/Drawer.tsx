import { useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import { X } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useFocusTrap, useEscapeKey, useScrollLock } from '@/hooks/useUi';

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  side?: 'left' | 'right';
  width?: string;
  className?: string;
}

export function Drawer({
  open,
  onClose,
  title,
  children,
  footer,
  side = 'right',
  width = 'max-w-md',
  className,
}: DrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useScrollLock(open);
  useEscapeKey(open, onClose);
  useFocusTrap(panelRef, open);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-100">
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
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={title ?? 'Drawer'}
            initial={{ x: side === 'right' ? '100%' : '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: side === 'right' ? '100%' : '-100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className={cn(
              'absolute top-0 bottom-0 flex w-full flex-col border-[var(--border-color)] bg-[var(--bg-primary)] shadow-2xl',
              side === 'right' ? 'right-0 border-l' : 'left-0 border-r',
              width,
              className
            )}
          >
            {title && (
              <div className="flex items-center justify-between border-b border-[var(--border-color)] px-6 py-5">
                <h2 className="font-heading text-sm font-semibold uppercase tracking-[0.16em] text-[var(--text-primary)]">
                  {title}
                </h2>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close"
                  className="p-1 text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            )}
            <div className="flex-1 overflow-y-auto">{children}</div>
            {footer && (
              <div className="border-t border-[var(--border-color)] px-6 py-5">{footer}</div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
