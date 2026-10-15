import { Quote, Star } from 'lucide-react';
import { motion } from 'motion/react';
import { useReducedMotion } from '@/hooks/useUi';

const testimonials = [
  {
    id: 't1',
    quote:
      'The overcoat is the single best thing I have ever bought. Three winters in, it still looks better than the day it arrived, and the free repair service has already fixed one button.',
    name: 'Elena Vasquez',
    role: 'Verified buyer · London',
    rating: 5,
  },
  {
    id: 't2',
    quote:
      'I ordered on a Tuesday and it arrived Thursday, packaged like a gift. The sizing guide was accurate to the centimetre, which almost never happens for me.',
    name: 'Marcus Bell',
    role: 'Verified buyer · Chicago',
    rating: 5,
  },
  {
    id: 't3',
    quote:
      'What sold me was the price transparency page. Knowing exactly what went into the cost made spending £400 on a coat feel reasonable instead of indulgent.',
    name: 'Priya Raman',
    role: 'Verified buyer · Toronto',
    rating: 5,
  },
];

/** Customer testimonials with one large lead quote and two supporting ones. */
export function Testimonials() {
  const reduceMotion = useReducedMotion();
  const [lead, ...rest] = testimonials;

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
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6 border-b border-[var(--border-color)] pb-8">
          <div>
            <p className="font-heading text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--text-muted)]">
              Customer stories
            </p>
            <h2 className="mt-3 text-[clamp(2rem,5vw,3.5rem)] font-heading font-extrabold leading-[1] tracking-[-0.03em] text-[var(--text-primary)]">
              Worn, reviewed, returned for
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-noir-gold text-noir-gold" />
              ))}
            </div>
            <p className="text-sm text-[var(--text-muted)]">
              <span className="font-semibold text-[var(--text-primary)]">4.9</span> from 2,847 reviews
            </p>
          </div>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {/* Lead quote */}
          <motion.figure
            {...reveal(0)}
            className="border border-[var(--border-color)] bg-[var(--bg-card)] p-8 lg:col-span-2 lg:p-12"
          >
            <Quote className="h-8 w-8 text-[var(--color-noir-gold)]" aria-hidden="true" />
            <blockquote className="mt-6 font-editorial text-xl font-normal leading-relaxed text-[var(--text-primary)] sm:text-2xl lg:text-3xl lg:leading-[1.35]">
              “{lead.quote}”
            </blockquote>
            <figcaption className="mt-8 flex items-center gap-4">
              <span className="flex h-11 w-11 items-center justify-center bg-[var(--bg-secondary)] font-heading text-sm font-bold text-[var(--text-primary)]">
                {lead.name.split(' ').map((n) => n[0]).join('')}
              </span>
              <span>
                <span className="block text-sm font-semibold text-[var(--text-primary)]">
                  {lead.name}
                </span>
                <span className="block text-xs text-[var(--text-muted)]">{lead.role}</span>
              </span>
            </figcaption>
          </motion.figure>

          {/* Supporting quotes */}
          <div className="flex flex-col gap-6">
            {rest.map((testimonial, index) => (
              <motion.figure
                key={testimonial.id}
                {...reveal((index + 1) * 0.1)}
                className="flex flex-1 flex-col border border-[var(--border-color)] p-7"
              >
                <div className="flex gap-0.5">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-noir-gold text-noir-gold" />
                  ))}
                </div>
                <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-[var(--text-secondary)]">
                  “{testimonial.quote}”
                </blockquote>
                <figcaption className="mt-5 border-t border-[var(--border-color)] pt-4">
                  <span className="block text-sm font-semibold text-[var(--text-primary)]">
                    {testimonial.name}
                  </span>
                  <span className="block text-xs text-[var(--text-muted)]">{testimonial.role}</span>
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
