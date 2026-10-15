import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  CircleCheck,
  CircleDot,
  Clock,
  CreditCard,
  LifeBuoy,
  MapPin,
  Package,
  PackageCheck,
  Receipt,
  Truck,
} from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { getProductById } from '@/data/products';
import { useSeo } from '@/hooks/useSeo';
import { useReducedMotion } from '@/hooks/useUi';
import { useUserStore } from '@/store/userStore';
import { cn } from '@/utils/cn';
import { formatDate, formatDateTime, formatPrice, pluralize } from '@/utils/format';
import { slugify } from '@/utils/format';
import type { Order, PaymentMethod } from '@/types';

/* ─── Lookups ─────────────────────────────────────────────────────────────── */

const paymentLabels: Record<PaymentMethod, string> = {
  card: 'Credit or debit card',
  paypal: 'PayPal',
  'apple-pay': 'Apple Pay',
  'google-pay': 'Google Pay',
  cod: 'Cash on delivery',
  'purchase-order': 'Commercial Purchase Order (Net-30)',
  wire: 'Direct Bank Wire Remittance',
};

const paymentDetails: Record<PaymentMethod, string> = {
  card: 'Visa ending in 4218 · authorised at checkout',
  paypal: 'Paid via your PayPal balance',
  'apple-pay': 'Paid with Apple Pay',
  'google-pay': 'Paid with Google Pay',
  cod: 'Pay the courier on arrival',
  'purchase-order': 'Billed to corporate dealer account with Net-30 remittance terms',
  wire: 'Direct bank wire transfer to JPMorgan Chase atelier account',
};

const eyebrow =
  'font-heading text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]';

const card = 'border border-[var(--border-color)] bg-[var(--bg-card)] p-6';

const label = 'font-heading text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]';

/** Order items only store an id + name, so resolve the catalog slug for links. */
const productSlug = (productId: string, productName: string): string => {
  const product = getProductById(productId);
  return product?.slug ?? slugify(productName);
};

/* ─── Order detail ────────────────────────────────────────────────────────── */

