import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'motion/react';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Timer,
  CircleCheck,
  LifeBuoy,
  Send,
  MessageCircle,
} from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Accordion, type AccordionItemData } from '@/components/ui/Accordion';
import { useSeo } from '@/hooks/useSeo';
import { useReducedMotion } from '@/hooks/useUi';
import { contactSchema, type ContactFormData } from '@/schemas';

const subjectOptions = [
  { label: 'Order question', value: 'order' },
  { label: 'Shipping & delivery', value: 'shipping' },
  { label: 'Returns & exchanges', value: 'returns' },
  { label: 'Product advice', value: 'product' },
  { label: 'Repairs & aftercare', value: 'repairs' },
  { label: 'Payments & billing', value: 'payments' },
  { label: 'Press & partnerships', value: 'press' },
  { label: 'Something else', value: 'other' },
];

const faqTeasers: AccordionItemData[] = [
  {
    id: 'teaser-1',
    question: 'Where is my order?',
    answer: (
      <>
        Tracking links are emailed the moment a parcel leaves our atelier. You can also follow it
        live on the{' '}
        <Link
          to="/track-order"
          className="text-[var(--color-noir-gold)] underline-offset-2 hover:underline"
        >
          order tracking page
        </Link>
        .
      </>
    ),
  },
  {
    id: 'teaser-2',
    question: 'What is your return window?',
    answer: (
      <p>
        Thirty days from delivery, with a free prepaid label on every domestic return. Read the{' '}
        <Link
          to="/returns"
          className="text-[var(--color-noir-gold)] underline-offset-2 hover:underline"
        >
          returns policy
        </Link>{' '}
        for the details.
      </p>
    ),
  },
  {
    id: 'teaser-3',
    question: 'Do you ship internationally?',
    answer: (
      <p>
        To more than 60 countries, with duties and taxes calculated at checkout. See our{' '}
        <Link
          to="/shipping"
          className="text-[var(--color-noir-gold)] underline-offset-2 hover:underline"
        >
          shipping rates
        </Link>
        .
      </p>
    ),
  },
];

