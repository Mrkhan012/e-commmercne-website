import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Funnel, Package, Search, X } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { useSeo } from '@/hooks/useSeo';
import { useReducedMotion } from '@/hooks/useUi';
import { useUserStore } from '@/store/userStore';
import { cn } from '@/utils/cn';
import { formatDate, formatPrice, pluralize } from '@/utils/format';
import type { Order, OrderStatus } from '@/types';

/* ─── Filter model ────────────────────────────────────────────────────────── */

type StatusFilter = 'all' | 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

const statusFilters: { id: StatusFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'pending', label: 'Pending' },
  { id: 'processing', label: 'Processing' },
  { id: 'shipped', label: 'Shipped' },
  { id: 'delivered', label: 'Delivered' },
  { id: 'cancelled', label: 'Cancelled' },
];

const statusLabels: Record<OrderStatus, string> = {
  pending: 'Pending',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  refunded: 'Refunded',
};

const badgeVariant = (status: OrderStatus): 'default' | 'outline' | 'gold' | 'best' => {
  switch (status) {
    case 'delivered':
      return 'gold';
    case 'cancelled':
      return 'outline';
    case 'refunded':
      return 'best';
    default:
      return 'default';
  }
};

const eyebrow =
  'font-heading text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]';

/* ─── Order history ───────────────────────────────────────────────────────── */

