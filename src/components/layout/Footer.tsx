import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone } from 'lucide-react';
import { InstagramIcon, TwitterIcon, FacebookIcon, YoutubeIcon } from '@/components/ui/SocialIcons';
import { useCategoryStore } from '@/store/categoryStore';
import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useToastStore } from '@/store/toastStore';
import { useBrandStore } from '@/store/brandStore';

const shopLinks = [
  { label: 'New Arrivals', href: '/new-arrivals' },
  { label: 'Best Sellers', href: '/best-sellers' },
  { label: 'Trending', href: '/trending' },
  { label: 'Sale', href: '/sale' },
  { label: 'Compare Products', href: '/compare' },
];

const helpLinks = [
  { label: 'Contact Us', href: '/contact' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Shipping & Delivery', href: '/shipping' },
  { label: 'Returns & Refunds', href: '/returns' },
  { label: 'Track Your Order', href: '/track-order' },
];

const companyLinks = [
  { label: 'About AFRO & CO.', href: '/about' },
  { label: 'Terms & Conditions', href: '/terms' },
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Admin Dashboard', href: '/admin' },
];

const socialLinks = [
  { label: 'Instagram', icon: InstagramIcon, href: '#' },
  { label: 'Twitter', icon: TwitterIcon, href: '#' },
  { label: 'Facebook', icon: FacebookIcon, href: '#' },
  { label: 'YouTube', icon: YoutubeIcon, href: '#' },
];

export function Footer() {
  const categories = useCategoryStore((s) => s.categories);
  const siteName = useBrandStore((s) => s.siteName);
  const siteSubtitle = useBrandStore((s) => s.siteSubtitle);
  const [email, setEmail] = useState('');
  const toast = useToastStore((state) => state.success);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
    toast('Subscribed', `Welcome to the ${siteName} list (demo).`);
    setEmail('');
  };

  return (
    <footer className="mt-24 border-t border-[var(--border-color)] bg-[var(--bg-secondary)]">
      {/* ─── Newsletter ─── */}
      <div className="border-b border-[var(--border-color)]">
        <div className="mx-auto grid max-w-[1600px] gap-8 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-10">
          <div>
            <p className="font-heading text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--color-noir-gold)]">
              The Inner Circle
            </p>
            <h2 className="mt-3 max-w-md font-heading text-3xl font-bold leading-tight text-[var(--text-primary)] lg:text-4xl">
              Be first to know about new collections.
            </h2>
          </div>
          <form onSubmit={handleSubscribe} className="lg:justify-self-end lg:w-full lg:max-w-md">
            <div className="flex flex-col gap-3 sm:flex-row">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                aria-label="Email address for newsletter"
                leading={<Mail className="h-4 w-4" />}
                required
                containerClassName="flex-1"
              />
              <Button type="submit" size="lg" className="shrink-0">
                Subscribe
              </Button>
            </div>
            <p className="mt-3 text-xs text-[var(--text-muted)]">
              By subscribing you agree to our Privacy Policy. Unsubscribe anytime.
            </p>
          </form>
        </div>
      </div>

      {/* ─── Link Columns ─── */}
      <div className="mx-auto max-w-[1600px] px-4 py-14 sm:px-6 lg:px-10">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block">
              <span className="font-heading text-xl font-extrabold tracking-[-0.02em] text-[var(--text-primary)]">
                {siteName}
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-[var(--text-muted)]">
              {siteSubtitle || 'A premium editorial e-commerce experience. Curated fashion, accessories, and lifestyle goods for the modern collector.'}
            </p>
            <div className="mt-6 flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="flex h-9 w-9 items-center justify-center border border-[var(--border-color)] text-[var(--text-secondary)] transition-colors hover:border-[var(--color-noir-gold)] hover:text-[var(--color-noir-gold)]"
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <nav aria-label="Shop links">
            <h3 className="font-heading text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--text-primary)]">
              Shop
            </h3>
            <ul className="mt-4 space-y-3">
              {shopLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="nav-link text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Categories */}
          <nav aria-label="Category links">
            <h3 className="font-heading text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--text-primary)]">
              Categories
            </h3>
            <ul className="mt-4 space-y-3">
              {categories.slice(0, 5).map((category) => (
                <li key={category.id}>
                  <Link
                    to={`/shop/${category.slug}`}
                    className="nav-link text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Help */}
          <nav aria-label="Help links">
            <h3 className="font-heading text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--text-primary)]">
              Help
            </h3>
            <ul className="mt-4 space-y-3">
              {helpLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="nav-link text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Contact + company */}
        <div className="mt-12 flex flex-col gap-8 border-t border-[var(--border-color)] pt-8 lg:flex-row lg:items-center lg:justify-between">
          <ul className="flex flex-wrap items-center gap-x-8 gap-y-3 text-xs text-[var(--text-muted)]">
            <li className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
              New York · London · Tokyo
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-3.5 w-3.5" aria-hidden="true" />
              hello@noirandco.example
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-3.5 w-3.5" aria-hidden="true" />
              +1 (212) 555-0100
            </li>
          </ul>

          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {companyLinks.map((link) => (
              <li key={link.href}>
                <Link
                  to={link.href}
                  className="text-xs text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ─── Bottom bar ─── */}
      <div className="border-t border-[var(--border-color)]">
        <div className="mx-auto flex max-w-[1600px] flex-col items-center justify-between gap-3 px-4 py-6 sm:flex-row sm:px-6 lg:px-10">
          <p className="text-xs text-[var(--text-muted)]">
            © {new Date().getFullYear()} {siteName}. All rights reserved. Demo storefront.
          </p>
          <p className="text-xs text-[var(--text-muted)]">
            Visa · Mastercard · Amex · PayPal · Apple Pay · Google Pay
          </p>
        </div>
      </div>
    </footer>
  );
}
