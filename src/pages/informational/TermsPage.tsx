import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Scroll,
  FileText,
  Users,
  CreditCard,
  Truck,
  RotateCcw,
  Landmark,
  MessageSquare,
  Ban,
  ShieldAlert,
  Scale,
  Gavel,
  RefreshCcw,
  CalendarDays,
} from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Button } from '@/components/ui/Button';
import { useSeo } from '@/hooks/useSeo';
import { useReducedMotion } from '@/hooks/useUi';

/* ─── Reveal wrapper ───────────────────────────────────────────────────────── */

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

/* ─── Terms structure ──────────────────────────────────────────────────────── */

interface TermSection {
  id: string;
  number: string;
  title: string;
  icon: typeof Scroll;
  body: React.ReactNode;
}

const termSections: TermSection[] = [
  {
    id: 'acceptance',
    number: '01',
    title: 'Acceptance of terms',
    icon: Scroll,
    body: (
      <p>
        By browsing noirandco.com, creating an account or placing an order, you agree to these
        terms. If you do not agree with any part of them, please do not use the site. We may update
        these terms from time to time; the version published here at the time of your order is the
        one that governs it.
      </p>
    ),
  },
  {
    id: 'accounts',
    number: '02',
    title: 'Accounts',
    icon: Users,
    body: (
      <>
        <p>
          You must be at least 18 years old to create an account. You are responsible for keeping
          your password confidential and for everything that happens under your account — tell us
          immediately if you believe someone else has access.
        </p>
        <p className="mt-3">
          The information you give us must be accurate and current. We may suspend or close an
          account that breaches these terms, and we will tell you why unless the law prevents us
          from doing so.
        </p>
      </>
    ),
  },
  {
    id: 'products-pricing',
    number: '03',
    title: 'Products and pricing',
    icon: Scale,
    body: (
      <p>
        We work hard to describe our products accurately — materials, dimensions, colour and
        provenance — but photographs are illustrative and slight variation is inherent to natural
        materials. Prices are shown in US dollars and exclude any local taxes, which are added at
        checkout. If a price is obviously wrong due to a typographical error, we may cancel the
        order and refund you in full, even after confirmation.
      </p>
    ),
  },
  {
    id: 'orders',
    number: '04',
    title: 'Orders',
    icon: FileText,
    body: (
      <p>
        Your order is an offer to buy, which we accept when we send you a confirmation email. Until
        then we may decline it — for example if stock has run out, a payment is refused, or we
        suspect fraud. We may cancel an order before dispatch and refund you in full. If you need to
        change or cancel an existing order, contact us within 60 minutes of checkout and we will do
        our best.
      </p>
    ),
  },
  {
    id: 'payment',
    number: '05',
    title: 'Payment',
    icon: CreditCard,
    body: (
      <p>
        Payment is taken at the point of order by our PCI-DSS Level 1 processor. Your card is
        authorised on order and charged when the parcel ships. By submitting payment details you
        confirm you are authorised to use them. If a payment is reversed or charged back, we may
        recover the cost of the goods and any reasonable collection expenses.
      </p>
    ),
  },
  {
    id: 'shipping',
    number: '06',
    title: 'Shipping and delivery',
    icon: Truck,
    body: (
      <p>
        Delivery windows are estimates, not guarantees, and begin when the carrier scans your parcel.
        Risk of loss passes to you on delivery. We are not liable for delays caused by carriers,
        customs or events beyond our reasonable control. Full details of rates, windows and tracking
        are set out in our shipping policy.
      </p>
    ),
  },
  {
    id: 'returns',
    number: '07',
    title: 'Returns and refunds',
    icon: RotateCcw,
    body: (
      <p>
        You may return most items within 30 days of delivery for a full refund, subject to the
        exclusions listed in our returns policy. Refunds are released within two business days of
        inspection. Nothing in these terms affects your statutory rights as a consumer, including
        where goods are faulty or not as described.
      </p>
    ),
  },
  {
    id: 'intellectual-property',
    number: '08',
    title: 'Intellectual property',
    icon: Landmark,
    body: (
      <p>
        All content on this site — text, photographs, illustrations, logos, product designs,
        software and the arrangement of the site itself — belongs to AFRO &amp; CO. or its licensors
        and is protected by copyright and trademark law. You may view and print pages for personal,
        non-commercial use only. You may not reproduce, republish, sell or exploit any part of the
        site without our written permission.
      </p>
    ),
  },
  {
    id: 'user-content',
    number: '09',
    title: 'User content',
    icon: MessageSquare,
    body: (
      <p>
        When you post a review, photograph, comment or other material, you keep ownership of it but
        grant us a worldwide, royalty-free licence to display and promote it in connection with our
        products. You confirm that what you post is yours, is accurate, and does not infringe anyone
        else's rights. We may remove any content that is unlawful, misleading, abusive or off-topic.
      </p>
    ),
  },
  {
    id: 'prohibited-use',
    number: '10',
    title: 'Prohibited use',
    icon: Ban,
    body: (
      <p>
        You may not use the site to break any law, infringe anyone's rights, transmit malware,
        scrape or harvest data, interfere with its operation, attempt unauthorised access, resell
        products commercially, or use automated systems to place orders. We may block access where we
        reasonably believe these terms have been breached.
      </p>
    ),
  },
  {
    id: 'disclaimers',
    number: '11',
    title: 'Disclaimers',
    icon: ShieldAlert,
    body: (
      <p>
        The site is provided “as is” and “as available”. We do not warrant that it will be
        uninterrupted or error-free, and we make no warranties beyond those expressly stated. Nothing
        in these terms limits any liability that cannot be limited by law, or your statutory consumer
        rights.
      </p>
    ),
  },
  {
    id: 'limitation',
    number: '12',
    title: 'Limitation of liability',
    icon: Scale,
    body: (
      <p>
        To the fullest extent permitted by law, we are not liable for indirect, incidental or
        consequential loss, or for loss of profit, revenue, data or goodwill. Our total liability for
        any claim is limited to the greater of the amount you paid us in the twelve months before the
        claim, or $100. This does not apply to death or personal injury caused by negligence, to
        fraud, or to anything else that cannot lawfully be limited.
      </p>
    ),
  },
  {
    id: 'indemnification',
    number: '13',
    title: 'Indemnification',
    icon: ShieldAlert,
    body: (
      <p>
        You agree to indemnify and hold AFRO &amp; CO., its directors, employees and partners
        harmless from any claim, loss or expense — including reasonable legal fees — arising from
        your breach of these terms, your misuse of the site, or your infringement of another
        person's rights.
      </p>
    ),
  },
  {
    id: 'governing-law',
    number: '14',
    title: 'Governing law and disputes',
    icon: Gavel,
    body: (
      <>
        <p>
          These terms are governed by the laws of the State of New York, without regard to its
          conflict-of-law rules. We will always try to resolve a dispute informally first — contact
          client care and we will respond within one business day.
        </p>
        <p className="mt-3">
          If it cannot be resolved informally, the dispute will be settled by binding arbitration in
          New York County under the rules of the American Arbitration Association, before a single
          arbitrator, in English. If you are a consumer resident in the EU or UK, you keep the right
          to bring proceedings in your courts of residence, and nothing here deprives you of the
          protection of your local mandatory consumer law.
        </p>
      </>
    ),
  },
  {
    id: 'changes',
    number: '15',
    title: 'Changes to these terms',
    icon: RefreshCcw,
    body: (
      <p>
        We may revise these terms as our business and the law change. The date at the top of the page
        always shows the current version. Material changes are notified to account holders by email
        at least fourteen days before they take effect, and continued use of the site after that
        date constitutes acceptance.
      </p>
    ),
  },
];

