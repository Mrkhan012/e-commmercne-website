import { DollarSign, ShoppingBag, TrendingUp, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { StatCard } from '@/components/dashboard/StatCard';
import { DataTable } from '@/components/dashboard/DataTable';
import { Badge } from '@/components/ui/Badge';
import { useUserStore } from '@/store/userStore';
import { products } from '@/data/products';
import { formatPrice } from '@/utils/format';

export default function AdminDashboard() {
  const { orders } = useUserStore();

  const orderColumns = [
    {
      key: 'orderNumber',
      header: 'Order Reference',
      render: (row: (typeof orders)[0]) => (
        <span className="font-mono text-xs font-bold text-[var(--color-noir-gold)]">
          {row.orderNumber}
        </span>
      ),
    },
    {
      key: 'customer',
      header: 'Client',
      render: (row: (typeof orders)[0]) => (
        <span className="text-xs">
          {row.shippingAddress.firstName} {row.shippingAddress.lastName}
        </span>
      ),
    },
    {
      key: 'items',
      header: 'Pieces',
      render: (row: (typeof orders)[0]) => (
        <span className="text-xs text-[var(--text-muted)]">
          {row.items.reduce((acc, i) => acc + i.quantity, 0)} item(s)
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
      header: 'Status',
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
      <div>
        <p className="font-heading text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
          Executive Summary
        </p>
        <h1 className="mt-1 font-heading text-3xl font-extrabold text-[var(--text-primary)]">
          Atelier Overview
        </h1>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Revenue (MTD)"
          value="$148,920"
          change={14.6}
          icon={<DollarSign className="h-4 w-4" />}
        />
        <StatCard
          label="Orders Dispatched"
          value="342"
          change={8.2}
          icon={<ShoppingBag className="h-4 w-4" />}
        />
        <StatCard
          label="Average Order Value"
          value="$635.40"
          change={3.1}
          icon={<TrendingUp className="h-4 w-4" />}
        />
        <StatCard
          label="Private VIP Clients"
          value="1,280"
          change={18.4}
          icon={<Users className="h-4 w-4" />}
        />
      </div>

      {/* Recent Orders Section */}
      <div className="border border-[var(--border-color)] bg-[var(--bg-card)] p-6">
        <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4">
          <h2 className="font-heading text-sm font-bold uppercase tracking-wider text-[var(--text-primary)]">
            Recent Client Orders
          </h2>
          <Link
            to="/admin/orders"
            className="flex items-center gap-1 font-heading text-xs font-semibold uppercase tracking-wider text-[var(--color-noir-gold)] hover:underline"
          >
            <span>View All Orders</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="mt-4">
          <DataTable columns={orderColumns} data={orders} />
        </div>
      </div>

      {/* Low Stock Warning Section */}
      <div className="border border-[var(--border-color)] bg-[var(--bg-card)] p-6">
        <h2 className="border-b border-[var(--border-color)] pb-4 font-heading text-sm font-bold uppercase tracking-wider text-[var(--text-primary)]">
          Atelier Stock Advisories
        </h2>
        <div className="mt-4 divide-y divide-[var(--border-color)]">
          {products.slice(0, 4).map((p) => (
            <div key={p.id} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <img src={p.images[0]?.url} alt={p.name} className="h-10 w-9 object-cover" />
                <div>
                  <p className="font-heading text-xs font-bold text-[var(--text-primary)]">{p.name}</p>
                  <p className="text-[11px] text-[var(--text-muted)]">{p.category} &bull; {formatPrice(p.price)}</p>
                </div>
              </div>
              <span className="font-mono text-xs font-bold text-amber-500">
                {p.stock} units remaining
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
