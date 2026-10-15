import { Suspense, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { ToastContainer } from '@/components/ui/ToastContainer';
import { useCartStore } from '@/store/cartStore';
import { useThemeStore } from '@/store/themeStore';

/** Full-page fallback shown while a lazily-loaded route chunk downloads. */
function RouteFallback() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <span className="font-heading text-lg font-extrabold tracking-[-0.02em] text-[var(--text-primary)]">
        AFRO<span className="text-[var(--color-noir-gold)]">&amp;</span>CO.
      </span>
      <span className="h-0.5 w-24 overflow-hidden bg-[var(--border-color)]">
        <span className="block h-full w-1/2 animate-pulse bg-[var(--color-noir-gold)]" />
      </span>
    </div>
  );
}

export default function RootLayout() {
  const location = useLocation();
  const cartOpen = useCartStore((state) => state.isOpen);
  const closeCart = useCartStore((state) => state.closeCart);
  const theme = useThemeStore((state) => state.theme);

  // Keep the theme attribute in sync on mount (also set by the store module).
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  // Reset scroll position on route change, but honor in-page hash anchors.
  useEffect(() => {
    if (location.hash) {
      const el = document.getElementById(location.hash.slice(1));
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [location.pathname, location.hash]);

  return (
    <div className="flex min-h-screen flex-col bg-[var(--bg-primary)]">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-200 focus:border focus:border-[var(--color-noir-gold)] focus:bg-[var(--bg-primary)] focus:px-4 focus:py-2 focus:text-sm focus:text-[var(--text-primary)]"
      >
        Skip to content
      </a>

      <Header />

      <main id="main-content" className="flex-1">
        <Suspense fallback={<RouteFallback />}>
          <Outlet />
        </Suspense>
      </main>

      <Footer />

      <CartDrawer open={cartOpen} onClose={closeCart} />
      <ToastContainer />
    </div>
  );
}
