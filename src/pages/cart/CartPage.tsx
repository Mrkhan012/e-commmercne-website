import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Trash2,
  ShoppingBag,
  ArrowRight,
  Tag,
  ShieldCheck,
  RotateCcw,
  Truck,
  X,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useToastStore } from '@/store/toastStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Dialog } from '@/components/ui/Dialog';
import { EmptyState } from '@/components/ui/EmptyState';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { formatPrice } from '@/utils/format';
import { useSeo } from '@/hooks/useSeo';
import { useReducedMotion } from '@/hooks/useUi';

const TRUST = [
  { icon: Truck, label: 'Free shipping over $200' },
  { icon: RotateCcw, label: '30-day free returns' },
  { icon: ShieldCheck, label: 'Secure checkout' },
];

/** Shopping cart page with quantity controls, coupons, and an order summary. */
export default function CartPage() {
  useSeo({
    title: 'Shopping Bag',
    description: 'Review the pieces in your bag, apply a coupon, and continue to checkout.',
  });

  const reduceMotion = useReducedMotion();
  const {
    items,
    subtotal,
    discount,
    shipping,
    tax,
    total,
    couponCode,
    couponError,
    updateQuantity,
    removeItem,
    clearCart,
    applyCoupon,
    removeCoupon,
  } = useCartStore();

  const toggleWishlist = useWishlistStore((state) => state.toggleItem);
  const toast = useToastStore((state) => state.success);

  const [couponInput, setCouponInput] = useState('');
  const [confirmClear, setConfirmClear] = useState(false);
  const [pendingRemoval, setPendingRemoval] = useState<string | null>(null);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const freeShippingRemaining = Math.max(0, 200 - subtotal);

  const handleApplyCoupon = () => {
    const code = couponInput.trim();
    if (!code) return;
    if (applyCoupon(code)) {
      toast('Coupon applied', code.toUpperCase());
      setCouponInput('');
    }
  };

  const confirmRemove = (itemId: string) => setPendingRemoval(itemId);

  const executeRemove = () => {
    if (!pendingRemoval) return;
    const item = items.find((i) => i.id === pendingRemoval);
    removeItem(pendingRemoval);
    if (item) toast('Removed from bag', item.product.name);
    setPendingRemoval(null);
  };

  const pendingItem = items.find((i) => i.id === pendingRemoval);

  const summaryRows = [
    { label: 'Subtotal', value: formatPrice(subtotal) },
    ...(discount > 0
      ? [{ label: `Discount${couponCode ? ` (${couponCode})` : ''}`, value: `−${formatPrice(discount)}` }]
      : []),
    {
      label: 'Shipping',
      value: shipping === 0 ? 'Free' : formatPrice(shipping),
      note:
        shipping === 0 && subtotal > 0
          ? 'Complimentary on this order'
          : 'Calculated for standard delivery',
    },
    { label: 'Estimated tax', value: formatPrice(tax) },
  ];

  return (
    <>
      <section className="border-b border-[var(--border-color)] bg-[var(--bg-secondary)]">
        <div className="mx-auto max-w-[1600px] px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Shopping Bag' }]} />
          <div className="mt-5 flex flex-wrap items-end justify-between gap-6">
            <h1 className="text-[clamp(2rem,6vw,4rem)] font-heading font-extrabold leading-[0.95] tracking-[-0.03em] text-[var(--text-primary)]">
              Your Bag
            </h1>
            {items.length > 0 && (
              <p className="text-sm text-[var(--text-muted)]">
                {itemCount} {itemCount === 1 ? 'piece' : 'pieces'}
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
        {items.length === 0 ? (
          <EmptyState
            icon={<ShoppingBag className="h-7 w-7" />}
            title="Your bag is empty"
            message="Nothing here yet. Explore the collection and add the pieces you keep coming back to."
            action={
              <Button asChild size="lg">
                <Link to="/shop">Start shopping</Link>
              </Button>
            }
            className="mx-auto max-w-lg"
          />
        ) : (
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            {/* ─── Items ─── */}
            <div className="lg:col-span-7 xl:col-span-8">
              {/* Free shipping progress */}
              <div className="border border-[var(--border-color)] bg-[var(--bg-card)] p-5">
                <p className="text-xs text-[var(--text-secondary)]">
                  {freeShippingRemaining > 0 ? (
                    <>
                      Add <span className="font-semibold text-[var(--text-primary)]">{formatPrice(freeShippingRemaining)}</span>{' '}
                      more for complimentary shipping
                    </>
                  ) : (
                    <span className="font-medium text-emerald-600">
                      You have unlocked complimentary shipping
                    </span>
                  )}
                </p>
                <div className="mt-3 h-1 w-full bg-[var(--border-color)]">
                  <motion.div
                    className="h-full bg-[var(--color-noir-gold)]"
                    initial={reduceMotion ? { width: '100%' } : { width: 0 }}
                    animate={{ width: `${Math.min(100, (subtotal / 200) * 100)}%` }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>
              </div>

              <ul className="mt-8">
                <AnimatePresence initial={false}>
                  {items.map((item) => (
                    <motion.li
                      key={item.id}
                      layout
                      initial={reduceMotion ? {} : { opacity: 0, height: 0 }}
                      animate={reduceMotion ? {} : { opacity: 1, height: 'auto' }}
                      exit={reduceMotion ? {} : { opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden border-b border-[var(--border-color)] first:border-t"
                    >
                      <div className="flex gap-4 py-6 sm:gap-6">
                        <Link
                          to={`/product/${item.product.slug}`}
                          className="h-28 w-24 shrink-0 bg-[var(--bg-secondary)] sm:h-32 sm:w-28"
                        >
                          <img
                            src={item.product.images[0]?.url}
                            alt={item.product.name}
                            className="h-full w-full object-cover"
                          />
                        </Link>

                        <div className="flex min-w-0 flex-1 flex-col">
                          <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0">
                              <p className="font-heading text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
                                {item.product.brand}
                              </p>
                              <Link
                                to={`/product/${item.product.slug}`}
                                className="mt-1 block text-sm font-medium leading-snug text-[var(--text-primary)] transition-colors hover:text-[var(--color-noir-gold)] sm:text-base"
                              >
                                {item.product.name}
                              </Link>
                              {(item.selectedColor || item.selectedSize) && (
                                <p className="mt-1.5 text-xs text-[var(--text-muted)]">
                                  {[item.selectedColor?.name, item.selectedSize?.label]
                                    .filter(Boolean)
                                    .join(' · ')}
                                </p>
                              )}
                            </div>
                            <p className="shrink-0 font-heading text-sm font-semibold text-[var(--text-primary)]">
                              {formatPrice(item.price * item.quantity)}
                            </p>
                          </div>

                          <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-4">
                            <div className="flex items-center border border-[var(--border-color)]">
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                aria-label={`Decrease quantity of ${item.product.name}`}
                                className="flex h-9 w-9 items-center justify-center text-[var(--text-primary)] transition-colors hover:bg-[var(--bg-secondary)]"
                              >
                                −
                              </button>
                              <span className="w-10 text-center text-sm font-medium text-[var(--text-primary)]">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                disabled={item.quantity >= item.product.stock}
                                aria-label={`Increase quantity of ${item.product.name}`}
                                className="flex h-9 w-9 items-center justify-center text-[var(--text-primary)] transition-colors hover:bg-[var(--bg-secondary)] disabled:opacity-40"
                              >
                                +
                              </button>
                            </div>

                            <div className="flex items-center gap-4">
                              <button
                                type="button"
                                onClick={() => {
                                  toggleWishlist(item.product);
                                  toast('Saved for later', item.product.name);
                                }}
                                className="font-heading text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
                              >
                                Save for later
                              </button>
                              <button
                                type="button"
                                onClick={() => confirmRemove(item.id)}
                                aria-label={`Remove ${item.product.name}`}
                                className="text-[var(--text-muted)] transition-colors hover:text-red-500"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                <Button asChild variant="ghost">
                  <Link to="/shop">Continue shopping</Link>
                </Button>
                <button
                  type="button"
                  onClick={() => setConfirmClear(true)}
                  className="font-heading text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)] transition-colors hover:text-red-500"
                >
                  Clear bag
                </button>
              </div>
            </div>

            {/* ─── Summary ─── */}
            <aside className="lg:col-span-5 xl:col-span-4">
              <div className="lg:sticky lg:top-28">
                <div className="border border-[var(--border-color)] bg-[var(--bg-card)] p-6 sm:p-8">
                  <h2 className="font-heading text-sm font-semibold uppercase tracking-[0.16em] text-[var(--text-primary)]">
                    Order Summary
                  </h2>

                  {/* Coupon */}
                  <div className="mt-6 border-b border-[var(--border-color)] pb-6">
                    {couponCode ? (
                      <div className="flex items-center justify-between gap-3 border border-[var(--color-noir-gold)] px-4 py-3">
                        <p className="flex items-center gap-2 text-xs text-[var(--text-primary)]">
                          <Tag className="h-3.5 w-3.5 text-[var(--color-noir-gold)]" aria-hidden="true" />
                          <span className="font-semibold">{couponCode}</span> applied
                        </p>
                        <button
                          type="button"
                          onClick={removeCoupon}
                          aria-label="Remove coupon"
                          className="text-[var(--text-muted)] transition-colors hover:text-red-500"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <label htmlFor="cart-coupon" className="sr-only">
                          Coupon code
                        </label>
                        <div className="flex gap-2">
                          <Input
                            id="cart-coupon"
                            value={couponInput}
                            onChange={(e) => setCouponInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                            placeholder="Coupon code"
                            leading={<Tag className="h-3.5 w-3.5" />}
                          />
                          <Button variant="outline" onClick={handleApplyCoupon} className="shrink-0">
                            Apply
                          </Button>
                        </div>
                        <p className="mt-2 text-xs text-[var(--text-muted)]">
                          Try <span className="font-semibold text-[var(--text-primary)]">NOIR10</span>{' '}
                          or{' '}
                          <span className="font-semibold text-[var(--text-primary)]">WELCOME15</span>
                        </p>
                      </>
                    )}
                    {couponError && (
                      <p role="alert" className="mt-2 text-xs font-medium text-red-500">
                        {couponError}
                      </p>
                    )}
                  </div>

                  {/* Totals */}
                  <dl className="mt-6 space-y-3">
                    {summaryRows.map((row) => (
                      <div key={row.label} className="flex items-baseline justify-between gap-4">
                        <dt className="text-sm text-[var(--text-secondary)]">
                          {row.label}
                          {'note' in row && row.note && (
                            <span className="mt-0.5 block text-xs text-[var(--text-muted)]">
                              {row.note}
                            </span>
                          )}
                        </dt>
                        <dd className="text-sm font-medium text-[var(--text-primary)]">
                          {row.value}
                        </dd>
                      </div>
                    ))}
                    <div className="flex items-baseline justify-between gap-4 border-t border-[var(--border-color)] pt-4">
                      <dt className="font-heading text-sm font-semibold uppercase tracking-[0.14em] text-[var(--text-primary)]">
                        Total
                      </dt>
                      <dd className="font-heading text-2xl font-bold text-[var(--text-primary)]">
                        {formatPrice(total)}
                      </dd>
                    </div>
                  </dl>

                  <Button asChild fullWidth size="lg" className="mt-7">
                    <Link to="/checkout">
                      Proceed to Checkout
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>

                  <p className="mt-4 text-center text-xs text-[var(--text-muted)]">
                    Shipping and tax are estimated. Final totals are confirmed at checkout.
                  </p>
                </div>

                {/* Trust row */}
                <ul className="mt-6 grid gap-px border border-[var(--border-color)] bg-[var(--border-color)] sm:grid-cols-3 lg:grid-cols-1">
                  {TRUST.map((item) => (
                    <li
                      key={item.label}
                      className="flex items-center gap-3 bg-[var(--bg-card)] px-4 py-3"
                    >
                      <item.icon className="h-4 w-4 shrink-0 text-[var(--color-noir-gold)]" aria-hidden="true" />
                      <span className="text-xs text-[var(--text-secondary)]">{item.label}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        )}
      </section>

      {/* ─── Confirm removal ─── */}
      <Dialog
        open={pendingRemoval !== null}
        onClose={() => setPendingRemoval(null)}
        title="Remove this item?"
        description={
          pendingItem
            ? `${pendingItem.product.name} will be removed from your bag.`
            : undefined
        }
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setPendingRemoval(null)}>
              Keep it
            </Button>
            <Button variant="danger" onClick={executeRemove}>
              Remove
            </Button>
          </>
        }
      >
        <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
          You can add it again at any time from the product page.
        </p>
      </Dialog>

      {/* ─── Confirm clear bag ─── */}
      <Dialog
        open={confirmClear}
        onClose={() => setConfirmClear(false)}
        title="Clear your bag?"
        description="All items will be removed. This cannot be undone."
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirmClear(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                clearCart();
                setConfirmClear(false);
                toast('Bag cleared');
              }}
            >
              Clear bag
            </Button>
          </>
        }
      >
        <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
          You have {itemCount} {itemCount === 1 ? 'piece' : 'pieces'} in your bag.
        </p>
      </Dialog>
    </>
  );
}
