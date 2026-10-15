import { useState } from 'react';
import { DataTable } from '@/components/dashboard/DataTable';
import { Badge } from '@/components/ui/Badge';
import { useUserStore } from '@/store/userStore';
import { formatPrice, formatDate } from '@/utils/format';
import type { OrderStatus } from '@/types';

export default function AdminOrders() {
  const { orders } = useUserStore();
  const [filter, setFilter] = useState<'all' | OrderStatus>('all');

  const filteredOrders =
    filter === 'all' ? orders : orders.filter((o) => o.status === filter);

  const columns = [
    {
      key: 'orderNumber',
      header: 'Reference',
      render: (row: (typeof orders)[0]) => (
        <span className="font-mono text-xs font-bold text-[var(--color-noir-gold)]">
          {row.orderNumber}
        </span>
      ),
    },
    {
      key: 'customer',
      header: 'Customer',
      render: (row: (typeof orders)[0]) => (
        <span className="text-xs font-medium">
          {row.shippingAddress.firstName} {row.shippingAddress.lastName}
        </span>
      ),
    },
    {
      key: 'date',
      header: 'Placed Date',
      render: (row: (typeof orders)[0]) => (
        <span className="text-xs text-[var(--text-muted)]">
          {formatDate(row.createdAt || new Date().toISOString(), 'short')}
        </span>
      ),
    },
    {
      key: 'items',
      header: 'Items',
      render: (row: (typeof orders)[0]) => (
        <span className="text-xs text-[var(--text-muted)]">
          {row.items.map((i) => i.productName).join(', ')}
        </span>
      ),
    },
    {
      key: 'total',
      header: 'Total',
      align: 'right' as const,
      render: (row: (typeof orders)[0]) => (
        <span className="font-heading text-xs font-bold">{formatPrice(row.total)}</span>
      ),
    },
    {
      key: 'status',
      header: 'Fulfillment',
      align: 'center' as const,
      render: (row: (typeof orders)[0]) => (
        <Badge variant={row.status === 'delivered' ? 'gold' : 'default'}>
          {row.status.toUpperCase()}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-heading text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
            Order Fulfillment
          </p>
          <h1 className="mt-1 font-heading text-3xl font-extrabold text-[var(--text-primary)]">
            Client Orders ({filteredOrders.length})
          </h1>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          {(['all', 'pending', 'processing', 'shipped', 'delivered'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`border px-3 py-1.5 font-heading text-xs uppercase tracking-wider transition-colors ${
                filter === st
                  ? 'border-[var(--color-noir-gold)] bg-[var(--bg-secondary)] text-[var(--text-primary)]'
                  : 'border-[var(--border-color)] text-[var(--text-muted)] hover:border-[var(--text-primary)]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      <div className="border border-[var(--border-color)] bg-[var(--bg-card)] p-6">
        <DataTable columns={columns} data={filteredOrders} />
      </div>
    </div>
  );
}
