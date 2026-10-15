import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowRight,
  Award,
  Coins,
  Heart,
  LifeBuoy,
  MapPin,
  Package,
  Pencil,
  Truck,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { StatCard } from '@/components/dashboard/StatCard';
import { ProductCard } from '@/components/product/ProductCard';
import { useSeo } from '@/hooks/useSeo';
import { useReducedMotion } from '@/hooks/useUi';
import { useRecentlyViewedStore } from '@/store/recentlyViewedStore';
import { useUserStore } from '@/store/userStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { formatDate, formatPrice, pluralize } from '@/utils/format';

/* ─── Small helpers ───────────────────────────────────────────────────────── */

const eyebrow =
  'font-heading text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]';

const card = 'border border-[var(--border-color)] bg-[var(--bg-card)] p-6';

const statusTone: Record<string, string> = {
  pending: 'text-amber-600',
  processing: 'text-[var(--color-noir-gold)]',
  shipped: 'text-sky-600',
  delivered: 'text-emerald-600',
  cancelled: 'text-red-500',
  refunded: 'text-[var(--text-muted)]',
};

const statusLabel: Record<string, string> = {
  pending: 'Pending',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  refunded: 'Refunded',
};

/* ─── Dashboard ───────────────────────────────────────────────────────────── */

