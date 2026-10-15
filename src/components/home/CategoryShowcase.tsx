import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';
import { useCategoryStore } from '@/store/categoryStore';
import { useReducedMotion } from '@/hooks/useUi';

/**
 * Featured category cards. The first card is deliberately larger than the rest,
 * giving the grid intentional asymmetry instead of a uniform tile wall.
 */
export function CategoryShowcase() {
  const reduceMotion = useReducedMotion();
  const categories = useCategoryStore((s) => s.categories);
  const featured = categories.filter((c) => c.featured).slice(0, 5);

  const reveal = (delay: number) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 20 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: '-60px' },
          transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] as const },
        };

  return (
    <section className="mx-auto max-w-[1600px] px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
      {/* Header */}
      <div className="flex flex-col gap-5 border-b border-[var(--border-color)] pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="font-heading text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--text-muted)]">
            Explore
          </p>
          <h2 className="mt-3 text-[clamp(2rem,5vw,3.5rem)] font-heading font-extrabold leading-[1] tracking-[-0.03em] text-[var(--text-primary)]">
            Shop by category
          </h2>
        </div>
        <Link
          to="/shop"
          className="group inline-flex items-center gap-2 font-heading text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-primary)]"
        >
          View everything
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>

      {/* Asymmetric grid: first card spans 2 columns on large screens */}
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
        {featured.map((category, index) => (
          <motion.div
            key={category.id}
            {...reveal(index * 0.08)}
            className={index === 0 ? 'lg:col-span-2 lg:row-span-2' : ''}
          >
            <Link
              to={`/shop/${category.slug}`}
              className="group relative block h-full overflow-hidden bg-[var(--bg-secondary)]"
            >
              <div className={index === 0 ? 'aspect-[4/5] lg:aspect-auto lg:h-full lg:min-h-[560px]' : 'aspect-[4/5]'}>
                <img
                  src={category.image}
                  alt={category.name}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.07]"
                />
              </div>

              {/* Scrim */}
              <div
                className="absolute inset-0 bg-gradient-to-t from-noir-black/85 via-noir-black/20 to-transparent transition-opacity duration-500 group-hover:from-noir-black/90"
                aria-hidden="true"
              />

              {/* Label */}
              <div className="absolute inset-x-0 bottom-0 p-5 lg:p-7">
                <p className="text-[10px] uppercase tracking-[0.2em] text-noir-ivory/60">
                  {category.productCount} pieces
                </p>
                <h3
                  className={
                    index === 0
                      ? 'mt-2 font-heading text-2xl font-bold text-noir-ivory lg:text-4xl'
                      : 'mt-2 font-heading text-lg font-bold text-noir-ivory'
                  }
                >
                  {category.name}
                </h3>
                <p className="mt-2 max-w-xs text-xs leading-relaxed text-noir-ivory/70 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  {category.description}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 border-b border-noir-ivory/50 pb-0.5 font-heading text-[11px] font-semibold uppercase tracking-[0.16em] text-noir-ivory">
                  Shop now
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
