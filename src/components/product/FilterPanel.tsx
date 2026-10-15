import type { ProductFilters, SortOption } from '@/types';
import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import { useFacets } from '@/hooks/useQueries';
import { useProducts } from '@/hooks/useQueries';
import { cn } from '@/utils/cn';

export interface FilterPanelProps {
  filters: ProductFilters;
  onChange: (filters: ProductFilters) => void;
  sort: SortOption;
  onSortChange: (sort: SortOption) => void;
  categorySlug?: string;
  className?: string;
}

const PRICE_MIN = 0;
const PRICE_MAX = 1000;
const PRICE_STEP = 25;

const RATING_OPTIONS = [4.5, 4, 3.5, 3];

export function FilterPanel({
  filters,
  onChange,
  sort,
  onSortChange,
  className,
}: FilterPanelProps) {
  const { data: facets } = useFacets();
  const { data: page } = useProducts({ page: 1, pageSize: 1 });

  const brands = facets?.brands ?? [];
  const colors = facets?.colors ?? [];
  const sizes = facets?.sizes ?? [];

  const toggleArrayValue = <T,>(array: T[], value: T): T[] =>
    array.includes(value) ? array.filter((v) => v !== value) : [...array, value];

  const setPriceRange = (value: number) => {
    onChange({ ...filters, priceRange: [PRICE_MIN, value] });
  };

  const hasActiveFilters =
    filters.brands.length > 0 ||
    filters.colors.length > 0 ||
    filters.sizes.length > 0 ||
    filters.rating !== null ||
    filters.onSale ||
    filters.inStock ||
    filters.priceRange[1] !== PRICE_MAX;

  const clearAll = () =>
    onChange({
      categories: [],
      brands: [],
      priceRange: [PRICE_MIN, PRICE_MAX],
      colors: [],
      sizes: [],
      rating: null,
      onSale: false,
      inStock: false,
      status: [],
    });

  return (
    <div className={cn('space-y-8', className)}>
      {/* Results summary + sort */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border-color)] pb-5">
        <p className="text-sm text-[var(--text-muted)]">
          {page?.total ?? 0} {page?.total === 1 ? 'product' : 'products'}
        </p>
        <label className="flex items-center gap-3 text-xs text-[var(--text-secondary)]">
          <span className="font-heading font-semibold uppercase tracking-[0.14em]">Sort</span>
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="h-10 border border-[var(--border-color)] bg-[var(--bg-primary)] px-3 pr-8 text-sm text-[var(--text-primary)] focus:border-[var(--text-primary)] focus:outline-none"
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

      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={clearAll} className="-mt-4">
          Clear all filters
        </Button>
      )}

      {/* Price */}
      <div>
        <h3 className="mb-4 font-heading text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-primary)]">
          Price
        </h3>
        <input
          type="range"
          min={PRICE_MIN}
          max={PRICE_MAX}
          step={PRICE_STEP}
          value={filters.priceRange[1]}
          onChange={(e) => setPriceRange(Number(e.target.value))}
          aria-label="Maximum price"
          className="w-full accent-[var(--color-noir-gold)]"
        />
        <div className="mt-2 flex justify-between text-xs text-[var(--text-muted)]">
          <span>${filters.priceRange[0]}</span>
          <span>Up to ${filters.priceRange[1]}</span>
        </div>
      </div>

      {/* Brand */}
      {brands.length > 0 && (
        <div>
          <h3 className="mb-4 font-heading text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-primary)]">
            Brand
          </h3>
          <div className="space-y-3">
            {brands.map((brand) => (
              <Checkbox
                key={brand.value}
                label={brand.value}
                count={brand.count}
                checked={filters.brands.includes(brand.value)}
                onChange={() =>
                  onChange({ ...filters, brands: toggleArrayValue(filters.brands, brand.value) })
                }
              />
            ))}
          </div>
        </div>
      )}

      {/* Color */}
      {colors.length > 0 && (
        <div>
          <h3 className="mb-4 font-heading text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-primary)]">
            Color
          </h3>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => {
              const active = filters.colors.includes(color.value);
              return (
                <button
                  key={color.value}
                  type="button"
                  onClick={() =>
                    onChange({ ...filters, colors: toggleArrayValue(filters.colors, color.value) })
                  }
                  aria-pressed={active}
                  className={cn(
                    'border px-3 py-1.5 text-xs font-medium transition-colors',
                    active
                      ? 'border-[var(--color-noir-gold)] bg-[var(--color-noir-gold)] text-[var(--color-noir-black)]'
                      : 'border-[var(--border-color)] text-[var(--text-primary)] hover:border-[var(--text-primary)]'
                  )}
                >
                  {color.value}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Size */}
      {sizes.length > 0 && (
        <div>
          <h3 className="mb-4 font-heading text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-primary)]">
            Size
          </h3>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => {
              const active = filters.sizes.includes(size.value);
              return (
                <button
                  key={size.value}
                  type="button"
                  onClick={() =>
                    onChange({ ...filters, sizes: toggleArrayValue(filters.sizes, size.value) })
                  }
                  aria-pressed={active}
                  className={cn(
                    'min-w-10 border px-3 py-1.5 text-xs font-medium transition-colors',
                    active
                      ? 'border-[var(--color-noir-gold)] bg-[var(--color-noir-gold)] text-[var(--color-noir-black)]'
                      : 'border-[var(--border-color)] text-[var(--text-primary)] hover:border-[var(--text-primary)]'
                  )}
                >
                  {size.value}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Rating */}
      <div>
        <h3 className="mb-4 font-heading text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-primary)]">
          Rating
        </h3>
        <div className="space-y-3">
          {RATING_OPTIONS.map((rating) => (
            <Checkbox
              key={rating}
              label={`${rating} & up`}
              checked={filters.rating === rating}
              onChange={() =>
                onChange({ ...filters, rating: filters.rating === rating ? null : rating })
              }
            />
          ))}
        </div>
      </div>

      {/* Availability */}
      <div>
        <h3 className="mb-4 font-heading text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-primary)]">
          Availability
        </h3>
        <div className="space-y-3">
          <Checkbox
            label="On sale"
            checked={filters.onSale}
            onChange={() => onChange({ ...filters, onSale: !filters.onSale })}
          />
          <Checkbox
            label="In stock only"
            checked={filters.inStock}
            onChange={() => onChange({ ...filters, inStock: !filters.inStock })}
          />
        </div>
      </div>
    </div>
  );
}
