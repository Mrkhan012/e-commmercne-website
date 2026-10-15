import { Link } from 'react-router-dom';
import { Trash2, ShoppingBag, Scale, Check, X } from 'lucide-react';
import { useCompareStore } from '@/store/compareStore';
import { useCartStore } from '@/store/cartStore';
import { useToastStore } from '@/store/toastStore';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { RatingStars } from '@/components/ui/RatingStars';
import { PriceDisplay } from '@/components/ui/PriceDisplay';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { useSeo } from '@/hooks/useSeo';

export default function ComparePage() {
  const { items, removeItem, clearCompare } = useCompareStore();
  const addItemToCart = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);
  const toastSuccess = useToastStore((state) => state.success);

  useSeo({
    title: 'Compare Pieces',
    description: 'Compare materials, tailoring, and specifications across your selected AFRO & CO. pieces.',
  });

  const handleAddToCart = (product: any) => {
    addItemToCart(product, 1, product.colors?.[0], product.sizes?.[0]);
    toastSuccess('Added to bag', `${product.name} added to your shopping bag.`);
    openCart();
  };

  return (
    <div className="bg-[var(--bg-primary)] py-8 lg:py-14">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Shop', href: '/shop' },
            { label: 'Compare Products' },
          ]}
        />

        <div className="mt-8 flex flex-wrap items-end justify-between gap-4 border-b border-[var(--border-color)] pb-6">
          <div>
            <p className="font-heading text-xs font-bold uppercase tracking-[0.24em] text-[var(--color-noir-gold)]">
              Specification Matrix
            </p>
            <h1 className="mt-2 font-heading text-3xl font-extrabold tracking-tight text-[var(--text-primary)] lg:text-4xl">
              Compare Selected Pieces
            </h1>
          </div>
          {items.length > 0 && (
            <Button variant="outline" size="sm" onClick={clearCompare}>
              <Trash2 className="mr-2 h-3.5 w-3.5" />
              Clear Comparison
            </Button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="py-20">
            <EmptyState
              icon={<Scale className="h-6 w-6 text-[var(--color-noir-gold)]" />}
              title="No pieces in comparison"
              message="Select up to 4 items while browsing the catalog to compare tailoring, fabric composition, and dimensions side by side."
              action={
                <Link to="/shop">
                  <Button>Explore Collections</Button>
                </Link>
              }
            />
          </div>
        ) : (
          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[700px] border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-[var(--border-color)]">
                  <th className="w-48 py-4 pr-6 font-heading font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                    Piece
                  </th>
                  {items.map((item) => (
                    <th key={item.id} className="py-4 px-4 align-top">
                      <div className="relative group">
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-[var(--bg-primary)]/80 text-[var(--text-muted)] hover:text-red-600 shadow-sm"
                          title="Remove piece"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                        <div className="aspect-[4/5] w-full overflow-hidden bg-[var(--bg-secondary)] border border-[var(--border-color)]">
                          <img
                            src={item.images[0]?.url}
                            alt={item.name}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                        <p className="mt-3 font-heading text-xs uppercase tracking-wider text-[var(--color-noir-gold)]">
                          {item.brand}
                        </p>
                        <Link
                          to={`/product/${item.slug}`}
                          className="mt-1 block font-heading text-sm font-bold text-[var(--text-primary)] hover:underline"
                        >
                          {item.name}
                        </Link>
                        <div className="mt-2">
                          <PriceDisplay
                            price={item.price}
                            originalPrice={item.originalPrice}
                            currency={item.currency}
                            size="sm"
                          />
                        </div>
                        <Button
                          size="sm"
                          className="mt-4 w-full"
                          onClick={() => handleAddToCart(item)}
                        >
                          <ShoppingBag className="mr-1.5 h-3.5 w-3.5" />
                          Add to Bag
                        </Button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)]">
                <tr>
                  <td className="py-4 pr-6 font-semibold uppercase tracking-wider text-[var(--text-primary)]">
                    Client Rating
                  </td>
                  {items.map((item) => (
                    <td key={item.id} className="py-4 px-4">
                      <div className="flex items-center gap-1.5">
                        <RatingStars rating={item.rating} size="sm" />
                        <span className="font-semibold text-[var(--text-primary)]">{item.rating.toFixed(1)}</span>
                        <span className="text-[var(--text-muted)]">({item.reviewCount})</span>
                      </div>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-4 pr-6 font-semibold uppercase tracking-wider text-[var(--text-primary)]">
                    Category
                  </td>
                  {items.map((item) => (
                    <td key={item.id} className="py-4 px-4 text-[var(--text-muted)]">
                      {item.category} {item.subcategory && `› ${item.subcategory}`}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-4 pr-6 font-semibold uppercase tracking-wider text-[var(--text-primary)]">
                    Stock Availability
                  </td>
                  {items.map((item) => (
                    <td key={item.id} className="py-4 px-4">
                      {item.stock > 0 ? (
                        <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                          <Check className="h-3.5 w-3.5" /> In Stock ({item.stock})
                        </span>
                      ) : (
                        <span className="text-red-500 font-medium">Out of Stock</span>
                      )}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-4 pr-6 font-semibold uppercase tracking-wider text-[var(--text-primary)]">
                    Available Palettes
                  </td>
                  {items.map((item) => (
                    <td key={item.id} className="py-4 px-4">
                      {item.colors && item.colors.length > 0 ? (
                        <div className="flex items-center gap-1.5">
                          {item.colors.map((c) => (
                            <span
                              key={c.slug}
                              title={c.name}
                              className="h-4 w-4 rounded-full border border-[var(--border-color)]"
                              style={{ backgroundColor: c.hex }}
                            />
                          ))}
                        </div>
                      ) : (
                        <span className="text-[var(--text-muted)]">—</span>
                      )}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-4 pr-6 font-semibold uppercase tracking-wider text-[var(--text-primary)]">
                    Tailoring &amp; Fit
                  </td>
                  {items.map((item) => (
                    <td key={item.id} className="py-4 px-4 text-[var(--text-muted)] leading-relaxed">
                      {item.shortDescription || item.description}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
