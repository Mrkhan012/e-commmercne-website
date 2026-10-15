import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Trash2,
  Edit2,
  ExternalLink,
  Layers,
  Sparkles,
  Star,
} from 'lucide-react';
import { DataTable } from '@/components/dashboard/DataTable';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Dialog } from '@/components/ui/Dialog';
import { useCategoryStore } from '@/store/categoryStore';
import { useProductStore } from '@/store/productStore';
import { useToastStore } from '@/store/toastStore';
import type { Category } from '@/types';

const CATEGORY_IMAGE_PRESETS = [
  { label: 'Haute Fragrance', url: 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=800&q=80' },
  { label: 'Leather Goods', url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80' },
  { label: 'Timepieces', url: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&q=80' },
  { label: 'Tailoring', url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80' },
  { label: 'Fine Eyewear', url: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80' },
  { label: 'Artisanal Home', url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80' },
];

export default function AdminCategories() {
  const { categories, addCategory, updateCategory, deleteCategory } = useCategoryStore();
  const { products } = useProductStore();
  const toast = useToastStore();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Form state for creating category
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState(CATEGORY_IMAGE_PRESETS[0].url);
  const [subcategoriesStr, setSubcategoriesStr] = useState('');
  const [featured, setFeatured] = useState(false);

  // Form state for editing
  const [editName, setEditName] = useState('');
  const [editSlug, setEditSlug] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editImageUrl, setEditImageUrl] = useState('');
  const [editFeatured, setEditFeatured] = useState(false);

  const handleOpenAddModal = () => {
    setName('');
    setSlug('');
    setDescription('');
    setImageUrl(CATEGORY_IMAGE_PRESETS[0].url);
    setSubcategoriesStr('');
    setFeatured(false);
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (c: Category) => {
    setEditingCategory(c);
    setEditName(c.name);
    setEditSlug(c.slug);
    setEditDescription(c.description || '');
    setEditImageUrl(c.image);
    setEditFeatured(Boolean(c.featured));
  };

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Validation Error', 'Category title is required.');
      return;
    }

    const subcats = subcategoriesStr
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const created = addCategory({
      name: name.trim(),
      slug: slug.trim() || undefined,
      description: description.trim() || undefined,
      image: imageUrl.trim(),
      subcategories: subcats.length > 0 ? subcats : undefined,
      featured,
    });

    toast.success('Category Published', `New collection category "${created.name}" is now live!`);
    setIsAddModalOpen(false);
  };

  const handleUpdateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;

    if (!editName.trim()) {
      toast.error('Validation Error', 'Category title is required.');
      return;
    }

    updateCategory(editingCategory.id, {
      name: editName.trim(),
      slug: editSlug.trim() || editingCategory.slug,
      description: editDescription.trim() || undefined,
      image: editImageUrl.trim() || editingCategory.image,
      featured: editFeatured,
    });

    toast.success('Category Updated', `Updated "${editName.trim()}" successfully.`);
    setEditingCategory(null);
  };

  const handleDeleteCategory = (id: string, catName: string) => {
    if (window.confirm(`Are you sure you want to remove category "${catName}"?`)) {
      deleteCategory(id);
      toast.info('Category Removed', `Category "${catName}" has been removed from store taxonomy.`);
    }
  };

  const columns = [
    {
      key: 'image',
      header: 'Visual',
      width: '60px',
      render: (c: Category) => (
        <img
          src={c.image}
          alt={c.name}
          className="h-11 w-10 object-cover border border-[var(--border-color)]"
        />
      ),
    },
    {
      key: 'name',
      header: 'Category & Handle',
      render: (c: Category) => (
        <div>
          <div className="flex items-center gap-2">
            <p className="font-heading text-xs font-bold text-[var(--text-primary)]">{c.name}</p>
            {c.featured && (
              <span className="flex items-center gap-0.5 rounded bg-[var(--color-noir-gold)]/20 px-1.5 py-0.2 font-mono text-[9px] font-bold text-[var(--color-noir-gold)]">
                <Star className="h-2.5 w-2.5" /> FEATURED
              </span>
            )}
          </div>
          <p className="font-mono text-[10px] text-[var(--text-muted)]">/shop/{c.slug}</p>
        </div>
      ),
    },
    {
      key: 'productCount',
      header: 'Catalog Inventory',
      align: 'center' as const,
      render: (c: Category) => {
        // Calculate live matching count from productStore
        const count = products.filter(
          (p) =>
            p.category.toLowerCase() === c.name.toLowerCase() ||
            p.category.toLowerCase().includes(c.slug.toLowerCase())
        ).length;
        return (
          <span className="font-mono text-xs font-semibold text-[var(--text-primary)]">
            {count > 0 ? `${count} items` : `${c.productCount || 0} cataloged`}
          </span>
        );
      },
    },
    {
      key: 'subcategories',
      header: 'Sub-Lines',
      render: (c: Category) => (
        <div className="flex flex-wrap gap-1 max-w-xs">
          {c.subcategories && c.subcategories.length > 0 ? (
            c.subcategories.slice(0, 3).map((sub) => (
              <span
                key={sub.id}
                className="rounded border border-[var(--border-color)] bg-[var(--bg-secondary)] px-1.5 py-0.5 text-[10px] font-mono text-[var(--text-secondary)]"
              >
                {sub.name}
              </span>
            ))
          ) : (
            <span className="text-[11px] text-[var(--text-muted)] italic">Universal Line</span>
          )}
          {c.subcategories && c.subcategories.length > 3 && (
            <span className="text-[10px] font-mono text-[var(--text-muted)]">
              +{c.subcategories.length - 3} more
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right' as const,
      render: (c: Category) => (
        <div className="flex items-center justify-end gap-1.5">
          <Link
            to={`/shop/${c.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            title="View Live Collection Page"
            className="p-1.5 text-[var(--text-muted)] hover:text-[var(--color-noir-gold)] transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
          </Link>

          <button
            type="button"
            onClick={() => handleOpenEditModal(c)}
            title="Edit Category Details"
            className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          >
            <Edit2 className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => handleDeleteCategory(c.id, c.name)}
            title="Remove Category"
            className="p-1.5 text-[var(--text-muted)] hover:text-red-500 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border-color)] pb-6">
        <div>
          <p className="font-heading text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--color-noir-gold)]">
            Taxonomy &amp; Merchandising Structure
          </p>
          <h1 className="mt-1 font-heading text-3xl font-extrabold text-[var(--text-primary)]">
            Store Categories ({categories.length})
          </h1>
          <p className="mt-1 text-xs text-[var(--text-muted)]">
            Create, organize, and curate product classifications that appear in top navigation, filters, and collections.
          </p>
        </div>

        <Button
          onClick={handleOpenAddModal}
          className="gap-2 uppercase tracking-[0.16em] text-xs py-3 px-5"
        >
          <Plus className="h-4 w-4" />
          Add New Category
        </Button>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="border border-[var(--border-color)] bg-[var(--bg-card)] p-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--bg-secondary)] text-[var(--color-noir-gold)]">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <p className="font-heading text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
              Active Categories
            </p>
            <p className="font-heading text-xl font-bold text-[var(--text-primary)]">
              {categories.length} Lines
            </p>
          </div>
        </div>

        <div className="border border-[var(--border-color)] bg-[var(--bg-card)] p-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--bg-secondary)] text-[var(--color-noir-gold)]">
            <Star className="h-5 w-5" />
          </div>
          <div>
            <p className="font-heading text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
              Homepage Featured
            </p>
            <p className="font-heading text-xl font-bold text-[var(--color-noir-gold)]">
              {categories.filter((c) => c.featured).length} Showcase Lines
            </p>
          </div>
        </div>

        <div className="border border-[var(--border-color)] bg-[var(--bg-card)] p-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--bg-secondary)] text-[var(--color-noir-gold)]">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <p className="font-heading text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
              Cataloged Products
            </p>
            <p className="font-heading text-xl font-bold text-[var(--text-primary)]">
              {products.length} Pieces
            </p>
          </div>
        </div>
      </div>

      {/* Categories Table */}
      <div className="border border-[var(--border-color)] bg-[var(--bg-card)] p-6">
        <DataTable columns={columns} data={categories} />
      </div>

      {/* ─── ADD NEW CATEGORY DIALOG ─── */}
      <Dialog
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Collection Category"
        description="Establish a new department in the AFRO & CO. global merchandise hierarchy."
        size="lg"
      >
        <form onSubmit={handleCreateCategory} className="space-y-5 py-2">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block font-heading text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                Category Title *
              </label>
              <Input
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (!slug) {
                    setSlug(
                      e.target.value
                        .toLowerCase()
                        .trim()
                        .replace(/[^\w\s-]/g, '')
                        .replace(/[\s_-]+/g, '-')
                    );
                  }
                }}
                placeholder="e.g. Fragrance & Parfum, Fine Eyewear"
              />
            </div>

            <div>
              <label className="mb-1 block font-heading text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                URL Slug (Handle)
              </label>
              <Input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="e.g. fragrance-parfum"
                className="font-mono text-xs"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block font-heading text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
              Editorial Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Elevated statement pieces handcrafted with intention..."
              className="w-full border border-[var(--border-color)] bg-[var(--bg-primary)] p-2.5 text-xs text-[var(--text-primary)]"
            />
          </div>

          {/* Visual Image with Presets */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-heading text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                Hero Image URL *
              </label>
              <span className="text-[var(--color-noir-gold)] text-[10px] font-mono">
                Click a preset or paste link
              </span>
            </div>
            <Input
              required
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
            />

            <div className="mt-2 flex flex-wrap gap-1.5">
              {CATEGORY_IMAGE_PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => setImageUrl(preset.url)}
                  className={`border px-2 py-0.5 text-[10px] font-mono transition-colors ${
                    imageUrl === preset.url
                      ? 'border-[var(--color-noir-gold)] bg-[var(--color-noir-gold)]/10 text-[var(--color-noir-gold)]'
                      : 'border-[var(--border-color)] text-[var(--text-muted)] hover:border-[var(--text-primary)]'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {imageUrl && (
              <div className="mt-3 flex items-center gap-3 border border-[var(--border-color)] bg-[var(--bg-secondary)] p-2">
                <img src={imageUrl} alt="Thumbnail preview" className="h-12 w-12 object-cover" />
                <span className="font-mono text-[10px] text-[var(--text-muted)] truncate max-w-sm">
                  {imageUrl}
                </span>
              </div>
            )}
          </div>

          {/* Subcategories (comma-separated) */}
          <div>
            <label className="mb-1 block font-heading text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
              Subcategories (Comma-separated)
            </label>
            <Input
              value={subcategoriesStr}
              onChange={(e) => setSubcategoriesStr(e.target.value)}
              placeholder="e.g. Eau de Parfum, Extrait, Body Mist, Candle Sets"
            />
            <p className="mt-1 text-[10px] text-[var(--text-muted)]">
              Enter sub-departments separated by commas to populate collection filters.
            </p>
          </div>

          {/* Featured toggle */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="featureCategory"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="h-4 w-4 accent-[var(--color-noir-gold)]"
            />
            <label
              htmlFor="featureCategory"
              className="font-heading text-xs uppercase tracking-wider text-[var(--text-primary)] cursor-pointer"
            >
              Promote to Homepage Featured Showcase
            </label>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 border-t border-[var(--border-color)] pt-4">
            <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="uppercase tracking-wider text-xs">
              Publish Category
            </Button>
          </div>
        </form>
      </Dialog>

      {/* ─── EDIT CATEGORY DIALOG ─── */}
      <Dialog
        open={!!editingCategory}
        onClose={() => setEditingCategory(null)}
        title={`Edit Category: ${editingCategory?.name}`}
        description="Update nomenclature, description, imagery, or featured showcase status."
        size="lg"
      >
        {editingCategory && (
          <form onSubmit={handleUpdateCategory} className="space-y-5 py-2">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block font-heading text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                  Category Title *
                </label>
                <Input
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
              </div>

              <div>
                <label className="mb-1 block font-heading text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                  URL Slug
                </label>
                <Input
                  value={editSlug}
                  onChange={(e) => setEditSlug(e.target.value)}
                  className="font-mono text-xs"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block font-heading text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                Editorial Description
              </label>
              <textarea
                rows={2}
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="w-full border border-[var(--border-color)] bg-[var(--bg-primary)] p-2.5 text-xs text-[var(--text-primary)]"
              />
            </div>

            <div>
              <label className="mb-1 block font-heading text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                Image URL
              </label>
              <Input
                required
                value={editImageUrl}
                onChange={(e) => setEditImageUrl(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="editFeatureCategory"
                checked={editFeatured}
                onChange={(e) => setEditFeatured(e.target.checked)}
                className="h-4 w-4 accent-[var(--color-noir-gold)]"
              />
              <label
                htmlFor="editFeatureCategory"
                className="font-heading text-xs uppercase tracking-wider text-[var(--text-primary)] cursor-pointer"
              >
                Promote to Homepage Featured Showcase
              </label>
            </div>

            <div className="flex justify-end gap-3 border-t border-[var(--border-color)] pt-4">
              <Button type="button" variant="outline" onClick={() => setEditingCategory(null)}>
                Cancel
              </Button>
              <Button type="submit" className="uppercase tracking-wider text-xs">
                Save Changes
              </Button>
            </div>
          </form>
        )}
      </Dialog>
    </div>
  );
}
