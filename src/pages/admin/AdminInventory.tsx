import { useState } from 'react';
import { DataTable } from '@/components/dashboard/DataTable';
import { products } from '@/data/products';
import { formatPrice } from '@/utils/format';
import type { Product } from '@/types';

export default function AdminInventory() {
  const [filterLow, setFilterLow] = useState(false);

  const inventoryList = filterLow
    ? products.filter((p) => p.stock < 15)
    : products;

  const columns = [
    {
      key: 'name',
      header: 'Product',
      render: (p: Product) => (
        <div className="flex items-center gap-3">
          <img src={p.images[0]?.url} alt={p.name} className="h-9 w-8 object-cover" />
          <div>
            <p className="font-heading text-xs font-bold text-[var(--text-primary)]">{p.name}</p>
            <p className="font-mono text-[10px] text-[var(--text-muted)]">SKU: {p.id.toUpperCase()}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'stock',
      header: 'Units In Stock',
      align: 'center' as const,
      render: (p: Product) => (
        <span
          className={`font-mono text-xs font-bold ${
            p.stock <= 5 ? 'text-red-500' : p.stock <= 12 ? 'text-amber-500' : 'text-emerald-500'
          }`}
        >
          {p.stock}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Stock Health',
      align: 'center' as const,
      render: (p: Product) => (
        <span
          className={`inline-block px-2 py-0.5 font-mono text-[10px] uppercase font-semibold ${
            p.stock <= 5
              ? 'bg-red-500/10 text-red-500'
              : p.stock <= 12
                ? 'bg-amber-500/10 text-amber-500'
                : 'bg-emerald-500/10 text-emerald-500'
          }`}
        >
          {p.stock <= 5 ? 'Critical Low' : p.stock <= 12 ? 'Low Supply' : 'Optimal'}
        </span>
      ),
    },
    {
      key: 'price',
      header: 'Unit Value',
      align: 'right' as const,
      render: (p: Product) => (
        <span className="font-heading text-xs font-bold">{formatPrice(p.price)}</span>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-heading text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
            Warehousing &amp; Vault
          </p>
          <h1 className="mt-1 font-heading text-3xl font-extrabold text-[var(--text-primary)]">
            Inventory Management
          </h1>
        </div>

        <button
          onClick={() => setFilterLow(!filterLow)}
          className={`border px-3.5 py-2 font-heading text-xs uppercase tracking-wider transition-colors ${
            filterLow
              ? 'border-amber-500 bg-amber-500/10 text-amber-500'
              : 'border-[var(--border-color)] text-[var(--text-secondary)] hover:border-[var(--text-primary)]'
          }`}
        >
          {filterLow ? 'Showing Low Stock Only' : 'Filter Low Stock (<15)'}
        </button>
      </div>

      <div className="border border-[var(--border-color)] bg-[var(--bg-card)] p-6">
        <DataTable columns={columns} data={inventoryList} />
      </div>
    </div>
  );
}
