import { useState } from 'react';
import { Minus, Plus, ShoppingBag } from 'lucide-react';
import type { Product } from '@/types';
import { useCartStore } from '@/store/cartStore';
import { useToastStore } from '@/store/toastStore';
import { Dialog } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { RatingStars } from '@/components/ui/RatingStars';
import { PriceDisplay } from '@/components/ui/PriceDisplay';
import { cn } from '@/utils/cn';

export interface QuickViewModalProps {
  product: Product | null;
  open: boolean;
  onClose: () => void;
}

/**
 * Quick-view modal: image, price, variant selection, and add-to-cart without
 * leaving the current page. Validates variant and stock before adding.
 */
export function QuickViewModal({ product, open, onClose }: QuickViewModalProps) {
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0]?.slug);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const addItem = useCartStore((state) => state.addItem);
  const toast = useToastStore((state) => state.success);

  if (!product) return null;

  const color = product.colors?.find((c) => c.slug === selectedColor);
  const inStock = product.stock > 0;
  const hasSizes = !!product.sizes?.length;

  const resetAndClose = () => {
    setSelectedSize(undefined);
    setQuantity(1);
    setError(null);
    onClose();
  };

  const handleAddToCart = () => {
    setError(null);

    if (!inStock) {
      setError('This item is currently out of stock.');
      return;
    }
    if (hasSizes && !selectedSize) {
      setError('Please select a size.');
      return;
    }

    const size = product.sizes?.find((s) => s.slug === selectedSize);
    if (size && !size.available) {
      setError('The selected size is unavailable.');
      return;
    }

    addItem(product, quantity, color, size);
    toast('Added to bag', `${product.name}${size ? ` — ${size.label}` : ''}`);
    resetAndClose();
  };

  return (
    <Dialog open={open} onClose={resetAndClose} size="xl" className="p-0">
      <div className="grid gap-0 md:grid-cols-2">
        {/* Image */}
        <div className="relative aspect-[4/5] bg-[var(--bg-secondary)] md:aspect-auto md:h-full">
          <img
            src={product.images[0]?.url}
            alt={product.images[0]?.alt ?? product.name}
            className="h-full w-full object-cover"
          />
          {product.discount ? (
            <div className="absolute left-4 top-4">
              <Badge variant="sale">−{product.discount}%</Badge>
            </div>
          ) : null}
        </div>

        {/* Details */}
        <div className="flex flex-col p-6 md:p-8">
          <p className="font-heading text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--text-muted)]">
            {product.brand}
          </p>
          <h2 className="mt-2 font-heading text-2xl font-bold leading-tight text-[var(--text-primary)]">
            {product.name}
          </h2>

          <div className="mt-3 flex items-center gap-3">
            <RatingStars rating={product.rating} size="sm" />
            <span className="text-xs text-[var(--text-muted)]">
              {product.reviewCount} reviews
            </span>
          </div>

          <PriceDisplay
            price={product.price}
            originalPrice={product.originalPrice}
            discount={product.discount}
            size="lg"
            className="mt-5"
          />

          <p className="mt-4 text-sm leading-relaxed text-[var(--text-secondary)]">
            {product.shortDescription}
          </p>

          {/* Colors */}
          {product.colors && product.colors.length > 0 && (
            <div className="mt-6">
              <p className="mb-2 font-heading text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--text-secondary)]">
                Color: <span className="text-[var(--text-primary)]">{color?.name}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c.slug}
                    type="button"
                    onClick={() => setSelectedColor(c.slug)}
                    aria-label={c.name}
                    aria-pressed={selectedColor === c.slug}
                    className={cn(
                      'h-8 w-8 rounded-full border-2 transition-transform',
                      selectedColor === c.slug
                        ? 'border-[var(--color-noir-gold)] scale-110'
                        : 'border-[var(--border-color)] hover:scale-105'
                    )}
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Sizes */}
          {hasSizes && (
            <div className="mt-6">
              <p className="mb-2 font-heading text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--text-secondary)]">
                Size
              </p>
              <div className="flex flex-wrap gap-2">
                {product.sizes!.map((s) => (
                  <button
                    key={s.slug}
                    type="button"
                    disabled={!s.available}
                    onClick={() => {
                      setSelectedSize(s.slug);
                      setError(null);
                    }}
                    aria-pressed={selectedSize === s.slug}
                    className={cn(
                      'min-w-12 border px-3 py-2 text-xs font-medium transition-colors',
                      !s.available &&
                        'cursor-not-allowed border-[var(--border-color)] text-[var(--text-muted)] line-through opacity-50',
                      s.available && selectedSize === s.slug &&
                        'border-[var(--text-primary)] bg-[var(--text-primary)] text-[var(--bg-primary)]',
                      s.available &&
                        selectedSize !== s.slug &&
                        'border-[var(--border-color)] text-[var(--text-primary)] hover:border-[var(--text-primary)]'
                    )}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="mt-6 flex items-center gap-4">
            <p className="font-heading text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--text-secondary)]">
              Qty
            </p>
            <div className="flex items-center border border-[var(--border-color)]">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
                className="flex h-9 w-9 items-center justify-center text-[var(--text-primary)] disabled:opacity-40"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="w-10 text-center text-sm font-medium text-[var(--text-primary)]">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                disabled={quantity >= product.stock}
                aria-label="Increase quantity"
                className="flex h-9 w-9 items-center justify-center text-[var(--text-primary)] disabled:opacity-40"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {error && (
            <p role="alert" className="mt-4 text-xs font-medium text-red-500">
              {error}
            </p>
          )}

          <div className="mt-6 flex flex-col gap-3">
            <Button
              onClick={handleAddToCart}
              disabled={!inStock}
              fullWidth
              size="lg"
            >
              {inStock ? (
                <>
                  <ShoppingBag className="h-4 w-4" /> Add to Bag
                </>
              ) : (
                'Out of Stock'
              )}
            </Button>
            <Button variant="outline" fullWidth onClick={resetAndClose}>
              View Full Details
            </Button>
          </div>

          <p className="mt-4 text-xs text-[var(--text-muted)]">
            {inStock ? (
              <span className="text-emerald-600">In stock</span>
            ) : (
              <span className="text-red-500">Out of stock</span>
            )}
            {' · '}
            {product.stock <= 10 ? `Only ${product.stock} left` : 'Ready to ship'}
          </p>
        </div>
      </div>
    </Dialog>
  );
}
