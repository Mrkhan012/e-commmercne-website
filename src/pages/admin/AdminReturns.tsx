import { DataTable } from '@/components/dashboard/DataTable';
import { Badge } from '@/components/ui/Badge';
import { formatPrice } from '@/utils/format';

const DEMO_RETURNS = [
  {
    id: 'rma-101',
    orderNumber: 'NC-2024-8842',
    client: 'Julian Vance',
    item: 'Cashmere Scarf (Camel)',
    reason: 'Fit & drape preference',
    status: 'Inspection Passed',
    refundAmount: 265,
    date: 'Oct 12, 2024',
  },
  {
    id: 'rma-102',
    orderNumber: 'NC-2024-7719',
    client: 'Chloe Davenport',
    item: 'Double-Breasted Wool Blazer (38R)',
    reason: 'Exchanging for size 40R',
    status: 'In Transit to Atelier',
    refundAmount: 890,
    date: 'Oct 14, 2024',
  },
  {
    id: 'rma-103',
    orderNumber: 'NC-2024-6401',
    client: 'Kenji Takahashi',
    item: 'Silk Satin Evening Shirt (White)',
    reason: 'Wrong size ordered',
    status: 'Refund Processed',
    refundAmount: 380,
    date: 'Sep 29, 2024',
  },
];

export default function AdminReturns() {
  const columns = [
    {
      key: 'id',
      header: 'RMA Number',
      render: (r: (typeof DEMO_RETURNS)[0]) => (
        <span className="font-mono text-xs font-bold text-[var(--color-noir-gold)]">
          {r.id.toUpperCase()}
        </span>
      ),
    },
    {
      key: 'orderNumber',
      header: 'Original Order',
      render: (r: (typeof DEMO_RETURNS)[0]) => (
        <div>
          <span className="font-mono text-xs">{r.orderNumber}</span>
          <p className="text-[10px] text-[var(--text-muted)]">{r.client}</p>
        </div>
      ),
    },
    {
      key: 'item',
      header: 'Returned Piece',
      render: (r: (typeof DEMO_RETURNS)[0]) => (
        <div>
          <span className="text-xs font-medium text-[var(--text-primary)]">{r.item}</span>
          <p className="text-[10px] text-[var(--text-muted)]">{r.reason}</p>
        </div>
      ),
    },
    {
      key: 'refundAmount',
      header: 'Refund Amount',
      align: 'right' as const,
      render: (r: (typeof DEMO_RETURNS)[0]) => (
        <span className="font-heading text-xs font-bold">{formatPrice(r.refundAmount)}</span>
      ),
    },
    {
      key: 'status',
      header: 'RMA Status',
      align: 'center' as const,
      render: (r: (typeof DEMO_RETURNS)[0]) => (
        <Badge
          variant={
            r.status === 'Refund Processed'
              ? 'gold'
              : r.status === 'Inspection Passed'
                ? 'best'
                : 'default'
          }
        >
          {r.status.toUpperCase()}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <p className="font-heading text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
          Logistics &amp; Reverse Flow
        </p>
        <h1 className="mt-1 font-heading text-3xl font-extrabold text-[var(--text-primary)]">
          Returns &amp; Exchanges ({DEMO_RETURNS.length})
        </h1>
      </div>

      <div className="border border-[var(--border-color)] bg-[var(--bg-card)] p-6">
        <DataTable columns={columns} data={DEMO_RETURNS} />
      </div>
    </div>
  );
}
