import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToastStore } from '@/store/toastStore';

export default function AdminSettings() {
  const toast = useToastStore();
  const [storeName, setStoreName] = useState('AFRO & CO. Haute Atelier');
  const [supportEmail, setSupportEmail] = useState('concierge@afro.co');
  const [currency, setCurrency] = useState('USD');
  const [taxRate, setTaxRate] = useState('8.0');
  const [freeShippingThreshold, setFreeShippingThreshold] = useState('200');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Configuration Saved', 'Atelier operational parameters updated successfully.');
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="font-heading text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
          System &amp; Parameters
        </p>
        <h1 className="mt-1 font-heading text-3xl font-extrabold text-[var(--text-primary)]">
          Store Settings
        </h1>
      </div>

      <form onSubmit={handleSave} className="max-w-2xl space-y-6">
        <div className="border border-[var(--border-color)] bg-[var(--bg-card)] p-6 sm:p-8 space-y-5">
          <h2 className="font-heading text-sm font-bold uppercase tracking-wider text-[var(--text-primary)]">
            General Store Configuration
          </h2>

          <div>
            <label className="mb-1 block font-heading text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
              Store &amp; Atelier Brand Name
            </label>
            <Input value={storeName} onChange={(e) => setStoreName(e.target.value)} />
          </div>

          <div>
            <label className="mb-1 block font-heading text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
              Client Support Dispatch Email
            </label>
            <Input value={supportEmail} onChange={(e) => setSupportEmail(e.target.value)} />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="mb-1 block font-heading text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                Default Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full border border-[var(--border-color)] bg-[var(--bg-primary)] px-3 py-2 text-xs text-[var(--text-primary)]"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block font-heading text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                Sales Tax Rate (%)
              </label>
              <Input value={taxRate} onChange={(e) => setTaxRate(e.target.value)} />
            </div>
            <div>
              <label className="mb-1 block font-heading text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                Free Shipping ($)
              </label>
              <Input
                value={freeShippingThreshold}
                onChange={(e) => setFreeShippingThreshold(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div>
          <Button type="submit" size="lg" className="uppercase tracking-[0.2em]">
            Save Settings
          </Button>
        </div>
      </form>
    </div>
  );
}
