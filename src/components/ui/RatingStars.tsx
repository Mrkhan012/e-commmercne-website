import { Star } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface RatingStarsProps {
  rating: number;
  count?: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  className?: string;
}

const sizeMap = {
  sm: 'h-3 w-3',
  md: 'h-3.5 w-3.5',
  lg: 'h-4 w-4',
};

export function RatingStars({
  rating,
  count,
  size = 'md',
  showValue = false,
  className,
}: RatingStarsProps) {
  const rounded = Math.round(rating);

  return (
    <div
      className={cn('flex items-center gap-1.5', className)}
      aria-label={`Rated ${rating} out of 5${count !== undefined ? ` from ${count} reviews` : ''}`}
    >
      <div className="flex items-center gap-0.5" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              sizeMap[size],
              star <= rounded
                ? 'fill-[var(--color-noir-gold)] text-[var(--color-noir-gold)]'
                : 'fill-transparent text-[var(--border-color)]'
            )}
          />
        ))}
      </div>
      {showValue && (
        <span className="text-xs font-medium text-[var(--text-secondary)]">
          {rating.toFixed(1)}
        </span>
      )}
      {count !== undefined && (
        <span className="text-xs text-[var(--text-muted)]">({count})</span>
      )}
    </div>
  );
}
