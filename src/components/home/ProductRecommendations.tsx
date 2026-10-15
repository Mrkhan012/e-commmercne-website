import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { ProductGrid } from '@/components/product/ProductGrid';
import { QuickViewModal } from '@/components/product/QuickViewModal';
import { products as allProducts } from '@/data/products';
import { useState } from 'react';
import type { Product } from '@/types';

/** Personalized-style recommendations based on high-rated recent additions. */
export function ProductRecommendations() {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const recommendations = [...allProducts]
    .filter((p) => p.rating >= 4.7)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  return (
    <section className="bg-[var(--bg-secondary)] py-20 lg:py-28">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6 border-b border-[var(--border-color)] pb-8">
          <div>
            <p className="flex items-center gap-2 font-heading text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--text-muted)]">
              <Sparkles className="h-3.5 w-3.5" />
              Picked for you
            </p>
            <h2 className="mt-3 max-w-xl text-[clamp(2rem,5vw,3.5rem)] font-heading font-extrabold leading-[1] tracking-[-0.03em] text-[var(--text-primary)]">
              You may also like
            </h2>
          </div>
          <Link
            to="/shop"
            className="font-heading text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-primary)] underline-offset-4 hover:underline"
          >
            Browse everything
          </Link>
        </div>

        <div className="mt-10">
          <ProductGrid
            products={recommendations}
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
