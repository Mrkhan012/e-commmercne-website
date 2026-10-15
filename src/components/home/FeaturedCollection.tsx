import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { useReducedMotion } from '@/hooks/useUi';

const looks = [
  {
    id: 'look-1',
    title: 'The Long Coat',
    subtitle: 'Outerwear · Cashmere · Trousers',
    image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&q=80',
    span: 'lg:col-span-3 lg:row-span-2',
    ratio: 'aspect-[3/4] lg:aspect-auto lg:h-full lg:min-h-[520px]',
  },
  {
    id: 'look-2',
    title: 'The White Shirt',
    subtitle: 'Silk · Denim · Leather',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80',
    span: 'lg:col-span-2',
    ratio: 'aspect-[4/3]',
  },
  {
    id: 'look-3',
    title: 'The Evening Bag',
    subtitle: 'Accessories · Jewellery',
    image: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&q=80',
    span: 'lg:col-span-2',
    ratio: 'aspect-[4/3]',
  },
];

/** Featured collection with deliberately uneven imagery blocks. */
export function FeaturedCollection() {
  const reduceMotion = useReducedMotion();

  const reveal = (delay: number) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: '-60px' },
          transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] as const },
        };

  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10">
        <div className="max-w-2xl">
          <p className="font-heading text-[10px] font-semibold uppercase tracking-[0.28em] text-[var(--text-muted)]">
            Featured collection
          </p>
          <h2 className="mt-4 text-[clamp(2rem,5vw,3.75rem)] font-heading font-extrabold leading-[1] tracking-[-0.03em] text-[var(--text-primary)]">
            The Quiet Uniform
          </h2>
          <p className="mt-5 text-base leading-relaxed text-[var(--text-secondary)]">
            Three pieces that work harder than the rest of your wardrobe. Photographed on location
            in Lisbon, styled to be worn together or apart.
          </p>
        </div>

        <div className="mt-12 grid gap-4 lg:grid-cols-5 lg:gap-5">
          {looks.map((look, index) => (
            <motion.div key={look.id} {...reveal(index * 0.1)} className={look.span}>
              <Link to="/shop" className="group relative block h-full overflow-hidden bg-[var(--bg-secondary)]">
                <div className={look.ratio}>
                  <img
                    src={look.image}
                    alt={look.title}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
                  />
                </div>
                <div
                  className="absolute inset-0 bg-gradient-to-t from-noir-black/80 via-transparent to-transparent"
                  aria-hidden="true"
                />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6">
                  <div>
                    <h3 className="font-heading text-lg font-bold text-noir-ivory">{look.title}</h3>
                    <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-noir-ivory/60">
                      {look.subtitle}
                    </p>
                  </div>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-noir-ivory/40 text-noir-ivory transition-colors group-hover:bg-noir-ivory group-hover:text-noir-black">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
