import { useState } from 'react';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import type { Product } from '@/types';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductGridSkeleton } from '@/components/ui/Skeleton';
import { QuickViewModal } from '@/components/product/QuickViewModal';
import { useNewArrivals } from '@/hooks/useQueries';
import { products as allProducts } from '@/data/products';

/**
 * Horizontally-scrollable new-arrivals carousel with arrow controls that
 * scroll by one card width. Falls back to static data if the query is empty.
 */
export function NewArrivalsCarousel() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const { data, isLoading } = useNewArrivals();

  // Reliable fallback: derive new arrivals from static data.
  const staticNew = [...allProducts]
    .filter((p) => p.status === 'new')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 8);

  const products = data && data.length > 0 ? data : staticNew;

  const scrollBy = (direction: 'left' | 'right') => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>('[data-carousel-item]');
    const amount = card ? card.offsetWidth + 24 : el.clientWidth * 0.8;
    el.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  const arrowClass =
    'flex h-11 w-11 items-center justify-center border border-[var(--border-color)] text-[var(--text-primary)] transition-colors hover:border-[var(--text-primary)] hover:bg-[var(--text-primary)] hover:text-[var(--bg-primary)]';

  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6 border-b border-[var(--border-color)] pb-8">
          <div>
            <p className="font-heading text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--text-muted)]">
              Just landed
            </p>
            <h2 className="mt-3 text-[clamp(2rem,5vw,3.5rem)] font-heading font-extrabold leading-[1] tracking-[-0.03em] text-[var(--text-primary)]">
              New arrivals
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/new-arrivals"
              className="group mr-2 hidden items-center gap-2 font-heading text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-primary)] sm:inline-flex"
            >
              View all
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <button
              type="button"
              onClick={() => scrollBy('left')}
              aria-label="Scroll new arrivals left"
              className={arrowClass}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollBy('right')}
              aria-label="Scroll new arrivals right"
              className={arrowClass}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div
          ref={scrollerRef}
          className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 sm:gap-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {isLoading && products.length === 0 ? (
            <div className="w-full">
              <ProductGridSkeleton count={4} />
            </div>
          ) : (
            products.map((product, index) => (
              <div
                key={product.id}
                data-carousel-item
                className="w-[76%] shrink-0 snap-start sm:w-[45%] lg:w-[31%] xl:w-[24%]"
              >
                <ProductCard
                  product={product}
                  index={index}
                  onQuickView={(p) => setQuickViewProduct(p)}
                />
              </div>
            ))
          )}
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