export default function OrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>();

  useSeo({
    title: 'Order Details',
    description:
      'Full details for a single AFRO & CO. order: delivery tracking, items, payment method and totals.',
  });

  const orders = useUserStore((state) => state.orders);
  const getOrder = useUserStore((state) => state.getOrder);
  const reducedMotion = useReducedMotion();

  const order: Order | undefined = useMemo(
    () => (orderId ? getOrder(orderId) : undefined),
    [orderId, orders, getOrder]
  );

  const reveal = (delay: number) => ({
    initial: reducedMotion ? undefined : { opacity: 0, y: 12 },
    whileInView: reducedMotion ? undefined : { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.4, delay, ease: [0.16, 1, 0.3, 1] as const },
  });

  /* ─── Missing order ─── */
  if (!order) {
    return (
      <div className="flex flex-col gap-8">
        <Breadcrumbs
          items={[{ label: 'Account', href: '/account' }, { label: 'Orders', href: '/account/orders' }, { label: 'Not found' }]}
        />
        <EmptyState
          icon={<Package className="h-5 w-5" aria-hidden="true" />}
          title="We can't find that order"
          message="The order you are looking for may have been placed on another account, or the link may be out of date. Your full order history is one click away."
          action={
            <div className="flex flex-col items-center gap-3 sm:flex-row">
              <Button asChild size="sm">
                <Link to="/account/orders">Back to order history</Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link to="/account/support">Contact support</Link>
              </Button>
            </div>
          }
        />
      </div>
    );
  }

  const isCancelled = order.status === 'cancelled';
  const currentStep = order.timeline.length;

  return (
    <div className="flex flex-col gap-10">
      {/* ─── Header ─── */}
      <motion.header {...reveal(0)} className="flex flex-col gap-5">
        <Breadcrumbs
          items={[
            { label: 'Account', href: '/account' },
            { label: 'Orders', href: '/account/orders' },
            { label: order.orderNumber },
          ]}
        />
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <p className={eyebrow}>Order {order.orderNumber}</p>
            <h2 className="mt-3 text-[clamp(1.5rem,3vw,2rem)] font-heading font-extrabold tracking-[-0.02em] text-[var(--text-primary)]">
              {pluralize(order.items.length, 'item')} · {formatPrice(order.total)}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
              Placed {formatDate(order.createdAt, 'long')}
              {order.estimatedDelivery && !isCancelled
                ? ` · Estimated delivery ${formatDate(order.estimatedDelivery, 'long')}`
                : ''}
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
            <Button asChild variant="outline" size="sm">
              <Link to={`/track-order?order=${encodeURIComponent(order.orderNumber)}`}>
                <Truck className="h-3.5 w-3.5" aria-hidden="true" />
                Track shipment
              </Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link to="/account/support">
                <LifeBuoy className="h-3.5 w-3.5" aria-hidden="true" />
                Need help?
              </Link>
            </Button>
          </div>
        </div>
      </motion.header>

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        {/* ─── Tracking timeline ─── */}
        <motion.section
          {...reveal(0.04)}
          aria-labelledby="tracking-timeline"
          className={card}
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className={eyebrow}>Delivery progress</p>
              <h3
                id="tracking-timeline"
                className="mt-2 font-heading text-lg font-bold text-[var(--text-primary)]"
              >
                Tracking Timeline
              </h3>
            </div>
            {order.trackingNumber && (
              <div className="text-left sm:text-right">
                <p className={label}>Tracking number</p>
                <p className="mt-1 font-heading text-sm font-semibold text-[var(--text-primary)]">
                  {order.trackingNumber}
                </p>
              </div>
            )}
          </div>

          {order.timeline.length === 0 ? (
            <p className="mt-6 text-sm text-[var(--text-muted)]">
              No tracking events have been recorded for this order yet.
            </p>
          ) : (
            <ol className="mt-8">
              {order.timeline.map((event, index) => {
                const isLast = index === order.timeline.length - 1;
                const isCurrent = index === currentStep - 1;
                const isPast = index < currentStep - 1;

                return (
                  <li key={`${event.status}-${event.timestamp}`} className="flex gap-5">
                    {/* Rail */}
                    <div className="flex flex-col items-center">
                      <span
                        className={cn(
                          'flex h-9 w-9 shrink-0 items-center justify-center rounded-full border',
                          isCurrent
                            ? 'border-[var(--color-noir-gold)] bg-[var(--color-noir-gold)] text-[var(--color-noir-black)]'
                            : isPast
                              ? 'border-[var(--color-noir-gold)] text-[var(--color-noir-gold)]'
                              : 'border-[var(--border-color)] text-[var(--text-muted)]'
                        )}
                      >
                        {isCurrent ? (
                          <CircleDot className="h-4 w-4" aria-hidden="true" />
                        ) : isPast ? (
                          <CircleCheck className="h-4 w-4" aria-hidden="true" />
                        ) : (
                          <Clock className="h-4 w-4" aria-hidden="true" />
                        )}
                      </span>
                      {!isLast && (
                        <span
                          aria-hidden="true"
                          className={cn(
                            'w-px flex-1',
                            isPast || isCurrent
                              ? 'bg-[var(--color-noir-gold)]'
                              : 'bg-[var(--border-color)]'
                          )}
                        />
                      )}
                    </div>

                    {/* Event */}
                    <div className={cn('min-w-0 flex-1', isLast ? 'pb-0' : 'pb-8')}>
                      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <h4 className="font-heading text-sm font-semibold text-[var(--text-primary)]">
                          {event.label}
                        </h4>
                        {isCurrent && (
                          <span className="font-heading text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--color-noir-gold)]">
                            Current status
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-xs text-[var(--text-muted)]">
                        {formatDateTime(event.timestamp)}
                      </p>
                      {event.description && (
                        <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                          {event.description}
                        </p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
        </motion.section>

        {/* ─── Delivery + payment ─── */}
        <div className="flex flex-col gap-8">
          <motion.section {...reveal(0.08)} aria-labelledby="delivery-address" className={card}>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-[var(--color-noir-gold)]" aria-hidden="true" />
              <h3 id="delivery-address" className="font-heading text-sm font-bold uppercase tracking-[0.14em] text-[var(--text-primary)]">
                Delivery address
              </h3>
            </div>
            <address className="mt-4 text-sm not-italic leading-relaxed text-[var(--text-secondary)]">
              <span className="block font-semibold text-[var(--text-primary)]">
                {order.shippingAddress.firstName} {order.shippingAddress.lastName}
              </span>
              {order.shippingAddress.line1}
              {order.shippingAddress.line2 && (
                <>
                  <br />
                  {order.shippingAddress.line2}
                </>
              )}
              <br />
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
              <br />
              {order.shippingAddress.country}
              {order.shippingAddress.phone && (
                <>
                  <br />
                  <span className="text-[var(--text-muted)]">{order.shippingAddress.phone}</span>
                </>
              )}
            </address>
            <p className="mt-4 border-t border-[var(--border-color)] pt-4 text-xs text-[var(--text-muted)]">
              Billing address is the same as delivery.
            </p>
          </motion.section>

          <motion.section {...reveal(0.12)} aria-labelledby="payment-method" className={card}>
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-[var(--color-noir-gold)]" aria-hidden="true" />
              <h3 id="payment-method" className="font-heading text-sm font-bold uppercase tracking-[0.14em] text-[var(--text-primary)]">
                Payment method
              </h3>
            </div>
            <p className="mt-4 font-heading text-sm font-semibold text-[var(--text-primary)]">
              {paymentLabels[order.paymentMethod]}
            </p>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              {paymentDetails[order.paymentMethod]}
            </p>
            {order.couponCode && (
              <p className="mt-4 border-t border-[var(--border-color)] pt-4 text-xs text-[var(--text-muted)]">
                Coupon applied:{' '}
                <span className="font-heading font-semibold tracking-[0.14em] text-[var(--color-noir-gold)]">
                  {order.couponCode}
                </span>
              </p>
            )}
          </motion.section>

          {/* ─── Support CTA ─── */}
          <motion.section
            {...reveal(0.16)}
            aria-labelledby="order-help"
            className="border border-[var(--border-color)] bg-[var(--bg-secondary)] p-6"
          >
            <div className="flex items-center gap-2">
              <LifeBuoy className="h-4 w-4 text-[var(--color-noir-gold)]" aria-hidden="true" />
              <h3 id="order-help" className="font-heading text-sm font-bold uppercase tracking-[0.14em] text-[var(--text-primary)]">
                Need help with this order?
              </h3>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
              Something wrong with the size, the delivery or the contents? Open a support request
              and quote {order.orderNumber} — our team replies within one business day.
            </p>
            <Button asChild size="sm" className="mt-5">
              <Link to="/account/support">Open a support request</Link>
            </Button>
          </motion.section>
        </div>
      </div>

      {/* ─── Line items ─── */}
      <motion.section {...reveal(0.06)} aria-labelledby="line-items" className={card}>
        <div className="flex items-center gap-2">
          <Receipt className="h-4 w-4 text-[var(--color-noir-gold)]" aria-hidden="true" />
          <h3 id="line-items" className="font-heading text-sm font-bold uppercase tracking-[0.14em] text-[var(--text-primary)]">
            Items in this order
          </h3>
        </div>

        <div className="mt-5 -mx-6 overflow-x-auto px-6">
          <table className="w-full min-w-[38rem] border-collapse text-left">
            <caption className="sr-only">
              Line items for order {order.orderNumber}
            </caption>
            <thead>
              <tr className="border-b border-[var(--border-color)]">
                <th scope="col" className={label}>
                  Product
                </th>
                <th scope="col" className={cn(label, 'text-right')}>
                  Price
                </th>
                <th scope="col" className={cn(label, 'text-center')}>
                  Qty
                </th>
                <th scope="col" className={cn(label, 'text-right')}>
                  Subtotal
                </th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr
                  key={`${order.id}-${item.productId}`}
                  className="border-b border-[var(--border-color)] last:border-b-0"
                >
                  <td className="py-4 pr-4">
                    <div className="flex items-center gap-4">
                      <span className="h-16 w-14 shrink-0 overflow-hidden bg-[var(--bg-secondary)]">
                        <img
                          src={item.productImage}
                          alt={item.productName}
                          loading="lazy"
                          className="h-full w-full object-cover"
                        />
                      </span>
                      <span className="min-w-0">
                        <Link
                          to={`/product/${productSlug(item.productId, item.productName)}`}
                          className="block text-sm font-medium text-[var(--text-primary)] transition-colors hover:text-[var(--color-noir-gold)]"
                        >
                          {item.productName}
                        </Link>
                        <span className="mt-1 block text-xs text-[var(--text-muted)]">
                          {[item.selectedColor, item.selectedSize].filter(Boolean).join(' · ') ||
                            'Standard'}
                        </span>
                      </span>
                    </div>
                  </td>
                  <td className="py-4 text-right align-top text-sm text-[var(--text-secondary)]">
                    {formatPrice(item.price)}
                  </td>
                  <td className="py-4 text-center align-top text-sm text-[var(--text-secondary)]">
                    {item.quantity}
                  </td>
                  <td className="py-4 text-right align-top font-heading text-sm font-semibold text-[var(--text-primary)]">
                    {formatPrice(item.subtotal)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.section>

      {/* ─── Totals ─── */}
      <motion.section {...reveal(0.08)} aria-labelledby="totals" className={card}>
        <div className="flex items-center gap-2">
          <PackageCheck className="h-4 w-4 text-[var(--color-noir-gold)]" aria-hidden="true" />
          <h3 id="totals" className="font-heading text-sm font-bold uppercase tracking-[0.14em] text-[var(--text-primary)]">
            Order totals
          </h3>
        </div>

        <dl className="mt-5 flex flex-col gap-3">
          <div className="flex items-center justify-between gap-4 text-sm">
            <dt className="text-[var(--text-secondary)]">Subtotal</dt>
            <dd className="text-[var(--text-primary)]">{formatPrice(order.subtotal)}</dd>
          </div>
          <div className="flex items-center justify-between gap-4 text-sm">
            <dt className="text-[var(--text-secondary)]">Shipping</dt>
            <dd className="text-[var(--text-primary)]">
              {order.shipping === 0 ? 'Complimentary' : formatPrice(order.shipping)}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-4 text-sm">
            <dt className="text-[var(--text-secondary)]">Tax</dt>
            <dd className="text-[var(--text-primary)]">{formatPrice(order.tax)}</dd>
          </div>
          {order.discount > 0 && (
            <div className="flex items-center justify-between gap-4 text-sm">
              <dt className="text-[var(--text-secondary)]">Discount</dt>
              <dd className="text-[var(--color-noir-gold)]">−{formatPrice(order.discount)}</dd>
            </div>
          )}
          <div className="flex items-center justify-between gap-4 border-t border-[var(--border-color)] pt-4">
            <dt className="font-heading text-sm font-bold uppercase tracking-[0.14em] text-[var(--text-primary)]">
              Total
            </dt>
            <dd className="font-heading text-xl font-bold text-[var(--text-primary)]">
              {formatPrice(order.total)}
            </dd>
          </div>
        </dl>

        {order.notes && (
          <p className="mt-6 border-t border-[var(--border-color)] pt-4 text-xs leading-relaxed text-[var(--text-muted)]">
            <span className="font-heading font-semibold uppercase tracking-[0.14em] text-[var(--text-secondary)]">
              Order notes:
            </span>{' '}
            {order.notes}
          </p>
        )}
      </motion.section>
    </div>
  );
}
