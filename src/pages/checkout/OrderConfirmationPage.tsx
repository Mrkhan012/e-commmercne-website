import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { CheckCircle2, MapPin, Truck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useUserStore } from '@/store/userStore';
import { formatPrice, formatDate } from '@/utils/format';
import { useSeo } from '@/hooks/useSeo';
import { useReducedMotion } from '@/hooks/useUi';

export default function OrderConfirmationPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const { orders } = useUserStore();
  const reduceMotion = useReducedMotion();

  // Find placed order or fallback to first order
  const order = orders.find((o) => o.id === orderId) || orders[0];

  useSeo({
    title: order ? `Order Confirmed: ${order.orderNumber}` : 'Order Confirmed',
    description: 'Thank you for your order with AFRO & CO.',
  });

  if (!order) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h1 className="font-heading text-2xl font-bold text-[var(--text-primary)]">
          Order Not Found
        </h1>
        <p className="mt-3 text-sm text-[var(--text-muted)]">
          We could not locate this order record. Please check your account history.
        </p>
        <Button asChild className="mt-6">
          <Link to="/account/orders">View All Orders</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] py-12 lg:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <motion.div
          initial={reduceMotion ? undefined : { opacity: 0, scale: 0.96 }}
          animate={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="border border-[var(--border-color)] bg-[var(--bg-card)] p-6 sm:p-12 text-center"
        >
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--bg-secondary)] text-[var(--color-noir-gold)]">
            <CheckCircle2 className="h-8 w-8" />
          </div>

          <p className="mt-6 font-heading text-xs font-semibold uppercase tracking-[0.25em] text-[var(--color-noir-gold)]">
            Order Confirmed
          </p>
          <h1 className="mt-2 font-heading text-3xl font-extrabold tracking-tight text-[var(--text-primary)] sm:text-4xl">
            Thank you for your acquisition
          </h1>
          <p className="mt-3 text-sm text-[var(--text-secondary)]">
            A confirmation email with your invoice and tracking updates has been sent.
          </p>

          <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-4 border border-[var(--border-color)] bg-[var(--bg-secondary)] px-6 py-3 font-mono text-xs">
            <span>
              Order No:{' '}
              <strong className="text-[var(--text-primary)]">{order.orderNumber}</strong>
            </span>
            <span className="text-[var(--border-color)]">|</span>
            <span>
              Placed:{' '}
              <strong className="text-[var(--text-primary)]">
                {formatDate(order.createdAt || new Date().toISOString(), 'short')}
              </strong>
            </span>
          </div>

          {/* Items breakdown */}
          <div className="mt-10 border-t border-[var(--border-color)] pt-8 text-left">
            <h2 className="font-heading text-xs font-bold uppercase tracking-[0.18em] text-[var(--text-muted)]">
              Pieces Acquired
            </h2>
            <div className="mt-4 divide-y divide-[var(--border-color)]">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 py-3.5">
                  <img
                    src={item.productImage}
                    alt={item.productName}
                    className="h-16 w-14 object-cover"
                  />
                  <div className="flex-1 text-xs">
                    <p className="font-heading font-semibold text-[var(--text-primary)]">
                      {item.productName}
                    </p>
                    <p className="text-[var(--text-muted)]">
                      Qty: {item.quantity}
                      {item.selectedColor ? ` • ${item.selectedColor}` : ''}
                      {item.selectedSize ? ` • Size ${item.selectedSize}` : ''}
                    </p>
                  </div>
                  <span className="font-heading text-sm font-bold text-[var(--text-primary)]">
                    {formatPrice(item.subtotal || item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery & Summary breakdown */}
          <div className="mt-8 grid gap-6 border-t border-[var(--border-color)] pt-8 text-left sm:grid-cols-2">
            <div>
              <p className="flex items-center gap-2 font-heading text-xs font-bold uppercase tracking-[0.16em] text-[var(--text-muted)]">
                <MapPin className="h-3.5 w-3.5" />
                Shipping Destination
              </p>
              <div className="mt-2 text-xs leading-relaxed text-[var(--text-secondary)]">
                <p className="font-semibold text-[var(--text-primary)]">
                  {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                </p>
                <p>{order.shippingAddress.line1}</p>
                {order.shippingAddress.line2 && <p>{order.shippingAddress.line2}</p>}
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                  {order.shippingAddress.zip}
                </p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </div>

            <div>
              <p className="font-heading text-xs font-bold uppercase tracking-[0.16em] text-[var(--text-muted)]">
                Payment Breakdown
              </p>
              <div className="mt-2 space-y-1.5 text-xs text-[var(--text-secondary)]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(order.subtotal)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-[var(--color-noir-gold)]">
                    <span>Discount</span>
                    <span>-{formatPrice(order.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{order.shipping === 0 ? 'Complimentary' : formatPrice(order.shipping)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>{formatPrice(order.tax)}</span>
                </div>
                <div className="flex justify-between border-t border-[var(--border-color)] pt-2 text-sm font-bold text-[var(--text-primary)]">
                  <span>Total Paid</span>
                  <span className="font-heading">{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-10 flex flex-col justify-center gap-3 border-t border-[var(--border-color)] pt-8 sm:flex-row">
            <Button asChild size="lg">
              <Link to={`/track-order?number=${order.orderNumber}`}>
                <Truck className="mr-2 h-4 w-4" />
                Track Order
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/shop">Continue Shopping</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
