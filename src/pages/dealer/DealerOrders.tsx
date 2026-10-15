import { useState, useMemo } from 'react';
import {
  FileText,
  Printer,
  Download,
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  CheckCircle2,
  Clock,
  Truck,
  Building,
  Sparkles,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useUserStore } from '@/store/userStore';
import { useDealerStore } from '@/store/dealerStore';
import { useCurrencyStore } from '@/store/currencyStore';
import { formatPrice } from '@/utils/format';
import { useSeo } from '@/hooks/useSeo';
import type { Order } from '@/types';

export default function DealerOrders() {
  useSeo({
    title: 'Wholesale Orders & B2B Invoices | Dealer Portal',
    description: 'Track wholesale dispatches, view commercial pro-forma invoices, and download compliant B2B tax invoices.',
  });

  const { orders } = useUserStore();
  const { dealers } = useDealerStore();
  const { currentCurrency } = useCurrencyStore();

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [search, setSearch] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const currentDealer = dealers[0];

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesStatus = filterStatus === 'all' || o.status === filterStatus;
      const matchesSearch =
        !search ||
        o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
        (o.poNumber && o.poNumber.toLowerCase().includes(search.toLowerCase()));
      return matchesStatus && matchesSearch;
    });
  }, [orders, filterStatus, search]);

  const totalOrders = filteredOrders.length;
  const totalPages = Math.ceil(totalOrders / pageSize) || 1;
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredOrders.slice(start, start + pageSize);
  }, [filteredOrders, currentPage, pageSize]);

  const handleOpenInvoice = (order: Order) => {
    setSelectedOrder(order);
    setIsInvoiceOpen(true);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--color-noir-gold)]">
            Purchasing Records
          </span>
          <h1 className="font-heading text-2xl font-bold text-[var(--text-primary)]">
            Wholesale Orders &amp; Invoices
          </h1>
          <p className="mt-1 text-xs text-[var(--text-secondary)]">
            Review commercial orders, payment terms, and printable B2B Tax Invoices for corporate accounting.
          </p>
        </div>
      </div>

      {/* ─── Controls ─── */}
      <div className="flex flex-col gap-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Search by Order # or PO #..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full rounded-md border border-[var(--border-color)] bg-[var(--bg-primary)] py-2 pl-9 pr-4 text-xs text-[var(--text-primary)] focus:border-[var(--color-noir-gold)] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setCurrentPage(1);
            }}
            aria-label="Filter wholesale orders by status"
            className="rounded-md border border-[var(--border-color)] bg-[var(--bg-primary)] px-3 py-2 text-xs text-[var(--text-primary)] focus:border-[var(--color-noir-gold)] focus:outline-none"
          >
            <option value="all">All Statuses ({orders.length})</option>
            <option value="pending">Pending Review</option>
            <option value="processing">Atelier Processing</option>
            <option value="shipped">Dispatched / In Transit</option>
            <option value="delivered">Delivered</option>
          </select>
        </div>
      </div>

      {/* ─── Orders Table ─── */}
      <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[var(--border-color)] bg-[var(--bg-secondary)] text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
              <tr>
                <th className="py-3 px-4 font-semibold">Order / PO #</th>
                <th className="py-3 px-4 font-semibold">Date</th>
                <th className="py-3 px-4 font-semibold">Items &amp; Units</th>
                <th className="py-3 px-4 font-semibold">Payment Terms</th>
                <th className="py-3 px-4 font-semibold">Fulfillment</th>
                <th className="py-3 px-4 font-semibold text-right">Invoice Total</th>
                <th className="py-3 px-4 font-semibold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {paginatedOrders.map((order) => {
                const totalUnits = order.items.reduce((s, i) => s + i.quantity, 0);
                return (
                  <tr key={order.id} className="hover:bg-[var(--bg-secondary)]/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[var(--color-noir-gold)]">
                      {order.poNumber ? (
                        <div>
                          <span>{order.poNumber}</span>
                          <span className="block text-[10px] text-[var(--text-muted)] font-normal">{order.orderNumber}</span>
                        </div>
                      ) : (
                        order.orderNumber
                      )}
                    </td>
                    <td className="py-3 px-4 text-[var(--text-secondary)]">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-[var(--text-primary)]">
                      <span className="font-semibold">{totalUnits} units</span> ({order.items.length} line items)
                    </td>
                    <td className="py-3 px-4 uppercase text-[var(--text-secondary)] font-medium">
                      {order.paymentMethod === 'purchase-order' ? 'PO / Net-30' : order.paymentMethod}
                    </td>
                    <td className="py-3 px-4">
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
                    <td className="py-3 px-4 text-right font-mono font-bold text-[var(--text-primary)]">
                      {formatPrice(order.total, currentCurrency)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Button
                        onClick={() => handleOpenInvoice(order)}
                        variant="outline"
                        size="sm"
                        className="text-[11px] h-7 px-2.5"
                      >
                        <FileText className="mr-1 h-3 w-3 text-[var(--color-noir-gold)]" />
                        Tax Invoice
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* ─── Pagination ─── */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-[var(--border-color)] p-4 sm:flex-row">
          <p className="text-xs text-[var(--text-secondary)]">
            Showing <span className="font-semibold text-[var(--text-primary)]">{(currentPage - 1) * pageSize + 1}</span> to{' '}
            <span className="font-semibold text-[var(--text-primary)]">
              {Math.min(currentPage * pageSize, totalOrders)}
            </span>{' '}
            of <span className="font-semibold text-[var(--text-primary)]">{totalOrders}</span> orders
          </p>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="mr-1 h-3.5 w-3.5" />
              Previous
            </Button>
            <span className="text-xs text-[var(--text-muted)] font-mono">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="ml-1 h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* ─── Printable B2B Tax Invoice Modal ─── */}
      {isInvoiceOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="relative my-8 w-full max-w-3xl rounded-xl border border-[var(--border-color)] bg-white text-zinc-900 p-8 shadow-2xl print:m-0 print:border-none print:shadow-none print:p-0">
            {/* Modal Controls (Hidden when printing) */}
            <div className="mb-6 flex items-center justify-between border-b border-zinc-200 pb-4 print:hidden">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-amber-700">
                Official B2B Commercial Tax Invoice
              </span>
              <div className="flex items-center gap-2">
                <Button onClick={handlePrint} variant="outline" size="sm" className="text-zinc-900 border-zinc-300">
                  <Printer className="mr-1.5 h-3.5 w-3.5" /> Print / Save as PDF
                </Button>
                <button
                  type="button"
                  onClick={() => setIsInvoiceOpen(false)}
                  className="rounded p-1 text-zinc-500 hover:text-zinc-900"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Invoice Printable Body */}
            <div className="space-y-6">
              {/* Header */}
              <div className="flex justify-between items-start border-b border-zinc-200 pb-6">
                <div>
                  <h2 className="font-heading text-2xl font-black tracking-tight text-zinc-900">
                    AFRO &amp; CO. ATELIER
                  </h2>
                  <p className="text-xs text-zinc-500 mt-0.5">Luxury Goods &amp; Wholesale Distribution Ltd.</p>
                  <p className="text-xs text-zinc-500">Tax ID: US-EIN-882910481 &bull; VAT: EU-39281093</p>
                  <p className="text-xs text-zinc-500">450 Lexington Avenue, Suite 2200, New York, NY 10017</p>
                </div>

                <div className="text-right">
                  <span className="font-mono text-xs font-bold uppercase text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
                    TAX INVOICE
                  </span>
                  <p className="mt-2 font-mono text-sm font-bold text-zinc-900">
                    INV-{selectedOrder.orderNumber}
                  </p>
                  <p className="text-xs text-zinc-500">Date: {new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                  {selectedOrder.poNumber && (
                    <p className="text-xs font-mono font-semibold text-zinc-700">PO Ref: {selectedOrder.poNumber}</p>
                  )}
                </div>
              </div>

              {/* Bill to & Ship to */}
              <div className="grid grid-cols-2 gap-8 text-xs">
                <div>
                  <p className="font-bold uppercase tracking-wider text-zinc-400 text-[10px] mb-1">
                    Billed To (Buyer):
                  </p>
                  <p className="font-bold text-zinc-900 text-sm">{currentDealer?.companyName}</p>
                  <p className="text-zinc-600">Attn: {currentDealer?.contactPerson}</p>
                  <p className="text-zinc-600">Tax / VAT ID: {currentDealer?.taxId}</p>
                  <p className="text-zinc-600">{currentDealer?.address}, {currentDealer?.city}, {currentDealer?.state}</p>
                  <p className="text-zinc-600">Payment Terms: {currentDealer?.paymentTerms?.toUpperCase() || 'NET-30'}</p>
                </div>

                <div>
                  <p className="font-bold uppercase tracking-wider text-zinc-400 text-[10px] mb-1">
                    Shipping Destination:
                  </p>
                  <p className="font-bold text-zinc-900">{selectedOrder.shippingAddress?.firstName} {selectedOrder.shippingAddress?.lastName}</p>
                  <p className="text-zinc-600">{selectedOrder.shippingAddress?.line1}</p>
                  <p className="text-zinc-600">{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} {selectedOrder.shippingAddress?.zip}</p>
                  <p className="text-zinc-600">{selectedOrder.shippingAddress?.country}</p>
                  {selectedOrder.trackingNumber && (
                    <p className="mt-1 font-mono text-[11px] text-zinc-700">
                      Tracking Code: <strong>{selectedOrder.trackingNumber}</strong>
                    </p>
                  )}
                </div>
              </div>

              {/* Items Table */}
              <table className="w-full text-left text-xs border border-zinc-200">
                <thead className="bg-zinc-50 text-[10px] uppercase font-bold text-zinc-500 border-b border-zinc-200">
                  <tr>
                    <th className="py-2 px-3">Item Description</th>
                    <th className="py-2 px-3">HSN Code</th>
                    <th className="py-2 px-3 text-center">Qty</th>
                    <th className="py-2 px-3 text-right">Wholesale Rate</th>
                    <th className="py-2 px-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200">
                  {selectedOrder.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="py-2 px-3">
                        <span className="font-bold text-zinc-900">{item.productName}</span>
                        {item.selectedColor && (
                          <span className="block text-[11px] text-zinc-500">
                            Color: {item.selectedColor} {item.selectedSize && `| Size: ${item.selectedSize}`}
                          </span>
                        )}
                      </td>
                      <td className="py-2 px-3 font-mono text-zinc-500">6204.42</td>
                      <td className="py-2 px-3 text-center font-mono font-bold">{item.quantity}</td>
                      <td className="py-2 px-3 text-right font-mono">${item.price.toFixed(2)}</td>
                      <td className="py-2 px-3 text-right font-mono font-bold">${item.subtotal.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Financial Totals */}
              <div className="flex justify-end text-xs">
                <div className="w-64 space-y-1.5 border-t border-zinc-200 pt-2">
                  <div className="flex justify-between text-zinc-600">
                    <span>Wholesale Subtotal:</span>
                    <span className="font-mono font-semibold">${selectedOrder.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-zinc-600">
                    <span>Consolidated Freight:</span>
                    <span className="font-mono">${selectedOrder.shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-zinc-600">
                    <span>Applicable Tax (8%):</span>
                    <span className="font-mono">${selectedOrder.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-t border-zinc-300 pt-2 font-bold text-sm text-zinc-900">
                    <span>Total Amount Due:</span>
                    <span className="font-mono text-base font-black text-amber-800">
                      ${selectedOrder.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Wire details & terms */}
              <div className="rounded-lg bg-zinc-50 border border-zinc-200 p-4 text-[11px] text-zinc-600 space-y-1">
                <p className="font-bold text-zinc-900">Remittance &amp; Wire Payment Instructions:</p>
                <p>Bank: JPMorgan Chase Bank N.A. &bull; Beneficiary: AFRO &amp; CO. ATELIER INC.</p>
                <p>SWIFT/BIC: CHASUS33 &bull; Account / IBAN: US82CHAS0210000892019842</p>
                <p className="text-[10px] text-zinc-500 pt-1">
                  Payment is due strictly under {currentDealer?.paymentTerms?.toUpperCase() || 'NET-30'} terms. Thank you for your continued partnership.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
