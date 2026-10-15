import { Globe, Eye, ShoppingCart, Percent } from 'lucide-react';
import { StatCard } from '@/components/dashboard/StatCard';

export default function AdminAnalytics() {
  return (
    <div className="space-y-8">
      <div>
        <p className="font-heading text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
          Intelligence &amp; Metrics
        </p>
        <h1 className="mt-1 font-heading text-3xl font-extrabold text-[var(--text-primary)]">
          Commerce Analytics
        </h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Conversion Rate"
          value="3.84%"
          change={0.6}
          icon={<Percent className="h-4 w-4" />}
        />
        <StatCard
          label="Total Store Sessions"
          value="48,290"
          change={12.4}
          icon={<Eye className="h-4 w-4" />}
        />
        <StatCard
          label="Bag-to-Checkout"
          value="42.1%"
          change={-1.2}
          icon={<ShoppingCart className="h-4 w-4" />}
        />
        <StatCard
          label="Global Territories"
          value="38 Countries"
          change={4.0}
          icon={<Globe className="h-4 w-4" />}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Geographic Demand */}
        <div className="border border-[var(--border-color)] bg-[var(--bg-card)] p-6">
          <h2 className="border-b border-[var(--border-color)] pb-4 font-heading text-sm font-bold uppercase tracking-wider text-[var(--text-primary)]">
            Regional Demand Distribution
          </h2>
          <div className="mt-6 space-y-4">
            {[
              { region: 'North America (NYC, LA, Miami)', pct: 44, value: '$65,520' },
              { region: 'Western Europe (Paris, London, Milan)', pct: 32, value: '$47,650' },
              { region: 'East Asia (Tokyo, Seoul, HK)', pct: 16, value: '$23,820' },
              { region: 'Middle East (Dubai, Doha)', pct: 8, value: '$11,930' },
            ].map((reg) => (
              <div key={reg.region} className="space-y-1.5">
                <div className="flex justify-between text-xs font-heading">
                  <span className="font-semibold text-[var(--text-primary)]">{reg.region}</span>
                  <span className="text-[var(--color-noir-gold)]">{reg.value} ({reg.pct}%)</span>
                </div>
                <div className="h-2 w-full bg-[var(--bg-secondary)] overflow-hidden">
                  <div
                    className="h-full bg-[var(--color-noir-gold)] transition-all duration-500"
                    style={{ width: `${reg.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Performance */}
        <div className="border border-[var(--border-color)] bg-[var(--bg-card)] p-6">
          <h2 className="border-b border-[var(--border-color)] pb-4 font-heading text-sm font-bold uppercase tracking-wider text-[var(--text-primary)]">
            Category Contribution
          </h2>
          <div className="mt-6 space-y-4">
            {[
              { category: 'Outerwear & Tailoring', pct: 38, units: '184 pieces' },
              { category: 'Leather Goods & Handbags', pct: 28, units: '120 pieces' },
              { category: 'Cashmere Knitwear', pct: 22, units: '98 pieces' },
              { category: 'Fine Accessories & Eyewear', pct: 12, units: '65 pieces' },
            ].map((cat) => (
              <div key={cat.category} className="space-y-1.5">
                <div className="flex justify-between text-xs font-heading">
                  <span className="font-semibold text-[var(--text-primary)]">{cat.category}</span>
                  <span className="text-[var(--text-muted)]">{cat.units}</span>
                </div>
                <div className="h-2 w-full bg-[var(--bg-secondary)] overflow-hidden">
                  <div
                    className="h-full bg-[var(--color-noir-charcoal)] transition-all duration-500"
                    style={{ width: `${cat.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