export default function DashboardPage() {
  useSeo({
    title: 'Dashboard',
    description:
      'Your AFRO & CO. account dashboard: recent orders, saved pieces, loyalty points and quick actions.',
  });

  const reducedMotion = useReducedMotion();
  const { user, orders, addresses } = useUserStore();
  const wishlistItems = useWishlistStore((state) => state.items);
  const recentlyViewed = useRecentlyViewedStore((state) => state.items);

  const firstName = user?.firstName ?? 'there';
  const loyaltyPoints = 2480;
  const recentOrders = orders.slice(0, 3);

  const quickActions = [
    {
      label: 'Track order',
      description: 'Follow a parcel in real time',
      icon: <Truck className="h-4 w-4" aria-hidden="true" />,
      to: '/track-order',
    },
    {
      label: 'Edit profile',
      description: 'Name, email and phone',
      icon: <Pencil className="h-4 w-4" aria-hidden="true" />,
      to: '/account/profile',
    },
    {
      label: 'Manage addresses',
      description: 'Delivery and billing',
      icon: <MapPin className="h-4 w-4" aria-hidden="true" />,
      to: '/account/addresses',
    },
    {
      label: 'Contact support',
      description: 'We reply within a day',
      icon: <LifeBuoy className="h-4 w-4" aria-hidden="true" />,
      to: '/account/support',
    },
  ];

  const reveal = (delay: number) => ({
    initial: reducedMotion ? undefined : { opacity: 0, y: 12 },
    whileInView: reducedMotion ? undefined : { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.4, delay, ease: [0.16, 1, 0.3, 1] as const },
  });

  return (
    <div className="flex flex-col gap-12">
      {/* ─── Welcome ─── */}
      <motion.header {...reveal(0)}>
        <p className={eyebrow}>Dashboard</p>
        <h2 className="mt-3 text-[clamp(1.5rem,3vw,2rem)] font-heading font-extrabold tracking-[-0.02em] text-[var(--text-primary)]">
          Good morning, {firstName}
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--text-secondary)]">
          Here is where your AFRO &amp; CO. account stands today. Pick up an order, revisit a
          piece you were considering, or adjust how we stay in touch.
        </p>
      </motion.header>

      {/* ─── Stat tiles ─── */}
      <section aria-labelledby="account-stats" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <h2 id="account-stats" className="sr-only">
          Account summary
        </h2>
        <motion.div {...reveal(0.02)}>
          <StatCard
            label="Total orders"
            value={String(orders.length)}
            icon={<Package className="h-4 w-4" aria-hidden="true" />}
            hint={
              orders.length > 0
                ? `${pluralize(orders.length, 'order')} placed with us`
                : 'No orders yet'
            }
          />
        </motion.div>
        <motion.div {...reveal(0.06)}>
          <StatCard
            label="Wishlist items"
            value={String(wishlistItems.length)}
            icon={<Heart className="h-4 w-4" aria-hidden="true" />}
            hint={
              wishlistItems.length > 0
                ? `${pluralize(wishlistItems.length, 'piece')} saved for later`
                : 'Save pieces you love'
            }
          />
        </motion.div>
        <motion.div {...reveal(0.1)}>
          <StatCard
            label="Saved addresses"
            value={String(addresses.length)}
            icon={<MapPin className="h-4 w-4" aria-hidden="true" />}
            hint={
              addresses.length > 0
                ? `${pluralize(addresses.length, 'address', 'addresses')} on file`
                : 'Add a delivery address'
            }
          />
        </motion.div>
        <motion.div {...reveal(0.14)}>
          <StatCard
            label="Loyalty points"
            value={loyaltyPoints.toLocaleString('en-US')}
            icon={<Coins className="h-4 w-4" aria-hidden="true" />}
            hint="Worth $24.80 toward your next order"
          />
        </motion.div>
      </section>

      {/* ─── Recent orders ─── */}
      <motion.section {...reveal(0.04)} aria-labelledby="recent-orders">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className={eyebrow}>Order history</p>
            <h2
              id="recent-orders"
              className="mt-2 font-heading text-xl font-bold tracking-[-0.01em] text-[var(--text-primary)]"
            >
              Recent Orders
            </h2>
          </div>
          <Button asChild variant="ghost" size="sm">
            <Link to="/account/orders">
              View all orders
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </Button>
        </div>

        {recentOrders.length === 0 ? (
          <div className="mt-6">
            <EmptyState
              icon={<Package className="h-5 w-5" aria-hidden="true" />}
              title="No orders yet"
              message="Your placed orders will appear here with tracking, receipts and returns."
              action={
                <Button asChild size="sm">
                  <Link to="/shop">Start shopping</Link>
                </Button>
              }
            />
          </div>
        ) : (
          <ul className="mt-6 flex flex-col gap-4">
            {recentOrders.map((order) => (
              <li key={order.id}>
                <Link
                  to={`/account/orders/${order.id}`}
                  className={`${card} flex flex-col gap-5 transition-colors hover:border-[var(--text-primary)] sm:flex-row sm:items-center`}
                >
                  {/* Thumbnails */}
                  <div className="flex shrink-0 items-center gap-2">
                    {order.items.slice(0, 3).map((item) => (
                      <span
                        key={`${order.id}-${item.productId}`}
                        className="h-16 w-14 shrink-0 overflow-hidden bg-[var(--bg-secondary)]"
                      >
                        <img
                          src={item.productImage}
                          alt={item.productName}
                          loading="lazy"
                          className="h-full w-full object-cover"
                        />
                      </span>
                    ))}
                    {order.items.length > 3 && (
                      <span className="text-xs text-[var(--text-muted)]">
                        +{order.items.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Meta */}
                  <div className="min-w-0 flex-1">
                    <p className="font-heading text-sm font-bold text-[var(--text-primary)]">
                      {order.orderNumber}
                    </p>
                    <p className="mt-1 text-xs text-[var(--text-muted)]">
                      {formatDate(order.createdAt, 'long')} ·{' '}
                      {pluralize(order.items.length, 'item')}
                    </p>
                    <p
                      className={`mt-2 font-heading text-[10px] font-semibold uppercase tracking-[0.2em] ${statusTone[order.status] ?? 'text-[var(--text-secondary)]'}`}
                    >
                      {statusLabel[order.status] ?? order.status}
                    </p>
                  </div>

                  <p className="shrink-0 font-heading text-lg font-bold text-[var(--text-primary)]">
                    {formatPrice(order.total)}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </motion.section>

      {/* ─── Quick actions ─── */}
      <motion.section {...reveal(0.04)} aria-labelledby="quick-actions">
        <p className={eyebrow}>Shortcuts</p>
        <h2
          id="quick-actions"
          className="mt-2 font-heading text-xl font-bold tracking-[-0.01em] text-[var(--text-primary)]"
        >
          Quick Actions
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              to={action.to}
              className={`${card} group flex flex-col gap-3 transition-colors hover:border-[var(--text-primary)]`}
            >
              <span className="flex h-9 w-9 items-center justify-center bg-[var(--bg-secondary)] text-[var(--color-noir-gold)] transition-colors group-hover:bg-[var(--color-noir-gold)] group-hover:text-[var(--color-noir-black)]">
                {action.icon}
              </span>
              <span className="font-heading text-sm font-semibold text-[var(--text-primary)]">
                {action.label}
              </span>
              <span className="text-xs leading-relaxed text-[var(--text-muted)]">
                {action.description}
              </span>
            </Link>
          ))}
        </div>
      </motion.section>

      {/* ─── Recently viewed ─── */}
      <motion.section {...reveal(0.04)} aria-labelledby="recently-viewed">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className={eyebrow}>Browsing history</p>
            <h2
              id="recently-viewed"
              className="mt-2 font-heading text-xl font-bold tracking-[-0.01em] text-[var(--text-primary)]"
            >
              Recently Viewed
            </h2>
          </div>
          <span className="inline-flex items-center gap-2 border border-[var(--color-noir-gold)] px-2.5 py-1 font-heading text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--color-noir-gold)]">
            <Award className="h-3 w-3" aria-hidden="true" />
            {loyaltyPoints.toLocaleString('en-US')} points
          </span>
        </div>

        {recentlyViewed.length === 0 ? (
          <div className="mt-6">
            <EmptyState
              icon={<Heart className="h-5 w-5" aria-hidden="true" />}
              title="Nothing viewed yet"
              message="Pieces you open will be collected here so you can pick them back up."
              action={
                <Button asChild size="sm">
                  <Link to="/shop">Browse the collection</Link>
                </Button>
              }
            />
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-3 xl:grid-cols-4">
            {recentlyViewed.slice(0, 4).map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        )}
      </motion.section>
    </div>
  );
}
