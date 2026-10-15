import { useState } from 'react';
import {
  Plus,
  Trash2,
  CheckCircle,
  XCircle,
  Copy,
  Sparkles,
  Percent,
  DollarSign,
  Truck,
  Megaphone,
} from 'lucide-react';
import { DataTable } from '@/components/dashboard/DataTable';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Dialog } from '@/components/ui/Dialog';
import { useCouponStore, type Coupon } from '@/store/couponStore';
import { useToastStore } from '@/store/toastStore';

export default function AdminCoupons() {
  const {
    coupons,
    bannerPromoText,
    bannerActive,
    addCoupon,
    deleteCoupon,
    toggleCouponStatus,
    updateBanner,
  } = useCouponStore();
  const toast = useToastStore();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);

  // Form states for new coupon
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'percentage' | 'fixed' | 'free_shipping'>('percentage');
  const [value, setValue] = useState('20');
  const [minSpend, setMinSpend] = useState('');
  const [maxDiscount, setMaxDiscount] = useState('');
  const [active, setActive] = useState(true);

  // Banner form state
  const [bannerText, setBannerText] = useState(bannerPromoText);
  const [bannerEnabled, setBannerEnabled] = useState(bannerActive);

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = code.trim().toUpperCase();

    if (!cleanCode) {
      toast.error('Validation Error', 'Coupon code is required.');
      return;
    }

    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue < 0) {
      toast.error('Validation Error', 'Please enter a valid discount value.');
      return;
    }

    const newCoupon: Coupon = {
      code: cleanCode,
      description: description.trim() || `${numValue}${type === 'percentage' ? '%' : '$'} promotional offer`,
      type,
      value: type === 'free_shipping' ? 0 : numValue,
      minSpend: minSpend ? parseFloat(minSpend) : undefined,
      maxDiscount: maxDiscount ? parseFloat(maxDiscount) : undefined,
      active,
    };

    addCoupon(newCoupon);
    toast.success('Offer Created', `Promotional coupon ${cleanCode} is now active and ready for customers!`);

    // Reset & close
    setCode('');
    setDescription('');
    setValue('20');
    setMinSpend('');
    setMaxDiscount('');
    setIsCreateModalOpen(false);
  };

  const handleCopyCode = (promoCode: string) => {
    navigator.clipboard.writeText(promoCode);
    toast.info('Copied', `Promo code ${promoCode} copied to clipboard.`);
  };

  const handleSaveBanner = (e: React.FormEvent) => {
    e.preventDefault();
    updateBanner(bannerText.trim(), bannerEnabled);
    toast.success('Announcement Updated', 'Storefront promotional announcement bar updated.');
    setIsBannerModalOpen(false);
  };

  const couponList = coupons.map((c) => ({
    ...c,
    id: c.code,
  }));

  const columns = [
    {
      key: 'code',
      header: 'Promo Offer Code',
      render: (c: Coupon) => (
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-[var(--color-noir-gold)] tracking-wider">
            {c.code}
          </span>
          <button
            type="button"
            onClick={() => handleCopyCode(c.code)}
            title="Copy promo code"
            className="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          >
            <Copy className="h-3 w-3" />
          </button>
        </div>
      ),
    },
    {
      key: 'description',
      header: 'Offer Description & Terms',
      render: (c: Coupon) => (
        <div>
          <p className="text-xs font-medium text-[var(--text-primary)]">{c.description}</p>
          {c.maxDiscount && (
            <p className="text-[10px] text-[var(--text-muted)] font-mono">Max discount cap: ${c.maxDiscount}</p>
          )}
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Discount Structure',
      render: (c: Coupon) => (
        <div className="flex items-center gap-1.5 font-mono text-xs">
          {c.type === 'percentage' && (
            <span className="inline-flex items-center gap-1 rounded bg-amber-500/10 px-2 py-0.5 font-bold text-amber-500">
              <Percent className="h-3 w-3" /> {c.value}% OFF
            </span>
          )}
          {c.type === 'fixed' && (
            <span className="inline-flex items-center gap-1 rounded bg-emerald-500/10 px-2 py-0.5 font-bold text-emerald-500">
              <DollarSign className="h-3 w-3" /> ${c.value} OFF
            </span>
          )}
          {c.type === 'free_shipping' && (
            <span className="inline-flex items-center gap-1 rounded bg-sky-500/10 px-2 py-0.5 font-bold text-sky-400">
              <Truck className="h-3 w-3" /> FREE SHIPPING
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'minSpend',
      header: 'Minimum Order',
      align: 'right' as const,
      render: (c: Coupon) => (
        <span className="font-mono text-xs text-[var(--text-muted)]">
          {c.minSpend ? `$${c.minSpend}` : 'No minimum'}
        </span>
      ),
    },
    {
      key: 'active',
      header: 'Status & Live Toggle',
      align: 'center' as const,
      render: (c: Coupon) => (
        <button
          type="button"
          onClick={() => {
            toggleCouponStatus(c.code);
            toast.info(
              'Status Changed',
              `Coupon ${c.code} is now ${!c.active ? 'ACTIVE' : 'INACTIVE'}.`
            );
          }}
          className="cursor-pointer transition-opacity hover:opacity-80"
          title="Click to toggle active state"
        >
          <Badge variant={c.active ? 'gold' : 'outline'}>
            {c.active ? (
              <span className="flex items-center gap-1">
                <CheckCircle className="h-2.5 w-2.5 text-emerald-500" /> ACTIVE
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[var(--text-muted)]">
                <XCircle className="h-2.5 w-2.5" /> INACTIVE
              </span>
            )}
          </Badge>
        </button>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right' as const,
      render: (c: Coupon) => (
        <button
          type="button"
          onClick={() => {
            if (window.confirm(`Delete coupon offer "${c.code}"?`)) {
              deleteCoupon(c.code);
              toast.success('Offer Removed', `Coupon ${c.code} was deleted.`);
            }
          }}
          title="Delete coupon"
          className="p-1.5 text-[var(--text-muted)] hover:text-red-500 transition-colors"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border-color)] pb-6">
        <div>
          <p className="font-heading text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--color-noir-gold)]">
            Marketing &amp; Promotions
          </p>
          <h1 className="mt-1 font-heading text-3xl font-extrabold text-[var(--text-primary)]">
            Sales Offers &amp; Coupons ({coupons.length})
          </h1>
          <p className="mt-1 text-xs text-[var(--text-muted)]">
            Decide and launch sales offers, promo coupon codes, and custom discount rules across all products.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() => {
              setBannerText(bannerPromoText);
              setBannerEnabled(bannerActive);
              setIsBannerModalOpen(true);
            }}
            className="gap-2 uppercase tracking-[0.16em] text-xs py-3 px-4 border-[var(--border-color)]"
          >
            <Megaphone className="h-4 w-4 text-[var(--color-noir-gold)]" />
            Announcement Bar Offer
          </Button>

          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="gap-2 uppercase tracking-[0.16em] text-xs py-3 px-5"
          >
            <Plus className="h-4 w-4" />
            Create New Promo Offer
          </Button>
        </div>
      </div>

      {/* Banner Preview Card */}
      <div className="border border-[var(--border-color)] bg-[var(--bg-secondary)] p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--bg-card)] text-[var(--color-noir-gold)] shrink-0">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <p className="font-heading text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
              Storefront Announcement Offer (Live on Top of All Pages):
            </p>
            <p className="text-xs font-semibold text-[var(--text-primary)] mt-0.5">
              {bannerActive ? (
                <span>&ldquo;{bannerPromoText}&rdquo;</span>
              ) : (
                <span className="text-[var(--text-muted)] italic">Announcement bar is currently hidden</span>
              )}
            </p>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setBannerText(bannerPromoText);
            setBannerEnabled(bannerActive);
            setIsBannerModalOpen(true);
          }}
          className="text-xs uppercase tracking-wider text-[var(--color-noir-gold)]"
        >
          Edit Announcement
        </Button>
      </div>

      {/* Coupons Table */}
      <div className="border border-[var(--border-color)] bg-[var(--bg-card)] p-6">
        <DataTable columns={columns} data={couponList} />
      </div>

      {/* Create Coupon Modal Dialog */}
      <Dialog
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Promotional Offer / Coupon"
        description="Configure a new customer discount code that applies at checkout and in cart."
        size="lg"
      >
        <form onSubmit={handleCreateCoupon} className="space-y-5 py-2">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block font-heading text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                Promo Code *
              </label>
              <Input
                required
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="e.g. FLASH25, DIWALI30, EID20"
                className="font-mono font-bold tracking-wider"
              />
            </div>

            <div>
              <label className="mb-1 block font-heading text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                Discount Type *
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full border border-[var(--border-color)] bg-[var(--bg-primary)] px-3 py-2 text-xs text-[var(--text-primary)] font-heading"
              >
                <option value="percentage">Percentage Discount (% OFF)</option>
                <option value="fixed">Fixed Cash Amount ($ OFF)</option>
                <option value="free_shipping">Complimentary Free Shipping</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block font-heading text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
              Offer Description &amp; Terms
            </label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. 25% off all orders over $150"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1 block font-heading text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                {type === 'percentage' ? 'Discount Percentage (%)' : type === 'fixed' ? 'Discount Amount ($)' : 'Value (N/A)'}
              </label>
              <Input
                type="number"
                disabled={type === 'free_shipping'}
                required={type !== 'free_shipping'}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="20"
              />
            </div>

            <div>
              <label className="mb-1 block font-heading text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                Min. Spend ($ USD)
              </label>
              <Input
                type="number"
                value={minSpend}
                onChange={(e) => setMinSpend(e.target.value)}
                placeholder="e.g. 100 (Optional)"
              />
            </div>

            <div>
              <label className="mb-1 block font-heading text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                Max Discount Cap ($)
              </label>
              <Input
                type="number"
                value={maxDiscount}
                onChange={(e) => setMaxDiscount(e.target.value)}
                placeholder="e.g. 250 (Optional)"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="activeToggle"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
              className="h-4 w-4 accent-[var(--color-noir-gold)]"
            />
            <label htmlFor="activeToggle" className="font-heading text-xs uppercase tracking-wider text-[var(--text-primary)] cursor-pointer">
              Activate Offer Immediately for Customer Checkout
            </label>
          </div>

          <div className="flex justify-end gap-3 border-t border-[var(--border-color)] pt-4">
            <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="uppercase tracking-wider">
              Launch Promo Offer
            </Button>
          </div>
        </form>
      </Dialog>

      {/* Announcement Bar Offer Dialog */}
      <Dialog
        open={isBannerModalOpen}
        onClose={() => setIsBannerModalOpen(false)}
        title="Storefront Announcement Bar Offer"
        description="Decide the promotional offer message displayed at the very top of the website."
        size="md"
      >
        <form onSubmit={handleSaveBanner} className="space-y-5 py-2">
          <div>
            <label className="mb-1 block font-heading text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
              Announcement Message
            </label>
            <textarea
              rows={3}
              value={bannerText}
              onChange={(e) => setBannerText(e.target.value)}
              className="w-full border border-[var(--border-color)] bg-[var(--bg-primary)] p-3 text-xs text-[var(--text-primary)]"
              placeholder="e.g. Complimentary worldwide shipping on orders over $200 · Use code WELCOME15 for 15% off"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="bannerActiveToggle"
              checked={bannerEnabled}
              onChange={(e) => setBannerEnabled(e.target.checked)}
              className="h-4 w-4 accent-[var(--color-noir-gold)]"
            />
            <label htmlFor="bannerActiveToggle" className="font-heading text-xs uppercase tracking-wider text-[var(--text-primary)] cursor-pointer">
              Show Announcement Bar on Website
            </label>
          </div>

          <div className="flex justify-end gap-3 border-t border-[var(--border-color)] pt-4">
            <Button type="button" variant="outline" onClick={() => setIsBannerModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="uppercase tracking-wider">
              Update Announcement
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
