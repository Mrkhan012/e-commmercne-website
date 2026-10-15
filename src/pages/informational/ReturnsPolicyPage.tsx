import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  RotateCcw,
  CircleCheck,
  PackageX,
  Banknote,
  RefreshCw,
  Undo2,
  Receipt,
  Clock,
  ArrowRight,
  Info,
} from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Button } from '@/components/ui/Button';
import { useSeo } from '@/hooks/useSeo';
import { useReducedMotion } from '@/hooks/useUi';

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

const eligibleItems = [
  'Clothing, footwear, bags and accessories that are unworn, unwashed and undamaged.',
  'Items still carrying their original tags, with all packaging, dust bags and tissue intact.',
  'Anything purchased within thirty days of delivery, including sale and promotional items.',
  'Faulty or mis-described goods, at any time — these are always accepted, whatever the category.',
  'Gifts, using the order number from your gift note rather than your own account.',
];

const nonReturnableItems = [
  'Pierced jewellery and earrings, for hygiene reasons.',
  'Swimwear, underwear and hosiery once the hygiene seal has been broken.',
  'Gift cards and store credit.',
  'Items that have been personalised, monogrammed or altered to order.',
  'Final-sale items, which are clearly marked on the product page.',
];

const returnSteps = [
  {
    title: 'Start the return',
    body: 'Open Account → Orders, choose the order and select “Start a return”. Guest orders can be returned with the order number from your confirmation email.',
  },
  {
    title: 'Choose items and reason',
    body: 'Tick what you are sending back and pick a reason. A short reason genuinely helps us fix problems upstream — it takes ten seconds.',
  },
  {
    title: 'Print the prepaid label',
    body: 'We email a prepaid, tracked return label for every domestic return. International returns are refunded the standard shipping cost once the parcel is scanned.',
  },
  {
    title: 'Pack it properly',
    body: 'Use the original packaging where you can, with tags attached and the dust bag inside. If the box is gone, any sturdy carton is fine.',
  },
  {
    title: 'Drop it off',
    body: 'Leave the parcel at any carrier location. Your refund begins the moment the label is scanned — you do not need to tell us again.',
  },
  {
    title: 'We inspect and refund',
    body: 'Returns are inspected within two business days of arrival and the refund is released the same day. Exchanges ship as soon as your parcel is scanned.',
  },
];

const refundTimeline = [
  {
    method: 'Credit or debit card',
    inspection: '2 business days',
    posted: '5–10 business days after release',
  },
  {
    method: 'PayPal',
    inspection: '2 business days',
    posted: '3–5 business days after release',
  },
  {
    method: 'Apple Pay / Google Pay',
    inspection: '2 business days',
    posted: '5–10 business days after release',
  },
  {
    method: 'Klarna / Afterpay',
    inspection: '2 business days',
    posted: 'Balance updates within 3 business days',
  },
  {
    method: 'Store credit',
    inspection: '2 business days',
    posted: 'Issued immediately on approval',
  },
];

/* ─── Page ─────────────────────────────────────────────────────────────────── */

