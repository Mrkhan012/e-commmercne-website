import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useCartStore } from '@/store/cartStore';
import { useToastStore } from '@/store/toastStore';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatPrice } from '@/utils/format';

export interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const {
    items,
    subtotal,
    total,
    updateQuantity,
    removeItem,
    isOpen,
    closeCart,
  } = useCartStore();
  const toast = useToastStore((state) => state.info);

  const drawerOpen = open || isOpen;

  const handleClose = () => {
    closeCart();
    onClose();
  };

  const freeShippingThreshold = 200;
  const remaining = Math.max(0, freeShippingThreshold - subtotal);
  const progress = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  return (
    <AnimatePresence>
      {drawerOpen && (
        <div className="fixed inset-0 z-100">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            aria-hidden="true"
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 280 }}
            role="dialog"
            aria-modal="true"
            aria-label="Shopping bag"
            className="absolute right-0 top-0 bottom-0 flex w-full max-w-md flex-col border-l border-[var(--border-color)] bg-[var(--bg-primary)] shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[var(--border-color)] px-6 py-5">
              <h2 className="font-heading text-sm font-semibold uppercase tracking-[0.16em] text-[var(--text-primary)]">
                Your Bag ({items.reduce((sum, i) => sum + i.quantity, 0)})
              </h2>
              <button
                type="button"
                onClick={handleClose}
                aria-label="Close bag"
                className="p-1 text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
              >
                <Plus className="h-5 w-5 rotate-45" />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 items-center justify-center px-6">
                <EmptyState
                  icon={<ShoppingBag className="h-6 w-6" />}
                  title="Your bag is empty"
                  message="Discover our curated selection and add your first piece."
                  action={
                    <Button onClick={handleClose} asChild={false}>
                      <Link to="/shop" className="flex items-center gap-2">
                        Start Shopping <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  }
                  className="border-0"
                />
              </div>
            ) : (
              <>
                {/* Free shipping progress */}
                <div className="border-b border-[var(--border-color)] px-6 py-4">
                  {remaining > 0 ? (
                    <p className="text-xs text-[var(--text-secondary)]">
                      Add <span className="font-semibold">{formatPrice(remaining)}</span> more for
                      complimentary shipping
                    </p>
                  ) : (
                    <p className="text-xs font-medium text-emerald-600">
                      You have unlocked complimentary shipping
                    </p>
                  )}
                  <div className="mt-2 h-1 w-full bg-[var(--border-color)]">
                    <motion.div
                      className="h-full bg-[var(--color-noir-gold)]"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>
                </div>

                {/* Items */}
                <div className="flex-1 overflow-y-auto px-6">
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="flex gap-4 border-b border-[var(--border-color)] py-5">
                          <Link
                            to={`/product/${item.product.slug}`}
                            onClick={handleClose}
                            className="h-24 w-20 shrink-0 overflow-hidden bg-[var(--bg-secondary)]"
                          >
                            <img
                              src={item.product.images[0]?.url}
                              alt={item.product.name}
                              className="h-full w-full object-cover"
                            />
                          </Link>

                          <div className="flex min-w-0 flex-1 flex-col">
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <Link
                                  to={`/product/${item.product.slug}`}
                                  onClick={handleClose}
                                  className="block truncate text-sm font-medium text-[var(--text-primary)] hover:text-[var(--color-noir-gold)]"
                                >
                                  {item.product.name}
                                </Link>
                                <p className="mt-0.5 text-xs text-[var(--text-muted)]">
                                  {[item.selectedColor?.name, item.selectedSize?.label]
                                    .filter(Boolean)
                                    .join(' · ')}
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeItem(item.id)}
                                aria-label={`Remove ${item.product.name}`}
                                className="shrink-0 p-1 text-[var(--text-muted)] transition-colors hover:text-red-500"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>

                            <div className="mt-auto flex items-center justify-between">
                              <div className="flex items-center border border-[var(--border-color)]">
                                <button
                                  type="button"
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  aria-label="Decrease quantity"
                                  className="flex h-8 w-8 items-center justify-center text-[var(--text-primary)]"
                                >
                                  <Minus className="h-3 w-3" />
                                </button>
                                <span className="w-8 text-center text-xs font-medium text-[var(--text-primary)]">
                                  {item.quantity}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  disabled={item.quantity >= item.product.stock}
                                  aria-label="Increase quantity"
                                  className="flex h-8 w-8 items-center justify-center text-[var(--text-primary)] disabled:opacity-40"
                                >
                                  <Plus className="h-3 w-3" />
                                </button>
                              </div>
                              <span className="text-sm font-semibold text-[var(--text-primary)]">
                                {formatPrice(item.price * item.quantity)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Footer */}
                <div className="border-t border-[var(--border-color)] px-6 py-5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[var(--text-secondary)]">Subtotal</span>
                    <span className="font-heading text-lg font-bold text-[var(--text-primary)]">
                      {formatPrice(subtotal)}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-[var(--text-muted)]">
                    Taxes and shipping calculated at checkout. Estimated total{' '}
                    {formatPrice(total)}.
                  </p>

                  <div className="mt-4 flex flex-col gap-2">
                    <Link to="/checkout" onClick={handleClose} className="block">
                      <Button fullWidth size="lg">
                        Checkout <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      fullWidth
                      onClick={() => {
                        handleClose();
                        toast('Bag preserved', 'Your bag is saved for later.');
                      }}
                    >
                      Continue Shopping
                    </Button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
