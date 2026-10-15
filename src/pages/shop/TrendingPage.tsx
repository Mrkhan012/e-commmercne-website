import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Flame, LayoutGrid, List, ShoppingBag } from 'lucide-react';
import type { Product } from '@/types';
import { products as catalog } from '@/data/products';
import { useTrendingProducts } from '@/hooks/useQueries';
import { useSeo } from '@/hooks/useSeo';
import { useReducedMotion } from '@/hooks/useUi';
import { useCartStore } from '@/store/cartStore';
import { useToastStore } from '@/store/toastStore';
import { ProductCard } from '@/components/product/ProductCard';
import { QuickViewModal } from '@/components/product/QuickViewModal';
import { Button } from '@/components/ui/Button';
import { Select, type SelectOption } from '@/components/ui/Select';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { EmptyState } from '@/components/ui/EmptyState';
import { PriceDisplay } from '@/components/ui/PriceDisplay';
import { RatingStars } from '@/components/ui/RatingStars';
import { cn } from '@/utils/cn';

// ─── Local model ─────────────────────────────────────────────────────────────

type SortKey = 'featured' | 'price-asc' | 'price-desc' | 'rating';
type ViewMode = 'grid' | 'list';

const PAGE_SIZE = 8;

const SORT_OPTIONS: SelectOption[] = [
  { label: 'Trending', value: 'featured' },
  { label: 'Price: low to high', value: 'price-asc' },
  { label: 'Price: high to low', value: 'price-desc' },
  { label: 'Top rated', value: 'rating' },
];

const applySort = (list: Product[], key: SortKey): Product[] => {
  const sorted = [...list];
  switch (key) {
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price || a.name.localeCompare(b.name));
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price || a.name.localeCompare(b.name));
    case 'rating':
      return sorted.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
    case 'featured':
    default:
      return sorted;
  }
};

// ─── List row ────────────────────────────────────────────────────────────────

interface ListRowProps {
  product: Product;
  index: number;
  onQuickView: (product: Product) => void;
}

