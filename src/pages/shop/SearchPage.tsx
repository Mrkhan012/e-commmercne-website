import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search as SearchIcon, X, TrendingUp, PackageSearch, SlidersHorizontal } from 'lucide-react';
import type { Product, SortOption } from '@/types';
import { useProducts, useSearch } from '@/hooks/useQueries';
import { ProductCard } from '@/components/product/ProductCard';
import { QuickViewModal } from '@/components/product/QuickViewModal';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { EmptyState } from '@/components/ui/EmptyState';
import { Pagination } from '@/components/ui/Pagination';
import { useDebounce } from '@/hooks/useUi';
import { useSeo } from '@/hooks/useSeo';
import { cn } from '@/utils/cn';

const PAGE_SIZE = 12;

const SORT_LABELS: Record<SortOption, string> = {
  featured: 'Relevance',
  newest: 'Newest',
  'price-asc': 'Price: Low to High',
  'price-desc': 'Price: High to Low',
  rating: 'Top Rated',
  bestselling: 'Best Selling',
};

const TRENDING = ['cashmere', 'overcoat', 'sneakers', 'perfume', 'tote bag', 'linen shirt'];

/** Search results page. The query lives in the URL so results are shareable. */
export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') ?? '';

  const [term, setTerm] = useState(query);
  const [sort, setSort] = useState<SortOption>('featured');
  const [page, setPage] = useState(1);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const debouncedTerm = useDebounce(term, 300);

  useSeo({
    title: query ? `Search: ${query}` : 'Search',
    description: `Search results for ${query || 'the NOIR & CO. catalogue'}.`,
  });

  // Keep the input and URL in sync when navigation changes the query.
  useEffect(() => {
    setTerm(query);
    setPage(1);
  }, [query]);

  // Push a debounced term into the URL so the results update as you type.
  useEffect(() => {
    if (debouncedTerm === query) return;
    const params = new URLSearchParams(searchParams);
    if (debouncedTerm) params.set('q', debouncedTerm);
    else params.delete('q');
    setSearchParams(params, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedTerm]);

  const { data: page1, isLoading } = useProducts({
    search: query || undefined,
    sort,
    page,
    pageSize: PAGE_SIZE,
  });

  // The search service powers the refine row (categories, brands, suggestions).
  const { data: facets } = useSearch(query, !!query);

  const products = page1?.data ?? [];
  const total = page1?.total ?? 0;
  const totalPages = page1?.totalPages ?? 1;

  const categoryChips = useMemo(
    () => (facets?.categories ?? []).slice(0, 5),
    [facets]
  );
  const brandChips = useMemo(() => (facets?.brands ?? []).slice(0, 6), [facets]);

  return (
    <>
      {/* ─── Search header ─── */}
      <section className="border-b border-[var(--border-color)] bg-[var(--bg-secondary)]">
        <div className="mx-auto max-w-[1600px] px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Search' }]} />

          <h1 className="mt-5 text-[clamp(2rem,6vw,4rem)] font-heading font-extrabold leading-[0.95] tracking-[-0.03em] text-[var(--text-primary)]">
            {query ? (
              <>
                Results for{' '}
                <span className="font-editorial font-normal italic text-[var(--color-noir-gold)]">
                  {query}
                </span>
              </>
            ) : (
              'Search the collection'
            )}
          </h1>

          <form
            role="search"
            onSubmit={(e) => e.preventDefault()}
            className="mt-8 max-w-2xl"
          >
            <label htmlFor="search-page-input" className="sr-only">
              Search products
            </label>
            <div className="relative">
              <Input
                id="search-page-input"
                type="search"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                placeholder="Search for products, brands, categories…"
                autoComplete="off"
                leading={<SearchIcon className="h-4 w-4" />}
                trailing={
                  term ? (
                    <button
                      type="button"
                      onClick={() => setTerm('')}
                      aria-label="Clear search"
                      className="pointer-events-auto text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  ) : undefined
                }
                className="h-14 pr-11 text-base"
              />
            </div>
          </form>

          {/* Trending prompts when the field is empty */}
          {!query && (
            <div className="mt-6">
              <p className="flex items-center gap-2 font-heading text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
                <TrendingUp className="h-3.5 w-3.5" aria-hidden="true" />
                Trending searches
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {TRENDING.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => setTerm(suggestion)}
                    className="border border-[var(--border-color)] px-3.5 py-1.5 text-xs text-[var(--text-secondary)] transition-colors hover:border-[var(--text-primary)] hover:text-[var(--text-primary)]"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ─── Refine row ─── */}
      {query && (categoryChips.length > 0 || brandChips.length > 0) && (
        <div className="border-b border-[var(--border-color)]">
          <div className="mx-auto flex max-w-[1600px] flex-wrap items-center gap-x-6 gap-y-4 px-4 py-5 sm:px-6 lg:px-10">
            {categoryChips.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-heading text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
                  Categories
                </span>
                {categoryChips.map((category) => (
                  <Link
                    key={category.slug}
                    to={`/shop/${category.slug}`}
                    className="border border-[var(--border-color)] px-3 py-1.5 text-xs text-[var(--text-secondary)] transition-colors hover:border-[var(--color-noir-gold)] hover:text-[var(--text-primary)]"
                  >
                    {category.name}
                    <span className="ml-1.5 text-[var(--text-muted)]">{category.count}</span>
                  </Link>
                ))}
              </div>
            )}

            {brandChips.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-heading text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
                  Brands
                </span>
                {brandChips.map((brand) => (
                  <span
                    key={brand.name}
                    className="border border-[var(--border-color)] px-3 py-1.5 text-xs text-[var(--text-secondary)]"
                  >
                    {brand.name}
                    <span className="ml-1.5 text-[var(--text-muted)]">{brand.count}</span>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── Results ─── */}
      <section className="mx-auto max-w-[1600px] px-4 py-10 sm:px-6 lg:px-10 lg:py-14">
        {query && (
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border-color)] pb-5">
            <p className="text-sm text-[var(--text-muted)]">
              {isLoading ? 'Searching…' : `${total} ${total === 1 ? 'result' : 'results'}`}
            </p>

            <label className="flex items-center gap-2">
              <span className="hidden font-heading text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)] sm:inline">
                <SlidersHorizontal className="mr-1.5 inline h-3 w-3" aria-hidden="true" />
                Sort
              </span>
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value as SortOption);
                  setPage(1);
                }}
                className="h-9 border border-[var(--border-color)] bg-[var(--bg-primary)] px-3 text-xs text-[var(--text-primary)]"
              >
                {(Object.keys(SORT_LABELS) as SortOption[]).map((option) => (
                  <option key={option} value={option}>
                    {SORT_LABELS[option]}
                  </option>
                ))}
              </select>
            </label>
          </div>
        )}

        <div className="mt-8">
          {isLoading ? (
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="skeleton aspect-[4/5] w-full" />
              ))}
            </div>
          ) : !query ? (
            <EmptyState
              icon={<SearchIcon className="h-7 w-7" />}
              title="Start with a search term"
              message="Try a product name, a brand, a category, or one of the trending searches above."
            />
          ) : products.length === 0 ? (
            <EmptyState
              icon={<PackageSearch className="h-7 w-7" />}
              title={`No results for “${query}”`}
              message="Check the spelling, try a broader term, or browse the full collection."
              action={
                <Button asChild variant="outline">
                  <Link to="/shop">Shop all products</Link>
                </Button>
              }
              className="mx-auto max-w-lg"
            />
          ) : (
            <div
              className={cn(
                'grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-3 xl:grid-cols-4'
              )}
            >
              {products.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={index}
                  onQuickView={(p) => setQuickViewProduct(p)}
                />
              ))}
            </div>
          )}
        </div>

        {query && totalPages > 1 && (
          <div className="mt-14">
            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          </div>
        )}
      </section>

      <QuickViewModal
        product={quickViewProduct}
        open={quickViewProduct !== null}
        onClose={() => setQuickViewProduct(null)}
      />
    </>
  );
}
