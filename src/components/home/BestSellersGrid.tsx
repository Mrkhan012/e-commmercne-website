import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ProductGrid } from '@/components/product/ProductGrid';
import { QuickViewModal } from '@/components/product/QuickViewModal';
import { products as allProducts } from '@/data/products';
import { useState } from 'react';
import type { Product } from '@/types';

/** Best-selling products grid, derived from static catalog data. */
export function BestSellersGrid() {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const bestSellers = allProducts
    .filter((p) => p.status === 'best-seller')
    .sort((a, b) => b.reviewCount * b.rating - a.reviewCount * a.rating)
    .slice(0, 8);

  return (
    <section className="bg-[var(--bg-secondary)] py-20 lg:py-28">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6 border-b border-[var(--border-color)] pb-8">
          <div>
            <p className="font-heading text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--text-muted)]">
              Most wanted
            </p>
            <h2 className="mt-3 max-w-xl text-[clamp(2rem,5vw,3.5rem)] font-heading font-extrabold leading-[1] tracking-[-0.03em] text-[var(--text-primary)]">
              The pieces our customers keep coming back for
            </h2>
          </div>
          <Link
            to="/best-sellers"
            className="group inline-flex items-center gap-2 font-heading text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-primary)]"
          >
            All best sellers
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="mt-10">
          <ProductGrid
            products={bestSellers}
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