export default function ReturnsPolicyPage() {
  useSeo({
    title: 'Returns & Exchanges',
    description:
      'Thirty days to change your mind, a free prepaid return label on every domestic order, and refunds released within two business days of inspection. Read the full returns policy.',
  });

  return (
    <div>
      {/* ─── Hero ─── */}
      <header className="border-b border-[var(--border-color)] bg-[var(--bg-secondary)]">
        <div className="mx-auto max-w-[1600px] px-4 py-10 sm:px-6 lg:px-10 lg:py-16">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Returns & Exchanges' }]} />
          <div className="mt-8 max-w-2xl">
            <p className="font-heading text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
              Policies
            </p>
            <h1 className="mt-4 text-[clamp(2rem,6vw,4.5rem)] font-heading font-extrabold leading-[0.95] tracking-[-0.03em] text-[var(--text-primary)]">
              Returns &amp; exchanges
            </h1>
            <p className="mt-6 max-w-2xl text-sm leading-relaxed text-[var(--text-secondary)] sm:text-base">
              Thirty days to change your mind. A free prepaid label on every domestic return.
              Refunds released within two business days of inspection. No forms, no restocking fee,
              no argument.
            </p>
          </div>
        </div>
      </header>

      {/* ─── The promise ─── */}
      <section aria-labelledby="promise-heading" className="py-16 lg:py-24">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <Reveal>
                <span className="inline-flex h-14 w-14 items-center justify-center border border-[var(--color-noir-gold)] text-[var(--color-noir-gold)]">
                  <RotateCcw className="h-6 w-6" aria-hidden="true" />
                </span>
                <h2
                  id="promise-heading"
                  className="mt-6 font-editorial text-4xl font-bold leading-[1.05] tracking-[-0.02em] text-[var(--text-primary)] sm:text-5xl"
                >
                  The 30-day promise
                </h2>
                <p className="mt-6 text-base leading-[1.75] text-[var(--text-secondary)]">
                  Return anything within thirty days of delivery, for any reason, and we will refund
                  you in full. You do not need to explain yourself, keep the box, or pay for postage
                  within the United States.
                </p>
                <p className="mt-4 text-base leading-[1.75] text-[var(--text-secondary)]">
                  The clock starts on the day the parcel is delivered — not the day you ordered it —
                  and we extend it automatically through the holiday period to 31 December.
                </p>

                <div className="mt-8 flex flex-wrap gap-8 border-t border-[var(--border-color)] pt-8">
                  {[
                    { k: '30', v: 'Days to return' },
                    { k: '$0', v: 'Return postage (US)' },
                    { k: '2', v: 'Business days to refund' },
                  ].map((stat) => (
                    <div key={stat.v}>
                      <p className="font-editorial text-3xl font-bold tracking-[-0.02em] text-[var(--text-primary)]">
                        {stat.k}
                      </p>
                      <p className="mt-1 font-heading text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
                        {stat.v}
                      </p>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>

            {/* Eligibility */}
            <div className="lg:col-span-7">
              <Reveal>
                <div className="border border-[var(--border-color)] bg-[var(--bg-card)] p-8">
                  <div className="flex items-center gap-3">
                    <CircleCheck
                      className="h-4 w-4 text-[var(--color-noir-gold)]"
                      aria-hidden="true"
                    />
                    <h3 className="font-heading text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--text-primary)]">
                      What can be returned
                    </h3>
                  </div>
                  <ul className="mt-5 space-y-3">
                    {eligibleItems.map((item) => (
                      <li
                        key={item}
                        className="flex gap-3 text-sm leading-relaxed text-[var(--text-secondary)]"
                      >
                        <span
                          aria-hidden="true"
                          className="mt-2 h-1 w-1 shrink-0 bg-[var(--color-noir-gold)]"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>

              <Reveal>
                <div className="mt-6 border border-[var(--border-color)] bg-[var(--bg-card)] p-8">
                  <div className="flex items-center gap-3">
                    <PackageX className="h-4 w-4 text-[var(--color-noir-gold)]" aria-hidden="true" />
                    <h3 className="font-heading text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--text-primary)]">
                      What cannot be returned
                    </h3>
                  </div>
                  <ul className="mt-5 space-y-3">
                    {nonReturnableItems.map((item) => (
                      <li
                        key={item}
                        className="flex gap-3 text-sm leading-relaxed text-[var(--text-secondary)]"
                      >
                        <span
                          aria-hidden="true"
                          className="mt-2 h-1 w-1 shrink-0 bg-[var(--text-muted)]"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-5 flex items-start gap-3 border-t border-[var(--border-color)] pt-5 text-xs leading-relaxed text-[var(--text-muted)]">
                    <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    Faulty items are accepted regardless of category, at any time, with return
                    postage on us.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Step-by-step process ─── */}
      <section
        aria-labelledby="process-heading"
        className="border-y border-[var(--border-color)] bg-[var(--bg-secondary)] py-20 lg:py-28"
      >
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10">
          <Reveal className="max-w-2xl">
            <p className="font-heading text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
              How it works
            </p>
            <h2
              id="process-heading"
              className="mt-4 text-[clamp(1.75rem,4vw,3rem)] font-heading font-extrabold leading-[1] tracking-[-0.03em] text-[var(--text-primary)]"
            >
              Six steps, about three minutes
            </h2>
          </Reveal>

          <ol className="mt-14 grid grid-cols-1 gap-px border border-[var(--border-color)] bg-[var(--border-color)] sm:grid-cols-2 lg:grid-cols-3">
            {returnSteps.map((step, index) => (
              <Reveal key={step.title}>
                <li className="h-full bg-[var(--bg-card)] p-8">
                  <span className="font-editorial text-4xl font-bold tracking-[-0.02em] text-[var(--color-noir-gold)]">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3 className="mt-4 font-heading text-sm font-semibold uppercase tracking-[0.14em] text-[var(--text-primary)]">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
                    {step.body}
                  </p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ─── Refund timelines ─── */}
      <section aria-labelledby="refunds-heading" className="py-20 lg:py-28">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10">
          <Reveal className="max-w-2xl">
            <p className="font-heading text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
              Getting your money back
            </p>
            <h2
              id="refunds-heading"
              className="mt-4 text-[clamp(1.75rem,4vw,3rem)] font-heading font-extrabold leading-[1] tracking-[-0.03em] text-[var(--text-primary)]"
            >
              Refund timelines
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-[var(--text-secondary)]">
              We release refunds the same day we inspect a return. The remaining time is your bank or
              provider, not us — but here is exactly what to expect.
            </p>
          </Reveal>

          <Reveal>
            <div className="mt-12 overflow-x-auto border border-[var(--border-color)]">
              <table className="w-full min-w-[680px] border-collapse text-left">
                <caption className="sr-only">
                  Refund method, inspection time and time for the refund to appear
                </caption>
                <thead>
                  <tr className="bg-[var(--bg-secondary)]">
                    <th
                      scope="col"
                      className="border-b border-[var(--border-color)] px-6 py-5 font-heading text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]"
                    >
                      Payment method
                    </th>
                    <th
                      scope="col"
                      className="border-b border-[var(--border-color)] px-6 py-5 font-heading text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]"
                    >
                      Our inspection
                    </th>
                    <th
                      scope="col"
                      className="border-b border-[var(--border-color)] px-6 py-5 font-heading text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]"
                    >
                      Time to appear
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {refundTimeline.map((row) => (
                    <tr
                      key={row.method}
                      className="bg-[var(--bg-card)] transition-colors hover:bg-[var(--bg-primary)]"
                    >
                      <th
                        scope="row"
                        className="border-b border-[var(--border-color)] px-6 py-6 align-top font-heading text-sm font-semibold uppercase tracking-[0.1em] text-[var(--text-primary)]"
                      >
                        {row.method}
                      </th>
                      <td className="border-b border-[var(--border-color)] px-6 py-6 align-top text-sm text-[var(--text-secondary)]">
                        {row.inspection}
                      </td>
                      <td className="border-b border-[var(--border-color)] px-6 py-6 align-top text-sm text-[var(--text-secondary)]">
                        {row.posted}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>

          <Reveal>
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
              {[
                {
                  icon: Banknote,
                  title: 'What is refunded',
                  body: 'The full item price, plus original shipping when the return is caused by our error or a defect.',
                },
                {
                  icon: Clock,
                  title: 'If it is late',
                  body: 'Past these windows, send us your order number and the release date and we will chase it with the provider.',
                },
                {
                  icon: Receipt,
                  title: 'Partial refunds',
                  body: 'Returning part of an order refunds only those items. Discount codes are re-applied proportionally.',
                },
              ].map((card) => (
                <div
                  key={card.title}
                  className="border border-[var(--border-color)] bg-[var(--bg-card)] p-6"
                >
                  <card.icon
                    className="h-4 w-4 text-[var(--color-noir-gold)]"
                    aria-hidden="true"
                  />
                  <h3 className="mt-4 font-heading text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--text-primary)]">
                    {card.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                    {card.body}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── Exchanges ─── */}
      <section
        aria-labelledby="exchanges-heading"
        className="border-y border-[var(--border-color)] bg-[var(--bg-secondary)] py-20 lg:py-28"
      >
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <Reveal>
                <RefreshCw
                  className="h-5 w-5 text-[var(--color-noir-gold)]"
                  aria-hidden="true"
                />
                <h2
                  id="exchanges-heading"
                  className="mt-5 text-[clamp(1.75rem,4vw,3rem)] font-heading font-extrabold leading-[1] tracking-[-0.03em] text-[var(--text-primary)]"
                >
                  Exchanges are free
                </h2>
                <p className="mt-5 text-sm leading-relaxed text-[var(--text-secondary)]">
                  Swap for a different size or colour at no cost. Start a return, choose “Exchange”
                  instead of “Refund”, and pick your replacement. We ship the new item as soon as
                  your return is scanned, so you rarely wait longer than a fresh order.
                </p>
                <ul className="mt-6 space-y-3 border-t border-[var(--border-color)] pt-6">
                  {[
                    'Exchanges are free worldwide, both directions.',
                    'If the replacement costs more, you pay only the difference.',
                    'If it costs less, we refund the difference automatically.',
                    'Out of stock? We will offer the nearest alternative or a full refund.',
                  ].map((line) => (
                    <li
                      key={line}
                      className="flex gap-3 text-sm leading-relaxed text-[var(--text-secondary)]"
                    >
                      <CircleCheck
                        className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-noir-gold)]"
                        aria-hidden="true"
                      />
                      {line}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>

            <div className="lg:col-span-7">
              <Reveal>
                <div className="border border-[var(--color-noir-gold)] p-8 sm:p-10">
                  <Undo2 className="h-5 w-5 text-[var(--color-noir-gold)]" aria-hidden="true" />
                  <h3 className="mt-5 font-heading text-2xl font-extrabold tracking-[-0.02em] text-[var(--text-primary)] sm:text-3xl">
                    How to start a return
                  </h3>
                  <p className="mt-4 max-w-xl text-sm leading-relaxed text-[var(--text-secondary)]">
                    The quickest route is your account: open <strong>Account → Orders</strong>, pick
                    the order and select “Start a return”. You will have a prepaid label in your
                    inbox within a minute.
                  </p>
                  <p className="mt-3 max-w-xl text-sm leading-relaxed text-[var(--text-secondary)]">
                    Ordered as a guest, or cannot sign in? Use the order number from your
                    confirmation email and our{' '}
                    <Link
                      to="/contact"
                      className="text-[var(--color-noir-gold)] underline-offset-2 hover:underline"
                    >
                      contact form
                    </Link>{' '}
                    — we will start it for you and send the label by hand.
                  </p>
                  <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <Button asChild size="lg">
                      <Link to="/track-order">
                        Find my order number
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="lg">
                      <Link to="/contact">Ask for help</Link>
                    </Button>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
