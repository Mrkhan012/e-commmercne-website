import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Trash2, ExternalLink, Sparkles } from 'lucide-react';
import { DataTable } from '@/components/dashboard/DataTable';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Dialog } from '@/components/ui/Dialog';
import { useProductStore } from '@/store/productStore';
import { useToastStore } from '@/store/toastStore';
import { formatPrice } from '@/utils/format';
import type { Product, ProductStatus } from '@/types';

const CATEGORIES = [
  'Clothing',
  'Shoes',
  'Bags & Accessories',
  'Watches & Jewelry',
  'Home & Lifestyle',
  'Beauty & Personal Care',
  'Electronics & Gadgets',
];

const PRESET_IMAGES = [
  { label: 'Outerwear', url: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=800&q=80' },
  { label: 'Tailored Blazer', url: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80' },
  { label: 'Cashmere Knit', url: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80' },
  { label: 'Leather Tote', url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80' },
  { label: 'Minimal Watch', url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80' },
  { label: 'Suede Chelsea', url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80' },
  { label: 'Haute Parfum', url: 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=800&q=80' },
  { label: 'Silk Dress', url: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&q=80' },
];

export default function AdminProducts() {
  const queryClient = useQueryClient();
  const { products, addProduct, deleteProduct } = useProductStore();
  const toast = useToastStore();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form state for new product listing
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('AFRO & CO.');
  const [category, setCategory] = useState('Clothing');
  const [subcategory, setSubcategory] = useState('Jackets & Coats');
  const [price, setPrice] = useState('480');
  const [originalPrice, setOriginalPrice] = useState('550');
  const [stock, setStock] = useState('20');
  const [status, setStatus] = useState<ProductStatus>('new');
  const [imageUrl, setImageUrl] = useState(PRESET_IMAGES[0].url);
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');

  // Filtered product list
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Validation error', 'Product title is required.');
      return;
    }

    const numPrice = parseFloat(price);
    if (isNaN(numPrice) || numPrice <= 0) {
      toast.error('Validation error', 'Please enter a valid price.');
      return;
    }

    const numStock = parseInt(stock, 10);
    const numOrig = originalPrice ? parseFloat(originalPrice) : undefined;

    const created = addProduct({
      name: name.trim(),
      brand: brand.trim() || 'AFRO & CO.',
      category,
      subcategory: subcategory.trim() || undefined,
      price: numPrice,
      originalPrice: numOrig && numOrig > numPrice ? numOrig : undefined,
      stock: isNaN(numStock) ? 10 : numStock,
      status,
      shortDescription: shortDescription.trim() || `${name.trim()} by ${brand}.`,
      description:
        description.trim() ||
        `Crafted with supreme attention to detail, the ${name.trim()} features artisanal construction, structured silhouette, and signature AFRO & CO. finishes.`,
      images: [
        {
          id: `img-${Date.now()}`,
          url: imageUrl.trim() || PRESET_IMAGES[0].url,
          alt: name.trim(),
          width: 800,
          height: 800,
        },
      ],
    });

    // Invalidate React Query cache so all frontend queries update
    queryClient.invalidateQueries();

    toast.success('Listing Published', `${created.name} is now active on the storefront.`);
    setIsAddModalOpen(false);

    // Reset form
    setName('');
    setPrice('480');
    setOriginalPrice('550');
    setShortDescription('');
    setDescription('');
  };

  const handleDelete = (id: string, productName: string) => {
    if (confirm(`Are you sure you want to retire "${productName}" from the atelier catalog?`)) {
      deleteProduct(id);
      queryClient.invalidateQueries();
      toast.info('Piece retired', `${productName} was removed from the catalog.`);
    }
  };

  const columns = [
    {
      key: 'image',
      header: 'Piece',
      width: '60px',
      render: (p: Product) => (
        <img src={p.images[0]?.url} alt={p.name} className="h-11 w-10 object-cover rounded-none border border-[var(--border-color)]" />
      ),
    },
    {
      key: 'name',
      header: 'Title & Brand',
      render: (p: Product) => (
        <div>
          <div className="flex items-center gap-2">
            <p className="font-heading text-xs font-bold text-[var(--text-primary)]">{p.name}</p>
            {p.createdAt && Date.now() - new Date(p.createdAt).getTime() < 86400000 && (
              <span className="bg-[var(--color-noir-gold)]/20 text-[var(--color-noir-gold)] font-mono text-[9px] font-bold px-1.5 py-0.2">
                NEW
              </span>
            )}
          </div>
          <p className="text-[11px] text-[var(--text-muted)] font-mono">{p.brand} &bull; SKU: {p.id.slice(-6).toUpperCase()}</p>
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
        <div className="text-right">
          <p className="font-heading text-xs font-bold text-[var(--text-primary)]">{formatPrice(p.price)}</p>
          {p.originalPrice && (
            <p className="text-[10px] text-[var(--text-muted)] line-through">{formatPrice(p.originalPrice)}</p>
          )}
        </div>
      ),
    },
    {
      key: 'stock',
      header: 'Atelier Stock',
      align: 'center' as const,
      render: (p: Product) => (
        <span
          className={`font-mono text-xs font-semibold ${
            p.stock <= 5 ? 'text-red-500' : p.stock <= 12 ? 'text-amber-500' : 'text-emerald-500'
          }`}
        >
          {p.stock} units
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      align: 'center' as const,
      render: (p: Product) => (
        <Badge variant={p.status === 'new' ? 'gold' : p.status === 'best-seller' ? 'best' : 'default'}>
          {p.status.toUpperCase()}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right' as const,
      render: (p: Product) => (
        <div className="flex items-center justify-end gap-2">
          <Link
            to={`/product/${p.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            title="View Live Listing"
            className="p-1.5 text-[var(--text-muted)] hover:text-[var(--color-noir-gold)] transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
          </Link>
          <button
            type="button"
            onClick={() => handleDelete(p.id, p.name)}
            title="Retire Piece"
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
      {/* Header with Title and Add Product Action */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border-color)] pb-6">
        <div>
          <p className="font-heading text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--color-noir-gold)]">
            Atelier Merchandising
          </p>
          <h1 className="mt-1 font-heading text-3xl font-extrabold text-[var(--text-primary)]">
            Product Catalog ({products.length})
          </h1>
        </div>

        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="gap-2 uppercase tracking-[0.16em] text-xs py-3 px-5"
        >
          <Plus className="h-4 w-4" />
          Add New Product
        </Button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-[var(--text-muted)]" />
          <Input
            placeholder="Search by title, brand, or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 text-xs"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto [scrollbar-width:none]">
          <span className="font-heading text-[10px] uppercase tracking-wider text-[var(--text-muted)] whitespace-nowrap">
            Category:
          </span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border border-[var(--border-color)] bg-[var(--bg-primary)] px-3 py-1.5 text-xs text-[var(--text-primary)] font-heading"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="border border-[var(--border-color)] bg-[var(--bg-card)] p-6">
        <DataTable columns={columns} data={filteredProducts} />
      </div>

      {/* Add Product Modal Dialog */}
      <Dialog
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Create New Atelier Listing"
        description="Introduce a new handcrafted creation to the AFRO & CO. global storefront."
        size="2xl"
      >
        <form onSubmit={handleCreateProduct} className="space-y-6 py-2">
          {/* Row 1: Name and Brand */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="sm:col-span-2">
              <label className="mb-1 block font-heading text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                Product Title *
              </label>
              <Input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Silk Velvet Tuxedo Jacket"
              />
            </div>
            <div>
              <label className="mb-1 block font-heading text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                Brand House
              </label>
              <Input
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="AFRO & CO."
              />
            </div>
          </div>

          {/* Row 2: Category, Subcategory, Status */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1 block font-heading text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border border-[var(--border-color)] bg-[var(--bg-primary)] px-3 py-2 text-xs text-[var(--text-primary)]"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block font-heading text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                Subcategory
              </label>
              <Input
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
                placeholder="e.g. Outerwear, Boots"
              />
            </div>
            <div>
              <label className="mb-1 block font-heading text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                Collection Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ProductStatus)}
                className="w-full border border-[var(--border-color)] bg-[var(--bg-primary)] px-3 py-2 text-xs text-[var(--text-primary)]"
              >
                <option value="new">New Arrival</option>
                <option value="best-seller">Best Seller</option>
                <option value="trending">Trending Now</option>
                <option value="sale">Special Sale</option>
                <option value="default">Standard Catalog</option>
              </select>
            </div>
          </div>

          {/* Row 3: Price, Compare Price, Stock */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1 block font-heading text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                Price (USD $) *
              </label>
              <Input
                type="number"
                step="0.01"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="450.00"
              />
            </div>
            <div>
              <label className="mb-1 block font-heading text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                Original Price (Compare At $)
              </label>
              <Input
                type="number"
                step="0.01"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                placeholder="520.00"
              />
            </div>
            <div>
              <label className="mb-1 block font-heading text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                Atelier Stock Count *
              </label>
              <Input
                type="number"
                required
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="25"
              />
            </div>
          </div>

          {/* Row 4: Image URL with Presets */}
          <div>
            <label className="mb-1 flex items-center justify-between font-heading text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
              <span>Primary Imagery URL *</span>
              <span className="text-[var(--color-noir-gold)]">Click a preset or paste link</span>
            </label>
            <Input
              required
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
            />

            {/* Quick preset selector buttons */}
            <div className="mt-2 flex flex-wrap gap-1.5">
              {PRESET_IMAGES.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => setImageUrl(preset.url)}
                  className={`border px-2.5 py-1 text-[10px] font-mono transition-colors ${
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
                <img src={imageUrl} alt="Preview" className="h-12 w-10 object-cover" />
                <span className="font-mono text-[11px] text-[var(--text-muted)] truncate max-w-sm">
                  {imageUrl}
                </span>
              </div>
            )}
          </div>

          {/* Row 5: Descriptions */}
          <div>
            <label className="mb-1 block font-heading text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
              One-Sentence Synopsis
            </label>
            <Input
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="e.g. Crafted in Como silk with hand-stitched peak lapels."
            />
          </div>

          <div>
            <label className="mb-1 block font-heading text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
              Editorial Product Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed craftsmanship notes, materials composition, silhouette..."
              className="w-full border border-[var(--border-color)] bg-[var(--bg-primary)] p-3 text-xs text-[var(--text-primary)] outline-none focus:border-[var(--color-noir-gold)]"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 border-t border-[var(--border-color)] pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="gap-2 uppercase tracking-wider">
              <Sparkles className="h-4 w-4" />
              Publish Listing
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
