import { cn } from '@/utils/cn';

export interface SkeletonProps {
  className?: string;
  /** Rounded skeleton for images, square for text blocks. */
  variant?: 'default' | 'circle';
}

export function Skeleton({ className, variant = 'default' }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'skeleton',
        variant === 'circle' ? 'rounded-full' : 'rounded-none',
        className
      )}
    />
  );
}

/** Full product-card placeholder shown while the catalog loads. */
export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton className="aspect-[4/5] w-full" />
      <Skeleton className="h-3 w-1/3" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/4" />
    </div>
  );
}

/** Grid of product-card placeholders. */
export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
