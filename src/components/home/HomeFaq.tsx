import { Link } from 'react-router-dom';
import { Plus, Minus } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useReducedMotion } from '@/hooks/useUi';

const faqs = [
  {
    id: 'shipping-time',
    question: 'How long will my order take to arrive?',
    answer:
      'Orders are processed within one business day. Standard delivery takes 3 to 5 business days within the US and UK, and 5 to 10 business days internationally. Express options are available at checkout.',
  },
  {
    id: 'returns',
    question: 'What is your return policy?',
    answer:
      'You have 30 days from delivery to return any unworn, unwashed item with its original tags attached. Return shipping is free within the US and UK. Refunds are issued to your original payment method within 5 business days of us receiving the item.',
  },
  {
    id: 'sizing',
    question: 'How do I find my size?',
    answer:
      'Every product page includes a detailed size chart with measurements in centimetres and inches, plus a note on the fit. If you are between sizes, our fit notes tell you which way to go. You can also reach out to support and we will advise based on your measurements.',
  },
  {
    id: 'tracking',
    question: 'Can I track my order?',
    answer:
      'Yes. As soon as your order ships you will receive an email with a tracking link. You can also track it any time from the Track Order page using your order number and email address.',
  },
  {
    id: 'payment',
    question: 'Which payment methods do you accept?',
    answer:
      'We accept Visa, Mastercard, American Express, PayPal, Apple Pay, and Google Pay. All payments are processed by Stripe. This demo storefront never collects or stores real card details.',
  },
  {
    id: 'international',
    question: 'Do you ship internationally?',
    answer:
      'We ship to 68 countries. Duties and taxes are calculated at checkout for most destinations, so there is nothing to pay on arrival. A small number of remote destinations require duty payment at delivery, which is flagged before you order.',
  },
];

/** FAQ accordion for the homepage, with a CTA to the full FAQ page. */
export function HomeFaq() {
  const reduceMotion = useReducedMotion();
  const [openIds, setOpenIds] = useState<string[]>(['shipping-time']);

  const toggle = (id: string) =>
    setOpenIds((current) =>
      current.includes(id) ? current.filter((i) => i !== id) : [...current, id]
    );

  return (
    <section className="bg-[var(--bg-secondary)] py-20 lg:py-28">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Header column */}
          <div className="lg:col-span-4">
            <p className="font-heading text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--text-muted)]">
              Good to know
            </p>
            <h2 className="mt-3 text-[clamp(2rem,4vw,3rem)] font-heading font-extrabold leading-[1] tracking-[-0.03em] text-[var(--text-primary)]">
              Questions, answered
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-[var(--text-muted)]">
              Everything you need to know about ordering, delivery, and returns. Still stuck? Our
              support team replies in under four hours.
            </p>
            <Link
              to="/faq"
              className="mt-6 inline-block border-b border-[var(--text-primary)] pb-1 font-heading text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-primary)]"
            >
              Visit the full FAQ
            </Link>
          </div>

          {/* Accordion */}
          <div className="lg:col-span-8">
            <ul className="border-t border-[var(--border-color)]">
              {faqs.map((faq) => {
                const isOpen = openIds.includes(faq.id);
                return (
                  <li key={faq.id} className="border-b border-[var(--border-color)]">
                    <h3>
                      <button
                        type="button"
                        onClick={() => toggle(faq.id)}
                        aria-expanded={isOpen}
                        aria-controls={`faq-panel-${faq.id}`}
                        id={`faq-trigger-${faq.id}`}
                        className="flex w-full items-center justify-between gap-6 py-5 text-left"
                      >
                        <span className="font-heading text-sm font-semibold text-[var(--text-primary)] sm:text-base">
                          {faq.question}
                        </span>
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center border border-[var(--border-color)] text-[var(--text-primary)]">
                          {isOpen ? <Minus className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                        </span>
                      </button>
                    </h3>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          id={`faq-panel-${faq.id}`}
                          role="region"
                          aria-labelledby={`faq-trigger-${faq.id}`}
                          initial={reduceMotion ? {} : { height: 0, opacity: 0 }}
                          animate={reduceMotion ? {} : { height: 'auto', opacity: 1 }}
                          exit={reduceMotion ? {} : { height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                          className="overflow-hidden"
                        >
                          <p className="max-w-2xl pb-6 pr-12 text-sm leading-relaxed text-[var(--text-muted)]">
                            {faq.answer}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
