import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Truck,
  Clock,
  Globe,
  PackageSearch,
  MapPin,
  Zap,
  Info,
  CircleCheck,
  ArrowRight,
} from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Button } from '@/components/ui/Button';
import { useSeo } from '@/hooks/useSeo';
import { useReducedMotion } from '@/hooks/useUi';
import { formatPrice } from '@/utils/format';

/* ─── Shared reveal wrapper ────────────────────────────────────────────────── */

function Reveal({ children, className }: { children: React.ReactNode; className?: string }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      initial={reduceMotion ? undefined : { opacity: 0, y: 16 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Data ─────────────────────────────────────────────────────────────────── */

interface ShippingRate {
  id: string;
  name: string;
  price: string;
  window: string;
  bestFor: string;
  highlight?: boolean;
}

const shippingRates: ShippingRate[] = [
  {
    id: 'standard',
    name: 'Standard',
    price: formatPrice(12),
    window: '3–5 business days',
    bestFor: 'Everyday domestic orders. Free over $150.',
  },
  {
    id: 'express',
    name: 'Express',
    price: formatPrice(24),
    window: '2 business days',
    bestFor: 'When you need it by a specific date.',
    highlight: true,
  },
  {
    id: 'overnight',
    name: 'Overnight',
    price: formatPrice(39),
    window: 'Next business day',
    bestFor: 'Order before 1:00 PM ET, Monday to Thursday.',
  },
];

const processingSteps = [
  {
    icon: Clock,
    title: 'Placed & confirmed',
    body: 'You get an order confirmation within minutes, and your card is authorised — not charged.',
  },
  {
    icon: Zap,
    title: 'Picked & packed',
    body: 'Ready-to-ship items leave our New York atelier within 1 business day. Made-to-order pieces take 10–14 days to cut and finish.',
  },
  {
    icon: Truck,
    title: 'Handed to the carrier',
    body: 'A tracking link is emailed and texted the moment the parcel is scanned. Domestic parcels travel by tracked courier; international by air with signature on delivery.',
  },
];

const internationalFacts = [
  'We ship to more than 60 countries across Europe, Asia-Pacific, the Middle East, Canada and Latin America.',
  'Duties, VAT and import taxes are calculated at checkout and collected by us, so nothing is payable on delivery.',
  'Delivery is typically 7–15 business days after dispatch, depending on customs clearance at destination.',
  'A small number of restricted destinations cannot receive leather goods — checkout will tell you before payment.',
  'All international parcels are tracked and require a signature, so please give an address where someone can receive them.',
];

/* ─── Page ─────────────────────────────────────────────────────────────────── */

export default function ShippingPolicyPage() {
  useSeo({
    title: 'Shipping & Delivery',
    description:
      'Shipping rates and delivery windows for Standard, Express and Overnight service, processing times, international shipping, and how to track your NOIR & CO. order.',
  });

  return (
    <div>
      {/* ─── Hero ─── */}
      <header className="border-b border-[var(--border-color)] bg-[var(--bg-secondary)]">
        <div className="mx-auto max-w-[1600px] px-4 py-10 sm:px-6 lg:px-10 lg:py-16">
          <Breadcrumbs
            items={[{ label: 'Home', href: '/' }, { label: 'Shipping & Delivery' }]}
          />
          <div className="mt-8 max-w-2xl">
            <p className="font-heading text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
              Policies
            </p>
            <h1 className="mt-4 text-[clamp(2rem,6vw,4.5rem)] font-heading font-extrabold leading-[0.95] tracking-[-0.03em] text-[var(--text-primary)]">
              Shipping &amp; delivery
            </h1>
            <p className="mt-6 max-w-2xl text-sm leading-relaxed text-[var(--text-secondary)] sm:text-base">
              Every parcel is tracked from our atelier to your door, and the full cost is shown
              before you pay. Here is exactly how long each service takes, what it costs, and what to
              do if something goes missing.
            </p>
          </div>
        </div>
      </header>

      {/* ─── Rates table ─── */}
      <section aria-labelledby="rates-heading" className="py-16 lg:py-24">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10">
          <Reveal className="max-w-2xl">
            <p className="font-heading text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
              Rates &amp; windows
            </p>
            <h2
              id="rates-heading"
              className="mt-4 text-[clamp(1.75rem,4vw,3rem)] font-heading font-extrabold leading-[1] tracking-[-0.03em] text-[var(--text-primary)]"
            >
              Choose your speed
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-[var(--text-secondary)]">
              Rates are per order, not per item, and apply to the continental United States. Business
              days exclude weekends and federal holidays.
            </p>
          </Reveal>

          <Reveal>
            <div className="mt-12 overflow-x-auto border border-[var(--border-color)]">
              <table className="w-full min-w-[720px] border-collapse text-left">
                <caption className="sr-only">
                  Shipping service, price, delivery window and recommended use
                </caption>
                <thead>
                  <tr className="bg-[var(--bg-secondary)]">
                    <th
                      scope="col"
                      className="border-b border-[var(--border-color)] px-6 py-5 font-heading text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]"
                    >
                      Service
                    </th>
                    <th
                      scope="col"
                      className="border-b border-[var(--border-color)] px-6 py-5 font-heading text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]"
                    >
                      Price
                    </th>
                    <th
                      scope="col"
                      className="border-b border-[var(--border-color)] px-6 py-5 font-heading text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]"
                    >
                      Delivery window
                    </th>
                    <th
                      scope="col"
                      className="border-b border-[var(--border-color)] px-6 py-5 font-heading text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]"
                    >
                      Best for
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {shippingRates.map((rate) => (
                    <tr
                      key={rate.id}
                      className="bg-[var(--bg-card)] transition-colors hover:bg-[var(--bg-primary)]"
                    >
                      <th
                        scope="row"
                        className="border-b border-[var(--border-color)] px-6 py-6 align-top"
                      >
                        <span className="flex items-center gap-2 font-heading text-sm font-semibold uppercase tracking-[0.1em] text-[var(--text-primary)]">
                          {rate.name}
                          {rate.highlight && (
                            <span className="border border-[var(--color-noir-gold)] px-1.5 py-0.5 font-heading text-[9px] font-bold uppercase tracking-[0.14em] text-[var(--color-noir-gold)]">
                              Popular
                            </span>
                          )}
                        </span>
                      </th>
                      <td className="border-b border-[var(--border-color)] px-6 py-6 align-top">
                        <span className="font-editorial text-2xl font-bold tracking-[-0.02em] text-[var(--text-primary)]">
                          {rate.price}
                        </span>
                      </td>
                      <td className="border-b border-[var(--border-color)] px-6 py-6 align-top text-sm text-[var(--text-secondary)]">
                        {rate.window}
                      </td>
                      <td className="border-b border-[var(--border-color)] px-6 py-6 align-top text-sm text-[var(--text-secondary)]">
                        {rate.bestFor}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>

          <Reveal>
            <p className="mt-6 flex items-start gap-3 text-xs leading-relaxed text-[var(--text-muted)]">
              <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              Standard shipping is complimentary on domestic orders over {formatPrice(150)}. Alaska,
              Hawaii and Puerto Rico add {formatPrice(18)} to Standard and {formatPrice(32)} to
              Express. Gift wrapping is always free and never changes the shipping cost.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ─── Processing times ─── */}
      <section
        aria-labelledby="processing-heading"
        className="border-y border-[var(--border-color)] bg-[var(--bg-secondary)] py-20 lg:py-28"
      >
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <Reveal>
                <p className="font-heading text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
                  Before it ships
                </p>
                <h2
                  id="processing-heading"
                  className="mt-4 text-[clamp(1.75rem,4vw,3rem)] font-heading font-extrabold leading-[1] tracking-[-0.03em] text-[var(--text-primary)]"
                >
                  Processing times
                </h2>
                <p className="mt-5 text-sm leading-relaxed text-[var(--text-secondary)]">
                  Delivery windows start when your parcel is scanned by the carrier, not when you
                  place the order. Here is what happens in between.
                </p>
              </Reveal>
            </div>

            <div className="lg:col-span-8">
              <ol className="space-y-0 border-t border-[var(--border-color)]">
                {processingSteps.map((step, index) => (
                  <Reveal key={step.title}>
                    <li className="flex gap-5 border-b border-[var(--border-color)] py-7">
                      <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center border border-[var(--border-color)] text-[var(--color-noir-gold)]">
                        <step.icon className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <div className="min-w-0">
                        <p className="font-heading text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
                          Step {index + 1}
                        </p>
                        <h3 className="mt-1 font-heading text-sm font-semibold uppercase tracking-[0.12em] text-[var(--text-primary)]">
                          {step.title}
                        </h3>
                        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--text-secondary)]">
                          {step.body}
                        </p>
                      </div>
                    </li>
                  </Reveal>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* ─── International ─── */}
      <section aria-labelledby="intl-heading" className="py-20 lg:py-28">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <Reveal>
                <div className="flex items-center gap-3">
                  <Globe className="h-4 w-4 text-[var(--color-noir-gold)]" aria-hidden="true" />
                  <p className="font-heading text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
                    Worldwide
                  </p>
                </div>
                <h2
                  id="intl-heading"
                  className="mt-4 text-[clamp(1.75rem,4vw,3rem)] font-heading font-extrabold leading-[1] tracking-[-0.03em] text-[var(--text-primary)]"
                >
                  International shipping
                </h2>
                <ul className="mt-8 space-y-0 border-t border-[var(--border-color)]">
                  {internationalFacts.map((fact) => (
                    <li
                      key={fact}
                      className="flex gap-3 border-b border-[var(--border-color)] py-4 text-sm leading-relaxed text-[var(--text-secondary)]"
                    >
                      <CircleCheck
                        className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-noir-gold)]"
                        aria-hidden="true"
                      />
                      {fact}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>

            <div className="lg:col-span-5">
              <Reveal>
                <div className="border border-[var(--border-color)] bg-[var(--bg-card)] p-8">
                  <h3 className="font-heading text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--text-primary)]">
                    Duties &amp; taxes
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
                    We use delivered-duty-paid shipping. The duty and import VAT for your country is
                    calculated at checkout and collected by us on behalf of your customs authority, so
                    your parcel clears without a second invoice and you are never asked to pay a
                    courier a surprise fee.
                  </p>
                  <dl className="mt-6 space-y-3 border-t border-[var(--border-color)] pt-6">
                    {[
                      { k: 'Europe (EU & UK)', v: '6–12 business days' },
                      { k: 'Canada & Mexico', v: '5–9 business days' },
                      { k: 'Asia-Pacific', v: '7–14 business days' },
                      { k: 'Rest of world', v: '10–15 business days' },
                    ].map((row) => (
                      <div key={row.k} className="flex items-baseline justify-between gap-4">
                        <dt className="text-sm text-[var(--text-secondary)]">{row.k}</dt>
                        <dd className="font-heading text-xs font-semibold text-[var(--text-primary)]">
                          {row.v}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Tracking ─── */}
      <section
        aria-labelledby="tracking-heading"
        className="border-y border-[var(--border-color)] bg-[var(--bg-secondary)] py-20 lg:py-28"
      >
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10">
          <Reveal className="max-w-2xl">
            <p className="font-heading text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
              Follow your parcel
            </p>
            <h2
              id="tracking-heading"
              className="mt-4 text-[clamp(1.75rem,4vw,3rem)] font-heading font-extrabold leading-[1] tracking-[-0.03em] text-[var(--text-primary)]"
            >
              Tracking your order
            </h2>
          </Reveal>

          <div className="mt-14 grid grid-cols-1 gap-px border border-[var(--border-color)] bg-[var(--border-color)] sm:grid-cols-3">
            {[
              {
                icon: MapPin,
                title: 'Watch for the email',
                body: 'A tracking link is sent to your email and phone as soon as the carrier scans your parcel — usually within a day of dispatch.',
              },
              {
                icon: PackageSearch,
                title: 'Check the tracking page',
                body: 'Enter your order number on the tracking page for live status, the carrier reference and your estimated delivery date.',
              },
              {
                icon: Truck,
                title: 'Nothing moving for 48 hours?',
                body: 'Tracking can pause over a weekend or during customs. After two full days of no movement, contact us and we will trace it with the carrier.',
              },
            ].map((card) => (
              <Reveal key={card.title}>
                <article className="h-full bg-[var(--bg-card)] p-8">
                  <span className="inline-flex h-11 w-11 items-center justify-center border border-[var(--border-color)] text-[var(--color-noir-gold)]">
                    <card.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-6 font-heading text-sm font-semibold uppercase tracking-[0.14em] text-[var(--text-primary)]">
                    {card.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
                    {card.body}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section aria-labelledby="ship-cta-heading" className="py-16 lg:py-24">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10">
          <Reveal>
            <div className="flex flex-col gap-8 border border-[var(--color-noir-gold)] p-8 sm:p-12 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-xl">
                <h2
                  id="ship-cta-heading"
                  className="font-heading text-3xl font-extrabold tracking-[-0.02em] text-[var(--text-primary)] sm:text-4xl"
                >
                  Where is my order?
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-[var(--text-secondary)]">
                  Enter your order number to see live tracking, the carrier reference and your
                  estimated delivery date. It takes about ten seconds.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button asChild size="lg">
                  <Link to="/track-order">
                    Track an order
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
                <Button asChild variant="ghost" size="lg">
                  <Link to="/contact">Ask client care</Link>
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
