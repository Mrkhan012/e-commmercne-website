import { Link } from 'react-router-dom';
import {
  TrendingUp,
  Package,
  Layers,
  CreditCard,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  ShoppingBag,
  Send,
  Building,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useUserStore } from '@/store/userStore';
import { useDealerStore } from '@/store/dealerStore';
import { useCurrencyStore } from '@/store/currencyStore';
import { formatPrice } from '@/utils/format';
import { useSeo } from '@/hooks/useSeo';

export default function DealerDashboard() {
  useSeo({
    title: 'Dealer Overview & B2B Dashboard',
    description: 'B2B Wholesale account status, available credit lines, order activity, and volume tier benefits.',
  });

  const { user, orders } = useUserStore();
  const { dealers, rfqRequests } = useDealerStore();
  const { currentCurrency } = useCurrencyStore();

  const currentDealer = user?.dealerProfile || dealers.find((d) => d.email === user?.email) || dealers[0];
  const discountRate = currentDealer?.discountRate || 0.35;
  const discountPercent = Math.round(discountRate * 100);

  const creditAvailable = Math.max(0, (currentDealer?.creditLimit || 50000) - (currentDealer?.creditUsed || 14200));

  // Wholesale orders (can be filtered by isWholesale or demo orders)
  const wholesaleOrders = orders.filter((o) => o.isWholesale || o.items.some((i) => i.quantity > 2));
  const recentOrders = wholesaleOrders.length > 0 ? wholesaleOrders : orders.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* ─── Welcome Header ─── */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center border-b border-[var(--border-color)] pb-6">
        <div>
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--color-noir-gold)]">
            Wholesale Operations Console
          </span>
          <h1 className="font-heading text-2xl font-bold text-[var(--text-primary)] sm:text-3xl">
            Welcome, {currentDealer?.contactPerson || 'Partner'}
          </h1>
          <p className="mt-1 text-xs text-[var(--text-secondary)]">
            Managing verified B2B wholesale distribution for{' '}
            <strong className="text-[var(--text-primary)]">{currentDealer?.companyName}</strong>.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button asChild variant="outline" size="sm">
            <Link to="/dealer/rfq">
              <Send className="mr-1.5 h-3.5 w-3.5" />
              Request Custom Quote
            </Link>
          </Button>
          <Button asChild variant="primary" size="sm">
            <Link to="/dealer/quick-order">
              <Layers className="mr-1.5 h-3.5 w-3.5" />
              Bulk Matrix Order
            </Link>
          </Button>
        </div>
      </div>

      {/* ─── Metric KPI Cards ─── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Tier Card */}
        <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
            <span className="font-medium">Partner Tier</span>
            <span className="rounded bg-amber-500/10 px-2 py-0.5 font-mono text-[10px] font-bold uppercase text-amber-500">
              {currentDealer?.tier?.toUpperCase()}
            </span>
          </div>
          <p className="mt-3 font-heading text-3xl font-extrabold text-[var(--text-primary)]">
            {discountPercent}% OFF
          </p>
          <p className="mt-1 text-[11px] text-[var(--text-muted)]">
            Automatic wholesale margin applied to all product lines
          </p>
        </div>

        {/* Credit Limit */}
        <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
            <span className="font-medium">Available Credit</span>
            <CreditCard className="h-4 w-4 text-[var(--color-noir-gold)]" />
          </div>
          <p className="mt-3 font-heading text-3xl font-extrabold text-emerald-500">
            {formatPrice(creditAvailable, currentCurrency)}
          </p>
          <p className="mt-1 text-[11px] text-[var(--text-muted)]">
            Limit: {formatPrice(currentDealer?.creditLimit || 50000, currentCurrency)} &bull; {currentDealer?.paymentTerms?.toUpperCase() || 'NET-30'}
          </p>
        </div>

        {/* Minimum Order Quantity */}
        <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
            <span className="font-medium">Minimum Order (MOQ)</span>
            <Package className="h-4 w-4 text-blue-400" />
          </div>
          <p className="mt-3 font-heading text-3xl font-extrabold text-[var(--text-primary)]">
            {currentDealer?.minOrderQuantity || 5} Units
          </p>
          <p className="mt-1 text-[11px] text-[var(--text-muted)]">
            Eligible for consolidated freight &amp; priority fulfillment
          </p>
        </div>

        {/* Active RFQs */}
        <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
            <span className="font-medium">Custom RFQs</span>
            <Send className="h-4 w-4 text-purple-400" />
          </div>
          <p className="mt-3 font-heading text-3xl font-extrabold text-[var(--text-primary)]">
            {rfqRequests.length} Active
          </p>
          <p className="mt-1 text-[11px] text-[var(--text-muted)]">
            Bespoke manufacturing &amp; volume batch requests
          </p>
        </div>
      </div>

      {/* ─── Wholesale Tier Level Progression ─── */}
      <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h2 className="font-heading text-base font-bold text-[var(--text-primary)]">
              AFRO &amp; CO. Dealer Tier Structure
            </h2>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              Wholesale volume unlocks progressively higher margins, Net payment terms, and dedicated atelier support.
            </p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link to="/dealer/catalog">
              Browse Wholesale Catalog <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-[var(--border-color)] p-4 bg-[var(--bg-secondary)]">
            <div className="flex items-center justify-between">
              <span className="font-bold text-orange-400 text-xs uppercase tracking-wider">Bronze Tier</span>
              <span className="text-xs font-mono font-bold">15% Off</span>
            </div>
            <p className="mt-2 text-[11px] text-[var(--text-secondary)]">
              &bull; MOQ: 3 units / SKU<br />
              &bull; Prepaid payment terms<br />
              &bull; Standard courier dispatch
            </p>
          </div>

          <div className="rounded-lg border border-[var(--border-color)] p-4 bg-[var(--bg-secondary)]">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-300 text-xs uppercase tracking-wider">Silver Tier</span>
              <span className="text-xs font-mono font-bold">25% Off</span>
            </div>
            <p className="mt-2 text-[11px] text-[var(--text-secondary)]">
              &bull; MOQ: 5 units / SKU<br />
              &bull; Net-30 payment terms ($25k credit)<br />
              &bull; Priority warehouse packing
            </p>
          </div>

          <div className="rounded-lg border-2 border-[var(--color-noir-gold)] p-4 bg-amber-500/5 relative overflow-hidden">
            <div className="absolute top-2 right-2 flex items-center gap-1 rounded bg-[var(--color-noir-gold)] px-1.5 py-0.5 text-[9px] font-bold uppercase text-black">
              Current Tier
            </div>
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-500 text-xs uppercase tracking-wider">Gold Tier (Flagship)</span>
              <span className="text-xs font-mono font-bold text-[var(--color-noir-gold)]">35% Off</span>
            </div>
            <p className="mt-2 text-[11px] text-[var(--text-secondary)]">
              &bull; MOQ: 10 units / SKU<br />
              &bull; Net-60 payment terms ($50k credit)<br />
              &bull; White-glove dedicated account manager
            </p>
          </div>
        </div>
      </div>

      {/* ─── Recent Wholesale Orders ─── */}
      <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-heading text-base font-bold text-[var(--text-primary)]">
              Recent Wholesale Orders &amp; Dispatches
            </h2>
            <p className="text-xs text-[var(--text-secondary)]">
              Review order progress, tracking codes, and B2B invoices.
            </p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link to="/dealer/orders">View All Orders</Link>
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[var(--border-color)] text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
              <tr>
                <th className="pb-3 font-semibold">Order / PO #</th>
                <th className="pb-3 font-semibold">Date</th>
                <th className="pb-3 font-semibold">Items</th>
                <th className="pb-3 font-semibold">Terms</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-[var(--bg-secondary)]/50 transition-colors">
                  <td className="py-3 font-mono font-semibold text-[var(--color-noir-gold)]">
                    {order.poNumber || order.orderNumber}
                  </td>
                  <td className="py-3 text-[var(--text-secondary)]">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 text-[var(--text-primary)]">
                    {order.items.reduce((s, i) => s + i.quantity, 0)} units ({order.items.length} lines)
                  </td>
                  <td className="py-3 uppercase text-[var(--text-muted)]">
                    {order.paymentMethod === 'purchase-order' ? 'PO / Net-30' : order.paymentMethod}
                  </td>
                  <td className="py-3">
                    <span
                      className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${
                        order.status === 'delivered'
                          ? 'bg-emerald-500/10 text-emerald-500'
                          : order.status === 'shipped'
                          ? 'bg-blue-500/10 text-blue-500'
                          : 'bg-amber-500/10 text-amber-500'
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 text-right font-mono font-bold text-[var(--text-primary)]">
                    {formatPrice(order.total, currentCurrency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
