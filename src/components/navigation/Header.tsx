import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import {
  Menu,
  Search,
  Heart,
  ShoppingBag,
  User as UserIcon,
  Sun,
  Moon,
  X,
  ChevronRight,
  Sparkles,
  LogOut,
  LayoutDashboard,
  Shield,
  Globe,
  Building2,
  Briefcase,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useCategoryStore } from '@/store/categoryStore';
import { useThemeStore } from '@/store/themeStore';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useUserStore } from '@/store/userStore';
import { useCurrencyStore, SUPPORTED_CURRENCIES } from '@/store/currencyStore';
import { useCouponStore } from '@/store/couponStore';
import { useBrandStore } from '@/store/brandStore';
import { useScrollLock, useEscapeKey } from '@/hooks/useUi';
import { Button } from '@/components/ui/Button';
import { SearchOverlay } from '@/components/navigation/SearchOverlay';
import { Dropdown, DropdownItem, DropdownDivider } from '@/components/ui/Dropdown';
import { cn } from '@/utils/cn';
import type { Currency } from '@/types';

export function Header() {
  const location = useLocation();
  const categories = useCategoryStore((s) => s.categories);
  const { theme, toggleTheme } = useThemeStore();
  const itemCount = useCartStore((state) => state.items.reduce((sum, item) => sum + item.quantity, 0));
  const openCart = useCartStore((state) => state.openCart);
  const wishlistCount = useWishlistStore((state) => state.items.length);
  const { isAuthenticated, user, signOut, setRole, signInAsAdmin, signInAsDealer } = useUserStore();
  const { currentCurrency, setCurrency } = useCurrencyStore();
  const { bannerPromoText, bannerActive } = useCouponStore();
  const siteName = useBrandStore((s) => s.siteName);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const megaMenuTimeout = useRef<number | null>(null);
  const megaMenuRef = useRef<HTMLDivElement>(null);

  useScrollLock(mobileMenuOpen);
  useEscapeKey(mobileMenuOpen, () => setMobileMenuOpen(false));
  useEscapeKey(searchOpen, () => setSearchOpen(false));

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(`${path}/`);

  const openMegaMenu = (slug: string) => {
    if (megaMenuTimeout.current) window.clearTimeout(megaMenuTimeout.current);
    setActiveMegaMenu(slug);
  };

  const closeMegaMenu = () => {
    if (megaMenuTimeout.current) window.clearTimeout(megaMenuTimeout.current);
    megaMenuTimeout.current = window.setTimeout(() => setActiveMegaMenu(null), 120);
  };

  const activeCategory = categories.find((c) => c.slug === activeMegaMenu);

  return (
    <>
      {/* ─── Announcement Bar ─── */}
      {bannerActive && (
        <div className="announcement-bar relative overflow-hidden">
          <div className="mx-auto flex h-10 max-w-[1600px] items-center justify-between px-4 text-[11px] font-medium uppercase tracking-[0.16em]">
            <div className="hidden sm:flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-[var(--color-noir-gold)]" aria-hidden="true" />
              <span>{bannerPromoText}</span>
            </div>

            <div className="flex items-center gap-3 mx-auto sm:ml-auto sm:mx-0">
              <Link
                to="/dealer/register"
                className="hidden md:inline-flex items-center gap-1 text-[10px] text-[var(--color-noir-gold)] hover:underline font-semibold"
              >
                <Briefcase className="h-3 w-3" />
                <span>Wholesale &bull; Dealer Apply</span>
              </Link>
              <span className="hidden md:inline text-[var(--border-color)]">|</span>
              {/* Quick Currency Selector */}
              <div className="flex items-center gap-1.5 rounded px-2 py-0.5 transition-colors hover:bg-[var(--bg-secondary)]">
                <Globe className="h-3 w-3 text-[var(--color-noir-gold)]" />
                <select
                  value={currentCurrency}
                  onChange={(e) => setCurrency(e.target.value as Currency)}
                  aria-label="Select storefront currency"
                  className="bg-transparent font-heading text-[10px] font-bold uppercase tracking-wider text-[var(--text-primary)] cursor-pointer focus:outline-none"
                >
                  {SUPPORTED_CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code} className="bg-[var(--bg-card)] text-[var(--text-primary)]">
                      {c.flag} {c.code} ({c.symbol})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Main Header ─── */}
      <header className="sticky top-0 z-50 border-b border-[var(--border-color)] header-blur">
        <div className="mx-auto flex h-16 max-w-[1600px] items-center gap-6 px-4 sm:px-6 lg:h-20 lg:px-10">
          {/* Mobile menu trigger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={mobileMenuOpen}
            className="text-[var(--text-primary)] lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Dynamic Logo */}
          <Link to="/" className="shrink-0" aria-label={`${siteName} home`}>
            <span className="font-heading text-lg font-extrabold tracking-[-0.02em] text-[var(--text-primary)] lg:text-xl">
              {siteName}
            </span>
          </Link>

          {/* Desktop navigation */}
          <nav
            ref={megaMenuRef}
            aria-label="Main"
            className="hidden flex-1 items-center gap-8 lg:flex"
            onMouseLeave={closeMegaMenu}
          >
            <Link
              to="/new-arrivals"
              className={cn(
                'nav-link font-heading text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]',
                isActive('/new-arrivals') && 'active text-[var(--text-primary)]'
              )}
            >
              New In
            </Link>

            {categories.slice(0, 4).map((category) => (
              <div
                key={category.id}
                onMouseEnter={() => openMegaMenu(category.slug)}
                className="relative"
              >
                <Link
                  to={`/shop/${category.slug}`}
                  aria-expanded={activeMegaMenu === category.slug}
                  aria-haspopup="true"
                  className={cn(
                    'nav-link flex items-center gap-1 font-heading text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]',
                    isActive(`/shop/${category.slug}`) && 'active text-[var(--text-primary)]'
                  )}
                >
                  {category.name}
                  <ChevronRight className="h-3 w-3 rotate-90" aria-hidden="true" />
                </Link>
              </div>
            ))}

            <Link
              to="/sale"
              className={cn(
                'nav-link font-heading text-[11px] font-semibold uppercase tracking-[0.18em] text-red-500 transition-colors hover:text-red-400',
                isActive('/sale') && 'active'
              )}
            >
              Sale
            </Link>
          </nav>

          {/* Actions */}
          <div className="ml-auto flex items-center gap-1 lg:gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search products"
              className="flex h-10 w-10 items-center justify-center text-[var(--text-primary)] transition-colors hover:text-[var(--color-noir-gold)]"
            >
              <Search className="h-[18px] w-[18px]" />
            </button>

            <button
              type="button"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              className="flex h-10 w-10 items-center justify-center text-[var(--text-primary)] transition-colors hover:text-[var(--color-noir-gold)]"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={theme}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex"
                >
                  {theme === 'dark' ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
                </motion.span>
              </AnimatePresence>
            </button>

            {/* Admin Console Pill (Visible only when user role is admin) */}
            {user?.role === 'admin' && (
              <Link
                to="/admin"
                className="hidden items-center gap-1.5 border border-[var(--color-noir-gold)]/60 bg-[var(--color-noir-gold)]/10 px-2.5 py-1 font-heading text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--color-noir-gold)] transition-colors hover:bg-[var(--color-noir-gold)]/25 sm:inline-flex"
              >
                <Shield className="h-3 w-3" />
                <span>Admin Console</span>
              </Link>
            )}

            {/* Dealer Portal Pill (Visible only when user role is dealer) */}
            {user?.role === 'dealer' && (
              <Link
                to="/dealer"
                className="hidden items-center gap-1.5 border border-amber-500/60 bg-amber-500/10 px-2.5 py-1 font-heading text-[10px] font-bold uppercase tracking-[0.16em] text-amber-500 transition-colors hover:bg-amber-500/25 sm:inline-flex"
              >
                <Building2 className="h-3 w-3" />
                <span>Dealer Portal</span>
              </Link>
            )}

            {/* Account */}
            <Dropdown
              align="right"
              trigger={
                <button
                  type="button"
                  aria-label="Account menu"
                  className="hidden h-10 w-10 items-center justify-center text-[var(--text-primary)] transition-colors hover:text-[var(--color-noir-gold)] sm:flex"
                >
                  <UserIcon className="h-[18px] w-[18px]" />
                </button>
              }
              panelClassName="w-60"
            >
              {(close) =>
                isAuthenticated && user ? (
                  <>
                    <div className="border-b border-[var(--border-color)] px-4 py-3">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-medium text-[var(--text-primary)]">
                          {user.firstName} {user.lastName}
                        </p>
                        <span
                          className={`px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase ${
                            user.role === 'admin'
                              ? 'border border-[var(--color-noir-gold)]/40 bg-[var(--color-noir-gold)]/20 text-[var(--color-noir-gold)]'
                              : user.role === 'dealer'
                              ? 'border border-amber-500/40 bg-amber-500/20 text-amber-500'
                              : 'bg-[var(--bg-secondary)] text-[var(--text-muted)]'
                          }`}
                        >
                          {user.role}
                        </span>
                      </div>
                      <p className="truncate text-xs text-[var(--text-muted)]">{user.email}</p>
                    </div>

                    <DropdownItem
                      icon={<UserIcon className="h-4 w-4" />}
                      onClick={() => {
                        close();
                        window.location.assign('/account');
                      }}
                    >
                      Customer Account
                    </DropdownItem>

                    {/* Dealer Portal Link */}
                    {user.role === 'dealer' && (
                      <DropdownItem
                        icon={<Building2 className="h-4 w-4 text-amber-500" />}
                        onClick={() => {
                          close();
                          window.location.assign('/dealer');
                        }}
                      >
                        <span className="font-semibold text-amber-500">
                          Dealer B2B Portal
                        </span>
                      </DropdownItem>
                    )}

                    {/* Admin Dashboard: shown only if user role is admin */}
                    {user.role === 'admin' && (
                      <DropdownItem
                        icon={<LayoutDashboard className="h-4 w-4 text-[var(--color-noir-gold)]" />}
                        onClick={() => {
                          close();
                          window.location.assign('/admin');
                        }}
                      >
                        <span className="font-semibold text-[var(--color-noir-gold)]">
                          Admin Dashboard
                        </span>
                      </DropdownItem>
                    )}

                    {/* Quick 3-way role switcher */}
                    <DropdownDivider />
                    <div className="px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                      Switch Role View
                    </div>

                    <DropdownItem
                      icon={<UserIcon className="h-3.5 w-3.5" />}
                      onClick={() => {
                        setRole('customer');
                        close();
                      }}
                    >
                      Customer View {user.role === 'customer' && '✓'}
                    </DropdownItem>

                    <DropdownItem
                      icon={<Building2 className="h-3.5 w-3.5 text-amber-500" />}
                      onClick={() => {
                        setRole('dealer');
                        close();
                        window.location.assign('/dealer');
                      }}
                    >
                      Dealer (B2B) View {user.role === 'dealer' && '✓'}
                    </DropdownItem>

                    <DropdownItem
                      icon={<Shield className="h-3.5 w-3.5 text-[var(--color-noir-gold)]" />}
                      onClick={() => {
                        setRole('admin');
                        close();
                        window.location.assign('/admin');
                      }}
                    >
                      Platform Admin View {user.role === 'admin' && '✓'}
                    </DropdownItem>

                    <DropdownDivider />
                    <DropdownItem
                      destructive
                      icon={<LogOut className="h-4 w-4" />}
                      onClick={() => {
                        signOut();
                        close();
                      }}
                    >
                      Sign Out
                    </DropdownItem>
                  </>
                ) : (
                  <>
                    <DropdownItem
                      onClick={() => {
                        close();
                        window.location.assign('/signin');
                      }}
                    >
                      Sign In
                    </DropdownItem>
                    <DropdownItem
                      onClick={() => {
                        close();
                        window.location.assign('/signup');
                      }}
                    >
                      Create Account
                    </DropdownItem>
                    <DropdownDivider />
                    <DropdownItem
                      icon={<Building2 className="h-4 w-4 text-amber-500" />}
                      onClick={() => {
                        signInAsDealer();
                        close();
                        window.location.assign('/dealer');
                      }}
                    >
                      Sign in as Demo Dealer
                    </DropdownItem>
                    <DropdownItem
                      icon={<Shield className="h-4 w-4 text-[var(--color-noir-gold)]" />}
                      onClick={() => {
                        signInAsAdmin();
                        close();
                        window.location.assign('/admin');
                      }}
                    >
                      Sign in as Admin
                    </DropdownItem>
                    <DropdownDivider />
                    <DropdownItem
                      onClick={() => {
                        close();
                        window.location.assign('/dealer/register');
                      }}
                    >
                      Apply for Dealer Account
                    </DropdownItem>
                  </>
                )
              }
            </Dropdown>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              aria-label={`Wishlist, ${wishlistCount} items`}
              className="relative flex h-10 w-10 items-center justify-center text-[var(--text-primary)] transition-colors hover:text-[var(--color-noir-gold)]"
            >
              <Heart className="h-[18px] w-[18px]" />
              {wishlistCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--color-noir-gold)] px-1 text-[10px] font-bold text-[var(--color-noir-black)]">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <button
              type="button"
              onClick={openCart}
              aria-label={`Shopping bag, ${itemCount} items`}
              className="relative flex h-10 w-10 items-center justify-center text-[var(--text-primary)] transition-colors hover:text-[var(--color-noir-gold)]"
            >
              <ShoppingBag className="h-[18px] w-[18px]" />
              {itemCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--color-noir-gold)] px-1 text-[10px] font-bold text-[var(--color-noir-black)]">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* ─── Mega Menu ─── */}
        <AnimatePresence>
          {activeCategory && (
            <motion.div
              key={activeCategory.id}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              onMouseEnter={() => openMegaMenu(activeCategory.slug)}
              onMouseLeave={closeMegaMenu}
              className="absolute inset-x-0 top-full hidden border-b border-[var(--border-color)] bg-[var(--bg-primary)] shadow-xl lg:block"
            >
              <div className="mx-auto grid max-w-[1600px] grid-cols-4 gap-10 px-10 py-10">
                <div className="col-span-2">
                  <p className="mb-5 font-heading text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
                    {activeCategory.name}
                  </p>
                  <ul className="space-y-3">
                    {activeCategory.subcategories?.map((sub) => (
                      <li key={sub.id}>
                        <Link
                          to={`/shop/${activeCategory.slug}?sub=${sub.slug}`}
                          onClick={() => setActiveMegaMenu(null)}
                          className="group flex items-center gap-2 text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
                        >
                          <span className="nav-link">{sub.name}</span>
                          <span className="text-[10px] text-[var(--text-muted)]">{sub.productCount}</span>
                        </Link>
                      </li>
                    ))}
                    <li>
                      <Link
                        to={`/shop/${activeCategory.slug}`}
                        onClick={() => setActiveMegaMenu(null)}
                        className="text-sm font-medium text-[var(--color-noir-gold)]"
                      >
                        View all {activeCategory.name} →
                      </Link>
                    </li>
                  </ul>
                </div>

                <div>
                  <p className="mb-5 font-heading text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
                    Featured Collections
                  </p>
                  <ul className="space-y-3">
                    {[
                      { label: 'The Winter Edit', href: '/new-arrivals' },
                      { label: 'Minimal Essentials', href: '/shop/clothing' },
                      { label: 'Gift Guide', href: '/best-sellers' },
                      { label: 'Last Chance', href: '/sale' },
                    ].map((item) => (
                      <li key={item.label}>
                        <Link
                          to={item.href}
                          onClick={() => setActiveMegaMenu(null)}
                          className="nav-link text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  to={`/shop/${activeCategory.slug}`}
                  onClick={() => setActiveMegaMenu(null)}
                  className="group relative block overflow-hidden"
                >
                  <img
                    src={activeCategory.image}
                    alt={activeCategory.name}
                    className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <p className="font-heading text-sm font-semibold uppercase tracking-[0.14em] text-white">
                      {activeCategory.name}
                    </p>
                    <p className="mt-1 text-xs text-white/70">{activeCategory.productCount} pieces</p>
                  </div>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ─── Mobile Menu Drawer ─── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-100 lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="absolute inset-0 bg-black/50"
              aria-hidden="true"
            />
            <motion.div
              ref={megaMenuRef}
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="absolute left-0 top-0 bottom-0 flex w-[85vw] max-w-sm flex-col bg-[var(--bg-primary)]"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile menu"
            >
              <div className="flex items-center justify-between border-b border-[var(--border-color)] px-5 py-4">
                <span className="font-heading text-base font-extrabold text-[var(--text-primary)]">
                  {siteName}
                </span>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close menu"
                  className="text-[var(--text-muted)]"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-5 py-6">
                <nav className="space-y-6">
                  <div>
                    <p className="mb-3 font-heading text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
                      Shop
                    </p>
                    <ul className="space-y-1">
                      {categories.map((category) => (
                        <li key={category.id}>
                          <Link
                            to={`/shop/${category.slug}`}
                            onClick={() => setMobileMenuOpen(false)}
                            className="block py-2.5 font-heading text-sm font-semibold uppercase tracking-[0.1em] text-[var(--text-primary)]"
                          >
                            {category.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className="mb-3 font-heading text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
                      Discover
                    </p>
                    <ul className="space-y-1">
                      {[
                        { label: 'New Arrivals', href: '/new-arrivals' },
                        { label: 'Best Sellers', href: '/best-sellers' },
                        { label: 'Trending', href: '/trending' },
                        { label: 'Sale', href: '/sale' },
                        { label: 'About the Brand', href: '/about' },
                        { label: 'Contact', href: '/contact' },
                        { label: 'FAQ', href: '/faq' },
                      ].map((item) => (
                        <li key={item.href}>
                          <Link
                            to={item.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className={cn(
                              'block py-2.5 text-sm text-[var(--text-secondary)]',
                              item.label === 'Sale' && 'text-red-500'
                            )}
                          >
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className="mb-3 font-heading text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
                      Account
                    </p>
                    <ul className="space-y-1">
                      <li>
                        <Link
                          to={isAuthenticated ? '/account' : '/signin'}
                          onClick={() => setMobileMenuOpen(false)}
                          className="block py-2.5 text-sm text-[var(--text-secondary)]"
                        >
                          {isAuthenticated ? 'My Account' : 'Sign In'}
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/track-order"
                          onClick={() => setMobileMenuOpen(false)}
                          className="block py-2.5 text-sm text-[var(--text-secondary)]"
                        >
                          Track Order
                        </Link>
                      </li>
                      {user?.role === 'dealer' && (
                        <li>
                          <Link
                            to="/dealer"
                            onClick={() => setMobileMenuOpen(false)}
                            className="block py-2.5 font-heading text-xs font-bold uppercase tracking-wider text-amber-500"
                          >
                            Dealer B2B Portal &rarr;
                          </Link>
                        </li>
                      )}
                      <li>
                        <Link
                          to="/dealer/register"
                          onClick={() => setMobileMenuOpen(false)}
                          className="block py-2.5 text-xs text-[var(--color-noir-gold)] font-semibold"
                        >
                          Apply for Dealer Partnership &rarr;
                        </Link>
                      </li>
                      {user?.role === 'admin' && (
                        <li>
                          <Link
                            to="/admin"
                            onClick={() => setMobileMenuOpen(false)}
                            className="block py-2.5 font-heading text-xs font-bold uppercase tracking-wider text-[var(--color-noir-gold)]"
                          >
                            Admin Dashboard &rarr;
                          </Link>
                        </li>
                      )}
                    </ul>
                  </div>
                </nav>
              </div>

              <div className="border-t border-[var(--border-color)] p-5 space-y-3">
                <div className="flex items-center justify-between border border-[var(--border-color)] bg-[var(--bg-secondary)] px-3 py-2">
                  <span className="flex items-center gap-2 font-heading text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                    <Globe className="h-3.5 w-3.5 text-[var(--color-noir-gold)]" />
                    <span>Currency</span>
                  </span>
                  <select
                    value={currentCurrency}
                    onChange={(e) => setCurrency(e.target.value as Currency)}
                    aria-label="Mobile currency selector"
                    className="bg-transparent font-heading text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] cursor-pointer focus:outline-none"
                  >
                    {SUPPORTED_CURRENCIES.map((c) => (
                      <option key={c.code} value={c.code} className="bg-[var(--bg-card)] text-[var(--text-primary)]">
                        {c.flag} {c.code} ({c.symbol})
                      </option>
                    ))}
                  </select>
                </div>

                <Button
                  fullWidth
                  size="lg"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setSearchOpen(true);
                  }}
                >
                  <Search className="h-4 w-4" /> Search
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── Search Overlay ─── */}
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
