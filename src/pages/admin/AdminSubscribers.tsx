import { DataTable } from '@/components/dashboard/DataTable';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Download } from 'lucide-react';

const DEMO_SUBSCRIBERS = [
  { id: 'sub-1', email: 'vance.julian@gmail.com', source: 'Homepage Footer', date: 'Oct 14, 2024', status: 'Subscribed' },
  { id: 'sub-2', email: 'elena.rostova@fashion.it', source: 'Checkout Opt-in', date: 'Oct 13, 2024', status: 'Subscribed' },
  { id: 'sub-3', email: 'c.davenport@mayfair.co.uk', source: 'VIP Lookbook Popup', date: 'Oct 11, 2024', status: 'Subscribed' },
  { id: 'sub-4', email: 'marcus.aurelius@roma.org', source: 'Homepage Footer', date: 'Oct 09, 2024', status: 'Subscribed' },
  { id: 'sub-5', email: 'clara.oswald@tardis.net', source: 'Lookbook Download', date: 'Oct 05, 2024', status: 'Subscribed' },
];

export default function AdminSubscribers() {
  const columns = [
    {
      key: 'email',
      header: 'Recipient Email',
      render: (s: (typeof DEMO_SUBSCRIBERS)[0]) => (
        <span className="font-mono text-xs font-semibold text-[var(--text-primary)]">
          {s.email}
        </span>
      ),
    },
    {
      key: 'source',
      header: 'Acquisition Channel',
      render: (s: (typeof DEMO_SUBSCRIBERS)[0]) => (
        <span className="text-xs text-[var(--text-muted)]">{s.source}</span>
      ),
    },
    {
      key: 'date',
      header: 'Subscribed On',
      render: (s: (typeof DEMO_SUBSCRIBERS)[0]) => (
        <span className="text-xs text-[var(--text-secondary)]">{s.date}</span>
      ),
    },
    {
      key: 'status',
      header: 'Subscription Status',
      align: 'center' as const,
      render: (s: (typeof DEMO_SUBSCRIBERS)[0]) => (
        <Badge variant="gold">{s.status.toUpperCase()}</Badge>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-heading text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
            Audience &amp; Newsletter
          </p>
          <h1 className="mt-1 font-heading text-3xl font-extrabold text-[var(--text-primary)]">
            Subscribers ({DEMO_SUBSCRIBERS.length})
          </h1>
        </div>

        <Button variant="outline" className="gap-2 uppercase tracking-wider text-xs">
          <Download className="h-4 w-4" />
          Export CSV List
        </Button>
      </div>

      <div className="border border-[var(--border-color)] bg-[var(--bg-card)] p-6">
        <DataTable columns={columns} data={DEMO_SUBSCRIBERS} />
      </div>
    </div>
  );
}