/** Builds a readable reference number for the success panel. */
const createReference = (): string =>
  `NC-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;

export default function ContactPage() {
  useSeo({
    title: 'Contact',
    description:
      'Reach AFRO & CO. client care by email, phone or post. Messages are answered within one business day by a real person in our New York studio.',
  });

  const reduceMotion = useReducedMotion();
  const [submitted, setSubmitted] = useState(false);
  const [reference, setReference] = useState('');
  const [sentName, setSentName] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    mode: 'onBlur',
    defaultValues: { name: '', email: '', subject: '', message: '' },
  });

  const onSubmit: SubmitHandler<ContactFormData> = async (values) => {
    // Simulated network round-trip; a production build would POST to the API.
    await new Promise((resolve) => setTimeout(resolve, 900));
    setSentName(values.name.trim().split(/\s+/)[0] ?? values.name);
    setReference(createReference());
    setSubmitted(true);
    reset();
  };

  const details = [
    {
      icon: Mail,
      label: 'Email',
      value: 'care@noirandco.com',
      href: 'mailto:care@noirandco.com',
      note: 'For all enquiries, including orders and repairs.',
    },
    {
      icon: Phone,
      label: 'Phone',
      value: '+1 (212) 555-0134',
      href: 'tel:+12125550134',
      note: 'Mon–Sat, 9:00 AM – 6:00 PM ET.',
    },
    {
      icon: MapPin,
      label: 'Studio',
      value: '118 Greene Street, Floor 4, New York, NY 10012',
      href: undefined,
      note: 'Visits by appointment — write ahead and we will host you.',
    },
  ];

  const hours = [
    { day: 'Monday – Friday', time: '9:00 AM – 6:00 PM ET' },
    { day: 'Saturday', time: '10:00 AM – 4:00 PM ET' },
    { day: 'Sunday', time: 'Closed — email answered Monday' },
  ];

  return (
    <div>
      <header className="border-b border-[var(--border-color)] bg-[var(--bg-secondary)]">
        <div className="mx-auto max-w-[1600px] px-4 py-10 sm:px-6 lg:px-10 lg:py-16">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Contact' }]} />
          <div className="mt-8 max-w-2xl">
            <p className="font-heading text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
              Client Care
            </p>
            <h1 className="mt-4 text-[clamp(2rem,6vw,4.5rem)] font-heading font-extrabold leading-[0.95] tracking-[-0.03em] text-[var(--text-primary)]">
              Contact us
            </h1>
            <p className="mt-6 max-w-2xl text-sm leading-relaxed text-[var(--text-secondary)] sm:text-base">
              A real person reads every message. Tell us what you need — an order question, styling
              advice, a repair quote — and we will come back to you within one business day.
            </p>
          </div>
        </div>
      </header>

      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
            {/* ─── Left: contact details ─── */}
            <div className="lg:col-span-5">
              <p className="font-heading text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
                Direct lines
              </p>
              <h2 className="mt-3 font-heading text-2xl font-extrabold tracking-[-0.02em] text-[var(--text-primary)]">
                Reach the studio
              </h2>

              <ul className="mt-8 border-t border-[var(--border-color)]">
                {details.map(({ icon: Icon, label, value, href, note }) => (
                  <li key={label} className="flex gap-4 border-b border-[var(--border-color)] py-6">
                    <span className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center border border-[var(--border-color)] text-[var(--color-noir-gold)]">
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <p className="font-heading text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
                        {label}
                      </p>
                      {href ? (
                        <a
                          href={href}
                          className="mt-1 block break-words font-heading text-sm font-semibold text-[var(--text-primary)] underline-offset-4 transition-colors hover:text-[var(--color-noir-gold)] hover:underline"
                        >
                          {value}
                        </a>
                      ) : (
                        <p className="mt-1 font-heading text-sm font-semibold text-[var(--text-primary)]">
                          {value}
                        </p>
                      )}
                      <p className="mt-1 text-xs leading-relaxed text-[var(--text-secondary)]">
                        {note}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Opening hours */}
              <div className="mt-10 border border-[var(--border-color)] bg-[var(--bg-card)] p-6">
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-[var(--color-noir-gold)]" aria-hidden="true" />
                  <h3 className="font-heading text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--text-primary)]">
                    Opening hours
                  </h3>
                </div>
                <dl className="mt-4 space-y-2">
                  {hours.map((entry) => (
                    <div
                      key={entry.day}
                      className="flex flex-wrap items-baseline justify-between gap-2"
                    >
                      <dt className="text-sm text-[var(--text-secondary)]">{entry.day}</dt>
                      <dd className="font-heading text-xs font-semibold text-[var(--text-primary)]">
                        {entry.time}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>

              {/* Response-time promise */}
              <div className="mt-6 flex gap-4 border border-[var(--color-noir-gold)] p-6">
                <Timer
                  className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-noir-gold)]"
                  aria-hidden="true"
                />
                <div>
                  <h3 className="font-heading text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--text-primary)]">
                    Our response promise
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                    Every message is answered within{' '}
                    <strong className="text-[var(--text-primary)]">one business day</strong>. Urgent
                    order issues phoned in before 3:00 PM ET are resolved the same day, and every
                    reply is signed by the person who handled it.
                  </p>
                </div>
              </div>

              {/* FAQ teaser */}
              <div className="mt-12">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="font-heading text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--text-primary)]">
                    Quick answers
                  </h3>
                  <Link
                    to="/faq"
                    className="font-heading text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)] underline-offset-4 transition-colors hover:text-[var(--color-noir-gold)] hover:underline"
                  >
                    All questions
                  </Link>
                </div>
                <Accordion items={faqTeasers} className="mt-4" />
              </div>
            </div>

            {/* ─── Right: form / success panel ─── */}
            <div className="lg:col-span-7">
              <div className="border border-[var(--border-color)] bg-[var(--bg-card)] p-6 sm:p-10">
                {submitted ? (
                  <motion.div
                    initial={reduceMotion ? undefined : { opacity: 0, y: 12 }}
                    animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    role="status"
                    aria-live="polite"
                    className="py-8 text-center"
                  >
                    <span className="inline-flex h-16 w-16 items-center justify-center border border-[var(--color-noir-gold)] text-[var(--color-noir-gold)]">
                      <CircleCheck className="h-7 w-7" aria-hidden="true" />
                    </span>
                    <h2 className="mt-6 font-heading text-2xl font-extrabold tracking-[-0.02em] text-[var(--text-primary)] sm:text-3xl">
                      Message received{sentName ? `, ${sentName}` : ''}
                    </h2>
                    <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-[var(--text-secondary)]">
                      Thank you for writing. A member of client care has your message and will reply
                      within one business day — check your spam folder if it does not arrive.
                    </p>

                    <dl className="mx-auto mt-8 max-w-sm border border-[var(--border-color)] text-left">
                      <div className="flex items-baseline justify-between gap-4 border-b border-[var(--border-color)] px-5 py-4">
                        <dt className="font-heading text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
                          Reference
                        </dt>
                        <dd className="font-heading text-sm font-bold tracking-[0.06em] text-[var(--text-primary)]">
                          {reference}
                        </dd>
                      </div>
                      <div className="flex items-baseline justify-between gap-4 px-5 py-4">
                        <dt className="font-heading text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
                          Reply by
                        </dt>
                        <dd className="font-heading text-sm font-semibold text-[var(--text-primary)]">
                          Within 1 business day
                        </dd>
                      </div>
                    </dl>

                    <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSubmitted(false);
                          setReference('');
                        }}
                      >
                        Send another message
                      </Button>
                      <Button asChild variant="ghost">
                        <Link to="/faq">Browse the FAQ</Link>
                      </Button>
                    </div>
                  </motion.div>
                ) : (
                  <>
                    <div className="flex items-center gap-3">
                      <Send className="h-4 w-4 text-[var(--color-noir-gold)]" aria-hidden="true" />
                      <h2 className="font-heading text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--text-primary)]">
                        Send a message
                      </h2>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
                      The more detail you give us — order number, product name, photographs of a
                      fault — the faster we can resolve things.
                    </p>

                    <form noValidate onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <Input
                          label="Full name"
                          autoComplete="name"
                          placeholder="Ada Okonkwo"
                          error={errors.name?.message}
                          {...register('name')}
                        />
                        <Input
                          label="Email address"
                          type="email"
                          autoComplete="email"
                          placeholder="you@example.com"
                          error={errors.email?.message}
                          {...register('email')}
                        />
                      </div>

                      <Select
                        label="Subject"
                        placeholder="Choose a topic"
                        options={subjectOptions}
                        error={errors.subject?.message}
                        {...register('subject')}
                      />

                      <div>
                        <label
                          htmlFor="contact-message"
                          className="mb-2 block font-heading text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--text-secondary)]"
                        >
                          Message
                        </label>
                        <textarea
                          id="contact-message"
                          rows={7}
                          placeholder="How can we help?"
                          aria-invalid={errors.message ? 'true' : undefined}
                          aria-describedby={errors.message ? 'contact-message-error' : undefined}
                          className={`w-full resize-y border bg-[var(--bg-primary)] px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none ${
                            errors.message
                              ? 'border-red-500'
                              : 'border-[var(--border-color)] focus:border-[var(--text-primary)]'
                          }`}
                          {...register('message')}
                        />
                        {errors.message && (
                          <p
                            id="contact-message-error"
                            role="alert"
                            className="mt-1.5 text-xs text-red-500"
                          >
                            {errors.message.message}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col gap-4 border-t border-[var(--border-color)] pt-6 sm:flex-row sm:items-center sm:justify-between">
                        <p className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                          <LifeBuoy className="h-3.5 w-3.5" aria-hidden="true" />
                          We never share your details.
                        </p>
                        <Button type="submit" loading={isSubmitting} size="lg">
                          {isSubmitting ? 'Sending…' : 'Send message'}
                        </Button>
                      </div>
                    </form>
                  </>
                )}
              </div>

              <p className="mt-6 flex items-start gap-3 text-xs leading-relaxed text-[var(--text-muted)]">
                <MessageCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                Prefer to talk it through? Call the studio line during opening hours and ask for
                client care — or read{' '}
                <Link
                  to="/about"
                  className="text-[var(--color-noir-gold)] underline-offset-2 hover:underline"
                >
                  our story
                </Link>{' '}
                to see where the work happens.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
