import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';
import { useReducedMotion } from '@/hooks/useUi';

/**
 * Editorial brand story. Intentionally asymmetric: a tall offset image on the
 * left, text offset lower on the right, with a pull-quote in Playfair Display.
 */
export function BrandStory() {
  const reduceMotion = useReducedMotion();

  const reveal = (delay: number) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: '-80px' },
          transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] as const },
        };

  return (
    <section className="py-20 lg:py-32">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10">
        <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Image column — offset downward for asymmetry */}
          <motion.div
            {...reveal(0)}
            className="lg:col-span-5 lg:mt-24"
          >
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=900&q=80"
                alt="A designer inspecting fabric in a studio"
                loading="lazy"
                decoding="async"
                className="aspect-[3/4] w-full object-cover"
              />
              {/* Overlapping accent card */}
              <div className="absolute -bottom-8 -right-4 hidden w-56 border border-[var(--border-color)] bg-[var(--bg-card)] p-6 shadow-xl sm:block lg:-right-10">
                <p className="font-heading text-3xl font-extrabold text-[var(--color-noir-gold)]">24</p>
                <p className="mt-1 text-xs leading-relaxed text-[var(--text-muted)]">
                  Artisan partners across Italy, Scotland, and Japan
                </p>
              </div>
            </div>
          </motion.div>

          {/* Text column */}
          <div className="lg:col-span-6 lg:col-start-7">
            <motion.p
              {...reveal(0.1)}
              className="font-heading text-[10px] font-semibold uppercase tracking-[0.28em] text-[var(--text-muted)]"
            >
              Our story
            </motion.p>

            <motion.h2
              {...reveal(0.15)}
              className="mt-5 text-[clamp(2rem,5vw,3.5rem)] font-heading font-extrabold leading-[1.02] tracking-[-0.03em] text-[var(--text-primary)]"
            >
              We started with one question: why is it so hard to buy something good?
            </motion.h2>

            <motion.p
              {...reveal(0.25)}
              className="mt-7 text-base leading-relaxed text-[var(--text-secondary)]"
            >
              AFRO &amp; CO. began in 2019 in a small Brooklyn studio with a frustration shared by
              everyone on the founding team: the things worth owning were either inaccessible or
              endlessly overpriced, and the things that were easy to buy rarely lasted.
            </motion.p>

            <motion.p
              {...reveal(0.3)}
              className="mt-5 text-base leading-relaxed text-[var(--text-secondary)]"
            >
              So we built the opposite. We work directly with twenty-four mills and workshops, cut
              out the middle layers, and publish what things actually cost to make. Every piece is
              designed to be repaired rather than replaced, and we stock the parts to make that
              possible.
            </motion.p>

            <motion.blockquote
              {...reveal(0.35)}
              className="mt-10 border-l-2 border-[var(--color-noir-gold)] pl-6"
            >
              <p className="font-editorial text-xl font-normal italic leading-relaxed text-[var(--text-primary)] sm:text-2xl">
                “We would rather make one coat properly than a hundred that end up in a landfill.”
              </p>
              <footer className="mt-3 text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">
                Amara Okonkwo, Founder
              </footer>
            </motion.blockquote>

            <motion.div {...reveal(0.4)} className="mt-10">
              <Link
                to="/about"
                className="group inline-flex items-center gap-2 border-b border-[var(--text-primary)] pb-1 font-heading text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-primary)]"
              >
                Read the full story
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
