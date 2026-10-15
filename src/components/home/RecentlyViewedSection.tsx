import { Link } from 'react-router-dom';
import { Clock, X } from 'lucide-react';
import { useRecentlyViewedStore } from '@/store/recentlyViewedStore';
import { ProductCard } from '@/components/product/ProductCard';
import { QuickViewModal } from '@/components/product/QuickViewModal';
import { useState } from 'react';
import type { Product } from '@/types';

/** Recently viewed products. Renders nothing until the user has history. */
export function RecentlyViewedSection() {
  const items = useRecentlyViewedStore((state) => state.items);
  const clearAll = useRecentlyViewedStore((state) => state.clearAll);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  if (items.length === 0) return null;

  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6 border-b border-[var(--border-color)] pb-8">
          <div>
            <p className="flex items-center gap-2 font-heading text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--text-muted)]">
              <Clock className="h-3.5 w-3.5" />
              Your history
            </p>
            <h2 className="mt-3 text-[clamp(2rem,5vw,3.5rem)] font-heading font-extrabold leading-[1] tracking-[-0.03em] text-[var(--text-primary)]">
              Recently viewed
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={clearAll}
              className="inline-flex items-center gap-1.5 font-heading text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)] transition-colors hover:text-red-500"
            >
              <X className="h-3.5 w-3.5" />
              Clear history
            </button>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
          {items.slice(0, 4).map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              index={index}
              onQuickView={(p) => setQuickViewProduct(p)}
            />
          ))}
        </div>

        {items.length > 4 && (
          <p className="mt-8 text-sm text-[var(--text-muted)]">
            {items.length - 4} more in your{' '}
            <Link to="/account" className="text-[var(--text-primary)] underline">
              viewing history
            </Link>
            .
          </p>
        )}
      </div>

      <QuickViewModal
        product={quickViewProduct}
        open={quickViewProduct !== null}
        onClose={() => setQuickViewProduct(null)}
      />
    </section>
  );
}
