import { Link, NavLink, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Layers,
  FileText,
  Building2,
  Send,
  ArrowLeft,
  Lock,
  ShieldCheck,
  Percent,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useUserStore } from '@/store/userStore';
import { useDealerStore } from '@/store/dealerStore';
import { useCartStore } from '@/store/cartStore';
import { useCurrencyStore } from '@/store/currencyStore';
import { formatPrice } from '@/utils/format';
import { useSeo } from '@/hooks/useSeo';
import { cn } from '@/utils/cn';

const dealerNav = [
  { to: '/dealer', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/dealer/catalog', label: 'Wholesale Catalog', icon: Package },
  { to: '/dealer/quick-order', label: 'Bulk Quick Order', icon: Layers },
  { to: '/dealer/orders', label: 'Orders & Invoices', icon: FileText },
  { to: '/dealer/rfq', label: 'Request Quote (RFQ)', icon: Send },
  { to: '/dealer/profile', label: 'Business Profile', icon: Building2 },
];

export default function DealerLayout() {
  useSeo({
    title: 'Dealer & Wholesale Portal | AFRO & CO.',
    description: 'Exclusive B2B wholesale ordering, tiered margins, bulk matrix purchasing, and invoicing for verified partners.',
  });

  const { user, isAuthenticated, setRole, signInAsDealer } = useUserStore();
  const { dealers } = useDealerStore();
  const { currentCurrency } = useCurrencyStore();
  const cartItemCount = useCartStore((s) => s.items.reduce((acc, i) => acc + i.quantity, 0));

  const currentDealer = user?.dealerProfile || dealers.find((d) => d.email === user?.email) || dealers[0];

  // Role Gate: Only users with 'dealer' or 'admin' role can view the dealer portal
  if (!isAuthenticated || (user?.role !== 'dealer' && user?.role !== 'admin')) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg-primary)] p-6">
        <div className="w-full max-w-md border border-[var(--border-color)] bg-[var(--bg-card)] p-8 text-center sm:p-10 shadow-2xl">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--bg-secondary)] text-[var(--color-noir-gold)]">
            <Lock className="h-6 w-6" />
          </div>

          <div className="mt-6 space-y-2">
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--color-noir-gold)]">
              B2B Access Gate &bull; {user ? `Role: ${user.role.toUpperCase()}` : 'ANONYMOUS'}
            </span>
            <h1 className="font-heading text-2xl font-bold text-[var(--text-primary)]">
              Dealer Privilege Required
            </h1>
            <p className="text-xs leading-relaxed text-[var(--text-secondary)]">
              The AFRO &amp; CO. Wholesale &amp; Dealer Portal is reserved for verified retail partners and distributors.
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3">
            {isAuthenticated ? (
              <Button
                onClick={() => {
                  setRole('dealer');
                }}
                variant="primary"
                className="w-full"
              >
                <ShieldCheck className="mr-2 h-4 w-4" />
                Switch to Verified Dealer Account
              </Button>
            ) : (
              <Button
                onClick={() => {
                  signInAsDealer();
                }}
                variant="primary"
                className="w-full"
              >
                <ShieldCheck className="mr-2 h-4 w-4" />
                Sign In as Demo Dealer
              </Button>
            )}

            <Button asChild variant="outline" className="w-full">
              <Link to="/dealer/register">
                Apply for Dealer Partnership
              </Link>
            </Button>

            <Link
              to="/"
              className="inline-flex items-center justify-center gap-1.5 pt-2 text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Return to Retail Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const tierColors: Record<string, string> = {
    gold: 'bg-amber-500/10 text-amber-500 border-amber-500/30',
    silver: 'bg-slate-300/10 text-slate-300 border-slate-300/30',
    bronze: 'bg-orange-500/10 text-orange-500 border-orange-500/30',
  };

  const discountPercent = Math.round((currentDealer?.discountRate || 0.25) * 100);
  const creditAvailable = Math.max(0, (currentDealer?.creditLimit || 25000) - (currentDealer?.creditUsed || 0));
  const creditUsagePct = Math.min(100, Math.round(((currentDealer?.creditUsed || 0) / (currentDealer?.creditLimit || 1)) * 100));

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      {/* ─── Top Dealer Status Bar ─── */}
      <div className="border-b border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-2 sm:px-6">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[var(--color-noir-gold)]">
              <Sparkles className="h-3.5 w-3.5" /> B2B Partner Portal
            </span>
            <span className="hidden text-[var(--text-muted)] sm:inline">&bull;</span>
            <span className="font-medium text-[var(--text-primary)]">
              {currentDealer?.companyName || 'Apex Luxury Retailing Ltd.'}
            </span>
            <span
              className={cn(
                'rounded border px-2 py-0.5 font-mono text-[10px] font-bold uppercase',
                tierColors[currentDealer?.tier || 'gold']
              )}
            >
              {currentDealer?.tier?.toUpperCase()} TIER &bull; {discountPercent}% OFF MSRP
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-[var(--text-muted)]">Credit Line:</span>
              <span className="font-semibold text-emerald-500">
                {formatPrice(creditAvailable, currentCurrency)} avail
              </span>
              <span className="text-[var(--text-muted)]">/ {formatPrice(currentDealer?.creditLimit || 50000, currentCurrency)}</span>
            </div>

            <Link
              to="/cart"
              className="flex items-center gap-1.5 rounded bg-[var(--bg-card)] px-2.5 py-1 text-[var(--text-primary)] hover:border-[var(--color-noir-gold)] border border-[var(--border-color)]"
            >
              <ShoppingBag className="h-3.5 w-3.5 text-[var(--color-noir-gold)]" />
              <span>Wholesale Cart ({cartItemCount})</span>
            </Link>

            <Link
              to="/"
              className="flex items-center gap-1 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            >
              <ArrowLeft className="h-3 w-3" /> Retail Store
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-[1600px]">
        {/* ─── Sidebar Navigation ─── */}
        <aside className="hidden w-64 shrink-0 border-r border-[var(--border-color)] bg-[var(--bg-card)] p-4 lg:block min-h-[calc(100vh-80px)]">
          <div className="mb-6 rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] p-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Partner Account</p>
            <p className="truncate font-heading text-sm font-bold text-[var(--text-primary)] mt-1">
              {currentDealer?.companyName}
            </p>
            <p className="text-[11px] text-[var(--text-muted)] truncate">Tax ID: {currentDealer?.taxId}</p>

            {/* Credit progress */}
            <div className="mt-3">
              <div className="flex justify-between text-[10px] font-mono mb-1">
                <span className="text-[var(--text-muted)]">Credit Used</span>
                <span className="font-semibold text-[var(--text-primary)]">{creditUsagePct}%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-[var(--border-color)] overflow-hidden">
                <div
                  className="h-full bg-[var(--color-noir-gold)] rounded-full transition-all"
                  style={{ width: `${creditUsagePct}%` }}
                />
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between text-[11px] pt-2 border-t border-[var(--border-color)]">
              <span className="text-[var(--text-muted)]">Terms:</span>
              <span className="font-semibold text-[var(--text-primary)] uppercase">
                {currentDealer?.paymentTerms || 'Net-30'}
              </span>
            </div>
          </div>

          <nav className="space-y-1">
            {dealerNav.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-md text-xs font-medium transition-colors',
                      isActive
                        ? 'bg-[var(--color-noir-gold)] text-black font-semibold'
                        : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]'
                    )
                  }
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          <div className="mt-8 rounded-lg border border-[var(--border-color)] p-3.5 bg-gradient-to-br from-amber-500/5 to-transparent">
            <div className="flex items-center gap-2 text-[var(--color-noir-gold)] text-xs font-bold">
              <Percent className="h-4 w-4" />
              <span>Wholesale Margin</span>
            </div>
            <p className="mt-1 text-[11px] text-[var(--text-secondary)] leading-relaxed">
              Your account receives an automatic {discountPercent}% discount off standard retail pricing across all catalogs.
            </p>
          </div>
        </aside>

        {/* ─── Main Content Area ─── */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          {/* Mobile subnav */}
          <div className="mb-6 flex overflow-x-auto gap-2 pb-2 lg:hidden border-b border-[var(--border-color)]">
            {dealerNav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    'shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border',
                    isActive
                      ? 'border-[var(--color-noir-gold)] bg-[var(--color-noir-gold)] text-black font-bold'
                      : 'border-[var(--border-color)] text-[var(--text-secondary)]'
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>

          <Outlet />
        </main>
      </div>
    </div>
  );
}
