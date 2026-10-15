import { useState } from 'react';
import {
  Send,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useProductStore } from '@/store/productStore';
import { useUserStore } from '@/store/userStore';
import { useDealerStore } from '@/store/dealerStore';
import { useCurrencyStore } from '@/store/currencyStore';
import { useToastStore } from '@/store/toastStore';
import { formatPrice } from '@/utils/format';
import { useSeo } from '@/hooks/useSeo';

export default function DealerRfq() {
  useSeo({
    title: 'Request Custom Wholesale Quote (RFQ) | Dealer Portal',
    description: 'Submit volume batch inquiries, private-label customizations, and special price negotiations directly to AFRO & CO. Atelier procurement.',
  });

  const { products } = useProductStore();
  const { user } = useUserStore();
  const { dealers, rfqRequests, submitRFQ } = useDealerStore();
  const { currentCurrency } = useCurrencyStore();
  const toast = useToastStore();

  const currentDealer = user?.dealerProfile || dealers.find((d) => d.email === user?.email) || dealers[0];

  const [productId, setProductId] = useState(products[0]?.id || '');
  const [requestedQuantity, setRequestedQuantity] = useState(100);
  const [targetPrice, setTargetPrice] = useState(150);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedProduct = products.find((p) => p.id === productId) || products[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      submitRFQ({
        dealerId: currentDealer?.id,
        companyName: currentDealer?.companyName || 'Partner Company',
        contactName: currentDealer?.contactPerson || user?.firstName || 'Representative',
        email: currentDealer?.email || user?.email || 'dealer@example.com',
        phone: currentDealer?.phone || '+1 555-0199',
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        requestedQuantity: Number(requestedQuantity),
        targetPrice: Number(targetPrice),
        notes,
      });

      toast.success(
        'RFQ Submitted Successfully',
        `Your quote request for ${requestedQuantity}x ${selectedProduct.name} has been routed to senior procurement.`
      );

      setNotes('');
    } catch {
      toast.error('Submission failed', 'Unable to record your quote request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--color-noir-gold)]">
          Volume Purchasing &bull; Custom Runs
        </span>
        <h1 className="font-heading text-2xl font-bold text-[var(--text-primary)]">
          Request for Quote (RFQ)
        </h1>
        <p className="mt-1 text-xs text-[var(--text-secondary)]">
          For enterprise orders exceeding 100 units, custom packaging, or seasonal pre-commitments, negotiate custom production pricing directly with our team.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        {/* RFQ Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 shadow-sm"
        >
          <h2 className="font-heading text-base font-bold text-[var(--text-primary)]">
            New Quote Request Details
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Product */}
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-semibold text-[var(--text-secondary)]">
                Select Product Line
              </label>
              <select
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                className="w-full rounded-md border border-[var(--border-color)] bg-[var(--bg-primary)] px-3 py-2 text-xs text-[var(--text-primary)] focus:border-[var(--color-noir-gold)] focus:outline-none"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} (Retail: {formatPrice(p.price, currentCurrency)})
                  </option>
                ))}
              </select>
            </div>

            {/* Requested Quantity */}
            <div>
              <label className="mb-1 block text-xs font-semibold text-[var(--text-secondary)]">
                Target Order Quantity (Units)
              </label>
              <input
                type="number"
                min={20}
                required
                value={requestedQuantity}
                onChange={(e) => setRequestedQuantity(parseInt(e.target.value) || 20)}
                className="w-full rounded-md border border-[var(--border-color)] bg-[var(--bg-primary)] px-3 py-2 font-mono text-xs text-[var(--text-primary)] focus:border-[var(--color-noir-gold)] focus:outline-none"
              />
              <span className="mt-1 block text-[10px] text-[var(--text-muted)]">
                Recommended volume: 50+ units for best volume pricing.
              </span>
            </div>

            {/* Target Price per unit */}
            <div>
              <label className="mb-1 block text-xs font-semibold text-[var(--text-secondary)]">
                Target Unit Price ({currentCurrency})
              </label>
              <input
                type="number"
                min={1}
                required
                value={targetPrice}
                onChange={(e) => setTargetPrice(parseFloat(e.target.value) || 1)}
                className="w-full rounded-md border border-[var(--border-color)] bg-[var(--bg-primary)] px-3 py-2 font-mono text-xs text-[var(--text-primary)] focus:border-[var(--color-noir-gold)] focus:outline-none"
              />
              <span className="mt-1 block text-[10px] text-[var(--text-muted)]">
                Retail MSRP is {formatPrice(selectedProduct.price, currentCurrency)}
              </span>
            </div>
          </div>

          {/* Notes / Special requirements */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-[var(--text-secondary)]">
              Production Specifications &amp; Delivery Timeline Notes
            </label>
            <textarea
              rows={4}
              placeholder="e.g., Required delivery by October 2026. Private label hangtags required. Split shipping across London and Paris distribution hubs..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-md border border-[var(--border-color)] bg-[var(--bg-primary)] p-3 text-xs text-[var(--text-primary)] focus:border-[var(--color-noir-gold)] focus:outline-none"
            />
          </div>

          <Button type="submit" variant="primary" size="lg" disabled={isSubmitting} className="w-full sm:w-auto">
            <Send className="mr-2 h-4 w-4" />
            {isSubmitting ? 'Routing to Procurement...' : 'Submit Commercial Quote Request'}
          </Button>
        </form>

        {/* Info Sidebar */}
        <div className="space-y-4">
          <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5">
            <div className="flex items-center gap-2 text-[var(--color-noir-gold)] font-bold text-xs uppercase tracking-wider">
              <Sparkles className="h-4 w-4" />
              <span>Commercial Terms</span>
            </div>
            <ul className="mt-3 space-y-2 text-xs text-[var(--text-secondary)] leading-relaxed">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span>Quotes returned within 1 business day with detailed volume discount schedules.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span>Custom packaging, private label tagging, and bespoke colorways available for 100+ units.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span>Net-60 terms and consolidated sea/air freight options provided upon quote acceptance.</span>
              </li>
            </ul>
          </div>

          <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5">
            <p className="font-bold text-xs uppercase tracking-wider text-[var(--text-muted)]">Company Profile</p>
            <p className="mt-1 font-heading text-sm font-bold text-[var(--text-primary)]">
              {currentDealer?.companyName}
            </p>
            <p className="text-xs text-[var(--text-secondary)]">Tax ID: {currentDealer?.taxId}</p>
            <p className="text-xs text-[var(--text-secondary)]">Tier: {currentDealer?.tier?.toUpperCase()} Partner</p>
          </div>
        </div>
      </div>

      {/* ─── Past RFQ Inquiries Table ─── */}
      <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 shadow-sm">
        <h2 className="font-heading text-base font-bold text-[var(--text-primary)] mb-4">
          Recent RFQ Submissions &amp; Formal Quotes
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[var(--border-color)] text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
              <tr>
                <th className="pb-3 font-semibold">RFQ ID</th>
                <th className="pb-3 font-semibold">Date</th>
                <th className="pb-3 font-semibold">Product</th>
                <th className="pb-3 font-semibold">Requested Qty</th>
                <th className="pb-3 font-semibold">Target Price</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold text-right">Quoted Batch Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {rfqRequests.map((rfq) => (
                <tr key={rfq.id} className="hover:bg-[var(--bg-secondary)]/50 transition-colors">
                  <td className="py-3 font-mono font-semibold text-[var(--color-noir-gold)]">{rfq.id}</td>
                  <td className="py-3 text-[var(--text-secondary)]">
                    {new Date(rfq.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 font-medium text-[var(--text-primary)]">{rfq.productName}</td>
                  <td className="py-3 font-mono">{rfq.requestedQuantity} units</td>
                  <td className="py-3 font-mono text-[var(--text-secondary)]">
                    ${rfq.targetPrice?.toFixed(2)}/unit
                  </td>
                  <td className="py-3">
                    <span
                      className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${
                        rfq.status === 'quoted'
                          ? 'bg-emerald-500/10 text-emerald-500'
                          : rfq.status === 'accepted'
                          ? 'bg-blue-500/10 text-blue-500'
                          : 'bg-amber-500/10 text-amber-500'
                      }`}
                    >
                      {rfq.status}
                    </span>
                  </td>
                  <td className="py-3 text-right font-mono font-bold text-[var(--text-primary)]">
                    {rfq.quoteAmount ? `$${rfq.quoteAmount.toLocaleString()}` : 'Evaluating'}
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
