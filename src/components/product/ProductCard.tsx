import { memo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Eye, Heart, ShoppingBag, Check, GitCompare } from 'lucide-react';
import type { Product } from '@/types';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useCompareStore } from '@/store/compareStore';
import { useToastStore } from '@/store/toastStore';
import { Badge } from '@/components/ui/Badge';
import { RatingStars } from '@/components/ui/RatingStars';
import { PriceDisplay } from '@/components/ui/PriceDisplay';
import { cn } from '@/utils/cn';

export interface ProductCardProps {
  product: Product;
  /** `grid` for catalog layouts, `wide` for horizontal/carousel layouts. */
  layout?: 'grid' | 'wide';
  onQuickView?: (product: Product) => void;
  className?: string;
  /** Index in a list — used to stagger reveal animations. */
  index?: number;
}

function ProductCardComponent({
  product,
  layout = 'grid',
  onQuickView,
  className,
  index = 0,
}: ProductCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const addItem = useCartStore((state) => state.addItem);
  const toggleWishlist = useWishlistStore((state) => state.toggleItem);
  const isInWishlist = useWishlistStore((state) => state.items.some((p) => p.id === product.id));
  const toggleCompare = useCompareStore((state) => state.toggleItem);
  const isInCompare = useCompareStore((state) => state.items.some((p) => p.id === product.id));
  const toast = useToastStore((state) => state.success);

  const inStock = product.stock > 0;
  const primaryImage = product.images[0];
  const hoverImage = product.images[1] ?? product.images[0];

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!inStock) return;

    // Products without variants can go straight into the cart.
    const needsSelection =
      (product.sizes && product.sizes.filter((s) => s.available).length > 0) ||
      (product.colors && product.colors.length > 0);

    if (needsSelection) {
      onQuickView?.(product);
      return;
    }

    addItem(product, 1);
    setJustAdded(true);
    toast('Added to bag', product.name);
    window.setTimeout(() => setJustAdded(false), 1600);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleCompare(product);
  };

  const badge = () => {
    if (product.discount && product.discount > 0) {
      return <Badge variant="sale">−{product.discount}%</Badge>;
    }
    if (product.status === 'new') return <Badge variant="new">New</Badge>;
    if (product.status === 'best-seller') return <Badge variant="best">Best Seller</Badge>;
    if (product.status === 'trending') return <Badge variant="trending">Trending</Badge>;
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.05, 0.3), ease: [0.16, 1, 0.3, 1] }}
      className={cn('group relative', className)}
    >
      <Link
        to={`/product/${product.slug}`}
        className={cn(
          'block',
          layout === 'wide' ? 'flex gap-5' : 'flex-col'
        )}
      >
        {/* ─── Image ─── */}
        <div
          className={cn(
            'relative overflow-hidden bg-[var(--bg-secondary)]',
            layout === 'wide' ? 'w-32 shrink-0 sm:w-40' : 'aspect-[4/5] w-full'
          )}
        >
          {!imageLoaded && (
            <div className="skeleton absolute inset-0" aria-hidden="true" />
          )}
          <img
            src={primaryImage?.url}
            alt={primaryImage?.alt ?? product.name}
            loading="lazy"
            decoding="async"
            onLoad={() => setImageLoaded(true)}
            className={cn(
              'h-full w-full object-cover transition-[opacity,transform] duration-700 ease-out',
              imageLoaded ? 'opacity-100' : 'opacity-0',
              'group-hover:scale-[1.06]',
              layout === 'wide' && 'aspect-[4/5]'
            )}
          />
          {/* Secondary image crossfades in on hover */}
          {hoverImage && hoverImage.id !== primaryImage?.id && (
            <img
              src={hoverImage.url}
              alt=""
              aria-hidden="true"
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            />
          )}

          {/* Badges */}
          <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
            {badge()}
            {!inStock && <Badge variant="outline">Sold Out</Badge>}
          </div>

          {/* Hover action rail */}
          <div className="absolute right-3 top-3 flex flex-col gap-2 opacity-0 transition-all duration-300 group-hover:opacity-100 focus-within:opacity-100">
            <button
              type="button"
              onClick={handleWishlist}
              aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
              aria-pressed={isInWishlist}
              className="flex h-9 w-9 items-center justify-center border border-[var(--border-color)] bg-[var(--bg-primary)]/90 text-[var(--text-primary)] backdrop-blur transition-colors hover:border-[var(--color-noir-gold)] hover:bg-[var(--color-noir-gold)] hover:text-[var(--brand-contrast-text,#0A0A0A)]"
            >
              <Heart className={cn('h-4 w-4', isInWishlist && 'fill-red-500 text-red-500')} />
            </button>
            {onQuickView && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onQuickView(product);
                }}
                aria-label={`Quick view ${product.name}`}
                className="flex h-9 w-9 items-center justify-center border border-[var(--border-color)] bg-[var(--bg-primary)]/90 text-[var(--text-primary)] backdrop-blur transition-colors hover:border-[var(--color-noir-gold)] hover:bg-[var(--color-noir-gold)] hover:text-[var(--brand-contrast-text,#0A0A0A)]"
              >
                <Eye className="h-4 w-4" />
              </button>
            )}
            <button
              type="button"
              onClick={handleCompare}
              aria-label={isInCompare ? 'Remove from compare' : 'Add to compare'}
              aria-pressed={isInCompare}
              className={cn(
                'flex h-9 w-9 items-center justify-center border border-[var(--border-color)] bg-[var(--bg-primary)]/90 backdrop-blur transition-colors hover:border-[var(--color-noir-gold)] hover:bg-[var(--color-noir-gold)] hover:text-[var(--brand-contrast-text,#0A0A0A)]',
                isInCompare ? 'text-[var(--color-noir-gold)] border-[var(--color-noir-gold)]' : 'text-[var(--text-primary)]'
              )}
            >
              <GitCompare className="h-4 w-4" />
            </button>
          </div>

          {/* Quick add — slides up on hover */}
          {inStock && (
            <div className="absolute inset-x-0 bottom-0 translate-y-full transition-transform duration-300 ease-out group-hover:translate-y-0 focus-within:translate-y-0">
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex h-11 w-full items-center justify-center gap-2 bg-[var(--text-primary)] font-heading text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--bg-primary)] transition-colors hover:bg-[var(--color-noir-gold)] hover:text-[var(--brand-contrast-text,#0A0A0A)]"
              >
                {justAdded ? (
                  <>
                    <Check className="h-3.5 w-3.5" /> Added
                  </>
                ) : (
                  <>
                    <ShoppingBag className="h-3.5 w-3.5" /> Quick Add
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* ─── Meta ─── */}
        <div className={cn('flex flex-1 flex-col gap-1.5', layout === 'wide' ? 'py-1' : 'pt-4')}>
          <p className="font-heading text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
            {product.brand}
          </p>
          <h3 className="text-sm font-medium leading-snug text-[var(--text-primary)] transition-colors group-hover:text-[var(--color-noir-gold)]">
            {product.name}
          </h3>
          <RatingStars rating={product.rating} count={product.reviewCount} size="sm" />
          <PriceDisplay
            price={product.price}
            originalPrice={product.originalPrice}
            discount={product.discount}
            size="sm"
            className="mt-0.5"
          />
          {product.colors && product.colors.length > 1 && (
            <div className="mt-1.5 flex items-center gap-1.5">
              {product.colors.slice(0, 4).map((color) => (
                <span
                  key={color.slug}
                  className="h-3 w-3 rounded-full border border-[var(--border-color)]"
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
              ))}
              {product.colors.length > 4 && (
                <span className="text-[10px] text-[var(--text-muted)]">
                  +{product.colors.length - 4}
                </span>
              )}
            </div>
          )}
          {product.stock > 0 && product.stock <= 10 && (
            <p className="mt-1 text-[11px] font-medium text-amber-600">
              Only {product.stock} left
            </p>
          )}
        </div>
      </Link>
    </motion.div>
  );
}

export const ProductCard = memo(ProductCardComponent);

/** Compact row version used in cart, wishlist, and order summaries. */
export function ProductCardMini({ product }: { product: Product }) {
  return (
    <Link
      to={`/product/${product.slug}`}
      className="group flex items-center gap-4 py-3 transition-colors"
    >
      <div className="h-16 w-14 shrink-0 overflow-hidden bg-[var(--bg-secondary)]">
        <img
          src={product.images[0]?.url}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-[var(--text-primary)]">{product.name}</p>
        <p className="text-xs text-[var(--text-muted)]">{product.brand}</p>
        <p className="mt-0.5 text-sm font-semibold text-[var(--text-primary)]">
          ${product.price.toFixed(2)}
        </p>
      </div>
    </Link>
  );
}
