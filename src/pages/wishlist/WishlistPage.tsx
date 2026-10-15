import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, ArrowRight, Trash2 } from 'lucide-react';
import { useWishlistStore } from '@/store/wishlistStore';
import { useCartStore } from '@/store/cartStore';
import { useToastStore } from '@/store/toastStore';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Dialog } from '@/components/ui/Dialog';
import { ProductCard } from '@/components/product/ProductCard';
import { QuickViewModal } from '@/components/product/QuickViewModal';
import { useSeo } from '@/hooks/useSeo';
import type { Product } from '@/types';

/** Wishlist page with add-all-to-bag and per-item removal. */
export default function WishlistPage() {
  useSeo({
    title: 'Wishlist',
    description: 'The pieces you have saved for later at AFRO & CO.',
  });

  const items = useWishlistStore((state) => state.items);
  const removeItem = useWishlistStore((state) => state.removeItem);
  const clearWishlist = useWishlistStore((state) => state.clearWishlist);

  const addItem = useCartStore((state) => state.addItem);
  const toast = useToastStore((state) => state.success);

  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);

  /** Adds everything that can be added without choosing a variant. */
  const addAllToBag = () => {
    let added = 0;
    let needsChoice = 0;

    items.forEach((product) => {
      if (product.stock <= 0) return;
      const needsSelection =
        !!product.sizes?.some((size) => size.available) || !!product.colors?.length;
      if (needsSelection) {
        needsChoice += 1;
        return;
      }
      addItem(product, 1);
      added += 1;
    });

    if (added > 0) toast('Added to bag', `${added} ${added === 1 ? 'piece' : 'pieces'}`);
    if (needsChoice > 0) {
      toast(
        'Some need a size',
        `${needsChoice} ${needsChoice === 1 ? 'piece needs' : 'pieces need'} a size or colour first.`
      );
    }
  };

  return (
    <>
      <section className="border-b border-[var(--border-color)] bg-[var(--bg-secondary)]">
        <div className="mx-auto max-w-[1600px] px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Wishlist' }]} />
          <div className="mt-5 flex flex-wrap items-end justify-between gap-6">
            <div>
              <h1 className="text-[clamp(2rem,6vw,4rem)] font-heading font-extrabold leading-[0.95] tracking-[-0.03em] text-[var(--text-primary)]">
                Wishlist
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-[var(--text-secondary)]">
                Saved pieces, kept safe between visits. Move them to your bag when you are ready.
              </p>
            </div>
            {items.length > 0 && (
              <p className="text-sm text-[var(--text-muted)]">
                {items.length} {items.length === 1 ? 'piece' : 'pieces'} saved
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
        {items.length === 0 ? (
          <EmptyState
            icon={<Heart className="h-7 w-7" />}
            title="Nothing saved yet"
            message="Tap the heart on any product to keep it here while you decide."
            action={
              <Button asChild size="lg">
                <Link to="/shop">Browse the collection</Link>
              </Button>
            }
            className="mx-auto max-w-lg"
          />
        ) : (
          <>
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border-color)] pb-6">
              <div className="flex flex-wrap gap-3">
                <Button onClick={addAllToBag}>
                  <ShoppingBag className="h-4 w-4" />
                  Add all to bag
                </Button>
                <Button asChild variant="outline">
                  <Link to="/compare">Compare saved</Link>
                </Button>
              </div>
              <button
                type="button"
                onClick={() => setConfirmClear(true)}
                className="font-heading text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)] transition-colors hover:text-red-500"
              >
                Clear wishlist
              </button>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-3 xl:grid-cols-4">
              {items.map((product, index) => (
                <div key={product.id} className="relative">
                  <ProductCard
                    product={product}
                    index={index}
                    onQuickView={(p) => setQuickViewProduct(p)}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      removeItem(product.id);
                      toast('Removed from wishlist', product.name);
                    }}
                    className="absolute right-2 bottom-2 z-10 flex h-9 w-9 items-center justify-center border border-[var(--border-color)] bg-[var(--bg-primary)]/90 text-[var(--text-muted)] backdrop-blur transition-colors hover:border-red-500 hover:text-red-500"
                    aria-label={`Remove ${product.name} from wishlist`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-14 flex justify-center">
              <Button asChild variant="outline" size="lg">
                <Link to="/shop">
                  Keep shopping
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </>
        )}
      </section>

      <QuickViewModal
        product={quickViewProduct}
        open={quickViewProduct !== null}
        onClose={() => setQuickViewProduct(null)}
      />

      <Dialog
        open={confirmClear}
        onClose={() => setConfirmClear(false)}
        title="Clear your wishlist?"
        description="All saved pieces will be removed."
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirmClear(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                clearWishlist();
                setConfirmClear(false);
                toast('Wishlist cleared');
              }}
            >
              Clear wishlist
            </Button>
          </>
        }
      >
        <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
          You have {items.length} {items.length === 1 ? 'piece' : 'pieces'} saved.
        </p>
      </Dialog>
    </>
  );
}
