import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { MessageCircle, LifeBuoy } from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Button } from '@/components/ui/Button';
import { Accordion, type AccordionItemData } from '@/components/ui/Accordion';
import { useSeo } from '@/hooks/useSeo';
import { useReducedMotion } from '@/hooks/useUi';
import { cn } from '@/utils/cn';

/* ─── Page hero header pattern (shared across informational pages) ─────────── */

interface PageHeroProps {
  eyebrow: string;
  title: string;
  intro: string;
  breadcrumbs: { label: string; href?: string }[];
  aside?: React.ReactNode;
}

function PageHero({ eyebrow, title, intro, breadcrumbs, aside }: PageHeroProps) {
  return (
    <header className="border-b border-[var(--border-color)] bg-[var(--bg-secondary)]">
      <div className="mx-auto max-w-[1600px] px-4 py-10 sm:px-6 lg:px-10 lg:py-16">
        <Breadcrumbs items={breadcrumbs} />
        <div className="mt-8 flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="font-heading text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
              {eyebrow}
            </p>
            <h1 className="mt-4 text-[clamp(2rem,6vw,4.5rem)] font-heading font-extrabold leading-[0.95] tracking-[-0.03em] text-[var(--text-primary)]">
              {title}
            </h1>
            <p className="mt-6 max-w-2xl text-sm leading-relaxed text-[var(--text-secondary)] sm:text-base">
              {intro}
            </p>
          </div>
          {aside && <div className="shrink-0">{aside}</div>}
        </div>
      </div>
    </header>
  );
}

/* ─── FAQ data ─────────────────────────────────────────────────────────────── */

type CategoryId =
  | 'orders-shipping'
  | 'returns'
  | 'payments'
  | 'account'
  | 'product-care';

const categoryLabels: Record<CategoryId, string> = {
  'orders-shipping': 'Orders & Shipping',
  returns: 'Returns',
  payments: 'Payments',
  account: 'Account',
  'product-care': 'Product Care',
};

const categoryOrder: CategoryId[] = [
  'orders-shipping',
  'returns',
  'payments',
  'account',
  'product-care',
];

interface FaqItem extends AccordionItemData {
  category: CategoryId;
}

