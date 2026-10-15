import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Heart,
  LayoutDashboard,
  LifeBuoy,
  Lock,
  LogOut,
  MapPin,
  Package,
  ShieldCheck,
  Star,
  UserCog,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useSeo } from '@/hooks/useSeo';
import { useReducedMotion } from '@/hooks/useUi';
import { useToastStore } from '@/store/toastStore';
import { useUserStore } from '@/store/userStore';
import { cn } from '@/utils/cn';
import { formatDate } from '@/utils/format';

/* ─── Navigation model ────────────────────────────────────────────────────── */

interface NavItem {
  to: string;
  label: string;
  icon: React.ReactNode;
  /** Only match the path exactly (used for the index route). */
  end?: boolean;
}

const navItems: NavItem[] = [
  {
    to: '/account',
    label: 'Dashboard',
    icon: <LayoutDashboard className="h-4 w-4" aria-hidden="true" />,
    end: true,
  },
  { to: '/account/orders', label: 'Orders', icon: <Package className="h-4 w-4" aria-hidden="true" /> },
  { to: '/account/wishlist', label: 'Wishlist', icon: <Heart className="h-4 w-4" aria-hidden="true" /> },
  { to: '/account/addresses', label: 'Addresses', icon: <MapPin className="h-4 w-4" aria-hidden="true" /> },
  { to: '/account/reviews', label: 'Reviews', icon: <Star className="h-4 w-4" aria-hidden="true" /> },
  { to: '/account/support', label: 'Support', icon: <LifeBuoy className="h-4 w-4" aria-hidden="true" /> },
  {
    to: '/account/profile',
    label: 'Profile & Settings',
    icon: <UserCog className="h-4 w-4" aria-hidden="true" />,
  },
];

/* ─── Shared class recipes ────────────────────────────────────────────────── */

const eyebrow =
  'font-heading text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]';

const sidebarLink = [
  'flex items-center gap-3 border-l-2 px-4 py-3 text-left font-heading text-[11px] font-semibold',
  'uppercase tracking-[0.16em] transition-colors duration-200',
].join(' ');

const mobileLink = [
  'flex shrink-0 items-center gap-2 border-b-2 px-3 py-3 font-heading text-[11px] font-semibold',
  'uppercase tracking-[0.14em] transition-colors duration-200',
].join(' ');

/* ─── Account shell ───────────────────────────────────────────────────────── */

