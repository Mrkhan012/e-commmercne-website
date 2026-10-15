import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { LayoutGrid, List, SlidersHorizontal, SearchX } from 'lucide-react';
import type { Product, ProductFilters, SortOption } from '@/types';
import { categories, getCategoryBySlug } from '@/data/categories';
import { useProducts } from '@/hooks/useQueries';
import { FilterPanel } from '@/components/product/FilterPanel';
import { ProductCard } from '@/components/product/ProductCard';
import { QuickViewModal } from '@/components/product/QuickViewModal';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Pagination } from '@/components/ui/Pagination';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { Drawer } from '@/components/ui/Drawer';
import { useSeo } from '@/hooks/useSeo';
import { cn } from '@/utils/cn';

const PAGE_SIZE = 12;

const DEFAULT_FILTERS: ProductFilters = {
  categories: [],
  brands: [],
  priceRange: [0, 1000],
  colors: [],
  sizes: [],
  rating: null,
  onSale: false,
  inStock: false,
  status: [],
};

/**
 * Resolves a `:categorySlug` route param to either a top-level category or one of
 * its subcategories, so both /shop/clothing and /shop/tops-shirts work.
 */
const resolveCategory = (slug: string | undefined) => {
  if (!slug) return null;

  const topLevel = getCategoryBySlug(slug);
  if (topLevel) return { kind: 'category' as const, category: topLevel, subcategory: undefined };

  for (const category of categories) {
    const sub = category.subcategories?.find((s) => s.slug === slug);
    if (sub) return { kind: 'subcategory' as const, category, subcategory: sub };
  }

  return null;
};

