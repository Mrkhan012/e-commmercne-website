import type { Product } from '@/types';
import { ProductCard } from '@/components/product/ProductCard';
import { cn } from '@/utils/cn';

export interface ProductGridProps {
  products: Product[];
  onQuickView?: (product: Product) => void;
  columns?: 2 | 3 | 4;
  className?: string;
  emptyMessage?: string;
}

const columnStyles = {
  2: 'grid-cols-2',
  3: 'grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
};

export function ProductGrid({
  products,
  onQuickView,
  columns = 4,
  className,
  emptyMessage = 'No products found.',
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="border border-dashed border-[var(--border-color)] py-20 text-center">
        <p className="text-sm text-[var(--text-muted)]">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={cn('grid gap-x-4 gap-y-10 sm:gap-x-6', columnStyles[columns], className)}>
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          index={index}
          onQuickView={onQuickView}
        />
      ))}
    </div>
  );
}
