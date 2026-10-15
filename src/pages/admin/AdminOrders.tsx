import { useState } from 'react';
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  XCircle,
  Eye,
  Search,
  Sparkles,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Dialog } from '@/components/ui/Dialog';
import { useUserStore } from '@/store/userStore';
import { useToastStore } from '@/store/toastStore';
import { formatPrice, formatDate } from '@/utils/format';
import type { Order, OrderStatus } from '@/types';

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; badgeVariant: 'default' | 'gold' | 'sale' | 'best'; icon: React.ComponentType<{ className?: string }> }
> = {
  pending: { label: 'Pending Review', badgeVariant: 'default', icon: Clock },
  processing: { label: 'Packed & Processing', badgeVariant: 'gold', icon: Package },
  shipped: { label: 'Dispatched / In Transit', badgeVariant: 'best', icon: Truck },
  delivered: { label: 'Delivered', badgeVariant: 'gold', icon: CheckCircle2 },
  cancelled: { label: 'Cancelled', badgeVariant: 'sale', icon: XCircle },
  refunded: { label: 'Refunded', badgeVariant: 'sale', icon: XCircle },
};

export default function AdminOrders() {
  const { orders, updateOrderStatus } = useUserStore();
  const toast = useToastStore();

  const [filter, setFilter] = useState<'all' | OrderStatus>('all');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [customTracking, setCustomTracking] = useState('');
  const [adminNote, setAdminNote] = useState('');

  // Synchronize modal state when an order is selected
  const handleOpenOrderModal = (order: Order) => {
    setSelectedOrder(order);
    setCustomTracking(order.trackingNumber || '');
    setAdminNote('');
  };

  const handleStatusChange = (
    orderId: string,
    newStatus: OrderStatus,
    trackingNumber?: string,
    note?: string
  ) => {
    updateOrderStatus(orderId, newStatus, trackingNumber, note);

    // Refresh selected order if open in modal
    if (selectedOrder && selectedOrder.id === orderId) {
      const updated = useUserStore.getState().orders.find((o) => o.id === orderId);
      if (updated) setSelectedOrder(updated);
    }

    const readableStatus = STATUS_CONFIG[newStatus]?.label || newStatus;
    toast.success('Fulfillment Updated', `Order #${orderId} marked as ${readableStatus}.`);
  };

  const handleGenerateTracking = () => {
    const randomCode = `AFRO-${Math.floor(100000 + Math.random() * 900000)}-EXP`;
    setCustomTracking(randomCode);
    toast.info('Tracking Generated', `Generated priority courier code: ${randomCode}`);
  };

  // Filtered orders list
  const filteredOrders = orders.filter((order) => {
    const matchesFilter = filter === 'all' || order.status === filter;
    const matchesSearch =
      search.trim() === '' ||
      order.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      order.items.some((i) => i.productName.toLowerCase().includes(search.toLowerCase()));

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border-color)] pb-6">
        <div>
          <p className="font-heading text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--color-noir-gold)]">
            Atelier Order Fulfillment &amp; Operations
          </p>
          <h1 className="mt-1 font-heading text-3xl font-extrabold text-[var(--text-primary)]">
            Client Orders ({filteredOrders.length})
          </h1>
          <p className="mt-1 text-xs text-[var(--text-muted)]">
            Review incoming patron orders, approve fulfillment, update tracking numbers, and advance delivery milestones.
          </p>
        </div>

        {/* Quick Summary Badges */}
        <div className="flex flex-wrap gap-2">
          <div className="border border-[var(--border-color)] bg-[var(--bg-card)] px-3 py-2 text-right">
            <span className="block font-mono text-[10px] uppercase text-[var(--text-muted)]">Pending</span>
            <span className="font-heading text-sm font-bold text-amber-500">
              {orders.filter((o) => o.status === 'pending').length}
            </span>
          </div>
          <div className="border border-[var(--border-color)] bg-[var(--bg-card)] px-3 py-2 text-right">
            <span className="block font-mono text-[10px] uppercase text-[var(--text-muted)]">Packed / Processing</span>
            <span className="font-heading text-sm font-bold text-[var(--color-noir-gold)]">
              {orders.filter((o) => o.status === 'processing').length}
            </span>
          </div>
          <div className="border border-[var(--border-color)] bg-[var(--bg-card)] px-3 py-2 text-right">
            <span className="block font-mono text-[10px] uppercase text-[var(--text-muted)]">In Transit</span>
            <span className="font-heading text-sm font-bold text-sky-400">
              {orders.filter((o) => o.status === 'shipped').length}
            </span>
          </div>
          <div className="border border-[var(--border-color)] bg-[var(--bg-card)] px-3 py-2 text-right">
            <span className="block font-mono text-[10px] uppercase text-[var(--text-muted)]">Delivered</span>
            <span className="font-heading text-sm font-bold text-emerald-400">
              {orders.filter((o) => o.status === 'delivered').length}
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-[var(--text-muted)]" />
          <Input
            placeholder="Search by order #, client name, or item..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 text-xs"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap gap-1.5">
          {(['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`border px-3 py-1.5 font-heading text-[11px] uppercase tracking-wider transition-colors ${
                filter === st
                  ? 'border-[var(--color-noir-gold)] bg-[var(--bg-secondary)] text-[var(--color-noir-gold)] font-bold'
                  : 'border-[var(--border-color)] text-[var(--text-muted)] hover:border-[var(--text-primary)]'
              }`}
            >
              {st === 'all' ? 'All Orders' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="border border-[var(--border-color)] bg-[var(--bg-card)]">
        {filteredOrders.length === 0 ? (
          <div className="py-16 text-center">
            <Package className="mx-auto h-10 w-10 text-[var(--text-muted)] opacity-50" />
            <h3 className="mt-3 font-heading text-sm font-bold uppercase text-[var(--text-primary)]">
              No Orders Found
            </h3>
            <p className="mt-1 text-xs text-[var(--text-muted)]">
              No orders matched your active filter or search query.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[var(--border-color)] bg-[var(--bg-secondary)] font-heading text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                <tr>
                  <th className="px-4 py-3">Order Ref</th>
                  <th className="px-4 py-3">Patron Client</th>
                  <th className="px-4 py-3">Placed Date</th>
                  <th className="px-4 py-3">Pieces Ordered</th>
                  <th className="px-4 py-3 text-right">Total</th>
                  <th className="px-4 py-3 text-center">Current Status</th>
                  <th className="px-4 py-3 text-center">Quick Milestone</th>
                  <th className="px-4 py-3 text-right">Manage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)]">
                {filteredOrders.map((order) => {
                  const statusInfo = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
                  const StatusIcon = statusInfo.icon;

                  return (
                    <tr
                      key={order.id}
                      className="transition-colors hover:bg-[var(--bg-secondary)]/50"
                    >
                      {/* Order Reference */}
                      <td className="px-4 py-3 font-mono font-bold text-[var(--color-noir-gold)] whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleOpenOrderModal(order)}
                          className="hover:underline flex items-center gap-1.5"
                        >
                          <span>{order.orderNumber}</span>
                        </button>
                        {order.trackingNumber && (
                          <span className="block font-mono text-[9px] text-[var(--text-muted)] font-normal truncate max-w-[130px]">
                            {order.trackingNumber}
                          </span>
                        )}
                      </td>

                      {/* Customer */}
                      <td className="px-4 py-3">
                        <p className="font-heading text-xs font-semibold text-[var(--text-primary)]">
                          {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                        </p>
                        <p className="text-[10px] text-[var(--text-muted)] font-mono">
                          {order.shippingAddress.city}, {order.shippingAddress.country}
                        </p>
                      </td>

                      {/* Placed Date */}
                      <td className="px-4 py-3 whitespace-nowrap text-[var(--text-muted)] font-mono text-[11px]">
                        {formatDate(order.createdAt || new Date().toISOString(), 'short')}
                      </td>

                      {/* Items */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {order.items.slice(0, 2).map((item, idx) => (
                            <img
                              key={idx}
                              src={item.productImage}
                              alt={item.productName}
                              className="h-8 w-7 object-cover border border-[var(--border-color)]"
                              title={item.productName}
                            />
                          ))}
                          {order.items.length > 2 && (
                            <span className="font-mono text-[10px] text-[var(--text-muted)]">
                              +{order.items.length - 2}
                            </span>
                          )}
                          <span className="text-[11px] text-[var(--text-secondary)] line-clamp-1 max-w-[180px]">
                            {order.items.map((i) => i.productName).join(', ')}
                          </span>
                        </div>
                      </td>

                      {/* Total */}
                      <td className="px-4 py-3 text-right font-heading font-bold text-[var(--text-primary)] whitespace-nowrap">
                        {formatPrice(order.total)}
                      </td>

                      {/* Current Status Badge */}
                      <td className="px-4 py-3 text-center whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-heading font-semibold uppercase tracking-wider rounded border border-[var(--border-color)] bg-[var(--bg-secondary)]">
                          <StatusIcon className="h-3 w-3 text-[var(--color-noir-gold)]" />
                          <span>{order.status}</span>
                        </span>
                      </td>

                      {/* Quick Approval / Milestone Progress Buttons */}
                      <td className="px-4 py-3 text-center whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          {order.status === 'pending' && (
                            <Button
                              size="sm"
                              onClick={() => handleStatusChange(order.id, 'processing')}
                              className="text-[10px] py-1 px-2.5 uppercase tracking-wider gap-1 bg-[var(--color-noir-gold)] text-black hover:opacity-90"
                              title="Approve order and start packing"
                            >
                              <Package className="h-3 w-3" />
                              <span>Pack Order</span>
                            </Button>
                          )}

                          {order.status === 'processing' && (
                            <Button
                              size="sm"
                              onClick={() => {
                                const tracking =
                                  order.trackingNumber ||
                                  `AFRO-${Math.floor(100000 + Math.random() * 900000)}-EXP`;
                                handleStatusChange(order.id, 'shipped', tracking);
                              }}
                              className="text-[10px] py-1 px-2.5 uppercase tracking-wider gap-1 border border-sky-500/40 bg-sky-500/10 text-sky-400 hover:bg-sky-500/20"
                              title="Dispatch order with priority courier"
                            >
                              <Truck className="h-3 w-3" />
                              <span>Dispatch &amp; Ship</span>
                            </Button>
                          )}

                          {order.status === 'shipped' && (
                            <Button
                              size="sm"
                              onClick={() => handleStatusChange(order.id, 'delivered')}
                              className="text-[10px] py-1 px-2.5 uppercase tracking-wider gap-1 border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                              title="Confirm courier delivery"
                            >
                              <CheckCircle2 className="h-3 w-3" />
                              <span>Mark Delivered</span>
                            </Button>
                          )}

                          {order.status === 'delivered' && (
                            <span className="font-mono text-[10px] text-emerald-400 flex items-center gap-1 justify-center">
                              <CheckCircle2 className="h-3 w-3" /> Fulfilled
                            </span>
                          )}

                          {order.status === 'cancelled' && (
                            <span className="font-mono text-[10px] text-red-400">Order Void</span>
                          )}

                          {/* Quick manual selector */}
                          <div className="relative inline-block ml-1">
                            <select
                              value={order.status}
                              onChange={(e) =>
                                handleStatusChange(order.id, e.target.value as OrderStatus)
                              }
                              title="Override order status"
                              className="cursor-pointer appearance-none rounded border border-[var(--border-color)] bg-[var(--bg-secondary)] px-2 py-1 pr-5 font-mono text-[10px] uppercase text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                            >
                              <option value="pending">Pending</option>
                              <option value="processing">Processing</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                              <option value="refunded">Refunded</option>
                            </select>
                            <ChevronDown className="pointer-events-none absolute right-1.5 top-2 h-2.5 w-2.5 text-[var(--text-muted)]" />
                          </div>
                        </div>
                      </td>

                      {/* Manage Button */}
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenOrderModal(order)}
                          className="text-[11px] uppercase tracking-wider gap-1.5 hover:text-[var(--color-noir-gold)]"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span>Inspect</span>
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Comprehensive Order Management Inspection Dialog */}
      <Dialog
        open={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={`Order Details & Fulfillment: ${selectedOrder?.orderNumber}`}
        description="Approve fulfillment state, manage courier tracking, and inspect patron purchase details."
        size="2xl"
      >
        {selectedOrder && (
          <div className="space-y-6 py-2">
            {/* Fulfillment Status Banner & Action Stepper */}
            <div className="border border-[var(--border-color)] bg-[var(--bg-secondary)] p-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-color)] pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-heading text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                    Current Fulfillment:
                  </span>
                  <Badge variant={selectedOrder.status === 'delivered' ? 'gold' : 'default'}>
                    {selectedOrder.status.toUpperCase()}
                  </Badge>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    to={`/track-order?ref=${selectedOrder.orderNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 font-heading text-[11px] font-semibold uppercase text-[var(--color-noir-gold)] hover:underline"
                  >
                    <span>Customer Tracking Page</span>
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>
              </div>

              {/* Status Action Buttons */}
              <div className="mt-4">
                <p className="font-heading text-[10px] uppercase tracking-wider text-[var(--text-muted)] mb-2">
                  Advance Order State (Updates Customer Live):
                </p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  <button
                    type="button"
                    onClick={() =>
                      handleStatusChange(
                        selectedOrder.id,
                        'pending',
                        customTracking,
                        adminNote || 'Order placed and under review'
                      )
                    }
                    className={`flex flex-col items-center justify-center border p-2.5 text-center transition-all ${
                      selectedOrder.status === 'pending'
                        ? 'border-[var(--color-noir-gold)] bg-[var(--color-noir-gold)]/10 text-[var(--color-noir-gold)] font-bold'
                        : 'border-[var(--border-color)] text-[var(--text-muted)] hover:border-[var(--text-primary)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    <Clock className="h-4 w-4 mb-1" />
                    <span className="font-heading text-[10px] uppercase">1. Pending</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleStatusChange(
                        selectedOrder.id,
                        'processing',
                        customTracking,
                        adminNote || 'Approved by Atelier: Item packed and boxed'
                      )
                    }
                    className={`flex flex-col items-center justify-center border p-2.5 text-center transition-all ${
                      selectedOrder.status === 'processing'
                        ? 'border-[var(--color-noir-gold)] bg-[var(--color-noir-gold)]/10 text-[var(--color-noir-gold)] font-bold'
                        : 'border-[var(--border-color)] text-[var(--text-muted)] hover:border-[var(--text-primary)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    <Package className="h-4 w-4 mb-1" />
                    <span className="font-heading text-[10px] uppercase">2. Pack &amp; Process</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const tracking =
                        customTracking ||
                        `AFRO-${Math.floor(100000 + Math.random() * 900000)}-EXP`;
                      setCustomTracking(tracking);
                      handleStatusChange(
                        selectedOrder.id,
                        'shipped',
                        tracking,
                        adminNote || 'Handed to white-glove courier for transit'
                      );
                    }}
                    className={`flex flex-col items-center justify-center border p-2.5 text-center transition-all ${
                      selectedOrder.status === 'shipped'
                        ? 'border-sky-500 bg-sky-500/10 text-sky-400 font-bold'
                        : 'border-[var(--border-color)] text-[var(--text-muted)] hover:border-[var(--text-primary)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    <Truck className="h-4 w-4 mb-1" />
                    <span className="font-heading text-[10px] uppercase">3. Dispatched / Shipped</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleStatusChange(
                        selectedOrder.id,
                        'delivered',
                        customTracking,
                        adminNote || 'Delivered to patron address'
                      )
                    }
                    className={`flex flex-col items-center justify-center border p-2.5 text-center transition-all ${
                      selectedOrder.status === 'delivered'
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400 font-bold'
                        : 'border-[var(--border-color)] text-[var(--text-muted)] hover:border-[var(--text-primary)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    <CheckCircle2 className="h-4 w-4 mb-1" />
                    <span className="font-heading text-[10px] uppercase">4. Delivered</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Tracking Number & Operational Note Input */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-heading text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                    Courier Tracking Code
                  </label>
                  <button
                    type="button"
                    onClick={handleGenerateTracking}
                    className="flex items-center gap-1 font-mono text-[10px] text-[var(--color-noir-gold)] hover:underline"
                  >
                    <Sparkles className="h-3 w-3" />
                    Generate Code
                  </button>
                </div>
                <div className="flex gap-2">
                  <Input
                    value={customTracking}
                    onChange={(e) => setCustomTracking(e.target.value)}
                    placeholder="e.g. AFRO-918234-EXP"
                    className="font-mono text-xs"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      updateOrderStatus(
                        selectedOrder.id,
                        selectedOrder.status,
                        customTracking,
                        'Tracking code updated by Atelier operations'
                      );
                      const updated = useUserStore
                        .getState()
                        .orders.find((o) => o.id === selectedOrder.id);
                      if (updated) setSelectedOrder(updated);
                      toast.success('Tracking Saved', `Assigned code: ${customTracking}`);
                    }}
                    className="shrink-0 text-[10px] uppercase tracking-wider px-3"
                  >
                    Save
                  </Button>
                </div>
              </div>

              <div>
                <label className="mb-1 block font-heading text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                  Atelier Fulfillment Note (Appears on Customer Timeline)
                </label>
                <Input
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  placeholder="e.g. Prepared with bespoke signature dust bag"
                  className="text-xs"
                />
              </div>
            </div>

            {/* Customer Details & Shipping Address */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="border border-[var(--border-color)] bg-[var(--bg-primary)] p-4">
                <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] mb-2">
                  Patron &amp; Delivery Address
                </h4>
                <p className="font-medium text-xs text-[var(--text-primary)]">
                  {selectedOrder.shippingAddress.firstName} {selectedOrder.shippingAddress.lastName}
                </p>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  {selectedOrder.shippingAddress.line1}
                  {selectedOrder.shippingAddress.line2 && `, ${selectedOrder.shippingAddress.line2}`}
                </p>
                <p className="text-xs text-[var(--text-muted)]">
                  {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}{' '}
                  {selectedOrder.shippingAddress.zip}
                </p>
                <p className="text-xs text-[var(--text-muted)]">{selectedOrder.shippingAddress.country}</p>
                <p className="font-mono text-[11px] text-[var(--color-noir-gold)] mt-2">
                  {selectedOrder.shippingAddress.phone || 'Phone: Not provided'}
                </p>
              </div>

              <div className="border border-[var(--border-color)] bg-[var(--bg-primary)] p-4">
                <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] mb-2">
                  Financial Settlement
                </h4>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-[var(--text-muted)]">
                    <span>Subtotal:</span>
                    <span>{formatPrice(selectedOrder.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-[var(--text-muted)]">
                    <span>Shipping:</span>
                    <span>{selectedOrder.shipping === 0 ? 'Complimentary' : formatPrice(selectedOrder.shipping)}</span>
                  </div>
                  <div className="flex justify-between text-[var(--text-muted)]">
                    <span>Tax (Atelier Duty):</span>
                    <span>{formatPrice(selectedOrder.tax)}</span>
                  </div>
                  {selectedOrder.discount > 0 && (
                    <div className="flex justify-between text-emerald-500">
                      <span>Privilege Discount:</span>
                      <span>-{formatPrice(selectedOrder.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t border-[var(--border-color)] pt-2 font-heading font-bold text-[var(--text-primary)]">
                    <span>Grand Total:</span>
                    <span className="text-[var(--color-noir-gold)]">{formatPrice(selectedOrder.total)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Ordered Items List */}
            <div className="border border-[var(--border-color)] bg-[var(--bg-primary)] p-4">
              <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] mb-3">
                Ordered Creations ({selectedOrder.items.length})
              </h4>
              <div className="divide-y divide-[var(--border-color)]">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between py-2.5">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="h-12 w-10 object-cover border border-[var(--border-color)]"
                      />
                      <div>
                        <p className="font-heading text-xs font-bold text-[var(--text-primary)]">
                          {item.productName}
                        </p>
                        <p className="text-[11px] text-[var(--text-muted)]">
                          Qty: {item.quantity} &bull;{' '}
                          {item.selectedColor ? `Color: ${item.selectedColor}` : ''}{' '}
                          {item.selectedSize ? `| Size: ${item.selectedSize}` : ''}
                        </p>
                      </div>
                    </div>
                    <span className="font-heading text-xs font-bold text-[var(--text-primary)]">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Milestone Timeline Log */}
            {selectedOrder.timeline && selectedOrder.timeline.length > 0 && (
              <div className="border border-[var(--border-color)] bg-[var(--bg-secondary)] p-4">
                <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] mb-3">
                  Live Fulfillment Audit Trail
                </h4>
                <div className="space-y-3">
                  {selectedOrder.timeline.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-xs">
                      <div className="mt-0.5 h-2 w-2 rounded-full bg-[var(--color-noir-gold)] shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-heading text-[11px] font-bold uppercase text-[var(--text-primary)]">
                            {step.status}
                          </span>
                          <span className="font-mono text-[10px] text-[var(--text-muted)]">
                            {formatDate(step.timestamp, 'short')}
                          </span>
                        </div>
                        <p className="text-[11px] text-[var(--text-secondary)]">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Dialog>
    </div>
  );
}
