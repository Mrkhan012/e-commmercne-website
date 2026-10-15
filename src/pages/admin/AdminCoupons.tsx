import { DataTable } from '@/components/dashboard/DataTable';
import { Badge } from '@/components/ui/Badge';
import { coupons } from '@/data/coupons';

export default function AdminCoupons() {
  const couponList = coupons.map((c) => ({
    ...c,
    id: c.code,
  }));

  const columns = [
    {
      key: 'code',
      header: 'Promo Code',
      render: (c: typeof couponList[0]) => (
        <span className="font-mono text-xs font-bold text-[var(--color-noir-gold)]">
          {c.code}
        </span>
      ),
    },
    {
      key: 'description',
      header: 'Privilege Terms',
      render: (c: typeof couponList[0]) => (
        <span className="text-xs text-[var(--text-primary)]">{c.description}</span>
      ),
    },
    {
      key: 'type',
      header: 'Discount Structure',
      render: (c: typeof couponList[0]) => (
        <span className="font-mono text-xs uppercase text-[var(--text-muted)]">
          {c.type === 'percentage'
            ? `${c.value}% OFF`
            : c.type === 'fixed'
              ? `$${c.value} OFF`
              : 'COMPLIMENTARY SHIPPING'}
        </span>
      ),
    },
    {
      key: 'minSpend',
      header: 'Minimum Acquisition',
      align: 'right' as const,
      render: (c: typeof couponList[0]) => (
        <span className="font-mono text-xs">
          {c.minSpend ? `$${c.minSpend}` : 'None'}
        </span>
      ),
    },
    {
      key: 'active',
      header: 'Status',
      align: 'center' as const,
      render: (c: typeof couponList[0]) => (
        <Badge variant={c.active ? 'gold' : 'outline'}>
          {c.active ? 'ACTIVE' : 'EXPIRED'}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <p className="font-heading text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
          Privilege Incentives
        </p>
        <h1 className="mt-1 font-heading text-3xl font-extrabold text-[var(--text-primary)]">
          Promotional Coupons ({coupons.length})
        </h1>
      </div>

      <div className="border border-[var(--border-color)] bg-[var(--bg-card)] p-6">
        <DataTable columns={columns} data={couponList} />
      </div>
    </div>
  );
}
