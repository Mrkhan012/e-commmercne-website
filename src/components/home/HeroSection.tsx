import { Link } from 'react-router-dom';
import { ArrowRight, ArrowDown } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/Button';
import { useReducedMotion } from '@/hooks/useUi';
import { useSeo } from '@/hooks/useSeo';

/**
 * Full-bleed editorial hero: oversized headline, dual CTAs, animated image.
 * The layout is intentionally asymmetric — text sits left-of-center with the
 * image bleeding off the right edge on desktop.
 */
export function HeroSection() {
  const reduceMotion = useReducedMotion();

  useSeo({
    title: 'AFRO & CO. (Afro.co) — Premium Editorial E-Commerce',
    description:
      'Curated fashion, accessories, and lifestyle goods for the modern collector. Complimentary shipping on orders over $200.',
  });

  const fadeUp = (delay: number) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] as const },
        };

  return (
    <section className="relative min-h-[88vh] overflow-hidden bg-noir-black lg:min-h-[92vh]">
      {/* Background image */}
      <motion.div
        className="absolute inset-0"
        {...(reduceMotion
          ? {}
          : {
              initial: { scale: 1.12, opacity: 0 },
              animate: { scale: 1, opacity: 1 },
              transition: { duration: 1.6, ease: [0.16, 1, 0.3, 1] as const },
            })}
      >
        <img
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1800&q=80"
          alt="A model in a tailored wool overcoat against a concrete backdrop"
          className="h-full w-full object-cover object-center"
        />
      </motion.div>

      {/* Gradient scrim for text legibility */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-noir-black via-noir-black/70 to-transparent"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-noir-black/60 via-transparent to-noir-black/30"
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative mx-auto flex min-h-[88vh] max-w-[1600px] flex-col justify-center px-4 py-24 sm:px-6 lg:min-h-[92vh] lg:px-10">
        <div className="max-w-2xl">
          <motion.p
            {...fadeUp(0.15)}
            className="font-heading text-[10px] font-semibold uppercase tracking-[0.32em] text-noir-gold sm:text-[11px]"
          >
            Autumn / Winter Collection 2026
          </motion.p>

          <motion.h1
            {...fadeUp(0.3)}
            className="mt-6 font-heading text-[clamp(2.75rem,8vw,6rem)] font-extrabold leading-[0.92] tracking-[-0.035em] text-noir-ivory"
          >
            Quiet luxury,
            <br />
            <span className="font-editorial font-normal italic text-noir-gold">
              loudly
            </span>{' '}
            considered.
          </motion.h1>

          <motion.p
            {...fadeUp(0.45)}
            className="mt-7 max-w-lg text-base leading-relaxed text-noir-ivory/75 sm:text-lg"
          >
            A curated wardrobe of essentials and statement pieces, made from the finest
            materials by artisans we know by name. Designed to be worn for decades, not seasons.
          </motion.p>

          <motion.div {...fadeUp(0.6)} className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button asChild size="lg" variant="gold">
              <Link to="/new-arrivals" className="gap-3">
                Shop New Arrivals
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-noir-ivory/40 text-noir-ivory hover:border-noir-ivory hover:bg-noir-ivory hover:text-noir-black"
            >
              <Link to="/shop">Explore the Collection</Link>
            </Button>
          </motion.div>

          <motion.dl {...fadeUp(0.75)} className="mt-14 flex flex-wrap gap-x-10 gap-y-5">
            {[
              { label: 'Artisan partners', value: '24' },
              { label: 'Countries shipped', value: '68' },
              { label: 'Customer rating', value: '4.9' },
            ].map((stat) => (
              <div key={stat.label}>
                <dt className="text-[10px] uppercase tracking-[0.2em] text-noir-ivory/50">
                  {stat.label}
                </dt>
                <dd className="mt-1 font-heading text-2xl font-bold text-noir-ivory">
                  {stat.value}
                </dd>
              </div>
            ))}
          </motion.dl>
        </div>
      </div>

      {/* Scroll cue */}
      <motion.div
        {...(reduceMotion
          ? {}
          : {
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              transition: { delay: 1.2, duration: 0.6 },
            })}
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 lg:block"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-[10px] uppercase tracking-[0.24em] text-noir-ivory/50">Scroll</span>
          <motion.span
            animate={reduceMotion ? {} : { y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ArrowDown className="h-4 w-4 text-noir-ivory/50" />
          </motion.span>
        </div>
      </motion.div>
    </section>
  );
}
