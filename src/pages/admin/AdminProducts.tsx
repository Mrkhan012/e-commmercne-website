import { useState } from 'react';
import { DataTable } from '@/components/dashboard/DataTable';
import { Badge } from '@/components/ui/Badge';
import { products } from '@/data/products';
import { formatPrice } from '@/utils/format';
import type { Product } from '@/types';

export default function AdminProducts() {
  const [productList] = useState<Product[]>(products);

  const columns = [
    {
      key: 'image',
      header: 'Piece',
      width: '60px',
      render: (p: Product) => (
        <img src={p.images[0]?.url} alt={p.name} className="h-10 w-9 object-cover" />
      ),
    },
    {
      key: 'name',
      header: 'Title & Brand',
      render: (p: Product) => (
        <div>
          <p className="font-heading text-xs font-bold text-[var(--text-primary)]">{p.name}</p>
          <p className="text-[11px] text-[var(--text-muted)]">{p.brand}</p>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      render: (p: Product) => (
        <span className="font-mono text-xs uppercase text-[var(--text-secondary)]">
          {p.category}
        </span>
      ),
    },
    {
      key: 'price',
      header: 'Price',
      align: 'right' as const,
      render: (p: Product) => (
        <span className="font-heading text-xs font-bold">{formatPrice(p.price)}</span>
      ),
    },
    {
      key: 'stock',
      header: 'Atelier Stock',
      align: 'center' as const,
      render: (p: Product) => (
        <span
          className={`font-mono text-xs font-semibold ${
            p.stock < 10 ? 'text-amber-500' : 'text-[var(--text-secondary)]'
          }`}
        >
          {p.stock} in atelier
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      align: 'center' as const,
      render: (p: Product) => (
        <Badge variant={p.status === 'new' ? 'gold' : 'default'}>
          {p.status.toUpperCase()}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <p className="font-heading text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
          Atelier Catalog
        </p>
        <h1 className="mt-1 font-heading text-3xl font-extrabold text-[var(--text-primary)]">
          Products ({productList.length})
        </h1>
      </div>

      <div className="border border-[var(--border-color)] bg-[var(--bg-card)] p-6">
        <DataTable columns={columns} data={productList} />
      </div>
    </div>
  );
}
