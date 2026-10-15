import { Flame } from 'lucide-react';
import { ProductGrid } from '@/components/product/ProductGrid';
import { QuickViewModal } from '@/components/product/QuickViewModal';
import { products as allProducts } from '@/data/products';
import { useState } from 'react';
import type { Product } from '@/types';
import { useSeo } from '@/hooks/useSeo';

/** Trending products, ranked by engagement-weighted rating. */
export function TrendingSection() {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const trending = allProducts
    .filter((p) => p.status === 'trending')
    .sort((a, b) => b.reviewCount * b.rating - a.reviewCount * a.rating)
    .slice(0, 4);

  useSeo({ title: 'AFRO & CO.' });

  if (trending.length === 0) return null;

  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6 border-b border-[var(--border-color)] pb-8">
          <div>
            <p className="flex items-center gap-2 font-heading text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--color-noir-gold)]">
              <Flame className="h-3.5 w-3.5" />
              Trending this week
            </p>
            <h2 className="mt-3 text-[clamp(2rem,5vw,3.5rem)] font-heading font-extrabold leading-[1] tracking-[-0.03em] text-[var(--text-primary)]">
              What everyone is buying
            </h2>
          </div>
        </div>

        <div className="mt-10">
          <ProductGrid
            products={trending}
            columns={4}
            onQuickView={(product) => setQuickViewProduct(product)}
          />
        </div>
      </div>

      <QuickViewModal
        product={quickViewProduct}
        open={quickViewProduct !== null}
        onClose={() => setQuickViewProduct(null)}
      />
    </section>
  );
}
