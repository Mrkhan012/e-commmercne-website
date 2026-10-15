import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, TrendingUp, ArrowRight } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useDebounce } from '@/hooks/useUi';
import { useSearch } from '@/hooks/useQueries';
import { formatPrice } from '@/utils/format';
import { cn } from '@/utils/cn';

export interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
}

export function SearchOverlay({ open, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const debouncedQuery = useDebounce(query, 200);
  const { data, isLoading } = useSearch(debouncedQuery, open && debouncedQuery.trim().length > 0);

  const hasQuery = debouncedQuery.trim().length > 0;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    handleClose();
  };

  const handleClose = () => {
    onClose();
    setQuery('');
  };

  const goToProduct = (slug: string) => {
    navigate(`/product/${slug}`);
    handleClose();
  };

  const trending = ['cashmere', 'overcoat', 'sneakers', 'perfume', 'tote bag'];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-100 bg-[var(--bg-primary)]/98 backdrop-blur-xl"
          role="dialog"
          aria-modal="true"
          aria-label="Search products"
        >
          <div className="mx-auto flex h-full max-w-3xl flex-col px-5 pt-8 pb-10 sm:pt-16">
            {/* Header */}
            <div className="flex items-center justify-between">
              <p className="font-heading text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
                Search
              </p>
              <button
                type="button"
                onClick={handleClose}
                aria-label="Close search"
                className="flex h-10 w-10 items-center justify-center text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Input */}
            <form onSubmit={submit} className="mt-6">
              <div className="flex items-center gap-4 border-b-2 border-[var(--text-primary)] pb-4">
                <Search className="h-5 w-5 shrink-0 text-[var(--text-muted)]" aria-hidden="true" />
                <input
                  autoFocus
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products, brands, categories…"
                  aria-label="Search query"
                  className="w-full bg-transparent font-heading text-xl font-medium text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none sm:text-2xl"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    aria-label="Clear search"
                    className="shrink-0 text-xs uppercase tracking-wider text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  >
                    Clear
                  </button>
                )}
              </div>
            </form>

            {/* Results */}
            <div className="mt-8 flex-1 overflow-y-auto">
              {!hasQuery && (
                <div>
                  <p className="flex items-center gap-2 font-heading text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">
                    <TrendingUp className="h-3.5 w-3.5" /> Trending searches
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {trending.map((term) => (
                      <button
                        key={term}
                        type="button"
                        onClick={() => setQuery(term)}
                        className="border border-[var(--border-color)] px-4 py-2 text-sm text-[var(--text-secondary)] transition-colors hover:border-[var(--text-primary)] hover:text-[var(--text-primary)]"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {hasQuery && isLoading && (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="skeleton h-16 w-full" />
                  ))}
                </div>
              )}

              {hasQuery && !isLoading && data && (
                <div>
                  {data.total === 0 ? (
                    <div className="py-12 text-center">
                      <p className="text-sm text-[var(--text-muted)]">
                        No results for “{debouncedQuery}”.
                      </p>
                      <button
                        type="button"
                        onClick={() => setQuery('')}
                        className="mt-3 text-sm font-medium text-[var(--color-noir-gold)]"
                      >
                        Clear search
                      </button>
                    </div>
                  ) : (
                    <>
                      <p className="mb-4 text-xs text-[var(--text-muted)]">
                        {data.total} {data.total === 1 ? 'result' : 'results'} for “{debouncedQuery}”
                      </p>

                      {/* Product suggestions */}
                      <ul className="divide-y divide-[var(--border-color)] border-y border-[var(--border-color)]">
                        {data.products.map((product) => (
                          <li key={product.id}>
                            <button
                              type="button"
                              onClick={() => goToProduct(product.slug)}
                              className="group flex w-full items-center gap-4 py-3 text-left"
                            >
                              <div className="h-14 w-12 shrink-0 overflow-hidden bg-[var(--bg-secondary)]">
                                <img
                                  src={product.images[0]?.url}
                                  alt=""
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium text-[var(--text-primary)] group-hover:text-[var(--color-noir-gold)]">
                                  {product.name}
                                </p>
                                <p className="text-xs text-[var(--text-muted)]">
                                  {product.brand} · {product.category}
                                </p>
                              </div>
                              <span className="shrink-0 text-sm font-semibold text-[var(--text-primary)]">
                                {formatPrice(product.price)}
                              </span>
                              <ArrowRight className="h-4 w-4 shrink-0 text-[var(--text-muted)] opacity-0 transition-opacity group-hover:opacity-100" />
                            </button>
                          </li>
                        ))}
                      </ul>

                      {/* Category suggestions */}
                      {data.categories.length > 0 && (
                        <div className="mt-6">
                          <p className="font-heading text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">
                            Categories
                          </p>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {data.categories.map((category) => (
                              <button
                                key={category.name}
                                type="button"
                                onClick={() => {
                                  navigate(`/shop/${category.slug}`);
                                  handleClose();
                                }}
                                className="border border-[var(--border-color)] px-4 py-2 text-sm text-[var(--text-secondary)] transition-colors hover:border-[var(--text-primary)] hover:text-[var(--text-primary)]"
                              >
                                {category.name} ({category.count})
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={submit}
                        className={cn(
                          'mt-6 w-full border border-[var(--text-primary)] py-4 text-center',
                          'font-heading text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-primary)]',
                          'transition-colors hover:bg-[var(--text-primary)] hover:text-[var(--bg-primary)]'
                        )}
                      >
                        View all {data.total} results
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
