import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowRight,
  Clock,
  LayoutGrid,
  List,
  Percent,
  ShoppingBag,
  Tag,
} from 'lucide-react';
import type { Product } from '@/types';
import { useProductStore } from '@/store/productStore';
import { useSaleProducts } from '@/hooks/useQueries';
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

type SortKey = 'featured' | 'discount-asc' | 'price-asc' | 'price-desc' | 'rating';
type ViewMode = 'grid' | 'list';
type DiscountBand = 'all' | '10' | '15' | '20';

const PAGE_SIZE = 8;
const SALE_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;

const SORT_OPTIONS: SelectOption[] = [
  { label: 'Biggest discount', value: 'featured' },
  { label: 'Smallest discount', value: 'discount-asc' },
  { label: 'Price: low to high', value: 'price-asc' },
  { label: 'Price: high to low', value: 'price-desc' },
  { label: 'Top rated', value: 'rating' },
];

const DISCOUNT_BANDS: { value: DiscountBand; label: string; min: number }[] = [
  { value: 'all', label: 'All', min: 0 },
  { value: '10', label: '10% +', min: 10 },
  { value: '15', label: '15% +', min: 15 },
  { value: '20', label: '20% +', min: 20 },
];

const applySort = (list: Product[], key: SortKey): Product[] => {
  const sorted = [...list];
  switch (key) {
    case 'discount-asc':
      return sorted.sort((a, b) => (a.discount ?? 0) - (b.discount ?? 0));
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price || a.name.localeCompare(b.name));
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price || a.name.localeCompare(b.name));
    case 'rating':
      return sorted.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
    case 'featured':
    default:
      return sorted.sort(
        (a, b) => (b.discount ?? 0) - (a.discount ?? 0) || b.reviewCount - a.reviewCount
      );
  }
};

