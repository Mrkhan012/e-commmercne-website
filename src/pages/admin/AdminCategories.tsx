import { DataTable } from '@/components/dashboard/DataTable';
import { categories } from '@/data/categories';
import type { Category } from '@/types';

export default function AdminCategories() {
  const columns = [
    {
      key: 'image',
      header: 'Visual',
      width: '60px',
      render: (c: Category) => (
        <img src={c.image} alt={c.name} className="h-10 w-10 object-cover" />
      ),
    },
    {
      key: 'name',
      header: 'Category Name',
      render: (c: Category) => (
        <div>
          <p className="font-heading text-xs font-bold text-[var(--text-primary)]">{c.name}</p>
          <p className="font-mono text-[10px] text-[var(--text-muted)]">/{c.slug}</p>
        </div>
      ),
    },
    {
      key: 'productCount',
      header: 'Catalog Size',
      align: 'center' as const,
      render: (c: Category) => (
        <span className="font-mono text-xs font-semibold">{c.productCount} models</span>
      ),
    },
    {
      key: 'description',
      header: 'Description',
      render: (c: Category) => (
        <span className="text-xs text-[var(--text-muted)] truncate max-w-xs block">
          {c.description || 'Curated luxury collection.'}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <p className="font-heading text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
          Taxonomy &amp; Merchandising
        </p>
        <h1 className="mt-1 font-heading text-3xl font-extrabold text-[var(--text-primary)]">
          Categories ({categories.length})
        </h1>
      </div>

      <div className="border border-[var(--border-color)] bg-[var(--bg-card)] p-6">
        <DataTable columns={columns} data={categories} />
      </div>
    </div>
  );
}
