import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { RatingStars } from '@/components/ui/RatingStars';
import { useSeo } from '@/hooks/useSeo';
import { useReducedMotion } from '@/hooks/useUi';

const DEMO_USER_REVIEWS = [
  {
    id: 'rev-1',
    productName: 'Silk Chiffon Evening Gown',
    productImage: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=300&q=80',
    productSlug: 'silk-chiffon-evening-gown',
    rating: 5,
    title: 'Exquisite craftsmanship & drape',
    content:
      'The silk has an ethereal weight and movement. Wore it to the gala in Milan and received non-stop compliments on the subtle luster.',
    date: 'October 2, 2024',
    verified: true,
  },
  {
    id: 'rev-2',
    productName: 'Double-Breasted Wool Blazer',
    productImage: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=300&q=80',
    productSlug: 'double-breasted-wool-blazer',
    rating: 5,
    title: 'Flawless architectural cut',
    content:
      'Structured shoulders and luxurious interior lining. The horn buttons and clean lapel roll showcase real bespoke atelier quality.',
    date: 'September 14, 2024',
    verified: true,
  },
];

export default function ReviewsPage() {
  useSeo({
    title: 'My Reviews',
    description: 'Past evaluations and verified feedback on your AFRO & CO. acquisitions.',
  });

  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? undefined : { opacity: 0, y: 10 }}
      animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div>
        <p className="font-heading text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
          Client Feedback
        </p>
        <h2 className="mt-1 font-heading text-2xl font-bold text-[var(--text-primary)]">
          My Reviews ({DEMO_USER_REVIEWS.length})
        </h2>
      </div>

      <div className="space-y-6">
        {DEMO_USER_REVIEWS.map((rev) => (
          <div
            key={rev.id}
            className="flex flex-col gap-6 border border-[var(--border-color)] bg-[var(--bg-card)] p-6 sm:flex-row sm:items-start"
          >
            <img
              src={rev.productImage}
              alt={rev.productName}
              className="h-24 w-20 shrink-0 object-cover"
            />
            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Link
                  to={`/product/${rev.productSlug}`}
                  className="font-heading text-sm font-bold text-[var(--text-primary)] hover:underline"
                >
                  {rev.productName}
                </Link>
                <span className="text-xs text-[var(--text-muted)]">{rev.date}</span>
              </div>

              <div className="flex items-center gap-2">
                <RatingStars rating={rev.rating} size="sm" />
                <span className="text-xs font-semibold text-[var(--color-noir-gold)]">
                  Verified Acquisition
                </span>
              </div>

              <p className="font-heading text-sm font-semibold text-[var(--text-primary)]">
                "{rev.title}"
              </p>
              <p className="text-xs leading-relaxed text-[var(--text-secondary)]">{rev.content}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