const faqItems: FaqItem[] = [
  {
    id: 'faq-1',
    category: 'orders-shipping',
    question: 'How long does delivery take?',
    answer: (
      <>
        <p>
          Standard delivery arrives in 3–5 business days within the continental United States.
          Express shortens that to 2 business days, and Overnight delivers the next business day
          when the order is placed before 1:00 PM ET.
        </p>
        <p className="mt-3">
          International orders are handed to the destination carrier in 2–4 business days and then
          take a further 5–12 days depending on customs. Every order ships with a tracking link sent
          to your email and phone.
        </p>
      </>
    ),
  },
  {
    id: 'faq-2',
    category: 'orders-shipping',
    question: 'Do you ship internationally?',
    answer: (
      <p>
        Yes. We ship to more than 60 countries. Duties and import taxes are calculated at checkout
        and collected by us on behalf of your customs authority, so nothing is payable on delivery.
        A small number of restricted destinations cannot receive leather goods — the checkout will
        tell you before payment if your address is affected.
      </p>
    ),
  },
  {
    id: 'faq-3',
    category: 'orders-shipping',
    question: 'Can I change or cancel my order after placing it?',
    answer: (
      <p>
        Within 60 minutes of checkout, yes — reply to your confirmation email or call
        +1 (212) 555-0134 and we will catch it before it reaches the warehouse. After that window
        the parcel is already being picked and packed, so the fastest route is to refuse delivery or
        start a free return once it arrives.
      </p>
    ),
  },
  {
    id: 'faq-4',
    category: 'orders-shipping',
    question: 'My parcel says delivered but I cannot find it.',
    answer: (
      <p>
        Check with neighbours, your building manager and any safe-place the carrier noted. Carriers
        mark a parcel delivered up to 24 hours before it is physically handed over, so give it a
        day. If it is still missing, contact us within 48 hours and we will open a trace with the
        carrier and either reship your order or refund it in full.
      </p>
    ),
  },
  {
    id: 'faq-5',
    category: 'orders-shipping',
    question: 'Is shipping free?',
    answer: (
      <p>
        Standard shipping is complimentary on all domestic orders over $150. Below that it is $12.
        Express is $24 and Overnight is $39. The exact amount is always shown in the cart before you
        enter payment details, and gift wrapping never changes the shipping cost.
      </p>
    ),
  },
  {
    id: 'faq-6',
    category: 'returns',
    question: 'What is your return window?',
    answer: (
      <p>
        Thirty days from the date of delivery, for any reason, including simply changing your mind.
        Items must be unworn, unwashed and in their original packaging with all tags attached. We
        issue a prepaid return label for every domestic return at no cost to you.
      </p>
    ),
  },
  {
    id: 'faq-7',
    category: 'returns',
    question: 'How do I start a return?',
    answer: (
      <>
        <p>Four steps, and it takes about three minutes:</p>
        <ol className="mt-3 list-decimal space-y-1 pl-5">
          <li>Open your order in Account → Orders and choose “Start a return”.</li>
          <li>Select the items and the reason — a short reason helps us improve.</li>
          <li>Print or save the prepaid label we email you.</li>
          <li>Drop the parcel at any carrier location. Refunds begin once it is scanned.</li>
        </ol>
      </>
    ),
  },
  {
    id: 'faq-8',
    category: 'returns',
    question: 'When will I receive my refund?',
    answer: (
      <p>
        We inspect returned items within 2 business days of arrival and release the refund the same
        day. Your bank then takes 5–10 business days to post it, depending on the issuer. Original
        shipping is refunded only when the return is caused by our error or a defect.
      </p>
    ),
  },
  {
    id: 'faq-9',
    category: 'returns',
    question: 'Can I exchange an item for a different size?',
    answer: (
      <p>
        Yes, and exchanges are free. Start a return and pick “Exchange” instead of “Refund”, then
        choose the replacement size. We ship the new item as soon as your return is scanned, so you
        rarely wait more than two days longer than a fresh order.
      </p>
    ),
  },
  {
    id: 'faq-10',
    category: 'returns',
    question: 'Which items cannot be returned?',
    answer: (
      <p>
        Pierced jewellery, earrings, swimwear, underwear, gift cards, and any item personalised or
        monogrammed for you. Final-sale items are marked as such on the product page and are also
        excluded. Faulty items are always accepted, regardless of category.
      </p>
    ),
  },
  {
    id: 'faq-11',
    category: 'payments',
    question: 'Which payment methods do you accept?',
    answer: (
      <p>
        Visa, Mastercard, American Express, Discover, Apple Pay, Google Pay, PayPal, and
        interest-free instalments through Klarna and Afterpay on orders over $100. Gift-card
        balances can be combined with any other method.
      </p>
    ),
  },
  {
    id: 'faq-12',
    category: 'payments',
    question: 'Is it safe to pay on your site?',
    answer: (
      <p>
        Card details are tokenised by our PCI-DSS Level 1 processor and never touch our servers. The
        whole checkout is served over TLS 1.3, and we support 3D Secure for an extra verification
        step on card payments.
      </p>
    ),
  },
  {
    id: 'faq-13',
    category: 'payments',
    question: 'Why was my payment declined?',
    answer: (
      <p>
        Most declines come from the issuing bank rather than us — an international-purchase block or
        a billing-address mismatch are the usual culprits. Confirm the details with your bank and
        retry. Nothing is charged for a declined attempt, and any pending authorisation clears
        within 3–5 business days.
      </p>
    ),
  },
  {
    id: 'faq-14',
    category: 'payments',
    question: 'Can I pay in instalments?',
    answer: (
      <p>
        Yes. Klarn and Afterpay split eligible orders into four interest-free payments, the first
        taken at checkout. Choose either option at the payment step to see your schedule. Instalment
        agreements sit with the provider, not with us, and do not affect your AFRO & CO. return
        rights.
      </p>
    ),
  },
  {
    id: 'faq-15',
    category: 'account',
    question: 'Do I need an account to order?',
    answer: (
      <p>
        No. Guest checkout is fully supported and takes about a minute. Creating an account
        afterwards — using the same email — automatically links your guest orders so you keep
        tracking, returns and your wishlist in one place.
      </p>
    ),
  },
  {
    id: 'faq-16',
    category: 'account',
    question: 'How do I reset my password?',
    answer: (
      <p>
        Choose “Forgot password” on the sign-in page and we will email a secure, single-use link
        that expires after 30 minutes. If it does not arrive, check spam and confirm that
        no-reply@noirandco.com is on your safe-sender list. Still stuck? Contact us and we will
        verify your identity manually.
      </p>
    ),
  },
  {
    id: 'faq-17',
    category: 'account',
    question: 'How is my personal data used?',
    answer: (
      <p>
        We use it to fulfil orders, provide support and — only if you opt in — send editorial
        newsletters. We never sell your data. The full detail, including your rights to access,
        export or delete everything we hold, is set out in our{' '}
        <Link to="/privacy" className="text-[var(--color-noir-gold)] underline-offset-2 hover:underline">
          Privacy Policy
        </Link>
        .
      </p>
    ),
  },
  {
    id: 'faq-18',
    category: 'product-care',
    question: 'How should I care for leather goods?',
    answer: (
      <p>
        Keep them away from direct sunlight and prolonged damp, and wipe with a soft dry cloth after
        wear. Condition full-grain leather every three months with a neutral, solvent-free balm, and
        store bags in the cotton dust bag with the tissue insert in place so the silhouette holds.
      </p>
    ),
  },
  {
    id: 'faq-19',
    category: 'product-care',
    question: 'Are your materials responsibly sourced?',
    answer: (
      <p>
        All leather is a by-product of the food industry and tanned at LWG Gold-rated facilities in
        Tuscany and North Carolina. Our cotton, linen and wool are certified to GOTS or RWS
        standards, and every shipment is offset at 150% through verified reforestation partners.
      </p>
    ),
  },
  {
    id: 'faq-20',
    category: 'product-care',
    question: 'Do you offer repairs?',
    answer: (
      <p>
        Yes. Our atelier in New York repairs stitching, hardware, zips and linings on any NOIR &
        CO. piece, at cost, for as long as you own it. Send a note with photographs through the
        contact form and we will return a fixed-price quote within five business days.
      </p>
    ),
  },
];

