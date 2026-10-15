import { DollarSign, ShoppingBag, TrendingUp, Users, ArrowRight, Package, Truck, CheckCircle2, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { StatCard } from '@/components/dashboard/StatCard';
import { DataTable } from '@/components/dashboard/DataTable';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useUserStore } from '@/store/userStore';
import { useProductStore } from '@/store/productStore';
import { useToastStore } from '@/store/toastStore';
import { formatPrice } from '@/utils/format';
import type { OrderStatus } from '@/types';

export default function AdminDashboard() {
  const { orders, updateOrderStatus } = useUserStore();
  const { products } = useProductStore();
  const toast = useToastStore();

  const handleQuickStatusChange = (orderId: string, newStatus: OrderStatus) => {
    const tracking =
      newStatus === 'shipped' ? `AFRO-${Math.floor(100000 + Math.random() * 900000)}-EXP` : undefined;
    updateOrderStatus(orderId, newStatus, tracking);
    toast.success('Order Updated', `Order #${orderId} moved to ${newStatus.toUpperCase()}`);
  };

  const orderColumns = [
    {
      key: 'orderNumber',
      header: 'Order Reference',
      render: (row: (typeof orders)[0]) => (
        <Link
          to="/admin/orders"
          className="font-mono text-xs font-bold text-[var(--color-noir-gold)] hover:underline"
        >
          {row.orderNumber}
        </Link>
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
    {
      key: 'quickAction',
      header: 'Approve / Advance',
      align: 'right' as const,
      render: (row: (typeof orders)[0]) => (
        <div className="flex items-center justify-end gap-1.5">
          {row.status === 'pending' && (
            <Button
              size="sm"
              onClick={() => handleQuickStatusChange(row.id, 'processing')}
              className="text-[10px] py-1 px-2 uppercase tracking-wider gap-1 bg-[var(--color-noir-gold)] text-black hover:opacity-90"
            >
              <Package className="h-3 w-3" />
              <span>Pack</span>
            </Button>
          )}
          {row.status === 'processing' && (
            <Button
              size="sm"
              onClick={() => handleQuickStatusChange(row.id, 'shipped')}
              className="text-[10px] py-1 px-2 uppercase tracking-wider gap-1 border border-sky-500/40 bg-sky-500/10 text-sky-400 hover:bg-sky-500/20"
            >
              <Truck className="h-3 w-3" />
              <span>Ship</span>
            </Button>
          )}
          {row.status === 'shipped' && (
            <Button
              size="sm"
              onClick={() => handleQuickStatusChange(row.id, 'delivered')}
              className="text-[10px] py-1 px-2 uppercase tracking-wider gap-1 border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
            >
              <CheckCircle2 className="h-3 w-3" />
              <span>Deliver</span>
            </Button>
          )}
          {row.status === 'delivered' && (
            <span className="font-mono text-[10px] text-emerald-400">Complete</span>
          )}
          {row.status === 'cancelled' && (
            <span className="font-mono text-[10px] text-red-400">Cancelled</span>
          )}
        </div>
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

      {/* Active Sales & Offers Widget */}
      <div className="border border-[var(--border-color)] bg-[var(--bg-card)] p-6">
        <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4">
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-[var(--color-noir-gold)]" />
            <h2 className="font-heading text-sm font-bold uppercase tracking-wider text-[var(--text-primary)]">
              Active Store Sales &amp; Promotional Offers ({products.filter((p) => p.discount && p.discount > 0).length} on Sale)
            </h2>
          </div>
          <Link
            to="/admin/products"
            className="flex items-center gap-1 font-heading text-xs font-semibold uppercase tracking-wider text-[var(--color-noir-gold)] hover:underline"
          >
            <span>Manage Product Offers</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {products
            .filter((p) => p.discount && p.discount > 0)
            .slice(0, 4)
            .map((p) => (
              <div key={p.id} className="border border-[var(--border-color)] bg-[var(--bg-secondary)] p-3">
                <div className="flex items-center gap-3">
                  <img src={p.images[0]?.url} alt={p.name} className="h-12 w-10 object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="font-heading text-xs font-bold text-[var(--text-primary)] truncate">
                      {p.name}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="font-heading text-xs font-bold text-[var(--color-noir-gold)]">
                        {formatPrice(p.price)}
                      </span>
                      {p.originalPrice && (
                        <span className="text-[10px] text-[var(--text-muted)] line-through">
                          {formatPrice(p.originalPrice)}
                        </span>
                      )}
                    </div>
                    <span className="inline-block mt-1 font-mono text-[9px] font-bold text-red-500 bg-red-500/10 px-1.5 py-0.2">
                      -{p.discount}% OFF
                    </span>
                  </div>
                </div>
              </div>
            ))}
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
