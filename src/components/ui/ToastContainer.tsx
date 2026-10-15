import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import { CheckCircle2, XCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useToastStore } from '@/store/toastStore';
import { cn } from '@/utils/cn';

const icons = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
  warning: AlertTriangle,
};

const accent = {
  success: 'text-emerald-400',
  error: 'text-red-400',
  info: 'text-[var(--color-noir-gold)]',
  warning: 'text-amber-400',
};

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div
      aria-live="polite"
      aria-atomic="true"
      className="pointer-events-none fixed bottom-4 right-4 z-200 flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3 sm:bottom-6 sm:right-6"
    >
      <AnimatePresence initial={false}>
        {toasts.map((toast) => {
          const Icon = icons[toast.type];
          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40, scale: 0.96 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              role="status"
              className={cn(
                'pointer-events-auto flex items-start gap-3 border border-white/10 bg-[var(--color-noir-charcoal)] p-4 shadow-2xl'
              )}
            >
              <Icon className={cn('mt-0.5 h-5 w-5 shrink-0', accent[toast.type])} aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <p className="font-heading text-sm font-semibold text-[var(--color-noir-ivory)]">
                  {toast.title}
                </p>
                {toast.message && (
                  <p className="mt-0.5 text-xs leading-relaxed text-white/60">{toast.message}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                aria-label="Dismiss notification"
                className="shrink-0 p-0.5 text-white/40 transition-colors hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>,
    document.body
  );
}
