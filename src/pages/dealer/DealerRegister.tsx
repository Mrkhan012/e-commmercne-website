import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Percent,
  Truck,
  CreditCard,
  ArrowLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useDealerStore } from '@/store/dealerStore';
import { useUserStore } from '@/store/userStore';
import { useToastStore } from '@/store/toastStore';
import { useSeo } from '@/hooks/useSeo';

export default function DealerRegister() {
  useSeo({
    title: 'Apply for Dealer & Wholesale Partnership | AFRO & CO.',
    description: 'Join the AFRO & CO. global retail partner network. Exclusive wholesale margins up to 35%, dedicated terms, and consolidated logistics.',
  });

  const navigate = useNavigate();
  const { applyForDealer } = useDealerStore();
  const { signInAsDealer } = useUserStore();
  const toast = useToastStore();

  const [companyName, setCompanyName] = useState('');
  const [businessType, setBusinessType] = useState<'retailer' | 'boutique' | 'distributor' | 'corporate'>('boutique');
  const [taxId, setTaxId] = useState('');
  const [website, setWebsite] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('United States');
  const [expectedMonthlyVolume, setExpectedMonthlyVolume] = useState('$10,000 - $25,000');
  const [notes, setNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      applyForDealer({
        companyName,
        businessType,
        taxId,
        website,
        contactPerson,
        email,
        phone,
        address,
        city,
        state,
        country,
        expectedMonthlyVolume,
        notes,
      });

      setIsSubmitted(true);
      toast.success('Application Received', 'Your dealer application has been submitted for verification.');
    } catch {
      toast.error('Error', 'Unable to process dealer application.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoSignIn = () => {
    signInAsDealer();
    navigate('/dealer');
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] py-12 lg:py-20 text-[var(--text-primary)]">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        {/* Navigation breadcrumb */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Return to Retail Storefront
          </Link>
        </div>

        {/* ─── Hero Banner ─── */}
        <div className="mb-12 text-center max-w-2xl mx-auto">
          <span className="font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-[var(--color-noir-gold)]">
            Wholesale &bull; Distribution &bull; B2B Network
          </span>
          <h1 className="mt-3 font-heading text-3xl font-extrabold sm:text-4xl lg:text-5xl tracking-tight">
            Partner with AFRO &amp; CO.
          </h1>
          <p className="mt-3 text-sm text-[var(--text-secondary)] leading-relaxed">
            Expand your luxury boutique, department store, or corporate gifting portfolio with our ready-to-wear garments, fine leathercraft, and signature timepieces.
          </p>
        </div>

        {/* ─── 3 Key Value Props ─── */}
        <div className="mb-12 grid gap-6 sm:grid-cols-3">
          <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10 text-[var(--color-noir-gold)] mb-4">
              <Percent className="h-6 w-6" />
            </div>
            <h3 className="font-heading text-base font-bold text-[var(--text-primary)]">
              Up to 35% Wholesale Margins
            </h3>
            <p className="mt-2 text-xs text-[var(--text-secondary)] leading-relaxed">
              Tiered pricing structures structured to ensure sustainable, high-margin retail profitability.
            </p>
          </div>

          <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10 text-blue-400 mb-4">
              <CreditCard className="h-6 w-6" />
            </div>
            <h3 className="font-heading text-base font-bold text-[var(--text-primary)]">
              Flexible Net-30 / Net-60 Terms
            </h3>
            <p className="mt-2 text-xs text-[var(--text-secondary)] leading-relaxed">
              Generous revolving credit lines up to $50,000 for verified physical boutiques and distributors.
            </p>
          </div>

          <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 mb-4">
              <Truck className="h-6 w-6" />
            </div>
            <h3 className="font-heading text-base font-bold text-[var(--text-primary)]">
              Consolidated Global Logistics
            </h3>
            <p className="mt-2 text-xs text-[var(--text-secondary)] leading-relaxed">
              White-glove priority freight with bonded warehouse dispatch across North America, Europe, and GCC.
            </p>
          </div>
        </div>

        {/* ─── Application Form or Success State ─── */}
        {isSubmitted ? (
          <div className="mx-auto max-w-xl rounded-2xl border border-[var(--color-noir-gold)] bg-[var(--bg-card)] p-8 text-center sm:p-12 shadow-2xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
              <CheckCircle2 className="h-8 w-8" />
            </div>

            <h2 className="mt-6 font-heading text-2xl font-bold text-[var(--text-primary)]">
              Application Under Review
            </h2>
            <p className="mt-3 text-xs leading-relaxed text-[var(--text-secondary)]">
              Thank you for applying to join the AFRO &amp; CO. Dealer Network. Our B2B onboarding team reviews corporate credentials and tax exemption certificates within 1 business day.
            </p>

            <div className="mt-8 rounded-lg bg-[var(--bg-secondary)] p-4 text-xs text-left text-[var(--text-secondary)] space-y-1">
              <p><strong className="text-[var(--text-primary)]">Applicant:</strong> {companyName}</p>
              <p><strong className="text-[var(--text-primary)]">Tax ID / VAT:</strong> {taxId}</p>
              <p><strong className="text-[var(--text-primary)]">Expected Volume:</strong> {expectedMonthlyVolume}</p>
            </div>

            <div className="mt-8 flex flex-col gap-3">
              <Button onClick={handleDemoSignIn} variant="primary" size="lg" className="w-full">
                <Sparkles className="mr-2 h-4 w-4" />
                Explore Dealer Portal as Demo Partner
              </Button>

              <Button asChild variant="outline" className="w-full">
                <Link to="/">Back to Storefront</Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-3xl rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 sm:p-10 shadow-xl">
            <div className="mb-8 border-b border-[var(--border-color)] pb-4">
              <h2 className="font-heading text-xl font-bold text-[var(--text-primary)]">
                B2B Partner Verification Application
              </h2>
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                Please provide your registered legal business details for commercial credit line assessment.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Company & Business Type */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-[var(--text-secondary)]">
                    Legal Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Sovereign Luxury Retail Ltd."
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full rounded-md border border-[var(--border-color)] bg-[var(--bg-primary)] px-3 py-2 text-xs text-[var(--text-primary)] focus:border-[var(--color-noir-gold)] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-[var(--text-secondary)]">
                    Business Entity Type *
                  </label>
                  <select
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value as any)}
                    className="w-full rounded-md border border-[var(--border-color)] bg-[var(--bg-primary)] px-3 py-2 text-xs text-[var(--text-primary)] focus:border-[var(--color-noir-gold)] focus:outline-none"
                  >
                    <option value="boutique">Independent Boutique Store</option>
                    <option value="retailer">Department Store / Multi-Brand Retailer</option>
                    <option value="distributor">Regional Wholesaler / Distributor</option>
                    <option value="corporate">Corporate Gifting / Enterprise Procurement</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-[var(--text-secondary)]">
                    Tax ID / VAT / GSTIN / EIN *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., US-EIN-948271034"
                    value={taxId}
                    onChange={(e) => setTaxId(e.target.value)}
                    className="w-full rounded-md border border-[var(--border-color)] bg-[var(--bg-primary)] px-3 py-2 font-mono text-xs text-[var(--text-primary)] focus:border-[var(--color-noir-gold)] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-[var(--text-secondary)]">
                    Company Website / Instagram
                  </label>
                  <input
                    type="url"
                    placeholder="https://yourstore.com"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="w-full rounded-md border border-[var(--border-color)] bg-[var(--bg-primary)] px-3 py-2 text-xs text-[var(--text-primary)] focus:border-[var(--color-noir-gold)] focus:outline-none"
                  />
                </div>
              </div>

              {/* Contact Representative */}
              <div className="border-t border-[var(--border-color)] pt-6">
                <h3 className="font-heading text-sm font-bold text-[var(--text-primary)] mb-4">
                  Authorized Purchasing Representative
                </h3>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-[var(--text-secondary)]">
                      Representative Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Jonathan Vance"
                      value={contactPerson}
                      onChange={(e) => setContactPerson(e.target.value)}
                      className="w-full rounded-md border border-[var(--border-color)] bg-[var(--bg-primary)] px-3 py-2 text-xs text-[var(--text-primary)] focus:border-[var(--color-noir-gold)] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-[var(--text-secondary)]">
                      Business Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="procurement@yourstore.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-md border border-[var(--border-color)] bg-[var(--bg-primary)] px-3 py-2 text-xs text-[var(--text-primary)] focus:border-[var(--color-noir-gold)] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-[var(--text-secondary)]">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+1 (555) 019-2834"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full rounded-md border border-[var(--border-color)] bg-[var(--bg-primary)] px-3 py-2 text-xs text-[var(--text-primary)] focus:border-[var(--color-noir-gold)] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Warehouse / Store Location */}
              <div className="border-t border-[var(--border-color)] pt-6">
                <h3 className="font-heading text-sm font-bold text-[var(--text-primary)] mb-4">
                  Distribution &amp; Shipping Hub
                </h3>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="sm:col-span-3">
                    <label className="mb-1 block text-xs font-semibold text-[var(--text-secondary)]">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="450 Lexington Avenue, Suite 2200"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full rounded-md border border-[var(--border-color)] bg-[var(--bg-primary)] px-3 py-2 text-xs text-[var(--text-primary)] focus:border-[var(--color-noir-gold)] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-[var(--text-secondary)]">City *</label>
                    <input
                      type="text"
                      required
                      placeholder="New York"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full rounded-md border border-[var(--border-color)] bg-[var(--bg-primary)] px-3 py-2 text-xs text-[var(--text-primary)] focus:border-[var(--color-noir-gold)] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-[var(--text-secondary)]">State / Province</label>
                    <input
                      type="text"
                      placeholder="NY"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full rounded-md border border-[var(--border-color)] bg-[var(--bg-primary)] px-3 py-2 text-xs text-[var(--text-primary)] focus:border-[var(--color-noir-gold)] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-[var(--text-secondary)]">Country *</label>
                    <input
                      type="text"
                      required
                      placeholder="United States"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full rounded-md border border-[var(--border-color)] bg-[var(--bg-primary)] px-3 py-2 text-xs text-[var(--text-primary)] focus:border-[var(--color-noir-gold)] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Volume & Notes */}
              <div className="border-t border-[var(--border-color)] pt-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-[var(--text-secondary)]">
                      Expected Monthly Purchasing Volume
                    </label>
                    <select
                      value={expectedMonthlyVolume}
                      onChange={(e) => setExpectedMonthlyVolume(e.target.value)}
                      className="w-full rounded-md border border-[var(--border-color)] bg-[var(--bg-primary)] px-3 py-2 text-xs text-[var(--text-primary)] focus:border-[var(--color-noir-gold)] focus:outline-none"
                    >
                      <option value="$5,000 - $10,000">$5,000 - $10,000 / month (Bronze Tier - 15%)</option>
                      <option value="$10,000 - $25,000">$10,000 - $25,000 / month (Silver Tier - 25%)</option>
                      <option value="$25,000 - $50,000+">$25,000 - $50,000+ / month (Gold Tier - 35%)</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-[var(--text-secondary)]">
                      Storefronts / Remarks
                    </label>
                    <input
                      type="text"
                      placeholder="Number of retail doors, regional exclusivity requests..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full rounded-md border border-[var(--border-color)] bg-[var(--bg-primary)] px-3 py-2 text-xs text-[var(--text-primary)] focus:border-[var(--color-noir-gold)] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[var(--border-color)]">
                <Button type="submit" variant="primary" size="lg" disabled={isSubmitting} className="w-full sm:w-auto">
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  {isSubmitting ? 'Submitting Application...' : 'Submit Dealer Application'}
                </Button>

                <button
                  type="button"
                  onClick={handleDemoSignIn}
                  className="text-xs text-[var(--color-noir-gold)] hover:underline"
                >
                  Quick Test: Open Portal as Demo Dealer &rarr;
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