// ─── Countdown ───────────────────────────────────────────────────────────────

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const splitRemaining = (ms: number): TimeLeft => {
  const clamped = Math.max(0, ms);
  const totalSeconds = Math.floor(clamped / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
};

function CountdownCell({ value, label }: { value: number; label: string }) {
  const reduced = useReducedMotion();
  return (
    <div className="flex min-w-16 flex-col items-center border border-[var(--color-noir-charcoal)] px-3 py-2">
      <span
        key={value}
        className={cn(
          'font-heading text-2xl font-extrabold tabular-nums leading-none text-[var(--color-noir-ivory)]',
          !reduced && 'animate-[none]'
        )}
      >
        {String(value).padStart(2, '0')}
      </span>
      <span className="mt-1.5 font-heading text-[9px] font-semibold uppercase tracking-[0.2em] text-[var(--color-noir-gold)]">
        {label}
      </span>
    </div>
  );
}

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
            {product.discount !== undefined && (
              <span className="absolute left-0 top-0 bg-red-600 px-2.5 py-1 font-heading text-[10px] font-bold uppercase tracking-[0.14em] text-white">
                −{product.discount}%
              </span>
            )}
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

export default function SalePage() {
  useSeo({
    title: 'Sale',
    description:
      'The AFRO & CO. sale — up to 25% off outerwear, tailoring, leather goods, and accessories. Limited stock, no restocks at sale prices.',
  });

  const [sort, setSort] = useState<SortKey>('featured');
  const [view, setView] = useState<ViewMode>('grid');
  const [band, setBand] = useState<DiscountBand>('all');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [quickView, setQuickView] = useState<Product | null>(null);

  // Fixed 7-day window captured once on mount so the countdown is deterministic
  // for the life of this visit.
  const [deadline] = useState(() => Date.now() + SALE_WINDOW_MS);
  const [remaining, setRemaining] = useState(() => deadline - Date.now());

  const { data: saleItems } = useSaleProducts();
  const feedCount = saleItems?.length ?? 0;

  useEffect(() => {
    const id = window.setInterval(() => setRemaining(deadline - Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [deadline]);

  const products = useProductStore((s) => s.products);

  const onSale = useMemo(
    () =>
      products
        .filter((product): product is Product & { discount: number } =>
          typeof product.discount === 'number' && product.discount > 0
        )
        .sort((a, b) => b.discount - a.discount || a.price - b.price),
    [products]
  );

  const maxDiscount = onSale.reduce((max, product) => Math.max(max, product.discount), 0);

  const filtered = useMemo(() => {
    const min = DISCOUNT_BANDS.find((entry) => entry.value === band)?.min ?? 0;
    return onSale.filter((product) => product.discount >= min);
  }, [onSale, band]);

  const ranked = useMemo(() => applySort(filtered, sort), [filtered, sort]);
  const visible = useMemo(() => ranked.slice(0, visibleCount), [ranked, visibleCount]);
  const hasMore = visibleCount < ranked.length;

  const timeLeft = splitRemaining(remaining);
  const savings = onSale.reduce(
    (sum, product) => sum + ((product.originalPrice ?? product.price) - product.price),
    0
  );

  const stats = [
    { label: 'On sale', value: String(onSale.length) },
    { label: 'Deepest cut', value: `−${maxDiscount}%` },
    { label: 'Total savings', value: `$${Math.round(savings).toLocaleString('en-US')}` },
    { label: 'Editor feed', value: String(feedCount > 0 ? feedCount : onSale.length) },
  ];

  return (
    <>
      {/* ─── Discount banner ─── */}
      <section className="announcement-bar border-b border-[var(--color-noir-charcoal)]">
        <div className="mx-auto max-w-[1600px] px-4 py-8 sm:px-6 lg:px-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <span className="mt-1 hidden h-10 w-10 shrink-0 items-center justify-center border border-[var(--color-noir-gold)] text-[var(--color-noir-gold)] sm:flex">
                <Percent className="h-4 w-4" aria-hidden="true" />
              </span>
              <div>
                <p className="font-heading text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--color-noir-gold)]">
                  Private sale
                </p>
                <h2 className="mt-2 font-heading text-[clamp(1.5rem,3.5vw,2.25rem)] font-extrabold leading-tight tracking-[-0.02em] text-[var(--color-noir-ivory)]">
                  Up to {maxDiscount}% off — ends soon
                </h2>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-[var(--color-noir-light-gray)]">
                  Marked down from the season's archive, not from an inflated price. Once a size is
                  gone it is gone — sale pieces are never restocked.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <p className="flex items-center gap-2 font-heading text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--color-noir-gold)]">
                <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                Offer ends in
              </p>
              <div
                className="flex gap-2"
                role="timer"
                aria-live="off"
                aria-label="Time remaining until the sale ends"
              >
                <CountdownCell value={timeLeft.days} label="Days" />
                <CountdownCell value={timeLeft.hours} label="Hours" />
                <CountdownCell value={timeLeft.minutes} label="Mins" />
                <CountdownCell value={timeLeft.seconds} label="Secs" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Hero band ─── */}
      <section className="border-b border-[var(--border-color)] bg-[var(--bg-secondary)]">
        <div className="mx-auto max-w-[1600px] px-4 py-14 sm:px-6 lg:px-10 lg:py-20">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Sale' }]} />

          <p className="mt-6 flex items-center gap-2 font-heading text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
            <Tag className="h-3.5 w-3.5 text-[var(--color-noir-gold)]" aria-hidden="true" />
            Reduced for a limited run
          </p>

          <h1 className="mt-4 text-[clamp(2.25rem,6vw,4.5rem)] font-heading font-extrabold leading-[0.95] tracking-[-0.03em] text-[var(--text-primary)]">
            Sale
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-relaxed text-[var(--text-secondary)]">
            The end-of-season reduction, {onSale.length} pieces deep. Every item below is discounted
            against its original ticket price — filter by how much you want to save and sort by the
            deepest cut.
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
        </div>
      </section>

      {/* ─── Catalog ─── */}
      <div className="mx-auto max-w-[1600px] px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
        {/* Discount-range filter row */}
        <div className="flex flex-wrap items-center gap-3 border-b border-[var(--border-color)] pb-6">
          <span className="font-heading text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
            Discount
          </span>
          <div
            className="flex flex-wrap items-center gap-2"
            role="group"
            aria-label="Filter by discount"
          >
            {DISCOUNT_BANDS.map((entry) => {
              const active = band === entry.value;
              return (
                <button
                  key={entry.value}
                  type="button"
                  onClick={() => {
                    setBand(entry.value);
                    setVisibleCount(PAGE_SIZE);
                  }}
                  aria-pressed={active}
                  className={cn(
                    'flex h-9 items-center border px-4 font-heading text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors',
                    active
                      ? 'border-[var(--text-primary)] bg-[var(--text-primary)] text-[var(--bg-primary)]'
                      : 'border-[var(--border-color)] text-[var(--text-secondary)] hover:border-[var(--text-primary)] hover:text-[var(--text-primary)]'
                  )}
                >
                  {entry.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border-color)] py-4">
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
                containerClassName="w-48 sm:w-56"
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

        {/* Results */}
        {ranked.length === 0 ? (
          <div className="mt-12">
            <EmptyState
              icon={<Tag className="h-6 w-6" aria-hidden="true" />}
              title="Nothing in this discount range"
              message="No pieces are marked down by that much right now. Widen the range or browse the full collection."
              action={
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <Button variant="outline" onClick={() => setBand('all')}>
                    Show all discounts
                  </Button>
                  <Button asChild>
                    <Link to="/shop">Browse the shop</Link>
                  </Button>
                </div>
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

        {/* Load more */}
        {hasMore && (
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
