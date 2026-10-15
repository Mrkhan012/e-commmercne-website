import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useReducedMotion } from '@/hooks/useUi';

const PROMO_END = new Date('2026-12-31T23:59:59Z').getTime();

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const computeTimeLeft = (): TimeLeft => {
  const diff = Math.max(0, PROMO_END - Date.now());
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
};

const pad = (value: number) => String(value).padStart(2, '0');

/** Limited-time promotional banner with a live countdown to the offer end. */
export function PromoBanner() {
  const reduceMotion = useReducedMotion();
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(computeTimeLeft);

  useEffect(() => {
    const timer = window.setInterval(() => setTimeLeft(computeTimeLeft()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const cells = [
    { label: 'Days', value: pad(timeLeft.days) },
    { label: 'Hours', value: pad(timeLeft.hours) },
    { label: 'Mins', value: pad(timeLeft.minutes) },
    { label: 'Secs', value: pad(timeLeft.seconds) },
  ];

  return (
    <section className="promo-gradient relative overflow-hidden py-16 lg:py-24">
      {/* Subtle texture wash */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        aria-hidden="true"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 30%, var(--color-noir-gold) 0%, transparent 45%), radial-gradient(circle at 80% 70%, var(--color-noir-gold) 0%, transparent 45%)',
        }}
      />

      <div className="relative mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Copy */}
          <div>
            <p className="flex items-center gap-2 font-heading text-[10px] font-semibold uppercase tracking-[0.28em] text-noir-gold">
              <Clock className="h-3.5 w-3.5" />
              Limited time
            </p>
            <h2 className="mt-5 text-[clamp(2.25rem,6vw,4rem)] font-heading font-extrabold leading-[0.98] tracking-[-0.03em] text-noir-ivory">
              Mid-season markdown.
              <br />
              <span className="font-editorial font-normal italic text-noir-gold">Up to 25% off.</span>
            </h2>
            <p className="mt-6 max-w-md text-base leading-relaxed text-noir-ivory/70">
              Selected outerwear, knitwear, and footwear. Once a size is gone, it is gone for the
              season. No extensions, no exceptions.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button asChild size="lg" variant="gold">
                <Link to="/sale">Shop the Sale</Link>
              </Button>
              <p className="text-xs text-noir-ivory/50">
                Applied automatically at checkout
              </p>
            </div>
          </div>

          {/* Countdown */}
          <div className="lg:justify-self-end">
            <p className="mb-5 text-center font-heading text-[10px] font-semibold uppercase tracking-[0.24em] text-noir-ivory/50 lg:text-left">
              Offer ends in
            </p>
            <div className="flex gap-3 sm:gap-4">
              {cells.map((cell) => (
                <div
                  key={cell.label}
                  className="flex min-w-[68px] flex-col items-center gap-2 border border-noir-ivory/15 bg-noir-ivory/5 px-4 py-5 backdrop-blur sm:min-w-[84px]"
                >
                  <span
                    className={
                      reduceMotion
                        ? 'font-heading text-2xl font-bold tabular-nums text-noir-ivory sm:text-3xl'
                        : 'font-heading text-2xl font-bold tabular-nums text-noir-ivory transition-transform sm:text-3xl'
                    }
                  >
                    {cell.value}
                  </span>
                  <span className="text-[9px] uppercase tracking-[0.2em] text-noir-ivory/50">
                    {cell.label}
                  </span>
                </div>
              ))}
            </div>

            <p className="mt-5 text-xs text-noir-ivory/50">
              Discounts already reflected in the prices shown. Cannot be combined with other offers.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