const LAST_UPDATED = '24 September 2026';

/* ─── Page ─────────────────────────────────────────────────────────────────── */

export default function TermsPage() {
  useSeo({
    title: 'Terms & Conditions',
    description:
      'The terms that govern your use of noirandco.com and every purchase you make — accounts, orders, payment, shipping, returns, intellectual property, liability and governing law.',
  });

  return (
    <div>
      {/* ─── Hero ─── */}
      <header className="border-b border-[var(--border-color)] bg-[var(--bg-secondary)]">
        <div className="mx-auto max-w-[1600px] px-4 py-10 sm:px-6 lg:px-10 lg:py-16">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Terms & Conditions' }]} />
          <div className="mt-8 max-w-2xl">
            <p className="font-heading text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
              Legal
            </p>
            <h1 className="mt-4 text-[clamp(2rem,6vw,4.5rem)] font-heading font-extrabold leading-[0.95] tracking-[-0.03em] text-[var(--text-primary)]">
              Terms &amp; conditions
            </h1>
            <p className="mt-6 max-w-2xl text-sm leading-relaxed text-[var(--text-secondary)] sm:text-base">
              The rules that govern your use of this site and every purchase you make from us. They
              are written to be understood, and they never override your statutory rights as a
              consumer.
            </p>
            <p className="mt-6 inline-flex items-center gap-2 font-heading text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
              <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
              Last updated {LAST_UPDATED}
            </p>
          </div>
        </div>
      </header>

      {/* ─── Plain-language summary ─── */}
      <section aria-labelledby="summary-heading" className="py-16 lg:py-24">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10">
          <Reveal>
            <div className="border border-[var(--color-noir-gold)] p-8 sm:p-10">
              <p className="font-heading text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
                The short version
              </p>
              <h2
                id="summary-heading"
                className="mt-3 font-editorial text-3xl font-bold leading-[1.1] tracking-[-0.02em] text-[var(--text-primary)] sm:text-4xl"
              >
                What these terms actually say
              </h2>
              <p className="mt-4 max-w-3xl text-sm leading-relaxed text-[var(--text-secondary)]">
                This summary is a courtesy, not a substitute. Where it differs from the numbered
                sections below, the numbered sections govern.
              </p>

              <ul className="mt-8 grid grid-cols-1 gap-px border border-[var(--border-color)] bg-[var(--border-color)] sm:grid-cols-2">
                {[
                  'We sell you things; you pay us; we deliver them. That is the deal.',
                  'You must be 18 or older and keep your account details to yourself.',
                  'Prices can be corrected if we make an obvious mistake, and we will refund you.',
                  'Your card is authorised on order and charged when the parcel ships.',
                  '30 days to return most items for a full refund — see the returns policy.',
                  'Our designs, photographs and words stay ours; what you post stays yours.',
                  'Do not use the site unlawfully, scrape it, or resell our products commercially.',
                  'New York law applies, and we would always rather talk than litigate.',
                ].map((line) => (
                  <li
                    key={line}
                    className="bg-[var(--bg-card)] p-5 text-sm leading-relaxed text-[var(--text-secondary)]"
                  >
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── Numbered sections ─── */}
      <section
        aria-labelledby="terms-sections-heading"
        className="border-t border-[var(--border-color)] bg-[var(--bg-secondary)] py-20 lg:py-28"
      >
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10">
          <Reveal className="max-w-2xl">
            <p className="font-heading text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
              The full terms
            </p>
            <h2
              id="terms-sections-heading"
              className="mt-4 text-[clamp(1.75rem,4vw,3rem)] font-heading font-extrabold leading-[1] tracking-[-0.03em] text-[var(--text-primary)]"
            >
              Fifteen numbered sections
            </h2>
          </Reveal>

          <ol className="mt-14 space-y-0 border-t border-[var(--border-color)]">
            {termSections.map((section) => (
              <Reveal key={section.id}>
                <li
                  id={section.id}
                  className="grid grid-cols-1 gap-4 border-b border-[var(--border-color)] py-8 sm:grid-cols-12 sm:gap-8"
                >
                  <div className="sm:col-span-4 lg:col-span-3">
                    <div className="flex items-start gap-3 sm:flex-col sm:gap-3">
                      <span className="font-editorial text-3xl font-bold tracking-[-0.02em] text-[var(--color-noir-gold)]">
                        {section.number}
                      </span>
                      <h3 className="flex items-center gap-2 font-heading text-sm font-semibold uppercase tracking-[0.12em] text-[var(--text-primary)]">
                        <section.icon
                          className="h-4 w-4 shrink-0 text-[var(--text-muted)]"
                          aria-hidden="true"
                        />
                        {section.title}
                      </h3>
                    </div>
                  </div>
                  <div className="text-sm leading-[1.75] text-[var(--text-secondary)] sm:col-span-8 lg:col-span-9">
                    {section.body}
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section aria-labelledby="terms-cta-heading" className="py-16 lg:py-24">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10">
          <Reveal>
            <div className="flex flex-col gap-8 border border-[var(--border-color)] bg-[var(--bg-card)] p-8 sm:p-12 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-xl">
                <h2
                  id="terms-cta-heading"
                  className="font-heading text-3xl font-extrabold tracking-[-0.02em] text-[var(--text-primary)] sm:text-4xl"
                >
                  Something unclear?
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-[var(--text-secondary)]">
                  Legal language should never be a barrier. If any part of these terms is confusing,
                  ask us and we will explain it in plain words — and we would always rather resolve
                  something by email than by process.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button asChild size="lg">
                  <Link to="/contact">Ask a question</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/privacy">Read the privacy policy</Link>
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