export default function OrdersPage() {
  useSeo({
    title: 'Order History',
    description:
      'Every NOIR & CO. order you have placed, with status, contents and totals in one searchable list.',
  });

  const orders = useUserStore((state) => state.orders);
  const reducedMotion = useReducedMotion();

  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return orders.filter((order) => {
      if (statusFilter !== 'all' && order.status !== statusFilter) return false;
      if (!needle) return true;

      const matchesOrderNumber = order.orderNumber.toLowerCase().includes(needle);
      const matchesProduct = order.items.some((item) =>
        item.productName.toLowerCase().includes(needle)
      );
      return matchesOrderNumber || matchesProduct;
    });
  }, [orders, statusFilter, query]);

  const counts = useMemo(() => {
    const map: Record<StatusFilter, number> = {
      all: orders.length,
      pending: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    };
    orders.forEach((order) => {
      const status = order.status as StatusFilter;
      if (status in map) map[status] += 1;
    });
    return map;
  }, [orders]);

  const hasActiveFilters = statusFilter !== 'all' || query.trim() !== '';

  const clearFilters = () => {
    setStatusFilter('all');
    setQuery('');
  };

  const reveal = (delay: number) => ({
    initial: reducedMotion ? undefined : { opacity: 0, y: 12 },
    whileInView: reducedMotion ? undefined : { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.4, delay, ease: [0.16, 1, 0.3, 1] as const },
  });

  return (
    <div className="flex flex-col gap-8">
      {/* ─── Header ─── */}
      <motion.header {...reveal(0)}>
        <p className={eyebrow}>Account</p>
        <h2 className="mt-3 text-[clamp(1.5rem,3vw,2rem)] font-heading font-extrabold tracking-[-0.02em] text-[var(--text-primary)]">
          Order History
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--text-secondary)]">
          {orders.length === 0
            ? 'Every order you place appears here with its contents, totals and delivery progress.'
            : `${pluralize(orders.length, 'order')} placed with NOIR & CO. — open any order for full tracking, receipts and returns.`}
        </p>
      </motion.header>

      {/* ─── Filters ─── */}
      <motion.div
        {...reveal(0.04)}
        className="flex flex-col gap-4 border border-[var(--border-color)] bg-[var(--bg-card)] p-5 lg:flex-row lg:items-end lg:justify-between"
      >
        <div className="min-w-0">
          <p className="flex items-center gap-2 font-heading text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
            <Funnel className="h-3.5 w-3.5" aria-hidden="true" />
            Filter by status
          </p>
          <div
            role="group"
            aria-label="Filter orders by status"
            className="mt-3 flex flex-wrap gap-2"
          >
            {statusFilters.map((filter) => {
              const isActive = statusFilter === filter.id;
              return (
                <button
                  key={filter.id}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setStatusFilter(filter.id)}
                  className={cn(
                    'border px-3.5 py-2 font-heading text-[10px] font-semibold uppercase tracking-[0.14em] transition-colors',
                    isActive
                      ? 'border-[var(--text-primary)] bg-[var(--text-primary)] text-[var(--bg-primary)]'
                      : 'border-[var(--border-color)] text-[var(--text-muted)] hover:border-[var(--text-primary)] hover:text-[var(--text-primary)]'
                  )}
                >
                  {filter.label}
                  <span className="ml-2 opacity-60">{counts[filter.id]}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="w-full lg:max-w-xs">
          <label
            htmlFor="order-search"
            className="mb-2 block font-heading text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]"
          >
            Search orders
          </label>
          <div className="relative flex items-center border border-[var(--border-color)] bg-[var(--bg-primary)] transition-colors focus-within:border-[var(--text-primary)]">
            <Search
              className="pointer-events-none absolute left-4 h-4 w-4 text-[var(--text-muted)]"
              aria-hidden="true"
            />
            <input
              id="order-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Order number or product"
              className="h-12 w-full bg-transparent pl-11 pr-4 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none"
            />
          </div>
        </div>
      </motion.div>

      {/* ─── Results ─── */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<Package className="h-5 w-5" aria-hidden="true" />}
          title={orders.length === 0 ? 'No orders yet' : 'No matching orders'}
          message={
            orders.length === 0
              ? 'When you place your first order it will appear here with tracking, receipts and returns.'
              : 'Nothing matches that status or search. Try a different filter or clear your search.'
          }
          action={
            orders.length === 0 ? (
              <Button asChild size="sm">
                <Link to="/shop">Browse the collection</Link>
              </Button>
            ) : (
              <Button size="sm" variant="outline" onClick={clearFilters}>
                <X className="h-3.5 w-3.5" aria-hidden="true" />
                Clear filters
              </Button>
            )
          }
        />
      ) : (
        <>
          <p className="text-xs text-[var(--text-muted)]" aria-live="polite">
            Showing {pluralize(filtered.length, 'order')}
            {hasActiveFilters ? ` of ${orders.length}` : ''}
          </p>

          <ul className="flex flex-col gap-5">
            {filtered.map((order, index) => (
              <OrderCard key={order.id} order={order} index={index} reduced={reducedMotion} />
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

/* ─── Order card ──────────────────────────────────────────────────────────── */

function OrderCard({
  order,
  index,
  reduced,
}: {
  order: Order;
  index: number;
  reduced: boolean;
}) {
  return (
    <motion.li
      initial={reduced ? undefined : { opacity: 0, y: 12 }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.25), ease: [0.16, 1, 0.3, 1] }}
      className="border border-[var(--border-color)] bg-[var(--bg-card)] transition-colors hover:border-[var(--text-primary)]"
    >
      <div className="flex flex-col gap-6 p-6 lg:flex-row lg:items-center">
        {/* Thumbnails */}
        <div className="flex shrink-0 items-center gap-2">
          {order.items.slice(0, 3).map((item) => (
            <span
              key={`${order.id}-${item.productId}`}
              className="h-20 w-16 shrink-0 overflow-hidden bg-[var(--bg-secondary)]"
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
            <span className="font-heading text-xs text-[var(--text-muted)]">
              +{order.items.length - 3}
            </span>
          )}
        </div>

        {/* Details */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="font-heading text-sm font-bold text-[var(--text-primary)]">
              {order.orderNumber}
            </h3>
            <Badge variant={badgeVariant(order.status)}>{statusLabels[order.status]}</Badge>
          </div>

          <p className="mt-2 text-xs text-[var(--text-muted)]">
            Placed {formatDate(order.createdAt, 'long')} ·{' '}
            {pluralize(order.items.length, 'item')} · Ships to {order.shippingAddress.city},{' '}
            {order.shippingAddress.state}
          </p>

          <p className="mt-3 truncate text-xs text-[var(--text-secondary)]">
            {order.items.map((item) => item.productName).join(' · ')}
          </p>

          {order.trackingNumber && (
            <p className="mt-2 text-[11px] text-[var(--text-muted)]">
              Tracking {order.trackingNumber}
            </p>
          )}
        </div>

        {/* Total + link */}
        <div className="flex shrink-0 flex-col items-start gap-3 lg:items-end">
          <p className="font-heading text-lg font-bold text-[var(--text-primary)]">
            {formatPrice(order.total)}
          </p>
          <Button asChild size="sm" variant="outline">
            <Link to={`/account/orders/${order.id}`}>View order</Link>
          </Button>
        </div>
      </div>
    </motion.li>
  );
}
