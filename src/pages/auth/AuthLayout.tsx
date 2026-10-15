import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { useReducedMotion } from '@/hooks/useUi';
import { cn } from '@/utils/cn';

export interface AuthLayoutProps {
  children: ReactNode;
  image: string;
  headline: string;
  subline: string;
}

/** Small editorial label that sits above the split-screen headline. */
const EYEBROW = 'The Members’ Journal';

/**
 * Shared split-screen shell for every authentication screen.
 *
 * Desktop: an editorial image panel (5/12) beside the form column (7/12).
 * Mobile: the image collapses to a short band and the form fills the rest.
 * This component is a shell, not a route — each page supplies its own form.
 */
export default function AuthLayout({ children, image, headline, subline }: AuthLayoutProps) {
  const reduceMotion = useReducedMotion();

  const panelEnter = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, x: -16 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
      };

  return (
    <div className="flex min-h-screen flex-col bg-[var(--bg-primary)] lg:flex-row">
      {/* ─── Editorial panel ─── */}
      <motion.aside
        {...panelEnter}
        className="relative h-40 w-full shrink-0 overflow-hidden bg-noir-charcoal lg:h-auto lg:w-5/12"
        aria-label="Editorial imagery"
      >
        <img
          src={image}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />

        {/* Dark scrim keeps the type legible over any photograph. */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-noir-black via-noir-black/70 to-noir-black/30"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-noir-black/25" aria-hidden="true" />

        <div className="relative flex h-full flex-col justify-end p-6 lg:justify-center lg:p-12">
          <p className="font-heading text-[10px] font-semibold uppercase tracking-[0.32em] text-noir-gold sm:text-[11px]">
            {EYEBROW}
          </p>

          <h2 className="mt-4 max-w-md font-editorial text-[clamp(1.75rem,4vw,2.75rem)] font-bold leading-[1.05] tracking-[-0.02em] text-noir-ivory">
            {headline}
          </h2>

          <p className="mt-4 max-w-sm text-sm leading-relaxed text-noir-ivory/70">{subline}</p>

          <p className="mt-8 hidden items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-noir-ivory/45 lg:inline-flex">
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
            Demo mode — no real account is created.
          </p>
        </div>
      </motion.aside>

      {/* ─── Form column ─── */}
      <div className="flex min-h-0 w-full flex-1 flex-col bg-[var(--bg-primary)] lg:w-7/12">
        <div className="mx-auto w-full max-w-[1600px] px-4 pt-6 sm:px-6 sm:pt-8 lg:px-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 font-heading text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-noir-gold)]"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            Back to store
          </Link>
        </div>

        <div className="flex flex-1 items-center px-4 py-10 sm:px-6 sm:py-12 lg:px-10">
          <div className="mx-auto w-full max-w-md">{children}</div>
        </div>
      </div>
    </div>
  );
}

/** Shared demo notice used inside the form column of every auth screen. */
export function AuthDemoNote({ className }: { className?: string }) {
  return (
    <p
      className={cn(
        'flex items-start gap-2 text-[11px] leading-relaxed text-[var(--text-muted)]',
        className
      )}
    >
      <ShieldCheck className="mt-px h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <span>
        Demo mode — no real account is created. This is a front-end prototype with mock
        data and no live authentication.
      </span>
    </p>
  );
}