/** Category and subcategory listing with faceted filtering and sorting. */
export default function CategoryPage() {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const resolved = useMemo(() => resolveCategory(categorySlug), [categorySlug]);

  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<SortOption>('featured');
  const [filters, setFilters] = useState<ProductFilters>(DEFAULT_FILTERS);

  const title = resolved?.subcategory?.name ?? resolved?.category.name ?? 'Category';

  useSeo({
    title: resolved ? title : 'Category Not Found',
    description: resolved?.category.description ?? 'Browse this collection at NOIR & CO.',
  });

  const query = useMemo(
    () => ({
      category: resolved?.kind === 'category' ? resolved.category.name : undefined,
      subcategory: resolved?.kind === 'subcategory' ? resolved.subcategory?.name : undefined,
      brands: filters.brands.length ? filters.brands : undefined,
      colors: filters.colors.length ? filters.colors : undefined,
      sizes: filters.sizes.length ? filters.sizes : undefined,
      minPrice: filters.priceRange[0] > 0 ? filters.priceRange[0] : undefined,
      maxPrice: filters.priceRange[1] >= 1000 ? undefined : filters.priceRange[1],
      minRating: filters.rating ?? undefined,
      onSale: filters.onSale || undefined,
      inStock: filters.inStock || undefined,
      sort,
      page,
      pageSize: PAGE_SIZE,
    }),
    [resolved, filters, sort, page]
  );

  const { data, isLoading } = useProducts(query);

  // Not found — an unknown slug should read as a 404, not an empty grid.
  if (!resolved) {
    return (
      <div className="mx-auto max-w-[1600px] px-4 py-24 sm:px-6 lg:px-10">
        <EmptyState
          icon={<SearchX className="h-7 w-7" />}
          title="We could not find that category"
          message="The link may be out of date. Browse the full collection instead."
          action={
            <Button asChild>
              <Link to="/shop">Shop all products</Link>
            </Button>
          }
          className="mx-auto max-w-lg"
        />
      </div>
    );
  }

  const { category, subcategory } = resolved;
  const products = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;

  const handleFilterChange = (next: ProductFilters) => {
    setFilters(next);
    setPage(1);
  };

  const filterPanel = (
    <FilterPanel
      filters={filters}
      onChange={handleFilterChange}
      sort={sort}
      onSortChange={(next) => {
        setSort(next);
        setPage(1);
      }}
    />
  );

  return (
    <>
      {/* Hero */}
      <section className="relative border-b border-[var(--border-color)]">
        <div className="absolute inset-0">
          <img
            src={category.image}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover"
          />
          <div
            className="absolute inset-0 bg-gradient-to-r from-noir-black/90 via-noir-black/70 to-noir-black/40"
            aria-hidden="true"
          />
        </div>

        <div className="relative mx-auto max-w-[1600px] px-4 py-14 sm:px-6 lg:px-10 lg:py-20">
          <div className="text-noir-ivory [&_a]:text-noir-ivory/70 [&_a:hover]:text-noir-ivory [&_span]:text-noir-ivory/60">
            <Breadcrumbs
              items={[
                { label: 'Home', href: '/' },
                { label: 'Shop', href: '/shop' },
                ...(subcategory ? [{ label: category.name, href: `/shop/${category.slug}` }] : []),
                { label: title },
              ]}
            />
          </div>

          <h1 className="mt-4 max-w-3xl text-[clamp(2.25rem,6vw,4.5rem)] font-heading font-extrabold leading-[0.95] tracking-[-0.03em] text-noir-ivory">
            {title}
          </h1>
          {category.description && (
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-noir-ivory/75">
              {category.description}
            </p>
          )}

          {/* Subcategory nav */}
          {category.subcategories && category.subcategories.length > 0 && (
            <nav aria-label={`${category.name} subcategories`} className="mt-9 flex flex-wrap gap-2">
              <Link
                to={`/shop/${category.slug}`}
                className={cn(
                  'border px-4 py-2 font-heading text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors',
                  !subcategory
                    ? 'border-noir-gold bg-noir-gold text-noir-black'
                    : 'border-noir-ivory/30 text-noir-ivory hover:border-noir-ivory'
                )}
              >
                All {category.name}
              </Link>
              {category.subcategories.map((sub) => (
                <Link
                  key={sub.id}
                  to={`/shop/${sub.slug}`}
                  className={cn(
                    'border px-4 py-2 font-heading text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors',
                    subcategory?.id === sub.id
                      ? 'border-noir-gold bg-noir-gold text-noir-black'
                      : 'border-noir-ivory/30 text-noir-ivory hover:border-noir-ivory'
                  )}
                >
                  {sub.name}
                </Link>
              ))}
            </nav>
          )}
        </div>
      </section>

      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10">
        <div className="lg:grid lg:grid-cols-[260px_1fr] lg:gap-12">
          <aside className="hidden py-10 lg:block">
            <div className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto pr-2">
              {filterPanel}
            </div>
          </aside>

          <section className="py-8 lg:py-10">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border-color)] pb-5">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFiltersOpen(true)}
                  className="lg:hidden"
                >
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                  Filters
                </Button>
                <p className="text-sm text-[var(--text-muted)]">
                  {isLoading ? 'Loading…' : `${total} ${total === 1 ? 'piece' : 'pieces'}`}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div
                  className="hidden items-center border border-[var(--border-color)] sm:flex"
                  role="group"
                  aria-label="View mode"
                >
                  <button
                    type="button"
                    onClick={() => setView('grid')}
                    aria-label="Grid view"
                    aria-pressed={view === 'grid'}
                    className={cn(
                      'flex h-9 w-9 items-center justify-center transition-colors',
                      view === 'grid'
                        ? 'bg-[var(--text-primary)] text-[var(--bg-primary)]'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                    )}
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setView('list')}
                    aria-label="List view"
                    aria-pressed={view === 'list'}
                    className={cn(
                      'flex h-9 w-9 items-center justify-center transition-colors',
                      view === 'list'
                        ? 'bg-[var(--text-primary)] text-[var(--bg-primary)]'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                    )}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>

                <label className="flex items-center gap-2 lg:hidden">
                  <span className="sr-only">Sort by</span>
                  <select
                    value={sort}
                    onChange={(e) => {
                      setSort(e.target.value as SortOption);
                      setPage(1);
                    }}
                    className="h-9 border border-[var(--border-color)] bg-[var(--bg-primary)] px-3 text-xs text-[var(--text-primary)]"
                  >
                    <option value="featured">Featured</option>
                    <option value="newest">Newest</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                    <option value="bestselling">Best Selling</option>
                  </select>
                </label>
              </div>
            </div>

            <div className="mt-8">
              {isLoading ? (
                <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-3 xl:grid-cols-4">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="skeleton aspect-[4/5] w-full" />
                  ))}
                </div>
              ) : products.length === 0 ? (
                <EmptyState
                  icon={<SearchX className="h-7 w-7" />}
                  title="Nothing here yet"
                  message="No pieces match those filters in this category. Try widening your search."
                  action={
                    <Button variant="outline" onClick={() => handleFilterChange(DEFAULT_FILTERS)}>
                      Clear all filters
                    </Button>
                  }
                />
              ) : view === 'grid' ? (
                <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-3 xl:grid-cols-4">
                  {products.map((product, index) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      index={index}
                      onQuickView={(p) => setQuickViewProduct(p)}
                    />
                  ))}
                </div>
              ) : (
                <ul className="divide-y divide-[var(--border-color)] border-y border-[var(--border-color)]">
                  {products.map((product, index) => (
                    <li key={product.id} className="py-6 first:pt-0 last:pb-0">
                      <ProductCard
                        product={product}
                        layout="wide"
                        index={index}
                        onQuickView={(p) => setQuickViewProduct(p)}
                      />
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {totalPages > 1 && (
              <div className="mt-14">
                <Pagination page={page} totalPages={totalPages} onChange={setPage} />
              </div>
            )}
          </section>
        </div>
      </div>

      <Drawer
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        title="Filters"
        side="left"
        width="max-w-sm"
        footer={
          <div className="flex gap-3">
            <Button variant="outline" fullWidth onClick={() => handleFilterChange(DEFAULT_FILTERS)}>
              Clear all
            </Button>
            <Button fullWidth onClick={() => setFiltersOpen(false)}>
              Show {total} results
            </Button>
          </div>
        }
      >
        <div className="p-5">{filterPanel}</div>
      </Drawer>

      <QuickViewModal
        product={quickViewProduct}
        open={quickViewProduct !== null}
        onClose={() => setQuickViewProduct(null)}
      />
    </>
  );
}
