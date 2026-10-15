import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Search,
  ArrowRight,
  House,
  ShoppingBag,
  Compass,
  LifeBuoy,
  Headphones,
  PackageSearch,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useSeo } from '@/hooks/useSeo';
import { useReducedMotion } from '@/hooks/useUi';
import { categories } from '@/data/categories';

/** Featured categories first, then the rest, trimmed to six. */
const popularCategories = [
  ...categories.filter((category) => category.featured),
  ...categories.filter((category) => !category.featured),
].slice(0, 6);

const suggestions = [
  { label: 'New arrivals', to: '/new-arrivals' },
  { label: 'Best sellers', to: '/best-sellers' },
  { label: 'Track an order', to: '/track-order' },
  { label: 'Contact client care', to: '/contact' },
];

export default function NotFoundPage() {
  useSeo({
    title: 'Page not found',
    description:
      'The page you were looking for could not be found. Search the collection, browse popular categories, or head back to the shop.',
  });

  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const [query, setQuery] = useState('');

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = query.trim();
    if (trimmed.length === 0) return;
    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <div className="relative overflow-hidden">
      {/* ─── Hero ─── */}
      <section className="border-b border-[var(--border-color)] bg-[var(--bg-secondary)]">
        <div className="mx-auto max-w-[1600px] px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <motion.p
                initial={reduceMotion ? undefined : { opacity: 0, y: 12 }}
                animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="font-heading text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]"
              >
                Error 404
              </motion.p>

              <h1 className="mt-4 font-editorial text-[clamp(5rem,20vw,14rem)] font-bold leading-[0.82] tracking-[-0.04em] text-[var(--text-primary)]">
                404
              </h1>

              <p className="mt-6 max-w-xl font-editorial text-2xl font-normal italic leading-[1.3] text-[var(--text-primary)] sm:text-3xl">
                This page has stepped out of the frame.
              </p>
              <p className="mt-5 max-w-xl text-sm leading-relaxed text-[var(--text-secondary)] sm:text-base">
                The link you followed may be broken, or the page may have been moved or retired.
                Nothing is wrong with your connection — let's find you something better.
              </p>

              {/* ─── Search ─── */}
              <form
                onSubmit={handleSearch}
                role="search"
                aria-label="Search the collection"
                className="mt-10 max-w-xl"
              >
                <label
                  htmlFor="not-found-search"
                  className="mb-2 block font-heading text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]"
                >
                  Search the collection
                </label>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="relative flex flex-1 items-center border border-[var(--border-color)] bg-[var(--bg-primary)] focus-within:border-[var(--text-primary)]">
                    <Search
                      className="pointer-events-none absolute left-4 h-4 w-4 text-[var(--text-muted)]"
                      aria-hidden="true"
                    />
                    <input
                      id="not-found-search"
                      type="search"
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder="Try “wool coat”, “loafers”, “tote bag”…"
                      className="h-13 w-full bg-transparent pl-11 pr-4 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none"
                    />
                  </div>
                  <Button type="submit" size="lg" className="sm:w-auto">
                    Search
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </div>
              </form>

              {/* ─── Primary / secondary CTAs ─── */}
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button asChild size="lg">
                  <Link to="/">
                    <House className="h-4 w-4" aria-hidden="true" />
                    Back to home
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/shop">
                    <ShoppingBag className="h-4 w-4" aria-hidden="true" />
                    Continue shopping
                  </Link>
                </Button>
              </div>
            </div>

            {/* ─── Quick routes rail ─── */}
            <div className="lg:col-span-5">
              <div className="border border-[var(--border-color)] bg-[var(--bg-card)] p-8">
                <div className="flex items-center gap-3">
                  <LifeBuoy className="h-4 w-4 text-[var(--color-noir-gold)]" aria-hidden="true" />
                  <h2 className="font-heading text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--text-primary)]">
                    Looking for something specific?
                  </h2>
                </div>
                <ul className="mt-5 border-t border-[var(--border-color)]">
                  {suggestions.map((suggestion) => (
                    <li key={suggestion.to}>
                      <Link
                        to={suggestion.to}
                        className="group flex items-center justify-between gap-4 border-b border-[var(--border-color)] py-4 text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
                      >
                        {suggestion.label}
                        <ArrowRight
                          className="h-3.5 w-3.5 shrink-0 text-[var(--text-muted)] transition-transform group-hover:translate-x-1 group-hover:text-[var(--color-noir-gold)]"
                          aria-hidden="true"
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
                <p className="mt-5 flex items-start gap-3 text-xs leading-relaxed text-[var(--text-muted)]">
                  <Headphones className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  Still stuck? Client care answers every message within one business day.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Popular categories ─── */}
      <section aria-labelledby="popular-heading" className="py-16 lg:py-24">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10">
          <div className="flex items-center gap-3">
            <Compass className="h-4 w-4 text-[var(--color-noir-gold)]" aria-hidden="true" />
            <h2
              id="popular-heading"
              className="font-heading text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--text-primary)]"
            >
              Popular categories
            </h2>
          </div>

          <ul className="mt-8 grid grid-cols-1 gap-px border border-[var(--border-color)] bg-[var(--border-color)] sm:grid-cols-2 lg:grid-cols-3">
            {popularCategories.map((category) => (
              <li key={category.id}>
                <Link
                  to={`/shop/${category.slug}`}
                  className="group flex h-full items-center justify-between gap-4 bg-[var(--bg-card)] p-6 transition-colors hover:bg-[var(--bg-primary)]"
                >
                  <span className="min-w-0">
                    <span className="block font-heading text-sm font-semibold uppercase tracking-[0.1em] text-[var(--text-primary)]">
                      {category.name}
                    </span>
                    <span className="mt-1 flex items-center gap-1.5 font-heading text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">
                      <PackageSearch className="h-3 w-3" aria-hidden="true" />
                      {category.productCount} pieces
                    </span>
                  </span>
                  <ArrowRight
                    className="h-4 w-4 shrink-0 text-[var(--text-muted)] transition-transform group-hover:translate-x-1 group-hover:text-[var(--color-noir-gold)]"
                    aria-hidden="true"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
