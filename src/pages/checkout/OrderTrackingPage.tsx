import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { Search, Package, CheckCircle2, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { useUserStore } from '@/store/userStore';
import { formatPrice } from '@/utils/format';
import { useSeo } from '@/hooks/useSeo';
import { useReducedMotion } from '@/hooks/useUi';
import type { Order } from '@/types';

const TIMELINE_STEPS = [
  { key: 'placed', label: 'Order Placed', desc: 'Verified and queued for atelier preparation' },
  { key: 'processing', label: 'In Atelier', desc: 'Custom inspection, packaging & wax sealing' },
  { key: 'shipped', label: 'Dispatched', desc: 'Handed over to secure priority courier' },
  { key: 'out_for_delivery', label: 'Out for Delivery', desc: 'Courier courier en route to destination' },
  { key: 'delivered', label: 'Delivered', desc: 'Safely received with signature on file' },
];

export default function OrderTrackingPage() {
  useSeo({
    title: 'Track Your Order',
    description: 'Follow the progress of your NOIR & CO. shipment from atelier to your doorstep in real time.',
  });

  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('number') || '';
  const { orders } = useUserStore();
  const reduceMotion = useReducedMotion();

  const [query, setQuery] = useState(initialQuery);
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(() => {
    if (initialQuery) {
      return (
        orders.find(
          (o) =>
            o.orderNumber.toLowerCase() === initialQuery.toLowerCase() ||
            o.id.toLowerCase() === initialQuery.toLowerCase()
        ) || orders[0] || null
      );
    }
    return orders[0] || null;
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const found = orders.find(
      (o) =>
        o.orderNumber.toLowerCase().includes(query.trim().toLowerCase()) ||
        o.id.toLowerCase().includes(query.trim().toLowerCase())
    );
    if (found) {
      setSearchedOrder(found);
    } else {
      setSearchedOrder(null);
    }
  };

  // Determine active step index
  const getStepIndex = (status?: string) => {
    switch (status) {
      case 'pending':
        return 0;
      case 'processing':
        return 1;
      case 'shipped':
        return 2;
      case 'delivered':
        return 4;
      default:
        return 2;
    }
  };

  const currentStep = getStepIndex(searchedOrder?.status);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] py-10 lg:py-16">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Track Order', href: '/track-order' },
          ]}
          className="mb-8"
        />

        <div className="mx-auto max-w-2xl text-center">
          <p className="font-heading text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--color-noir-gold)]">
            Live Courier Dispatch
          </p>
          <h1 className="mt-2 font-heading text-3xl font-extrabold tracking-tight text-[var(--text-primary)] sm:text-4xl">
            Track Shipment
          </h1>
          <p className="mt-3 text-sm text-[var(--text-secondary)]">
            Enter your order number or tracking code to view the live custody status of your delivery.
          </p>

          <form onSubmit={handleSearch} className="mt-8 flex gap-3">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. NC-2024-8842"
              className="h-12 font-mono text-sm"
            />
            <Button type="submit" size="lg" className="h-12 px-6">
              <Search className="mr-2 h-4 w-4" />
              Locate
            </Button>
          </form>
        </div>

        {searchedOrder ? (
          <motion.div
            initial={reduceMotion ? undefined : { opacity: 0, y: 16 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            className="mt-14 border border-[var(--border-color)] bg-[var(--bg-card)] p-6 sm:p-10"
          >
            {/* Header meta */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border-color)] pb-6">
              <div>
                <p className="font-heading text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                  Order Reference
                </p>
                <p className="font-mono text-xl font-bold text-[var(--text-primary)]">
                  {searchedOrder.orderNumber}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={searchedOrder.status === 'delivered' ? 'gold' : 'default'}>
                  {searchedOrder.status.toUpperCase()}
                </Badge>
                <span className="text-xs text-[var(--text-muted)]">
                  Estimated Arrival:{' '}
                  <strong className="text-[var(--text-primary)]">2-3 Business Days</strong>
                </span>
              </div>
            </div>

            {/* Stepper Timeline */}
            <div className="mt-10">
              <div className="grid gap-6 sm:grid-cols-5">
                {TIMELINE_STEPS.map((step, idx) => {
                  const isDone = idx <= currentStep;
                  const isCurrent = idx === currentStep;

                  return (
                    <div key={step.key} className="relative flex flex-col items-center text-center">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors ${
                          isDone
                            ? 'border-[var(--color-noir-gold)] bg-[var(--color-noir-gold)] text-[var(--color-noir-black)]'
                            : 'border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-muted)]'
                        }`}
                      >
                        {isDone ? (
                          <CheckCircle2 className="h-5 w-5" />
                        ) : (
                          <span className="font-mono text-xs">{idx + 1}</span>
                        )}
                      </div>
                      <p
                        className={`mt-3 font-heading text-xs font-bold uppercase tracking-wider ${
                          isCurrent
                            ? 'text-[var(--color-noir-gold)]'
                            : isDone
                              ? 'text-[var(--text-primary)]'
                              : 'text-[var(--text-muted)]'
                        }`}
                      >
                        {step.label}
                      </p>
                      <p className="mt-1 text-[11px] leading-tight text-[var(--text-muted)]">
                        {step.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Shipment details */}
            <div className="mt-12 grid gap-8 border-t border-[var(--border-color)] pt-8 sm:grid-cols-2">
              <div>
                <p className="flex items-center gap-2 font-heading text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                  <MapPin className="h-4 w-4" />
                  Delivery Address
                </p>
                <p className="mt-2 text-xs leading-relaxed text-[var(--text-secondary)]">
                  {searchedOrder.shippingAddress.firstName} {searchedOrder.shippingAddress.lastName}
                  <br />
                  {searchedOrder.shippingAddress.line1}
                  {searchedOrder.shippingAddress.line2 && `, ${searchedOrder.shippingAddress.line2}`}
                  <br />
                  {searchedOrder.shippingAddress.city}, {searchedOrder.shippingAddress.state}{' '}
                  {searchedOrder.shippingAddress.zip}
                </p>
              </div>

              <div>
                <p className="flex items-center gap-2 font-heading text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                  <Package className="h-4 w-4" />
                  Shipment Contents
                </p>
                <div className="mt-2 space-y-2">
                  {searchedOrder.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-xs text-[var(--text-secondary)]">
                      <span>
                        {item.quantity}x {item.productName}
                      </span>
                      <span className="font-mono">{formatPrice(item.subtotal || item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="mt-12 border border-[var(--border-color)] bg-[var(--bg-card)] p-12 text-center">
            <Package className="mx-auto h-10 w-10 text-[var(--text-muted)]" />
            <p className="mt-4 font-heading text-base font-bold text-[var(--text-primary)]">
              No matching shipment found
            </p>
            <p className="mt-1 text-xs text-[var(--text-muted)]">
              Double check the order number or reference ID and try again.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
