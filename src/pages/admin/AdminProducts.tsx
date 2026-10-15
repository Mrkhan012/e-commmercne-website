import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import {
  Plus,
  Search,
  Trash2,
  ExternalLink,
  Sparkles,
  Tag,
  Percent,
  RotateCcw,
  Flame,
} from 'lucide-react';
import { DataTable } from '@/components/dashboard/DataTable';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Dialog } from '@/components/ui/Dialog';
import { useProductStore } from '@/store/productStore';
import { useCategoryStore } from '@/store/categoryStore';
import { useCurrencyStore } from '@/store/currencyStore';
import { useToastStore } from '@/store/toastStore';
import { formatPrice } from '@/utils/format';
import type { Product, ProductStatus } from '@/types';

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
  const {
    products,
    addProduct,
    deleteProduct,
    applyDiscount,
    removeDiscount,
    applyBulkDiscount,
    restoreBulkPrices,
  } = useProductStore();
  const currentCurrency = useCurrencyStore((s) => s.currentCurrency);
  const { categories: categoryList } = useCategoryStore();
  const categoryNames = categoryList.map((c) => c.name);
  const toast = useToastStore();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSalesModalOpen, setIsSalesModalOpen] = useState(false);

  // Single Product Quick Offer state
  const [selectedOfferProduct, setSelectedOfferProduct] = useState<Product | null>(null);
  const [singleDiscountPercent, setSingleDiscountPercent] = useState('20');

  // Bulk Sales Campaign state
  const [campaignScope, setCampaignScope] = useState('all');
  const [campaignDiscount, setCampaignDiscount] = useState('20');
  const [campaignTag, setCampaignTag] = useState('Seasonal Atelier Offer');

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

  // Calculate active sales stats
  const onSaleProducts = products.filter((p) => (p.discount && p.discount > 0) || p.status === 'sale');
  const averageDiscount =
    onSaleProducts.length > 0
      ? Math.round(
          onSaleProducts.reduce((sum, p) => sum + (p.discount || 0), 0) / onSaleProducts.length
        )
      : 0;

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
          url: imageUrl,
          alt: name.trim(),
          width: 800,
          height: 800,
        },
      ],
    });

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

  // Launch Bulk Sale Campaign
  const handleLaunchCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    const percent = parseFloat(campaignDiscount);
    if (isNaN(percent) || percent <= 0 || percent >= 100) {
      toast.error('Invalid Discount', 'Please specify a discount between 1% and 99%.');
      return;
    }

    const count = applyBulkDiscount({
      category: campaignScope === 'all' ? undefined : campaignScope,
      percentage: percent,
      tag: campaignTag.trim() || undefined,
    });

    queryClient.invalidateQueries();
    toast.success(
      'Sale Campaign Active',
      `Applied ${percent}% discount offer across ${count} products (${campaignScope === 'all' ? 'Storewide' : campaignScope}).`
    );
    setIsSalesModalOpen(false);
  };

  // End Bulk Sale & Restore
  const handleRestorePrices = () => {
    const count = restoreBulkPrices(campaignScope === 'all' ? undefined : campaignScope);
    queryClient.invalidateQueries();
    toast.info(
      'Sale Concluded',
      `Restored regular catalog prices for ${count} products.`
    );
    setIsSalesModalOpen(false);
  };

  // Single Product Quick Offer Handlers
  const handleOpenQuickOffer = (p: Product) => {
    setSelectedOfferProduct(p);
    setSingleDiscountPercent(String(p.discount || 20));
  };

  const handleApplySingleOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOfferProduct) return;

    const percent = parseFloat(singleDiscountPercent);
    if (isNaN(percent) || percent <= 0 || percent >= 100) {
      toast.error('Invalid Discount', 'Please specify a discount between 1% and 99%.');
      return;
    }

    applyDiscount(selectedOfferProduct.id, percent);
    queryClient.invalidateQueries();
    toast.success(
      'Offer Applied',
      `Applied ${percent}% discount to "${selectedOfferProduct.name}". Reflecting on storefront and /sale!`
    );
    setSelectedOfferProduct(null);
  };

  const handleRemoveSingleOffer = () => {
    if (!selectedOfferProduct) return;
    removeDiscount(selectedOfferProduct.id);
    queryClient.invalidateQueries();
    toast.info('Offer Removed', `Restored "${selectedOfferProduct.name}" to standard regular price.`);
    setSelectedOfferProduct(null);
  };

  const columns = [
    {
      key: 'image',
      header: 'Piece',
      width: '60px',
      render: (p: Product) => (
        <img
          src={p.images[0]?.url}
          alt={p.name}
          className="h-11 w-10 object-cover rounded-none border border-[var(--border-color)]"
        />
      ),
    },
    {
      key: 'name',
      header: 'Title & Brand',
      render: (p: Product) => (
        <div>
          <div className="flex items-center gap-2">
            <p className="font-heading text-xs font-bold text-[var(--text-primary)]">{p.name}</p>
            {p.discount && p.discount > 0 && (
              <span className="bg-red-500/20 text-red-500 font-mono text-[9px] font-bold px-1.5 py-0.5">
                -{p.discount}% OFF
              </span>
            )}
            {p.createdAt && Date.now() - new Date(p.createdAt).getTime() < 86400000 && !p.discount && (
              <span className="bg-[var(--color-noir-gold)]/20 text-[var(--color-noir-gold)] font-mono text-[9px] font-bold px-1.5 py-0.2">
                NEW
              </span>
            )}
          </div>
          <p className="text-[11px] text-[var(--text-muted)] font-mono">
            {p.brand} &bull; SKU: {p.id.slice(-6).toUpperCase()}
          </p>
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
      header: 'Price / Sale Offer',
      align: 'right' as const,
      render: (p: Product) => (
        <div className="text-right">
          <p className="font-heading text-xs font-bold text-[var(--text-primary)]">
            {formatPrice(p.price)}
          </p>
          {p.originalPrice && p.originalPrice > p.price && (
            <p className="text-[10px] text-[var(--text-muted)] line-through">
              {formatPrice(p.originalPrice)}
            </p>
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
        <Badge
          variant={
            p.status === 'sale' || (p.discount && p.discount > 0)
              ? 'sale'
              : p.status === 'new'
              ? 'gold'
              : p.status === 'best-seller'
              ? 'best'
              : 'default'
          }
        >
          {p.status === 'sale' || (p.discount && p.discount > 0)
            ? `SALE (-${p.discount || 20}%)`
            : p.status.toUpperCase()}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right' as const,
      render: (p: Product) => (
        <div className="flex items-center justify-end gap-1.5">
          {/* Quick Sale Offer Trigger */}
          <button
            type="button"
            onClick={() => handleOpenQuickOffer(p)}
            title={p.discount ? `Manage Offer (-${p.discount}%)` : 'Set Sales Discount Offer'}
            className={`p-1.5 transition-colors rounded ${
              p.discount
                ? 'text-red-500 hover:bg-red-500/10'
                : 'text-[var(--text-muted)] hover:text-[var(--color-noir-gold)]'
            }`}
          >
            <Percent className="h-4 w-4" />
          </button>

          <Link
            to={`/product/${p.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            title="View Live Listing on Storefront"
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
      {/* Header with Title and Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border-color)] pb-6">
        <div>
          <p className="font-heading text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--color-noir-gold)]">
            Atelier Merchandising &amp; Sales Pricing
          </p>
          <h1 className="mt-1 font-heading text-3xl font-extrabold text-[var(--text-primary)]">
            Product Catalog &amp; Offers ({products.length})
          </h1>
          <p className="mt-1 text-xs text-[var(--text-muted)]">
            Manage pieces, launch storewide or category sales offers, and set product discounts.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {/* Manage Sales Offers Campaign Button */}
          <Button
            variant="outline"
            onClick={() => setIsSalesModalOpen(true)}
            className="gap-2 uppercase tracking-[0.16em] text-xs py-3 px-4 border-[var(--color-noir-gold)] text-[var(--color-noir-gold)] hover:bg-[var(--color-noir-gold)]/10"
          >
            <Tag className="h-4 w-4" />
            <span>Manage Sales &amp; Offers</span>
            {onSaleProducts.length > 0 && (
              <span className="ml-1 rounded-full bg-[var(--color-noir-gold)] px-1.5 py-0.2 font-mono text-[9px] font-bold text-black">
                {onSaleProducts.length}
              </span>
            )}
          </Button>

          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="gap-2 uppercase tracking-[0.16em] text-xs py-3 px-5"
          >
            <Plus className="h-4 w-4" />
            Add New Product
          </Button>
        </div>
      </div>

      {/* Active Sales Banner Indicator if products are on sale */}
      {onSaleProducts.length > 0 && (
        <div className="border border-[var(--color-noir-gold)]/40 bg-[var(--color-noir-gold)]/10 p-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-noir-gold)] text-black shrink-0">
              <Flame className="h-4 w-4" />
            </div>
            <div>
              <p className="font-heading text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
                Active Promotional Sales Event ({onSaleProducts.length} Products on Sale)
              </p>
              <p className="text-xs text-[var(--text-secondary)]">
                Average discount: <strong className="text-[var(--color-noir-gold)]">-{averageDiscount}% OFF</strong> &bull; Discounted items automatically display on the customer{' '}
                <Link to="/sale" target="_blank" className="underline font-bold text-[var(--color-noir-gold)]">
                  /sale page
                </Link>
                .
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSalesModalOpen(true)}
              className="text-[10px] uppercase tracking-wider"
            >
              Adjust Campaign
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRestorePrices}
              className="text-[10px] uppercase tracking-wider text-red-500 hover:text-red-400"
            >
              End All Sales
            </Button>
          </div>
        </div>
      )}

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

        {/* Category Dropdown */}
        <div className="flex items-center gap-2">
          <span className="font-heading text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
            Category:
          </span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border border-[var(--border-color)] bg-[var(--bg-primary)] px-3 py-1.5 text-xs text-[var(--text-primary)] font-heading"
          >
            <option value="all">All Categories</option>
            {categoryNames.map((c) => (
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

      {/* ─── SALES & OFFERS CAMPAIGN MODAL ─── */}
      <Dialog
        open={isSalesModalOpen}
        onClose={() => setIsSalesModalOpen(false)}
        title="Manage Sales, Offers &amp; Discounts"
        description="Launch promotional sale offers across an entire category or storewide with automatic price reduction and badges."
        size="lg"
      >
        <div className="space-y-6 py-2">
          {/* Active Sales Status Card */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 border border-[var(--border-color)] bg-[var(--bg-secondary)] p-4 text-center">
            <div>
              <span className="block font-heading text-[10px] uppercase text-[var(--text-muted)]">Items on Sale</span>
              <span className="font-heading text-lg font-bold text-[var(--color-noir-gold)]">
                {onSaleProducts.length} of {products.length}
              </span>
            </div>
            <div>
              <span className="block font-heading text-[10px] uppercase text-[var(--text-muted)]">Average Cut</span>
              <span className="font-heading text-lg font-bold text-red-500">
                {averageDiscount > 0 ? `-${averageDiscount}%` : 'None'}
              </span>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="block font-heading text-[10px] uppercase text-[var(--text-muted)]">Live Visibility</span>
              <Link to="/sale" target="_blank" className="font-heading text-xs font-semibold text-[var(--color-noir-gold)] hover:underline flex items-center justify-center gap-1 mt-1">
                <span>View /sale page</span>
                <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
          </div>

          {/* Launch Sale Form */}
          <form onSubmit={handleLaunchCampaign} className="space-y-4 border border-[var(--border-color)] bg-[var(--bg-card)] p-5">
            <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[var(--color-noir-gold)]" />
              Launch Bulk Discount Campaign
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block font-heading text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                  Target Products / Scope *
                </label>
                <select
                  value={campaignScope}
                  onChange={(e) => setCampaignScope(e.target.value)}
                  className="w-full border border-[var(--border-color)] bg-[var(--bg-primary)] px-3 py-2 text-xs text-[var(--text-primary)] font-heading"
                >
                  <option value="all">Entire Store Catalog (Storewide)</option>
                  {categoryNames.map((cat) => (
                    <option key={cat} value={cat}>
                      Only in: {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block font-heading text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                  Discount Offer Percentage (%) *
                </label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    min="1"
                    max="90"
                    required
                    value={campaignDiscount}
                    onChange={(e) => setCampaignDiscount(e.target.value)}
                    placeholder="20"
                    className="font-mono text-xs"
                  />
                  <div className="flex gap-1">
                    {[15, 20, 25, 30, 50].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setCampaignDiscount(String(preset))}
                        className={`border px-2 text-[10px] font-mono transition-colors ${
                          campaignDiscount === String(preset)
                            ? 'border-[var(--color-noir-gold)] bg-[var(--color-noir-gold)]/10 text-[var(--color-noir-gold)] font-bold'
                            : 'border-[var(--border-color)] text-[var(--text-muted)] hover:border-[var(--text-primary)]'
                        }`}
                      >
                        {preset}%
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="mb-1 block font-heading text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                Promotional Offer Tag (Displays as badge on products)
              </label>
              <Input
                value={campaignTag}
                onChange={(e) => setCampaignTag(e.target.value)}
                placeholder="e.g. Seasonal Atelier Sale, Flash Offer, VIP Privilege"
                className="text-xs"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[var(--border-color)]">
              <Button
                type="button"
                variant="outline"
                onClick={handleRestorePrices}
                className="text-xs uppercase tracking-wider gap-1.5 text-red-500 border-red-500/30 hover:bg-red-500/10"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Revert Scope to Regular Price</span>
              </Button>

              <Button type="submit" className="uppercase tracking-wider text-xs gap-1.5">
                <Percent className="h-3.5 w-3.5" />
                <span>Apply {campaignDiscount}% Discount to Products</span>
              </Button>
            </div>
          </form>
        </div>
      </Dialog>

      {/* ─── SINGLE PRODUCT QUICK OFFER DIALOG ─── */}
      <Dialog
        open={!!selectedOfferProduct}
        onClose={() => setSelectedOfferProduct(null)}
        title={`Set Sale Offer: ${selectedOfferProduct?.name}`}
        description="Apply an individual promotional discount offer or restore regular price."
        size="md"
      >
        {selectedOfferProduct && (
          <form onSubmit={handleApplySingleOffer} className="space-y-5 py-2">
            <div className="flex items-center gap-3 border border-[var(--border-color)] bg-[var(--bg-secondary)] p-3">
              <img
                src={selectedOfferProduct.images[0]?.url}
                alt={selectedOfferProduct.name}
                className="h-12 w-10 object-cover border border-[var(--border-color)]"
              />
              <div className="flex-1">
                <p className="font-heading text-xs font-bold text-[var(--text-primary)]">
                  {selectedOfferProduct.name}
                </p>
                <p className="text-[11px] text-[var(--text-muted)]">
                  Base Price: {formatPrice(selectedOfferProduct.originalPrice || selectedOfferProduct.price)} &bull; {selectedOfferProduct.category}
                </p>
              </div>
            </div>

            <div>
              <label className="mb-1 block font-heading text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                Discount Percentage (%)
              </label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  min="1"
                  max="90"
                  required
                  value={singleDiscountPercent}
                  onChange={(e) => setSingleDiscountPercent(e.target.value)}
                  placeholder="20"
                  className="font-mono text-sm"
                />
                <div className="flex gap-1">
                  {[10, 15, 20, 25, 30, 40, 50].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setSingleDiscountPercent(String(preset))}
                      className={`border px-2.5 text-[10px] font-mono transition-colors ${
                        singleDiscountPercent === String(preset)
                          ? 'border-[var(--color-noir-gold)] bg-[var(--color-noir-gold)]/10 text-[var(--color-noir-gold)] font-bold'
                          : 'border-[var(--border-color)] text-[var(--text-muted)] hover:border-[var(--text-primary)]'
                      }`}
                    >
                      {preset}%
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Live Calculation Preview */}
            <div className="border border-[var(--border-color)] bg-[var(--bg-card)] p-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[var(--text-muted)]">Original Price:</span>
                <span className="line-through font-mono">
                  {formatPrice(selectedOfferProduct.originalPrice || selectedOfferProduct.price)}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs mt-1">
                <span className="font-semibold text-red-500">
                  New Discounted Price (-{singleDiscountPercent}%):
                </span>
                <span className="font-heading text-base font-bold text-[var(--color-noir-gold)]">
                  {formatPrice(
                    Math.round(
                      ((selectedOfferProduct.originalPrice || selectedOfferProduct.price) *
                        (100 - (parseFloat(singleDiscountPercent) || 0))) /
                        100
                    )
                  )}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-[var(--border-color)] pt-4">
              {selectedOfferProduct.discount ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleRemoveSingleOffer}
                  className="text-xs uppercase tracking-wider text-red-500 border-red-500/30 hover:bg-red-500/10"
                >
                  Remove Sale (Restore Full Price)
                </Button>
              ) : (
                <div />
              )}

              <Button type="submit" className="uppercase tracking-wider text-xs">
                Apply Offer
              </Button>
            </div>
          </form>
        )}
      </Dialog>

      {/* ─── ADD PRODUCT MODAL DIALOG ─── */}
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
                {categoryNames.map((c) => (
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
                <option value="sale">Special Sale Offer</option>
                <option value="best-seller">Best Seller</option>
                <option value="trending">Trending Now</option>
                <option value="default">Standard Catalog</option>
              </select>
            </div>
          </div>

          {/* Row 3: Price, Compare Price, Stock */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-heading text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                  Base Price (USD $) *
                </label>
                {currentCurrency !== 'USD' && (
                  <span className="font-mono text-[9px] text-[var(--color-noir-gold)] font-bold">
                    ≈ {formatPrice(parseFloat(price) || 0)}
                  </span>
                )}
              </div>
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

          {/* Row 5: Short description & Full narrative */}
          <div>
            <label className="mb-1 block font-heading text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
              Short Summary Description
            </label>
            <Input
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="One line editorial summary for product cards"
            />
          </div>

          <div>
            <label className="mb-1 block font-heading text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
              Atelier Narrative / Full Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-[var(--border-color)] bg-[var(--bg-primary)] p-3 text-xs text-[var(--text-primary)] font-body"
              placeholder="Detailed description of craftsmanship, fabrics, tailoring notes..."
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
            <Button type="submit" className="uppercase tracking-wider">
              Publish Creation
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
