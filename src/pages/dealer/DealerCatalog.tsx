import { useState, useMemo } from 'react';
import {
  Search,
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useProductStore } from '@/store/productStore';
import { useCategoryStore } from '@/store/categoryStore';
import { useUserStore } from '@/store/userStore';
import { useDealerStore } from '@/store/dealerStore';
import { useCartStore } from '@/store/cartStore';
import { useCurrencyStore } from '@/store/currencyStore';
import { useToastStore } from '@/store/toastStore';
import { formatPrice } from '@/utils/format';
import { useSeo } from '@/hooks/useSeo';
import type { Product } from '@/types';

export default function DealerCatalog() {
  useSeo({
    title: 'Wholesale Product Catalog | Dealer Portal',
    description: 'B2B Wholesale purchasing catalog with volume tier margins, unit savings, and consolidated batch ordering.',
  });

  const { products } = useProductStore();
  const { categories } = useCategoryStore();
  const { user } = useUserStore();
  const { dealers } = useDealerStore();
  const { currentCurrency } = useCurrencyStore();
  const { addItem } = useCartStore();
  const toast = useToastStore();

  const currentDealer = user?.dealerProfile || dealers.find((d) => d.email === user?.email) || dealers[0];
  const discountRate = currentDealer?.discountRate || 0.35;
  const discountPercent = Math.round(discountRate * 100);

  // Filters & Search
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'price-asc' | 'price-desc' | 'stock'>('name');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  // Local quantities for fast wholesale adding: Record<productId, number>
  const [orderQuantities, setOrderQuantities] = useState<Record<string, number>>({});

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
        const matchesSearch =
          !search ||
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.brand.toLowerCase().includes(search.toLowerCase()) ||
          p.id.toLowerCase().includes(search.toLowerCase());
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'stock') return b.stock - a.stock;
        return a.name.localeCompare(b.name);
      });
  }, [products, selectedCategory, search, sortBy]);

  // Pagination calculation
  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, currentPage, pageSize]);

  const getWholesalePrice = (retailPrice: number) => {
    return Math.round(retailPrice * (1 - discountRate) * 100) / 100;
  };

  const handleQuantityChange = (productId: string, qty: number) => {
    setOrderQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(1, qty),
    }));
  };

  const handleAddWholesaleBatch = (product: Product) => {
    const qty = orderQuantities[product.id] || currentDealer?.minOrderQuantity || 5;
    const wholesaleUnitPrice = getWholesalePrice(product.price);

    addItem(product, qty, product.colors?.[0], product.sizes?.[0], wholesaleUnitPrice, true);

    toast.success(
      'Wholesale batch added',
      `${qty}x ${product.name} added at wholesale rate (${formatPrice(wholesaleUnitPrice, currentCurrency)}/unit)`
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--color-noir-gold)]">
            Verified Partner Pricing
          </span>
          <h1 className="font-heading text-2xl font-bold text-[var(--text-primary)]">
            Wholesale Catalog &amp; Bulk Ordering
          </h1>
          <p className="mt-1 text-xs text-[var(--text-secondary)]">
            Showing wholesale cost with <strong className="text-[var(--color-noir-gold)]">{discountPercent}% dealer margin</strong>. Minimum order requirement: {currentDealer?.minOrderQuantity || 5} units.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-lg border border-[var(--color-noir-gold)]/30 bg-[var(--color-noir-gold)]/10 px-3 py-2 text-xs">
          <Sparkles className="h-4 w-4 text-[var(--color-noir-gold)]" />
          <span className="font-medium">
            Tier: <strong>{currentDealer?.tier?.toUpperCase()}</strong> &bull; Margin:{' '}
            <strong>{discountPercent}% OFF MSRP</strong>
          </span>
        </div>
      </div>

      {/* ─── Controls: Search, Category, Sort ─── */}
      <div className="flex flex-col gap-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Search by product name, SKU, or brand..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full rounded-md border border-[var(--border-color)] bg-[var(--bg-primary)] py-2 pl-9 pr-4 text-xs text-[var(--text-primary)] focus:border-[var(--color-noir-gold)] focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            aria-label="Filter wholesale catalog by category"
            className="rounded-md border border-[var(--border-color)] bg-[var(--bg-primary)] px-3 py-2 text-xs text-[var(--text-primary)] focus:border-[var(--color-noir-gold)] focus:outline-none"
          >
            <option value="all">All Categories ({products.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            aria-label="Sort wholesale catalog"
            className="rounded-md border border-[var(--border-color)] bg-[var(--bg-primary)] px-3 py-2 text-xs text-[var(--text-primary)] focus:border-[var(--color-noir-gold)] focus:outline-none"
          >
            <option value="name">Sort: Name (A-Z)</option>
            <option value="price-asc">Sort: Price (Low to High)</option>
            <option value="price-desc">Sort: Price (High to Low)</option>
            <option value="stock">Sort: Stock Volume</option>
          </select>
        </div>
      </div>

      {/* ─── Product Catalog Grid ─── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {paginatedProducts.map((product) => {
          const wholesalePrice = getWholesalePrice(product.price);
          const perUnitSavings = Math.round((product.price - wholesalePrice) * 100) / 100;
          const currentQty = orderQuantities[product.id] || currentDealer?.minOrderQuantity || 5;
          const lineTotal = Math.round(wholesalePrice * currentQty * 100) / 100;

          return (
            <div
              key={product.id}
              className="flex flex-col justify-between rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-4 shadow-sm hover:border-[var(--color-noir-gold)]/50 transition-colors"
            >
              <div>
                {/* Image and badges */}
                <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-[var(--bg-secondary)] mb-3">
                  <img
                    src={product.images[0]?.url || 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80'}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    <span className="rounded bg-black/80 px-2 py-0.5 text-[10px] font-mono font-bold text-[var(--color-noir-gold)] backdrop-blur-sm">
                      {discountPercent}% OFF MSRP
                    </span>
                    <span className="rounded bg-black/60 px-2 py-0.5 text-[9px] font-mono text-white/80">
                      MOQ: {currentDealer?.minOrderQuantity || 5}
                    </span>
                  </div>

                  <div className="absolute bottom-2 right-2 rounded bg-black/80 px-2 py-0.5 text-[10px] font-mono text-emerald-400">
                    {product.stock} in stock
                  </div>
                </div>

                {/* Product Info */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                    <span>{product.brand}</span>
                    <span>SKU: {product.id}</span>
                  </div>
                  <h3 className="font-heading text-sm font-bold text-[var(--text-primary)] line-clamp-1">
                    {product.name}
                  </h3>

                  {/* Pricing breakdown */}
                  <div className="mt-2 rounded-lg bg-[var(--bg-secondary)] p-2.5">
                    <div className="flex items-baseline justify-between">
                      <span className="text-[10px] text-[var(--text-muted)] uppercase">Wholesale Price:</span>
                      <span className="font-mono text-base font-extrabold text-[var(--color-noir-gold)]">
                        {formatPrice(wholesalePrice, currentCurrency)}
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between text-[11px] text-[var(--text-muted)] mt-0.5">
                      <span>Retail MSRP:</span>
                      <span className="line-through">{formatPrice(product.price, currentCurrency)}</span>
                    </div>

                    <div className="flex items-baseline justify-between text-[10px] text-emerald-500 font-semibold mt-1 pt-1 border-t border-[var(--border-color)]">
                      <span>Profit Margin / Unit:</span>
                      <span>+{formatPrice(perUnitSavings, currentCurrency)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Controls */}
              <div className="mt-4 pt-3 border-t border-[var(--border-color)] space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-semibold uppercase text-[var(--text-secondary)]">
                    Batch Qty:
                  </span>
                  {/* Preset quick buttons */}
                  <div className="flex items-center gap-1">
                    {[5, 10, 25, 50].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => handleQuantityChange(product.id, preset)}
                        className={`rounded px-1.5 py-0.5 text-[10px] font-mono font-bold transition-colors ${
                          currentQty === preset
                            ? 'bg-[var(--color-noir-gold)] text-black'
                            : 'bg-[var(--bg-secondary)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                        }`}
                      >
                        +{preset}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={currentDealer?.minOrderQuantity || 1}
                    value={currentQty}
                    onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value) || 1)}
                    aria-label={`Quantity for ${product.name}`}
                    className="w-16 rounded border border-[var(--border-color)] bg-[var(--bg-primary)] px-2 py-1.5 text-center font-mono text-xs font-bold text-[var(--text-primary)] focus:border-[var(--color-noir-gold)] focus:outline-none"
                  />
                  <Button
                    onClick={() => handleAddWholesaleBatch(product)}
                    variant="primary"
                    size="sm"
                    className="flex-1 text-xs"
                  >
                    <ShoppingBag className="mr-1.5 h-3.5 w-3.5" />
                    Add Batch ({formatPrice(lineTotal, currentCurrency)})
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ─── Pagination Controls ─── */}
      <div className="flex flex-col items-center justify-between gap-4 border-t border-[var(--border-color)] pt-6 sm:flex-row">
        <p className="text-xs text-[var(--text-secondary)]">
          Showing <span className="font-semibold text-[var(--text-primary)]">{(currentPage - 1) * pageSize + 1}</span> to{' '}
          <span className="font-semibold text-[var(--text-primary)]">
            {Math.min(currentPage * pageSize, totalItems)}
          </span>{' '}
          of <span className="font-semibold text-[var(--text-primary)]">{totalItems}</span> wholesale products
        </p>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="mr-1 h-3.5 w-3.5" />
            Previous
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((p) => (
              <button
                key={p}
                onClick={() => setCurrentPage(p)}
                className={`h-8 w-8 rounded text-xs font-semibold transition-colors ${
                  currentPage === p
                    ? 'bg-[var(--color-noir-gold)] text-black'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className="ml-1 h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
