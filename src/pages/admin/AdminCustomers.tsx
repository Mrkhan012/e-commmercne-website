import { DataTable } from '@/components/dashboard/DataTable';
import { Badge } from '@/components/ui/Badge';
import { formatPrice } from '@/utils/format';

const DEMO_CUSTOMERS = [
  {
    id: 'cust-1',
    name: 'Elena Rostova',
    email: 'elena.r@luxemail.com',
    location: 'New York, US',
    ordersCount: 8,
    totalSpent: 12450,
    tier: 'Private VIP',
  },
  {
    id: 'cust-2',
    name: 'Julian Vance',
    email: 'j.vance@atelier-arch.com',
    location: 'Paris, FR',
    ordersCount: 5,
    totalSpent: 7890,
    tier: 'Connoisseur',
  },
  {
    id: 'cust-3',
    name: 'Chloe Davenport',
    email: 'chloe.d@davenport.co.uk',
    location: 'London, UK',
    ordersCount: 11,
    totalSpent: 18200,
    tier: 'Private VIP',
  },
  {
    id: 'cust-4',
    name: 'Kenji Takahashi',
    email: 'k.takahashi@ginza.jp',
    location: 'Tokyo, JP',
    ordersCount: 3,
    totalSpent: 4200,
    tier: 'Member',
  },
  {
    id: 'cust-5',
    name: 'Amina Al-Mansoor',
    email: 'amina@dubaiholdings.ae',
    location: 'Dubai, UAE',
    ordersCount: 14,
    totalSpent: 29500,
    tier: 'Private VIP',
  },
];

export default function AdminCustomers() {
  const columns = [
    {
      key: 'name',
      header: 'Client',
      render: (c: (typeof DEMO_CUSTOMERS)[0]) => (
        <div>
          <p className="font-heading text-xs font-bold text-[var(--text-primary)]">{c.name}</p>
          <p className="text-[11px] text-[var(--text-muted)]">{c.email}</p>
        </div>
      ),
    },
    {
      key: 'location',
      header: 'Location',
      render: (c: (typeof DEMO_CUSTOMERS)[0]) => (
        <span className="text-xs text-[var(--text-secondary)]">{c.location}</span>
      ),
    },
    {
      key: 'ordersCount',
      header: 'Acquisitions',
      align: 'center' as const,
      render: (c: (typeof DEMO_CUSTOMERS)[0]) => (
        <span className="font-mono text-xs">{c.ordersCount} orders</span>
      ),
    },
    {
      key: 'totalSpent',
      header: 'Lifetime Value',
      align: 'right' as const,
      render: (c: (typeof DEMO_CUSTOMERS)[0]) => (
        <span className="font-heading text-xs font-bold text-[var(--color-noir-gold)]">
          {formatPrice(c.totalSpent)}
        </span>
      ),
    },
    {
      key: 'tier',
      header: 'Status Tier',
      align: 'center' as const,
      render: (c: (typeof DEMO_CUSTOMERS)[0]) => (
        <Badge variant={c.tier === 'Private VIP' ? 'gold' : 'default'}>
          {c.tier.toUpperCase()}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <p className="font-heading text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
          Clientele Roster
        </p>
        <h1 className="mt-1 font-heading text-3xl font-extrabold text-[var(--text-primary)]">
          Customer Directory ({DEMO_CUSTOMERS.length})
        </h1>
      </div>

      <div className="border border-[var(--border-color)] bg-[var(--bg-card)] p-6">
        <DataTable columns={columns} data={DEMO_CUSTOMERS} />
      </div>
    </div>
  );
}
