import { cn } from '@/utils/cn';
import { formatPrice } from '@/utils/format';

export interface PriceDisplayProps {
  price: number;
  originalPrice?: number;
  discount?: number;
  size?: 'sm' | 'md' | 'lg';
  currency?: string;
  className?: string;
}

const sizeStyles = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-2xl',
};

export function PriceDisplay({
  price,
  originalPrice,
  discount,
  size = 'md',
  currency = 'USD',
  className,
}: PriceDisplayProps) {
  const hasDiscount = originalPrice !== undefined && originalPrice > price;

  return (
    <div className={cn('flex items-baseline gap-2', className)}>
      <span
        className={cn(
          'font-heading font-semibold text-[var(--text-primary)]',
          sizeStyles[size]
        )}
      >
        {formatPrice(price, currency)}
      </span>
      {hasDiscount && (
        <>
          <span className="text-xs text-[var(--text-muted)] line-through">
            {formatPrice(originalPrice, currency)}
          </span>
          {discount !== undefined && discount > 0 && (
            <span className="font-heading text-[11px] font-bold uppercase tracking-wider text-red-500">
              −{discount}%
            </span>
          )}
        </>
      )}
    </div>
  );
}