function ListRow({ product, index, onQuickView }: ListRowProps) {
  const reduced = useReducedMotion();
  const addItem = useCartStore((state) => state.addItem);
  const toast = useToastStore((state) => state.success);

  const inStock = product.stock > 0;
  const needsSelection =
    !!product.sizes?.some((size) => size.available) || !!product.colors?.length;

  const handleAdd = () => {
    if (!inStock) return;
    if (needsSelection) {
      onQuickView(product);
      return;
    }
    addItem(product, 1);
    toast('Added to bag', product.name);
  };

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 16 }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.05, 0.3), ease: [0.16, 1, 0.3, 1] }}
      className="group border-b border-[var(--border-color)] py-6"
    >
      <div className="flex items-start gap-4 sm:gap-6">
        <Link to={`/product/${product.slug}`} className="w-32 shrink-0 sm:w-48">
          <div className="relative aspect-[4/5] overflow-hidden bg-[var(--bg-secondary)]">
            <img
              src={product.images[0]?.url}
              alt={product.images[0]?.alt ?? product.name}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
            />
            <span className="absolute left-0 top-0 flex h-11 w-11 items-center justify-center bg-[var(--color-noir-black)] text-[var(--color-noir-gold)]">
              <Flame className="h-4 w-4" aria-hidden="true" />
            </span>
          </div>
        </Link>

        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <p className="font-heading text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
            {product.brand}
          </p>
          <h3 className="text-sm font-medium leading-snug text-[var(--text-primary)] transition-colors group-hover:text-[var(--color-noir-gold)] sm:text-base">
            <Link to={`/product/${product.slug}`}>{product.name}</Link>
          </h3>
          <RatingStars rating={product.rating} count={product.reviewCount} size="sm" />
          <p className="text-sm leading-relaxed text-[var(--text-secondary)] line-clamp-2">
            {product.shortDescription}
          </p>
        </div>

        <div className="hidden w-44 shrink-0 flex-col items-end gap-3 sm:flex">
          <PriceDisplay
            price={product.price}
            originalPrice={product.originalPrice}
            discount={product.discount}
            size="md"
          />
          <Button size="sm" fullWidth onClick={handleAdd} disabled={!inStock}>
            <ShoppingBag className="h-3.5 w-3.5" />
            {inStock ? 'Add to bag' : 'Sold out'}
          </Button>
          <Link
            to={`/product/${product.slug}`}
            className="font-heading text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
          >
            View details
          </Link>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 sm:hidden">
        <PriceDisplay
          price={product.price}
          originalPrice={product.originalPrice}
          discount={product.discount}
          size="sm"
        />
        <Button size="sm" onClick={handleAdd} disabled={!inStock}>
          <ShoppingBag className="h-3.5 w-3.5" />
          {inStock ? 'Add to bag' : 'Sold out'}
        </Button>
      </div>
    </motion.div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function TrendingPage() {
  useSeo({
    title: 'Trending Now',
    description:
      'What is moving this week at AFRO & CO. — cashmere, tailored wool, and the accessories everyone is wearing right now.',
  });

  const [sort, setSort] = useState<SortKey>('featured');
  const [view, setView] = useState<ViewMode>('grid');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [quickView, setQuickView] = useState<Product | null>(null);

  const { data: feedItems } = useTrendingProducts();
  const feedCount = feedItems?.length ?? 0;

  const trending = useMemo(
    () =>
      catalog
        .filter((product) => product.status === 'trending')
        .sort((a, b) => b.reviewCount * b.rating - a.reviewCount * a.rating),
    []
  );

  const ranked = useMemo(() => applySort(trending, sort), [trending, sort]);
  const visible = useMemo(() => ranked.slice(0, visibleCount), [ranked, visibleCount]);
  const hasMore = visibleCount < ranked.length;

  const hottest = trending[0];
  const totalReviews = trending.reduce((sum, product) => sum + product.reviewCount, 0);
  const categoryCount = new Set(trending.map((product) => product.category)).size;

  const stats = [
    { label: 'In rotation', value: String(trending.length) },
    { label: 'Reviews', value: totalReviews.toLocaleString('en-US') },
    { label: 'Categories', value: String(categoryCount) },
    { label: 'Editor feed', value: String(feedCount > 0 ? feedCount : trending.length) },
  ];

  return (
    <>
      {/* ─── Hero band ─── */}
      <section className="border-b border-[var(--border-color)] bg-[var(--bg-secondary)]">
        <div className="mx-auto max-w-[1600px] px-4 py-14 sm:px-6 lg:px-10 lg:py-20">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Trending' }]} />

          <p className="mt-6 flex items-center gap-2 font-heading text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
            <Flame className="h-3.5 w-3.5 text-[var(--color-noir-gold)]" aria-hidden="true" />
            Trending this week
          </p>

          <h1 className="mt-4 text-[clamp(2.25rem,6vw,4.5rem)] font-heading font-extrabold leading-[0.95] tracking-[-0.03em] text-[var(--text-primary)]">
            Trending Now
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-relaxed text-[var(--text-secondary)]">
            Trending this week: cashmere in oatmeal, the over-ear headphones nobody has taken off
            since they arrived, a tracker that has quietly replaced three apps, and the camel scarf
            doing the rounds on every street-style feed we follow. Ranked by velocity — how fast a
            piece is selling, not how long it has been on the shelf.
          </p>

          <dl className="mt-10 grid max-w-3xl grid-cols-2 gap-px border border-[var(--border-color)] bg-[var(--border-color)] sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-[var(--bg-primary)] px-4 py-4 sm:px-5">
                <dt className="font-heading text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
                  {stat.label}
                </dt>
                <dd className="mt-2 font-heading text-2xl font-bold text-[var(--text-primary)]">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>

          {hottest && (
            <p className="mt-6 text-sm leading-relaxed text-[var(--text-secondary)]">
              <span className="font-heading text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
                Fastest mover:{' '}
              </span>
              <Link
                to={`/product/${hottest.slug}`}
                className="font-medium text-[var(--text-primary)] underline decoration-[var(--color-noir-gold)] decoration-2 underline-offset-4 transition-colors hover:text-[var(--color-noir-gold)]"
              >
                {hottest.name}
              </Link>
            </p>
          )}
        </div>
      </section>

      {/* ─── Catalog ─── */}
      <div className="mx-auto max-w-[1600px] px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
        <div className="flex flex-wrap items-center justify-between gap-4 border-y border-[var(--border-color)] py-4">
          <p className="font-heading text-[11px] uppercase tracking-[0.16em] text-[var(--text-secondary)]">
            <span className="font-bold text-[var(--text-primary)]">{visible.length}</span> of{' '}
            {ranked.length} {ranked.length === 1 ? 'piece' : 'pieces'}
          </p>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className="hidden font-heading text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)] sm:inline"
              >
                Sort
              </span>
              <Select
                aria-label="Sort products"
                options={SORT_OPTIONS}
                value={sort}
                onChange={(event) => {
                  setSort(event.target.value as SortKey);
                  setVisibleCount(PAGE_SIZE);
                }}
                containerClassName="w-44 sm:w-52"
                className="h-11"
              />
            </div>

            <div
              className="flex items-center border border-[var(--border-color)]"
              role="group"
              aria-label="View mode"
            >
              <button
                type="button"
                onClick={() => setView('grid')}
                aria-pressed={view === 'grid'}
                aria-label="Grid view"
                className={cn(
                  'flex h-11 w-11 items-center justify-center transition-colors',
                  view === 'grid'
                    ? 'bg-[var(--text-primary)] text-[var(--bg-primary)]'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
                )}
              >
                <LayoutGrid className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => setView('list')}
                aria-pressed={view === 'list'}
                aria-label="List view"
                className={cn(
                  'flex h-11 w-11 items-center justify-center border-l border-[var(--border-color)] transition-colors',
                  view === 'list'
                    ? 'bg-[var(--text-primary)] text-[var(--bg-primary)]'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
                )}
              >
                <List className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        {ranked.length === 0 ? (
          <div className="mt-12">
            <EmptyState
              icon={<Flame className="h-6 w-6" aria-hidden="true" />}
              title="Nothing trending right now"
              message="The charts reset every Monday. Until then, the new arrivals are the closest thing to a guarantee."
              action={
                <Button asChild variant="outline">
                  <Link to="/new-arrivals">See new arrivals</Link>
                </Button>
              }
            />
          </div>
        ) : view === 'grid' ? (
          <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-3 xl:grid-cols-4">
            {visible.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
                onQuickView={setQuickView}
              />
            ))}
          </div>
        ) : (
          <div className="mt-6">
            {visible.map((product, index) => (
              <ListRow
                key={product.id}
                product={product}
                index={index}
                onQuickView={setQuickView}
              />
            ))}
          </div>
        )}

        {/* Load more + footer count */}
        {hasMore ? (
          <div className="mt-14 flex flex-col items-center gap-5">
            <Button
              variant="outline"
              size="lg"
              onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
            >
              Load more pieces
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
            <div className="h-px w-48 bg-[var(--border-color)]" aria-hidden="true">
              <div
                className="h-full bg-[var(--color-noir-gold)] transition-[width] duration-500 ease-out"
                style={{ width: `${(visible.length / ranked.length) * 100}%` }}
              />
            </div>
            <p className="font-heading text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
              Showing {visible.length} of {ranked.length}
            </p>
          </div>
        ) : (
          <p className="mt-12 text-center font-heading text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
            Showing all {ranked.length} {ranked.length === 1 ? 'piece' : 'pieces'}
          </p>
        )}
      </div>

      <QuickViewModal
        product={quickView}
        open={quickView !== null}
        onClose={() => setQuickView(null)}
      />
    </>
  );
}
