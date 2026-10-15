import { ShieldCheck, RotateCcw, Truck, Headphones, Leaf, CreditCard } from 'lucide-react';

const benefits = [
  {
    id: 'secure',
    icon: ShieldCheck,
    title: 'Secure checkout',
    description: 'Encrypted payments through Stripe, PayPal, and Apple Pay. We never store card details.',
  },
  {
    id: 'returns',
    icon: RotateCcw,
    title: '30-day returns',
    description: 'Unworn, unwashed, tags attached. We cover return shipping within the US and UK.',
  },
  {
    id: 'shipping',
    icon: Truck,
    title: 'Complimentary shipping',
    description: 'On every order over $200, shipped carbon-neutral from the warehouse nearest you.',
  },
  {
    id: 'support',
    icon: Headphones,
    title: 'Real human support',
    description: 'A team of nine, based in New York and London, answering in under four hours.',
  },
  {
    id: 'sourcing',
    icon: Leaf,
    title: 'Responsible materials',
    description: 'Traceable supply chain with published mill partners and material origins.',
  },
  {
    id: 'repairs',
    icon: CreditCard,
    title: 'Lifetime repairs',
    description: 'Free repairs on every full-price purchase for as long as you own the piece.',
  },
];

/** Brand trust benefits row. */
export function BenefitsStrip() {
  return (
    <section className="border-y border-[var(--border-color)] bg-[var(--bg-secondary)] py-16 lg:py-20">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10">
        <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit) => (
            <div key={benefit.id} className="flex gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center border border-[var(--color-noir-gold)] text-[var(--color-noir-gold)]">
                <benefit.icon className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-heading text-sm font-semibold text-[var(--text-primary)]">
                  {benefit.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">
                  {benefit.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