export default function AccountLayout() {
  useSeo({
    title: 'My Account',
    description:
      'Manage your AFRO & CO. orders, delivery addresses, wishlist, reviews and account preferences in one place.',
  });

  const { user, isAuthenticated, signOut } = useUserStore();
  const navigate = useNavigate();
  const toastInfo = useToastStore((state) => state.info);
  const reducedMotion = useReducedMotion();

    const initials = user
    ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase()
    : 'AC';

  const handleSignOut = () => {
    signOut();
    toastInfo('Signed out', 'You have been signed out of your AFRO & CO. account.');
    navigate('/');
  };

  const userNavItems: NavItem[] = [
    ...navItems,
    ...(user?.role === 'admin'
      ? [
          {
            to: '/admin',
            label: 'Admin Operations',
            icon: <ShieldCheck className="h-4 w-4 text-[var(--color-noir-gold)]" />,
          },
        ]
      : []),
  ];

  return (
    <div className="py-10 lg:py-14">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10">
        {/* ─── Page header ─── */}
        <motion.header
          initial={reducedMotion ? undefined : { opacity: 0, y: 12 }}
          animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="border-b border-[var(--border-color)] pb-8"
        >
          <p className={eyebrow}>Account</p>
          <h1 className="mt-3 text-[clamp(1.75rem,4vw,2.75rem)] font-heading font-extrabold tracking-[-0.02em] text-[var(--text-primary)]">
            My Account
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--text-secondary)]">
            Orders, addresses, wishlist and preferences — everything for your AFRO &amp; CO.
            account, gathered in one quiet place.
          </p>
        </motion.header>

        {!isAuthenticated || !user ? (
          /* ─── Gated panel: never redirect, always offer a way forward ─── */
          <motion.section
            initial={reducedMotion ? undefined : { opacity: 0, y: 12 }}
            animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            aria-labelledby="account-gated-title"
            className="mt-10 border border-[var(--border-color)] bg-[var(--bg-card)] p-8 text-center sm:p-14"
          >
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--bg-secondary)] text-[var(--color-noir-gold)]">
              <Lock className="h-5 w-5" aria-hidden="true" />
            </span>
            <h2
              id="account-gated-title"
              className="mt-6 font-heading text-2xl font-bold text-[var(--text-primary)]"
            >
              Sign in to open your account
            </h2>
            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-[var(--text-secondary)]">
              Your orders, saved addresses and wishlist live behind a quick sign-in. It takes a
              moment — and your bag stays exactly as it is.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild>
                <Link to="/signin">Sign in</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/shop">Continue shopping</Link>
              </Button>
            </div>
            <p className="mt-6 flex items-center justify-center gap-2 text-xs text-[var(--text-muted)]">
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
              New here? Creating an account takes less than a minute.
            </p>
          </motion.section>
        ) : (
          <div className="mt-10 grid gap-8 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-12">
            {/* ─── Desktop sidebar ─── */}
            <aside className="hidden lg:block">
              <div className="w-64 lg:sticky lg:top-[7.5rem] lg:max-h-[calc(100vh-9.5rem)] lg:overflow-y-auto">
                <div className="border border-[var(--border-color)] bg-[var(--bg-card)] p-6">
                  {/* Customer identity */}
                  <div className="flex items-center gap-4">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt=""
                        className="h-12 w-12 shrink-0 rounded-full object-cover"
                      />
                    ) : (
                      <span
                        aria-hidden="true"
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--color-noir-charcoal)] font-heading text-sm font-bold tracking-[0.08em] text-[var(--color-noir-ivory)]"
                      >
                        {initials}
                      </span>
                    )}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="truncate font-heading text-sm font-bold text-[var(--text-primary)]">
                          {user.firstName} {user.lastName}
                        </p>
                      </div>
                      <span className={`inline-block font-mono text-[9px] uppercase font-bold px-1.5 py-0.2 mt-0.5 ${
                        user.role === 'admin'
                          ? 'bg-[var(--color-noir-gold)]/20 text-[var(--color-noir-gold)] border border-[var(--color-noir-gold)]/40'
                          : 'bg-[var(--bg-secondary)] text-[var(--text-muted)]'
                      }`}>
                        {user.role}
                      </span>
                      <p className="truncate text-xs text-[var(--text-muted)] mt-1">{user.email}</p>
                    </div>
                  </div>

                  <p className="mt-4 border-t border-[var(--border-color)] pt-4 text-[11px] text-[var(--text-muted)]">
                    Member since {formatDate(user.createdAt, 'long')}
                  </p>

                  {/* Nav */}
                  <nav aria-label="Account navigation" className="mt-5 -mx-6">
                    <ul className="flex flex-col">
                      {userNavItems.map((item) => (
                        <li key={item.to}>
                          <NavLink
                            to={item.to}
                            end={item.end}
                            className={({ isActive }) =>
                              cn(
                                sidebarLink,
                                isActive
                                  ? 'border-l-2 border-[var(--color-noir-gold)] bg-[var(--color-noir-gold)]/10 text-[var(--color-noir-gold)] font-bold'
                                  : 'border-transparent text-[var(--text-muted)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]'
                              )
                            }
                          >
                            {item.icon}
                            <span className="truncate">{item.label}</span>
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  </nav>

                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="mt-6 flex w-full items-center gap-3 border-t border-[var(--border-color)] pt-5 text-left font-heading text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
                  >
                    <LogOut className="h-4 w-4" aria-hidden="true" />
                    Sign Out
                  </button>
                </div>
              </div>
            </aside>

            {/* ─── Mobile tab bar ─── */}
            <nav
              aria-label="Account sections"
              className="-mx-4 mb-2 overflow-x-auto border-b border-[var(--border-color)] px-4 lg:hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              <ul className="flex w-max items-center gap-1">
                {userNavItems.map((item) => (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      end={item.end}
                      className={({ isActive }) =>
                        cn(
                          mobileLink,
                          isActive
                            ? 'border-[var(--color-noir-gold)] text-[var(--color-noir-gold)] font-bold'
                            : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                        )
                      }
                    >
                      {item.icon}
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>

            {/* ─── Routed page content ─── */}
            <div className="min-w-0">
              <Outlet />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