/* ─── Page ─────────────────────────────────────────────────────────────────── */

export default function FaqPage() {
  useSeo({
    title: 'FAQ',
    description:
      'Answers to the questions we are asked most: shipping and delivery windows, returns and exchanges, payment methods, your account, and how to care for leather and tailoring.',
  });

  const [activeCategory, setActiveCategory] = useState<CategoryId | 'all'>('all');
  const reduceMotion = useReducedMotion();

  const filters = useMemo<{ id: CategoryId | 'all'; label: string; count: number }[]>(
    () => [
      { id: 'all', label: 'All', count: faqItems.length },
      ...categoryOrder.map((id) => ({
        id,
        label: categoryLabels[id],
        count: faqItems.filter((item) => item.category === id).length,
      })),
    ],
    []
  );

  const visibleItems = useMemo<AccordionItemData[]>(
    () =>
      faqItems
        .filter((item) => activeCategory === 'all' || item.category === activeCategory)
        .map(({ id, question, answer }) => ({ id, question, answer })),
    [activeCategory]
  );

  return (
    <div>
      <PageHero
        eyebrow="Help Centre"
        title="Frequently asked questions"
        intro="Everything we are asked most often, answered plainly. If you cannot find what you need here, our client care team replies to every message within one business day."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'FAQ' }]}
        aside={
          <Link
            to="/contact"
            className="group inline-flex items-center gap-3 border border-[var(--border-color)] bg-[var(--bg-card)] px-6 py-5 transition-colors hover:border-[var(--color-noir-gold)]"
          >
            <LifeBuoy className="h-5 w-5 text-[var(--color-noir-gold)]" aria-hidden="true" />
            <span>
              <span className="block font-heading text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
                Still stuck?
              </span>
              <span className="mt-1 block font-heading text-sm font-semibold text-[var(--text-primary)]">
                Talk to a human
              </span>
            </span>
          </Link>
        }
      />

      {/* ─── Category filter row ─── */}
      <section aria-labelledby="faq-filter-heading" className="border-b border-[var(--border-color)]">
        <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-10">
          <h2 id="faq-filter-heading" className="sr-only">
            Filter questions by topic
          </h2>
          <div
            role="tablist"
            aria-label="FAQ categories"
            className="flex flex-wrap gap-2 lg:gap-3"
          >
            {filters.map((filter) => {
              const isActive = activeCategory === filter.id;
              return (
                <button
                  key={filter.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveCategory(filter.id)}
                  className={cn(
                    'inline-flex items-center gap-2 border px-4 py-2.5 font-heading text-[10px] font-semibold uppercase tracking-[0.16em] transition-colors',
                    isActive
                      ? 'border-[var(--text-primary)] bg-[var(--text-primary)] text-[var(--bg-primary)]'
                      : 'border-[var(--border-color)] bg-transparent text-[var(--text-secondary)] hover:border-[var(--text-primary)] hover:text-[var(--text-primary)]'
                  )}
                >
                  {filter.label}
                  <span className={cn('text-[9px] tabular-nums', isActive ? 'opacity-70' : 'text-[var(--text-muted)]')}>
                    {filter.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Accordion ─── */}
      <section aria-labelledby="faq-list-heading" className="py-16 lg:py-24">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            <div className="lg:col-span-3">
              <div className="lg:sticky lg:top-28">
                <p className="font-heading text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
                  Showing
                </p>
                <h2
                  id="faq-list-heading"
                  className="mt-3 font-heading text-2xl font-extrabold tracking-[-0.02em] text-[var(--text-primary)]"
                >
                  {visibleItems.length} {visibleItems.length === 1 ? 'answer' : 'answers'}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
                  {activeCategory === 'all'
                    ? 'Every question, grouped by topic. Use the filters above to narrow things down.'
                    : `Filtered to ${categoryLabels[activeCategory]}.`}
                </p>
              </div>
            </div>

            <div className="lg:col-span-9">
              {visibleItems.length > 0 ? (
                <Accordion
                  key={activeCategory}
                  items={visibleItems}
                  allowMultiple
                  defaultOpen={[visibleItems[0].id]}
                />
              ) : (
                <p className="border border-dashed border-[var(--border-color)] p-8 text-center text-sm text-[var(--text-muted)]">
                  No questions in this topic yet.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="border-t border-[var(--border-color)] bg-[var(--bg-secondary)] py-16 lg:py-24">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10">
          <motion.div
            initial={reduceMotion ? undefined : { opacity: 0, y: 16 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-8 border border-[var(--border-color)] bg-[var(--bg-card)] p-8 sm:p-12 lg:flex-row lg:items-center lg:justify-between"
          >
            <div className="max-w-xl">
              <span className="inline-flex h-12 w-12 items-center justify-center border border-[var(--color-noir-gold)] text-[var(--color-noir-gold)]">
                <MessageCircle className="h-5 w-5" aria-hidden="true" />
              </span>
              <h2 className="mt-6 font-heading text-3xl font-extrabold tracking-[-0.02em] text-[var(--text-primary)] sm:text-4xl">
                Still need help?
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-[var(--text-secondary)]">
                Our client care team is available Monday to Saturday, 9:00 AM to 6:00 PM ET, and
                replies to every message within one business day — usually much sooner. No scripts,
                no queues.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button asChild size="lg">
                <Link to="/contact">Contact client care</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/track-order">Track an order</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
