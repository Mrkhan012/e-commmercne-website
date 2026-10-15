import { Link, NavLink, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  BarChart3,
  ShoppingBag,
  Package,
  Layers,
  Boxes,
  Users,
  Ticket,
  Star,
  RotateCcw,
  Mail,
  Settings,
  ArrowLeft,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { useSeo } from '@/hooks/useSeo';

const adminNav = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/categories', label: 'Categories', icon: Layers },
  { to: '/admin/inventory', label: 'Inventory', icon: Boxes },
  { to: '/admin/customers', label: 'Customers', icon: Users },
  { to: '/admin/coupons', label: 'Coupons', icon: Ticket },
  { to: '/admin/reviews', label: 'Reviews', icon: Star },
  { to: '/admin/returns', label: 'Returns & RMA', icon: RotateCcw },
  { to: '/admin/subscribers', label: 'Subscribers', icon: Mail },
  { to: '/admin/settings', label: 'Store Settings', icon: Settings },
];

export default function AdminLayout() {
  useSeo({
    title: 'Admin Console | NOIR & CO.',
    description: 'Executive management portal for NOIR & CO. operations, inventory, and orders.',
  });

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Top Banner */}
      <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-[var(--border-color)] bg-[var(--bg-card)]/90 px-4 sm:px-8 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="flex items-center gap-2 font-heading text-xs uppercase tracking-wider text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Storefront</span>
          </Link>
          <span className="text-[var(--border-color)]">|</span>
          <span className="font-heading text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-noir-gold)]">
            NOIR &amp; CO. Atelier Operations
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-[10px] text-emerald-500">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            LIVE ATELIER
          </span>
          <span className="font-heading text-xs font-semibold text-[var(--text-primary)]">
            Director Console
          </span>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1600px]">
        {/* Sidebar */}
        <aside className="hidden w-64 shrink-0 border-r border-[var(--border-color)] bg-[var(--bg-card)] p-4 md:block min-h-[calc(100vh-3.5rem)]">
          <nav className="space-y-1">
            {adminNav.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 px-3.5 py-2.5 font-heading text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors',
                      isActive
                        ? 'border-l-2 border-[var(--color-noir-gold)] bg-[var(--bg-secondary)] text-[var(--text-primary)]'
                        : 'border-l-2 border-transparent text-[var(--text-muted)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]'
                    )
                  }
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </aside>

        {/* Content Area */}
        <main className="flex-1 overflow-x-hidden p-6 sm:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
