import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { LayoutGrid, List, SlidersHorizontal, SearchX } from 'lucide-react';
import type { Product, ProductFilters, SortOption } from '@/types';
import { useProducts, useFacets } from '@/hooks/useQueries';
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

/** Full catalog listing with faceted filtering, sorting, and two view modes. */
export default function ShopPage() {
  useSeo({
    title: 'Shop All Products',
    description:
      'Browse the complete NOIR & CO. catalogue — clothing, footwear, accessories, watches, homeware, beauty, and electronics.',
  });

  const [searchParams, setSearchParams] = useSearchParams();
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // URL is the source of truth for page and sort so results are shareable.
  const page = Math.max(1, Number(searchParams.get('page') ?? 1));
  const sort = (searchParams.get('sort') as SortOption) ?? 'featured';

  const [filters, setFilters] = useState<ProductFilters>(DEFAULT_FILTERS);

  const { data: facets } = useFacets();
  const priceCeiling = facets?.priceRange?.[1] ?? 1000;

  const query = useMemo(() => {
    const atCeiling = filters.priceRange[1] >= priceCeiling;
    return {
      brands: filters.brands.length ? filters.brands : undefined,
      colors: filters.colors.length ? filters.colors : undefined,
      sizes: filters.sizes.length ? filters.sizes : undefined,
      minPrice: filters.priceRange[0] > 0 ? filters.priceRange[0] : undefined,
      maxPrice: atCeiling ? undefined : filters.priceRange[1],
      minRating: filters.rating ?? undefined,
      onSale: filters.onSale || undefined,
      inStock: filters.inStock || undefined,
      sort,
      page,
      pageSize: PAGE_SIZE,
    };
  }, [filters, sort, page, priceCeiling]);

  const { data, isLoading } = useProducts(query);

  const updateParams = (next: { page?: number; sort?: SortOption }) => {
    const params = new URLSearchParams(searchParams);
    if (next.page !== undefined) params.set('page', String(next.page));
    if (next.sort !== undefined) params.set('sort', next.sort);
    setSearchParams(params, { replace: true });
  };

  // Any filter change resets pagination to page one.
  const handleFilterChange = (next: ProductFilters) => {
    setFilters(next);
    if (page !== 1) updateParams({ page: 1 });
  };

  const products = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;

  const filterPanel = (
    <FilterPanel
      filters={filters}
      onChange={handleFilterChange}
      sort={sort}
      onSortChange={(next) => updateParams({ sort: next, page: 1 })}
    />
  );

  return (
    <>
      {/* Hero */}
      <section className="border-b border-[var(--border-color)] bg-[var(--bg-secondary)]">
        <div className="mx-auto max-w-[1600px] px-4 py-14 sm:px-6 lg:px-10 lg:py-20">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Shop' }]} />
          <h1 className="mt-4 text-[clamp(2.25rem,6vw,4.5rem)] font-heading font-extrabold leading-[0.95] tracking-[-0.03em] text-[var(--text-primary)]">
            The Collection
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-[var(--text-secondary)]">
            Every piece we make, in one place. Filter by brand, colour, size, or price to narrow
            things down — the full catalogue runs from everyday essentials to one-off statement pieces.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10">
        <div className="lg:grid lg:grid-cols-[260px_1fr] lg:gap-12">
          {/* Desktop sidebar */}
          <aside className="hidden py-10 lg:block">
            <div className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto pr-2">
              {filterPanel}
            </div>
          </aside>

          {/* Results */}
          <section className="py-8 lg:py-10">
            {/* Toolbar */}
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

                {/* Mobile sort */}
                <label className="flex items-center gap-2 lg:hidden">
                  <span className="sr-only">Sort by</span>
                  <select
                    value={sort}
                    onChange={(e) => updateParams({ sort: e.target.value as SortOption, page: 1 })}
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

            {/* Results */}
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
                  title="Nothing matches those filters"
                  message="Try widening your price range or clearing a filter or two."
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
                <Pagination page={page} totalPages={totalPages} onChange={(p) => updateParams({ page: p })} />
              </div>
            )}
          </section>
        </div>
      </div>

      {/* Mobile filter drawer */}
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
        <div className="p-5">
          {filterPanel}
        </div>
      </Drawer>

      <QuickViewModal
        product={quickViewProduct}
        open={quickViewProduct !== null}
        onClose={() => setQuickViewProduct(null)}
      />
    </>
  );
}
