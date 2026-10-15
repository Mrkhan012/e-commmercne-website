import { DataTable } from '@/components/dashboard/DataTable';
import { RatingStars } from '@/components/ui/RatingStars';
import { Badge } from '@/components/ui/Badge';
import { reviews } from '@/data/reviews';
import { formatDate } from '@/utils/format';
import type { Review } from '@/types';

export default function AdminReviews() {
  const columns = [
    {
      key: 'userName',
      header: 'Reviewer',
      render: (r: Review) => (
        <div>
          <p className="font-heading text-xs font-bold text-[var(--text-primary)]">{r.userName}</p>
          <p className="text-[10px] text-[var(--text-muted)]">
            {formatDate(r.createdAt, 'short')}
          </p>
        </div>
      ),
    },
    {
      key: 'rating',
      header: 'Rating',
      render: (r: Review) => <RatingStars rating={r.rating} size="sm" />,
    },
    {
      key: 'title',
      header: 'Subject & Evaluation',
      render: (r: Review) => (
        <div className="max-w-md">
          <p className="font-heading text-xs font-semibold text-[var(--text-primary)]">{r.title}</p>
          <p className="text-xs text-[var(--text-secondary)] line-clamp-2">{r.body}</p>
        </div>
      ),
    },
    {
      key: 'helpful',
      header: 'Helpful Votes',
      align: 'center' as const,
      render: (r: Review) => (
        <span className="font-mono text-xs">{r.helpful} votes</span>
      ),
    },
    {
      key: 'status',
      header: 'Moderation',
      align: 'center' as const,
      render: (r: Review) => (
        <Badge variant={r.isVerifiedPurchase ? 'gold' : 'default'}>
          {r.isVerifiedPurchase ? 'VERIFIED' : 'COMMUNITY'}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <p className="font-heading text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
          Moderation &amp; Sentiment
        </p>
        <h1 className="mt-1 font-heading text-3xl font-extrabold text-[var(--text-primary)]">
          Client Reviews ({reviews.length})
        </h1>
      </div>

      <div className="border border-[var(--border-color)] bg-[var(--bg-card)] p-6">
        <DataTable columns={columns} data={reviews} />
      </div>
    </div>
  );
}
