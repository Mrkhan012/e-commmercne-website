import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Mail, List, ChevronDown, CalendarDays, Lock, ArrowUpRight } from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Button } from '@/components/ui/Button';
import { useSeo } from '@/hooks/useSeo';
import { useReducedMotion } from '@/hooks/useUi';
import { cn } from '@/utils/cn';

/* ─── Policy structure ─────────────────────────────────────────────────────── */

interface Section {
  id: string;
  number: string;
  title: string;
  content: React.ReactNode;
}

const sections: Section[] = [
  {
    id: 'information-we-collect',
    number: '01',
    title: 'Information we collect',
    content: (
      <>
        <p>
          We collect only what we need to run a shop properly. That falls into three groups.
        </p>
        <dl className="mt-5 space-y-4">
          <div>
            <dt className="font-heading text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--text-primary)]">
              Information you give us
            </dt>
            <dd className="mt-1.5 text-sm leading-relaxed text-[var(--text-secondary)]">
              Your name, email address, phone number, billing and delivery addresses, order history,
              and anything you write to us in a message or review. Payment card numbers are
              tokenised by our processor and never reach our servers.
            </dd>
          </div>
          <div>
            <dt className="font-heading text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--text-primary)]">
              Information collected automatically
            </dt>
            <dd className="mt-1.5 text-sm leading-relaxed text-[var(--text-secondary)]">
              Your IP address, browser and device type, referring page, and the pages you view on our
              site. We use this in aggregate to understand what people look for and where the site
              breaks.
            </dd>
          </div>
          <div>
            <dt className="font-heading text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--text-primary)]">
              Information from third parties
            </dt>
            <dd className="mt-1.5 text-sm leading-relaxed text-[var(--text-secondary)]">
              Our payment provider confirms whether a transaction succeeded. Our carrier shares
              delivery status. If you sign in with Google or Apple, we receive your name and email
              from that provider.
            </dd>
          </div>
        </dl>
        <p className="mt-5">
          We do not buy data brokers' lists, we do not run third-party advertising pixels that
          profile you, and we do not collect special categories of data such as health or biometric
          information.
        </p>
      </>
    ),
  },
  {
    id: 'how-we-use-it',
    number: '02',
    title: 'How we use your information',
    content: (
      <>
        <p>We use your information to do the following, and not for much else.</p>
        <ul className="mt-5 space-y-2">
          {[
            'Take payment, pick, pack and deliver your order, and tell you where it is.',
            'Provide client care, handle returns and exchanges, and offer repairs.',
            'Keep your account, wishlist and order history in one place.',
            'Detect and prevent fraud, chargebacks and abuse of our systems.',
            'Send you editorial newsletters — only if you have opted in, and never sold onward.',
            'Meet our legal, tax and accounting obligations, including invoice retention.',
            'Understand, in aggregate, which products and pages people actually value.',
          ].map((line) => (
            <li key={line} className="flex gap-3 text-sm leading-relaxed text-[var(--text-secondary)]">
              <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 bg-[var(--color-noir-gold)]" />
              {line}
            </li>
          ))}
        </ul>
        <p className="mt-5">
          We do not use automated decision-making or profiling that produces legal effects for you.
          Fraud screening is rules-based and reviewed by a person before any order is cancelled.
        </p>
      </>
    ),
  },
  {
    id: 'legal-bases',
    number: '03',
    title: 'Legal bases for processing',
    content: (
      <>
        <p>
          Where the GDPR and UK GDPR apply, we rely on six lawful bases. Each purpose maps to one of
          them.
        </p>
        <div className="mt-5 overflow-x-auto border border-[var(--border-color)]">
          <table className="w-full min-w-[560px] border-collapse text-left">
            <caption className="sr-only">Purpose and the lawful basis we rely on</caption>
            <thead>
              <tr className="bg-[var(--bg-secondary)]">
                <th
                  scope="col"
                  className="border-b border-[var(--border-color)] px-5 py-4 font-heading text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]"
                >
                  Purpose
                </th>
                <th
                  scope="col"
                  className="border-b border-[var(--border-color)] px-5 py-4 font-heading text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]"
                >
                  Lawful basis
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                { p: 'Fulfilling and delivering your order', b: 'Contract' },
                { p: 'Payment processing and fraud prevention', b: 'Contract and legitimate interests' },
                { p: 'Customer service, returns and repairs', b: 'Contract' },
                { p: 'Tax, accounting and statutory record-keeping', b: 'Legal obligation' },
                { p: 'Editorial newsletters and product news', b: 'Consent, withdrawable at any time' },
                { p: 'Aggregate site analytics', b: 'Legitimate interests' },
              ].map((row) => (
                <tr key={row.p} className="bg-[var(--bg-card)]">
                  <th
                    scope="row"
                    className="border-b border-[var(--border-color)] px-5 py-4 text-left text-sm font-normal text-[var(--text-secondary)]"
                  >
                    {row.p}
                  </th>
                  <td className="border-b border-[var(--border-color)] px-5 py-4 text-sm text-[var(--text-primary)]">
                    {row.b}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    ),
  },
  {
    id: 'cookies',
    number: '04',
    title: 'Cookies and similar technologies',
    content: (
      <>
        <p>
          We use cookies to keep your session alive, remember your wishlist and theme preference, and
          measure how the site is used. We set no advertising cookies and share no cookie data with
          ad networks.
        </p>
        <dl className="mt-5 space-y-4">
          <div>
            <dt className="font-heading text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--text-primary)]">
              Strictly necessary
            </dt>
            <dd className="mt-1.5 text-sm leading-relaxed text-[var(--text-secondary)]">
              Session security, cart contents, checkout state and your light or dark theme choice.
              These cannot be disabled — the shop will not work without them.
            </dd>
          </div>
          <div>
            <dt className="font-heading text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--text-primary)]">
              Analytics
            </dt>
            <dd className="mt-1.5 text-sm leading-relaxed text-[var(--text-secondary)]">
              A privacy-preserving, cookieless analytics tool that reports page views and referrers
              in aggregate. No cross-site identifiers are stored.
            </dd>
          </div>
          <div>
            <dt className="font-heading text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--text-primary)]">
              Marketing
            </dt>
            <dd className="mt-1.5 text-sm leading-relaxed text-[var(--text-secondary)]">
              Set only after you opt in to newsletters, and used solely to attribute which email
              brought you here. Opting out removes them immediately.
            </dd>
          </div>
        </dl>
        <p className="mt-5">
          You can clear or block cookies in your browser settings at any time. Blocking strictly
          necessary cookies will prevent checkout from completing.
        </p>
      </>
    ),
  },
  {
    id: 'how-we-share',
    number: '05',
    title: 'How we share information',
    content: (
      <>
        <p>
          We share the minimum necessary with a short list of processors, each bound by a data
          processing agreement. We never sell your personal information, and we never will.
        </p>
        <ul className="mt-5 space-y-2">
          {[
            'Our payment processor, to take and refund card and wallet payments.',
            'Our carriers and fulfilment partners, to deliver your parcel and handle returns.',
            'Our email provider, to send order confirmations and any newsletter you opted into.',
            'Cloud hosting and database providers, who store encrypted data on our behalf.',
            'Professional advisers, where we are legally required to share information with them.',
            'Law enforcement or regulators, but only on a valid legal request that we have reviewed.',
          ].map((line) => (
            <li key={line} className="flex gap-3 text-sm leading-relaxed text-[var(--text-secondary)]">
              <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 bg-[var(--color-noir-gold)]" />
              {line}
            </li>
          ))}
        </ul>
        <p className="mt-5">
          If AFRO &amp; CO. were ever acquired or merged, your data would transfer to the new owner
          under this same policy, and you would be notified before it took effect.
        </p>
      </>
    ),
  },
  {
    id: 'retention',
    number: '06',
    title: 'How long we keep it',
    content: (
      <>
        <p>We keep data only as long as there is a reason to, then delete or anonymise it.</p>
        <div className="mt-5 overflow-x-auto border border-[var(--border-color)]">
          <table className="w-full min-w-[520px] border-collapse text-left">
            <caption className="sr-only">Data type and how long we retain it</caption>
            <thead>
              <tr className="bg-[var(--bg-secondary)]">
                <th
                  scope="col"
                  className="border-b border-[var(--border-color)] px-5 py-4 font-heading text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]"
                >
                  Data
                </th>
                <th
                  scope="col"
                  className="border-b border-[var(--border-color)] px-5 py-4 font-heading text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]"
                >
                  Retained for
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                { d: 'Order and invoice records', r: '7 years (tax law)' },
                { d: 'Account profile and preferences', r: 'Until you close your account' },
                { d: 'Client care correspondence', r: '24 months from last contact' },
                { d: 'Return and repair records', r: '36 months from completion' },
                { d: 'Analytics, in aggregate form', r: '14 months, then deleted' },
                { d: 'Newsletter consent record', r: 'Until you unsubscribe, plus 3 years' },
              ].map((row) => (
                <tr key={row.d} className="bg-[var(--bg-card)]">
                  <th
                    scope="row"
                    className="border-b border-[var(--border-color)] px-5 py-4 text-left text-sm font-normal text-[var(--text-secondary)]"
                  >
                    {row.d}
                  </th>
                  <td className="border-b border-[var(--border-color)] px-5 py-4 text-sm text-[var(--text-primary)]">
                    {row.r}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    ),
  },
  {
    id: 'your-rights',
    number: '07',
    title: 'Your rights',
    content: (
      <>
        <p>
          Whatever country you are in, you can ask us to do the following, and we will act within
          thirty days at no cost to you.
        </p>
        <ul className="mt-5 space-y-2">
          {[
            'Access — get a copy of the personal information we hold about you.',
            'Rectification — correct anything that is wrong or out of date.',
            'Erasure — delete your account and personal data, subject to our tax obligations.',
            'Portability — receive your data in a structured, machine-readable format.',
            'Restriction — ask us to pause processing while a dispute is resolved.',
            'Objection — object to processing based on legitimate interests.',
            'Withdraw consent — unsubscribe from marketing in one click, at any time.',
            'Complain — raise a concern with your local data protection authority.',
          ].map((line) => (
            <li key={line} className="flex gap-3 text-sm leading-relaxed text-[var(--text-secondary)]">
              <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 bg-[var(--color-noir-gold)]" />
              {line}
            </li>
          ))}
        </ul>
        <p className="mt-5">
          California residents additionally have the right to know the categories of personal
          information collected, to request deletion, to opt out of any sale or sharing, and to be
          free from discrimination for exercising these rights. We do not sell personal information,
          so there is nothing to opt out of.
        </p>
        <p className="mt-4">
          To exercise any right, email{' '}
          <a
            href="mailto:privacy@noirandco.com"
            className="text-[var(--color-noir-gold)] underline-offset-2 hover:underline"
          >
            privacy@noirandco.com
          </a>
          . We may ask one question to confirm your identity before we act.
        </p>
      </>
    ),
  },
  {
    id: 'security',
    number: '08',
    title: 'How we protect it',
    content: (
      <>
        <p>
          Our systems are built to make a breach expensive and unlikely. Concretely, that means:
        </p>
        <ul className="mt-5 space-y-2">
          {[
            'TLS 1.3 in transit, with HSTS enforced across every domain we operate.',
            'AES-256 encryption at rest for all databases and backups.',
            'A PCI-DSS Level 1 payment processor; no card data is ever stored by us.',
            'Role-based access control, so staff can reach only the records they need.',
            'Multi-factor authentication required for every administrative account.',
            'Annual third-party penetration testing and internal security review.',
            'A documented breach-response plan, including 72-hour regulator notification.',
          ].map((line) => (
            <li key={line} className="flex gap-3 text-sm leading-relaxed text-[var(--text-secondary)]">
              <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 bg-[var(--color-noir-gold)]" />
              {line}
            </li>
          ))}
        </ul>
        <p className="mt-5">
          No system is perfect. If a breach ever affected your data, we would tell you and your
          regulator without undue delay and explain exactly what was taken and what to do about it.
        </p>
      </>
    ),
  },
  {
    id: 'international-transfers',
    number: '09',
    title: 'International transfers',
    content: (
      <>
        <p>
          We are based in the United States and operate studios in Italy and Japan. If you are
          outside the US, your information will be transferred to and processed in the United States,
          where data protection laws may differ from those in your country.
        </p>
        <p className="mt-4">
          Where personal data moves from the EU, UK or Switzerland, we rely on Standard Contractual
          Clauses approved by the European Commission, supplemented by a transfer impact assessment
          for each recipient. Our EU fulfilment hub in Milan means most European orders never leave
          the EEA.
        </p>
        <p className="mt-4">
          We do not transfer personal data to countries that have not been assessed, and we require
          every processor outside the US to sign the same clauses.
        </p>
      </>
    ),
  },
  {
    id: 'children',
    number: '10',
    title: "Children's privacy",
    content: (
      <>
        <p>
          Our site is not directed at children under 16, and we do not knowingly collect personal
          information from them. We do not run targeted advertising, so there is no profiling of
          minors of any kind.
        </p>
        <p className="mt-4">
          If you are a parent or guardian and believe your child has given us personal information,
          email{' '}
          <a
            href="mailto:privacy@noirandco.com"
            className="text-[var(--color-noir-gold)] underline-offset-2 hover:underline"
          >
            privacy@noirandco.com
          </a>{' '}
          and we will delete it promptly. Where a jurisdiction sets a higher age of consent, we apply
          that higher age.
        </p>
      </>
    ),
  },
  {
    id: 'changes',
    number: '11',
    title: 'Changes to this policy',
    content: (
      <>
        <p>
          We will update this policy when our practices change, and we will always move the
          “last updated” date at the top of the page when we do. Material changes — a new purpose, a
          new category of data, a new recipient — are announced by email to account holders at least
          fourteen days before they take effect.
        </p>
        <p className="mt-4">
          Previous versions are kept on file and available on request. Continuing to use the site
          after a change takes effect means you accept the revised policy.
        </p>
      </>
    ),
  },
  {
    id: 'contact-us',
    number: '12',
    title: 'Contact us',
    content: (
      <>
        <p>
          Questions about this policy, or about anything we hold on you, go to our privacy team. We
          answer within one business day.
        </p>
        <dl className="mt-5 space-y-3 border-t border-[var(--border-color)] pt-5">
          <div>
            <dt className="font-heading text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
              Email
            </dt>
            <dd className="mt-1 text-sm text-[var(--text-primary)]">
              <a
                href="mailto:privacy@noirandco.com"
                className="text-[var(--color-noir-gold)] underline-offset-2 hover:underline"
              >
                privacy@noirandco.com
              </a>
            </dd>
          </div>
          <div>
            <dt className="font-heading text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
              Postal
            </dt>
            <dd className="mt-1 text-sm text-[var(--text-secondary)]">
              Data Protection Officer, AFRO &amp; CO., 118 Greene Street, Floor 4, New York, NY 10012,
              United States
            </dd>
          </div>
          <div>
            <dt className="font-heading text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
              EU representative
            </dt>
            <dd className="mt-1 text-sm text-[var(--text-secondary)]">
              AFRO &amp; CO. Europe S.r.l., Via della Spiga 21, 20121 Milano MI, Italy
            </dd>
          </div>
        </dl>
        <p className="mt-5">
          You also have the right to lodge a complaint with your local supervisory authority. We would
          appreciate the chance to put things right first.
        </p>
      </>
    ),
  },
];

const LAST_UPDATED = '1 October 2026';

/* ─── Page ─────────────────────────────────────────────────────────────────── */

export default function PrivacyPolicyPage() {
  useSeo({
    title: 'Privacy Policy',
    description:
      'How AFRO & CO. collects, uses, shares and protects your personal information — including your rights of access, erasure and portability, and how long we keep data.',
  });

  const reduceMotion = useReducedMotion();
  const [activeId, setActiveId] = useState<string>(sections[0].id);
  const [mobileTocOpen, setMobileTocOpen] = useState(false);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  // Highlight the section currently nearest the top of the viewport.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]?.target.id) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: '-120px 0px -60% 0px',
        threshold: [0, 0.25, 0.5],
      }
    );

    sectionRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const activeIndex = sections.findIndex((section) => section.id === activeId);

  return (
    <div>
      {/* ─── Hero ─── */}
      <header className="border-b border-[var(--border-color)] bg-[var(--bg-secondary)]">
        <div className="mx-auto max-w-[1600px] px-4 py-10 sm:px-6 lg:px-10 lg:py-16">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Privacy Policy' }]} />
          <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="font-heading text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
                Legal
              </p>
              <h1 className="mt-4 text-[clamp(2rem,6vw,4.5rem)] font-heading font-extrabold leading-[0.95] tracking-[-0.03em] text-[var(--text-primary)]">
                Privacy policy
              </h1>
              <p className="mt-6 max-w-2xl text-sm leading-relaxed text-[var(--text-secondary)] sm:text-base">
                We collect the minimum needed to run a shop, we never sell your information, and you
                can ask us to delete all of it at any time. This page explains exactly what we hold,
                why, and for how long — written to be read, not to be survived.
              </p>
              <p className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 font-heading text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
                <span className="inline-flex items-center gap-2">
                  <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
                  Last updated {LAST_UPDATED}
                </span>
                <span className="inline-flex items-center gap-2">
                  <Lock className="h-3.5 w-3.5" aria-hidden="true" />
                  12 sections
                </span>
              </p>
            </div>

            <div className="shrink-0">
              <a
                href="mailto:privacy@noirandco.com"
                className="group inline-flex items-center gap-3 border border-[var(--color-noir-gold)] px-6 py-5 transition-colors hover:bg-[var(--bg-card)]"
              >
                <Mail className="h-5 w-5 text-[var(--color-noir-gold)]" aria-hidden="true" />
                <span>
                  <span className="block font-heading text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
                    Privacy questions
                  </span>
                  <span className="mt-1 block font-heading text-sm font-semibold text-[var(--text-primary)]">
                    privacy@noirandco.com
                  </span>
                </span>
                <ArrowUpRight
                  className="h-4 w-4 text-[var(--text-muted)] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden="true"
                />
              </a>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10">
        <div className="lg:grid lg:grid-cols-12 lg:gap-16">
          {/* ─── Sticky table of contents (desktop) ─── */}
          <nav
            aria-label="Privacy policy contents"
            className="hidden lg:col-span-3 lg:block"
          >
            <div className="lg:sticky lg:top-28 lg:py-20">
              <p className="font-heading text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
                On this page
              </p>
              <ol className="mt-5 border-l border-[var(--border-color)]">
                {sections.map((section) => {
                  const isActive = section.id === activeId;
                  return (
                    <li key={section.id}>
                      <a
                        href={`#${section.id}`}
                        aria-current={isActive ? 'true' : undefined}
                        className={cn(
                          'relative -ml-px flex items-baseline gap-3 border-l py-2.5 pl-4 text-sm transition-colors',
                          isActive
                            ? 'border-l-2 border-[var(--color-noir-gold)] font-semibold text-[var(--text-primary)]'
                            : 'border-l border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                        )}
                      >
                        <span
                          className={cn(
                            'font-heading text-[10px] font-semibold tabular-nums',
                            isActive ? 'text-[var(--color-noir-gold)]' : 'text-[var(--text-muted)]'
                          )}
                        >
                          {section.number}
                        </span>
                        <span className="min-w-0">{section.title}</span>
                      </a>
                    </li>
                  );
                })}
              </ol>

              <div className="mt-8 border-t border-[var(--border-color)] pt-6">
                <p className="text-xs leading-relaxed text-[var(--text-muted)]">
                  Reading section {Math.max(activeIndex + 1, 1)} of {sections.length}.
                </p>
              </div>
            </div>
          </nav>

          {/* ─── Mobile contents ─── */}
          <div className="lg:hidden">
            <div className="sticky top-16 z-10 -mx-4 border-b border-[var(--border-color)] bg-[var(--bg-primary)] px-4 sm:-mx-6 sm:px-6">
              <button
                type="button"
                onClick={() => setMobileTocOpen((open) => !open)}
                aria-expanded={mobileTocOpen}
                aria-controls="mobile-toc"
                className="flex w-full items-center justify-between gap-4 py-4 text-left"
              >
                <span className="flex items-center gap-2 font-heading text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
                  <List className="h-3.5 w-3.5" aria-hidden="true" />
                  Contents —{' '}
                  <span className="text-[var(--text-primary)]">
                    {activeIndex >= 0 ? sections[activeIndex].title : sections[0].title}
                  </span>
                </span>
                <ChevronDown
                  className={cn(
                    'h-4 w-4 shrink-0 text-[var(--text-muted)] transition-transform duration-300',
                    mobileTocOpen && 'rotate-180'
                  )}
                  aria-hidden="true"
                />
              </button>
              <ol
                id="mobile-toc"
                hidden={!mobileTocOpen}
                className="max-h-[60vh] overflow-y-auto border-t border-[var(--border-color)] py-2"
              >
                {sections.map((section) => {
                  const isActive = section.id === activeId;
                  return (
                    <li key={section.id}>
                      <a
                        href={`#${section.id}`}
                        onClick={() => setMobileTocOpen(false)}
                        className={cn(
                          'flex items-baseline gap-3 px-1 py-2.5 text-sm transition-colors',
                          isActive
                            ? 'font-semibold text-[var(--text-primary)]'
                            : 'text-[var(--text-secondary)]'
                        )}
                      >
                        <span className="font-heading text-[10px] font-semibold tabular-nums text-[var(--text-muted)]">
                          {section.number}
                        </span>
                        {section.title}
                      </a>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>

          {/* ─── Policy body ─── */}
          <div className="py-16 lg:col-span-9 lg:py-20">
            <div className="max-w-3xl">
              {sections.map((section, index) => (
                <section
                  key={section.id}
                  id={section.id}
                  ref={(el) => {
                    sectionRefs.current[index] = el;
                  }}
                  aria-labelledby={`${section.id}-heading`}
                  className="scroll-mt-32 border-b border-[var(--border-color)] py-10 first:pt-0 last:border-b-0"
                >
                  <motion.div
                    initial={reduceMotion ? undefined : { opacity: 0, y: 16 }}
                    whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div className="flex items-baseline gap-4">
                      <span className="font-editorial text-2xl font-bold tracking-[-0.02em] text-[var(--color-noir-gold)]">
                        {section.number}
                      </span>
                      <h2
                        id={`${section.id}-heading`}
                        className="font-heading text-xl font-extrabold tracking-[-0.02em] text-[var(--text-primary)] sm:text-2xl"
                      >
                        {section.title}
                      </h2>
                    </div>
                    <div className="mt-5 space-y-4 text-sm leading-[1.75] text-[var(--text-secondary)]">
                      {section.content}
                    </div>
                  </motion.div>
                </section>
              ))}

              {/* Closing note */}
              <div className="mt-12 border border-[var(--border-color)] bg-[var(--bg-card)] p-8">
                <h3 className="font-heading text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--text-primary)]">
                  In plain language
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
                  We hold your name, address, email and order history because that is how a shop
                  works. We give it to a payment processor and a courier because that is how delivery
                  works. Nobody else gets it, nobody buys it, and you can have it deleted whenever
                  you ask. That is the whole policy.
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Button asChild variant="outline">
                    <Link to="/contact">Ask a privacy question</Link>
                  </Button>
                  <Button asChild variant="ghost">
                    <Link to="/terms">Read the terms</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
