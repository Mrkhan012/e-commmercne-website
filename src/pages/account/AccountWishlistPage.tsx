import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { useWishlistStore } from '@/store/wishlistStore';
import { useCartStore } from '@/store/cartStore';
import { useToastStore } from '@/store/toastStore';
import { formatPrice } from '@/utils/format';
import { useSeo } from '@/hooks/useSeo';
import { useReducedMotion } from '@/hooks/useUi';

export default function AccountWishlistPage() {
  useSeo({
    title: 'My Wishlist',
    description: 'Saved creations and future acquisitions in your private portfolio.',
  });

  const reduceMotion = useReducedMotion();
  const { items, removeItem } = useWishlistStore();
  const addItemToCart = useCartStore((state) => state.addItem);
  const toast = useToastStore();

  const handleMoveToBag = (product: (typeof items)[0]) => {
    addItemToCart(product, 1);
    removeItem(product.id);
    toast.success('Added to bag', `${product.name} moved to your shopping bag.`);
  };

  return (
    <motion.div
      initial={reduceMotion ? undefined : { opacity: 0, y: 10 }}
      animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div>
        <p className="font-heading text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
          Saved Portfolio
        </p>
        <h2 className="mt-1 font-heading text-2xl font-bold text-[var(--text-primary)]">
          Your Curated Pieces ({items.length})
        </h2>
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={<Heart className="h-10 w-10 text-[var(--color-noir-gold)]" />}
          title="Your wishlist is empty"
          message="Save pieces from the collection while exploring to keep track of your desired wardrobe."
          action={
            <Button asChild>
              <Link to="/shop">Discover Collection</Link>
            </Button>
          }
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((product) => (
            <div
              key={product.id}
              className="group flex flex-col justify-between border border-[var(--border-color)] bg-[var(--bg-card)] transition-colors hover:border-[var(--color-noir-gold)]"
            >
              <div>
                <div className="relative aspect-[3/4] overflow-hidden bg-[var(--bg-secondary)]">
                  <img
                    src={product.images[0]?.url}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      removeItem(product.id);
                      toast.info('Removed', `${product.name} removed from wishlist.`);
                    }}
                    className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-[var(--bg-card)]/90 text-red-500 backdrop-blur-sm transition-transform hover:scale-110"
                    aria-label="Remove item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="p-4">
                  <p className="font-heading text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                    {product.brand}
                  </p>
                  <Link
                    to={`/product/${product.slug}`}
                    className="mt-1 block font-heading text-sm font-bold text-[var(--text-primary)] hover:underline"
                  >
                    {product.name}
                  </Link>
                  <p className="mt-2 font-heading text-sm font-bold text-[var(--color-noir-gold)]">
                    {formatPrice(product.price)}
                  </p>
                </div>
              </div>

              <div className="p-4 pt-0">
                <Button
                  onClick={() => handleMoveToBag(product)}
                  className="w-full gap-2 text-xs uppercase tracking-wider"
                >
                  <ShoppingBag className="h-3.5 w-3.5" />
                  Move to Bag
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
