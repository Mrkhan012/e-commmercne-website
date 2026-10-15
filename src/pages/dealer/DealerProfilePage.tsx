import { useState } from 'react';
import {
  Building2,
  FileCheck2,
  CreditCard,
  MapPin,
  Mail,
  Phone,
  Globe,
  Save,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useUserStore } from '@/store/userStore';
import { useDealerStore } from '@/store/dealerStore';
import { useCurrencyStore } from '@/store/currencyStore';
import { useToastStore } from '@/store/toastStore';
import { formatPrice } from '@/utils/format';
import { useSeo } from '@/hooks/useSeo';

export default function DealerProfilePage() {
  useSeo({
    title: 'Dealer Business Profile & Tax Compliance | AFRO & CO.',
    description: 'Corporate business profile, registered Tax ID, VAT exemption credentials, and authorized distribution points.',
  });

  const { user } = useUserStore();
  const { dealers, updateDealer } = useDealerStore();
  const { currentCurrency } = useCurrencyStore();
  const toast = useToastStore();

  const currentDealer = user?.dealerProfile || dealers.find((d) => d.email === user?.email) || dealers[0];

  const [companyName, setCompanyName] = useState(currentDealer?.companyName || '');
  const [contactPerson, setContactPerson] = useState(currentDealer?.contactPerson || '');
  const [email, setEmail] = useState(currentDealer?.email || '');
  const [phone, setPhone] = useState(currentDealer?.phone || '');
  const [website, setWebsite] = useState(currentDealer?.website || '');
  const [address, setAddress] = useState(currentDealer?.address || '');
  const [city, setCity] = useState(currentDealer?.city || '');
  const [state, setState] = useState(currentDealer?.state || '');
  const [country, setCountry] = useState(currentDealer?.country || '');
  const [taxId, setTaxId] = useState(currentDealer?.taxId || '');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentDealer?.id) {
      updateDealer(currentDealer.id, {
        companyName,
        contactPerson,
        email,
        phone,
        website,
        address,
        city,
        state,
        country,
        taxId,
      });
    }
    toast.success('Profile updated', 'Your corporate dealer details have been saved.');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--color-noir-gold)]">
          Corporate Entity
        </span>
        <h1 className="font-heading text-2xl font-bold text-[var(--text-primary)]">
          Dealer Profile &amp; Compliance Details
        </h1>
        <p className="mt-1 text-xs text-[var(--text-secondary)]">
          Manage your business entity information, tax exemption documents, and logistics contact points.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        {/* Main Profile Form */}
        <form
          onSubmit={handleSave}
          className="space-y-6 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 shadow-sm"
        >
          <div className="flex items-center gap-2 border-b border-[var(--border-color)] pb-4 text-xs font-bold uppercase tracking-wider text-[var(--color-noir-gold)]">
            <Building2 className="h-4 w-4" />
            <span>Legal Business Entity Information</span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-semibold text-[var(--text-secondary)]">
                Registered Legal Company Name
              </label>
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full rounded-md border border-[var(--border-color)] bg-[var(--bg-primary)] px-3 py-2 text-xs text-[var(--text-primary)] focus:border-[var(--color-noir-gold)] focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-[var(--text-secondary)]">
                Tax ID / VAT / GSTIN Number
              </label>
              <input
                type="text"
                required
                value={taxId}
                onChange={(e) => setTaxId(e.target.value)}
                className="w-full rounded-md border border-[var(--border-color)] bg-[var(--bg-primary)] px-3 py-2 font-mono text-xs text-[var(--text-primary)] focus:border-[var(--color-noir-gold)] focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-[var(--text-secondary)]">
                Company Website
              </label>
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full rounded-md border border-[var(--border-color)] bg-[var(--bg-primary)] px-3 py-2 text-xs text-[var(--text-primary)] focus:border-[var(--color-noir-gold)] focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-[var(--text-secondary)]">
                Authorized Contact Person
              </label>
              <input
                type="text"
                required
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                className="w-full rounded-md border border-[var(--border-color)] bg-[var(--bg-primary)] px-3 py-2 text-xs text-[var(--text-primary)] focus:border-[var(--color-noir-gold)] focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-[var(--text-secondary)]">
                Official Business Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border border-[var(--border-color)] bg-[var(--bg-primary)] px-3 py-2 text-xs text-[var(--text-primary)] focus:border-[var(--color-noir-gold)] focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-[var(--text-secondary)]">
                Direct Phone / WhatsApp
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-md border border-[var(--border-color)] bg-[var(--bg-primary)] px-3 py-2 text-xs text-[var(--text-primary)] focus:border-[var(--color-noir-gold)] focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-[var(--text-secondary)]">
                Country
              </label>
              <input
                type="text"
                required
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full rounded-md border border-[var(--border-color)] bg-[var(--bg-primary)] px-3 py-2 text-xs text-[var(--text-primary)] focus:border-[var(--color-noir-gold)] focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-semibold text-[var(--text-secondary)]">
                Corporate Headquarters / Warehouse Street Address
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full rounded-md border border-[var(--border-color)] bg-[var(--bg-primary)] px-3 py-2 text-xs text-[var(--text-primary)] focus:border-[var(--color-noir-gold)] focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-[var(--text-secondary)]">City</label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full rounded-md border border-[var(--border-color)] bg-[var(--bg-primary)] px-3 py-2 text-xs text-[var(--text-primary)] focus:border-[var(--color-noir-gold)] focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-[var(--text-secondary)]">
                State / Province / Region
              </label>
              <input
                type="text"
                required
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full rounded-md border border-[var(--border-color)] bg-[var(--bg-primary)] px-3 py-2 text-xs text-[var(--text-primary)] focus:border-[var(--color-noir-gold)] focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-[var(--border-color)]">
            <Button type="submit" variant="primary">
              <Save className="mr-1.5 h-3.5 w-3.5" /> Save Corporate Details
            </Button>
          </div>
        </form>

        {/* Account Status Card */}
        <div className="space-y-4">
          <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5">
            <div className="flex items-center gap-2 text-emerald-500 font-bold text-xs uppercase tracking-wider">
              <FileCheck2 className="h-4 w-4" />
              <span>Verification Status</span>
            </div>
            <div className="mt-3 space-y-2 text-xs text-[var(--text-secondary)]">
              <p className="flex items-center justify-between">
                <span>Account Status:</span>
                <span className="font-bold text-emerald-500 uppercase">{currentDealer?.status}</span>
              </p>
              <p className="flex items-center justify-between">
                <span>Partner Tier:</span>
                <span className="font-bold uppercase text-[var(--color-noir-gold)]">
                  {currentDealer?.tier} ({Math.round((currentDealer?.discountRate || 0.25) * 100)}% off)
                </span>
              </p>
              <p className="flex items-center justify-between">
                <span>Credit Facility:</span>
                <span className="font-mono font-bold text-[var(--text-primary)]">
                  {formatPrice(currentDealer?.creditLimit || 50000, currentCurrency)}
                </span>
              </p>
              <p className="flex items-center justify-between">
                <span>Payment Terms:</span>
                <span className="font-bold uppercase text-[var(--text-primary)]">
                  {currentDealer?.paymentTerms || 'Net-30'}
                </span>
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5 text-xs text-[var(--text-secondary)] leading-relaxed">
            <p className="font-bold uppercase tracking-wider text-[var(--text-muted)] text-[10px] mb-2">
              Atelier Support
            </p>
            <p>
              Need to adjust your credit line or add authorized buyers to your account? Contact your dedicated AFRO &amp; CO. wholesale representative at:
            </p>
            <p className="mt-2 font-semibold text-[var(--text-primary)]">
              wholesale@afro.co &bull; +1 (800) 555-NOIR
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
