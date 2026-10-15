import { useState, useEffect } from 'react';
import {
  Globe,
  Coins,
  RefreshCw,
  Check,
  Building,
  Mail,
  Percent,
  Truck,
  Palette,
  Sparkles,
  RotateCcw,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToastStore } from '@/store/toastStore';
import { useCurrencyStore, SUPPORTED_CURRENCIES } from '@/store/currencyStore';
import { useBrandStore, BRAND_COLOR_PRESETS } from '@/store/brandStore';
import { formatPrice } from '@/utils/format';
import type { Currency } from '@/types';

export default function AdminSettings() {
  const toast = useToastStore();
  const { currentCurrency, rates, setCurrency, updateRate, resetRates, getCurrencyInfo } =
    useCurrencyStore();

  // Dynamic Brand & Color Theme Store
  const {
    siteName,
    siteSubtitle,
    primaryColor,
    activePresetId,
    setSiteName,
    setSiteSubtitle,
    setPrimaryColor,
    resetBrandSettings,
  } = useBrandStore();

  const [tempSiteName, setTempSiteName] = useState(siteName);
  const [tempSiteSubtitle, setTempSiteSubtitle] = useState(siteSubtitle);
  const [customHex, setCustomHex] = useState(primaryColor);

  useEffect(() => {
    setTempSiteName(siteName);
    setTempSiteSubtitle(siteSubtitle);
    setCustomHex(primaryColor);
  }, [siteName, siteSubtitle, primaryColor]);

  const [storeName, setStoreName] = useState(siteName);
  const [supportEmail, setSupportEmail] = useState('concierge@afro.co');
  const [taxRate, setTaxRate] = useState('8.0');
  const [freeShippingThreshold, setFreeShippingThreshold] = useState('200');

  // Simulation test amount in USD
  const [simAmountUSD, setSimAmountUSD] = useState(100);

  const handleApplyBrandIdentity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempSiteName.trim()) {
      toast.error('Validation Error', 'Storefront name cannot be empty.');
      return;
    }
    setSiteName(tempSiteName.trim());
    setSiteSubtitle(tempSiteSubtitle.trim());
    setStoreName(tempSiteName.trim());
    toast.success(
      'Brand Identity Saved',
      `Storefront title updated to "${tempSiteName.trim()}". Changes are live across all pages.`
    );
  };

  const handleSelectPreset = (preset: (typeof BRAND_COLOR_PRESETS)[0]) => {
    setPrimaryColor(preset.hex, preset.id);
    setCustomHex(preset.hex);
    toast.success(
      'Theme Palette Activated',
      `${preset.name} (${preset.hex}) applied to buttons, accents, borders, and gradients.`
    );
  };

  const handleCustomColorChange = (hex: string) => {
    setCustomHex(hex);
    if (/^#[0-9A-Fa-f]{6}$/.test(hex)) {
      setPrimaryColor(hex, 'custom');
    }
  };

  const handleResetBrand = () => {
    resetBrandSettings();
    setTempSiteName('AFRO & CO.');
    setTempSiteSubtitle('Haute Atelier & Luxury Goods');
    setCustomHex('#C8A97E');
    toast.info('Default Brand Restored', 'Restored Imperial Gold and AFRO & CO. identity.');
  };

  const handleCurrencySelect = (code: Currency) => {
    setCurrency(code);
    const info = getCurrencyInfo(code);
    toast.success(
      'Store Currency Updated',
      `Active catalog and order pricing is now displayed in ${info.flag} ${info.name} (${info.code}).`
    );
  };

  const handleRateChange = (code: Currency, newRateStr: string) => {
    const val = parseFloat(newRateStr);
    if (!isNaN(val) && val > 0) {
      updateRate(code, val);
    }
  };

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    if (storeName !== siteName) {
      setSiteName(storeName);
      setTempSiteName(storeName);
    }
    toast.success('Configuration Saved', 'Atelier operational parameters updated successfully.');
  };

  const activeInfo = getCurrencyInfo(currentCurrency);

  return (
    <div className="space-y-10">
      {/* Page Title */}
      <div>
        <p className="font-heading text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--color-noir-gold)]">
          Atelier System &amp; Global Operations
        </p>
        <h1 className="mt-1 font-heading text-3xl font-extrabold text-[var(--text-primary)]">
          Store Settings &amp; Multi-Currency
        </h1>
        <p className="mt-1 text-xs text-[var(--text-muted)]">
          Configure regional currencies (India INR ₹, UAE AED, US Dollar $, Euro €, etc.), live exchange rates, and store parameters.
        </p>
      </div>

      {/* ─── BRAND IDENTITY & THEME COLOR STUDIO ─── */}
      <div className="border border-[var(--border-color)] bg-[var(--bg-card)] p-6 sm:p-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border-color)] pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--bg-secondary)] text-[var(--color-noir-gold)]">
              <Palette className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-heading text-sm font-bold uppercase tracking-wider text-[var(--text-primary)]">
                  Brand Identity &amp; Theme Color Studio
                </h2>
                <span className="flex items-center gap-1 rounded bg-[var(--color-noir-gold)]/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-[var(--color-noir-gold)]">
                  <Sparkles className="h-2.5 w-2.5" /> Live Reflection
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)]">
                Personalize your storefront name and select your bespoke color palette. Instantly reflects across navigation, buttons, badges, and headers.
              </p>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleResetBrand}
            className="text-[10px] uppercase tracking-wider gap-1.5"
          >
            <RotateCcw className="h-3 w-3" />
            Reset Theme
          </Button>
        </div>

        <div className="grid gap-8 lg:grid-cols-12">
          {/* Brand Name & Palette Selector */}
          <div className="space-y-6 lg:col-span-7">
            <form onSubmit={handleApplyBrandIdentity} className="space-y-4">
              <div>
                <label className="mb-1 block font-heading text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                  Storefront Name (Header, Footer, Tab Titles &amp; SEO)
                </label>
                <div className="flex gap-2">
                  <Input
                    value={tempSiteName}
                    onChange={(e) => setTempSiteName(e.target.value)}
                    placeholder="e.g. NOIR & CO., AURA ATELIER, LUXE STUDIO"
                    className="flex-1 font-heading font-semibold"
                  />
                  <Button type="submit" size="sm" className="shrink-0 uppercase tracking-wider text-[11px]">
                    Apply Name
                  </Button>
                </div>
              </div>

              <div>
                <label className="mb-1 block font-heading text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                  Brand Tagline / Atelier Subtitle
                </label>
                <Input
                  value={tempSiteSubtitle}
                  onChange={(e) => setTempSiteSubtitle(e.target.value)}
                  placeholder="e.g. Haute Atelier & Luxury Goods"
                  className="text-xs"
                />
              </div>
            </form>

            {/* Curated Color Presets */}
            <div>
              <div className="mb-3 flex items-center justify-between">
                <label className="font-heading text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                  Curated Luxury Color Palettes
                </label>
                <span className="text-[10px] text-[var(--text-muted)]">
                  Active: <strong className="text-[var(--color-noir-gold)]">{primaryColor.toUpperCase()}</strong>
                </span>
              </div>

              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {BRAND_COLOR_PRESETS.map((preset) => {
                  const isActive = activePresetId === preset.id || primaryColor.toLowerCase() === preset.hex.toLowerCase();
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleSelectPreset(preset)}
                      className={`flex items-center gap-3 border p-3 text-left transition-all ${
                        isActive
                          ? 'border-[var(--color-noir-gold)] bg-[var(--color-noir-gold)]/10 shadow-sm'
                          : 'border-[var(--border-color)] bg-[var(--bg-secondary)] hover:border-[var(--text-secondary)]'
                      }`}
                    >
                      <div
                        className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full shadow"
                        style={{ backgroundColor: preset.hex }}
                      >
                        {isActive && <Check className="h-4 w-4 text-white drop-shadow" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-heading text-xs font-bold text-[var(--text-primary)]">
                            {preset.name}
                          </span>
                          <span className="font-mono text-[10px] text-[var(--text-muted)]">{preset.hex}</span>
                        </div>
                        <p className="truncate text-[10px] text-[var(--text-muted)]">{preset.description}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Hex Color Picker */}
            <div className="border border-[var(--border-color)] bg-[var(--bg-secondary)] p-4">
              <label className="mb-2 block font-heading text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                Custom Bespoke Hex Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={/^#[0-9A-Fa-f]{6}$/.test(customHex) ? customHex : primaryColor}
                  onChange={(e) => handleCustomColorChange(e.target.value)}
                  className="h-10 w-12 cursor-pointer border border-[var(--border-color)] bg-transparent p-1"
                  aria-label="Color Picker"
                />
                <Input
                  value={customHex}
                  onChange={(e) => handleCustomColorChange(e.target.value)}
                  placeholder="#C8A97E"
                  maxLength={7}
                  className="w-36 font-mono text-sm uppercase"
                />
                <span className="text-xs text-[var(--text-muted)]">
                  Pick any custom brand color or enter your company's hex code.
                </span>
              </div>
            </div>
          </div>

          {/* Live Real-Time Store Preview Card */}
          <div className="lg:col-span-5">
            <label className="mb-2 block font-heading text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
              Live Theme Preview (Real-Time)
            </label>
            <div className="overflow-hidden border border-[var(--border-color)] bg-[var(--bg-primary)] p-5 shadow-lg space-y-4">
              {/* Mock Header */}
              <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
                <span className="font-heading text-lg font-black tracking-[-0.02em] text-[var(--text-primary)]">
                  {tempSiteName || 'STORE NAME'}
                </span>
                <span className="rounded border border-[var(--color-noir-gold)]/40 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-widest text-[var(--color-noir-gold)]">
                  Atelier
                </span>
              </div>

              {/* Sample Product Card */}
              <div className="border border-[var(--border-color)] bg-[var(--bg-secondary)] p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                    Limited Edition
                  </span>
                  <span className="font-mono text-xs font-bold text-[var(--color-noir-gold)]">
                    {formatPrice(480, currentCurrency)}
                  </span>
                </div>
                <h4 className="font-heading text-sm font-bold text-[var(--text-primary)]">
                  Monogram Heritage Chronograph
                </h4>
                <p className="text-[11px] text-[var(--text-muted)]">
                  {tempSiteSubtitle || 'Exquisite artisanal craftsmanship.'}
                </p>

                {/* Primary Action Button */}
                <Button
                  type="button"
                  className="w-full uppercase tracking-wider text-[10px] py-2"
                >
                  Add To Luxury Bag
                </Button>
              </div>

              {/* Live Info Banner */}
              <div className="rounded bg-[var(--bg-secondary)] p-3 text-center">
                <p className="text-[11px] text-[var(--text-muted)]">
                  Color variable <code className="font-mono text-[var(--color-noir-gold)]">--color-noir-gold</code> is bound to{' '}
                  <strong className="text-[var(--text-primary)] font-mono">{primaryColor}</strong>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── CURRENCY & REGIONAL MARKET CONFIGURATION ─── */}
      <div className="border border-[var(--border-color)] bg-[var(--bg-card)] p-6 sm:p-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border-color)] pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--bg-secondary)] text-[var(--color-noir-gold)]">
              <Globe className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-heading text-sm font-bold uppercase tracking-wider text-[var(--text-primary)]">
                Global Currency &amp; Regional Localization
              </h2>
              <p className="text-xs text-[var(--text-muted)]">
                Active Store Currency:{' '}
                <strong className="text-[var(--color-noir-gold)]">
                  {activeInfo.flag} {activeInfo.name} ({activeInfo.code} - {activeInfo.symbol})
                </strong>
              </p>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              resetRates();
              toast.info('Benchmark Rates Restored', 'All currency exchange rates reset to market standards.');
            }}
            className="text-[10px] uppercase tracking-wider gap-1.5"
          >
            <RefreshCw className="h-3 w-3" />
            <span>Reset Market Rates</span>
          </Button>
        </div>

        {/* Currency Selector Grid */}
        <div>
          <label className="mb-2 block font-heading text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
            Select Active Default Currency (Applies Globally Across Storefront, Cart &amp; Admin):
          </label>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {SUPPORTED_CURRENCIES.map((curr) => {
              const isSelected = currentCurrency === curr.code;
              return (
                <button
                  key={curr.code}
                  type="button"
                  onClick={() => handleCurrencySelect(curr.code)}
                  className={`flex flex-col items-start rounded border p-3 text-left transition-all ${
                    isSelected
                      ? 'border-[var(--color-noir-gold)] bg-[var(--color-noir-gold)]/10 shadow-sm ring-1 ring-[var(--color-noir-gold)]'
                      : 'border-[var(--border-color)] bg-[var(--bg-primary)] hover:border-[var(--text-muted)]'
                  }`}
                >
                  <div className="flex w-full items-center justify-between">
                    <span className="text-xl">{curr.flag}</span>
                    {isSelected && (
                      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[var(--color-noir-gold)] text-black">
                        <Check className="h-2.5 w-2.5" />
                      </span>
                    )}
                  </div>
                  <div className="mt-2">
                    <p className="font-heading text-xs font-bold text-[var(--text-primary)]">
                      {curr.code} ({curr.symbol})
                    </p>
                    <p className="text-[11px] text-[var(--text-muted)] line-clamp-1">{curr.name}</p>
                    <p className="font-mono text-[10px] text-[var(--color-noir-gold)] mt-1">
                      1 USD = {rates[curr.code]} {curr.code}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Live Conversion Simulator */}
        <div className="border border-[var(--border-color)] bg-[var(--bg-secondary)] p-4 sm:p-5">
          <div className="flex items-center gap-2 mb-3">
            <Coins className="h-4 w-4 text-[var(--color-noir-gold)]" />
            <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
              Real-Time Conversion Calculator &amp; Preview
            </h3>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 items-center">
            <div>
              <label className="mb-1 block font-heading text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                Base Amount in US Dollars ($ USD)
              </label>
              <div className="relative">
                <Input
                  type="number"
                  min="1"
                  step="1"
                  value={simAmountUSD}
                  onChange={(e) => setSimAmountUSD(Math.max(1, parseFloat(e.target.value) || 0))}
                  className="font-mono text-sm"
                />
              </div>
            </div>

            <div className="border border-[var(--border-color)] bg-[var(--bg-card)] p-3">
              <span className="block font-heading text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                Storefront Display in {activeInfo.name} ({activeInfo.code}):
              </span>
              <p className="mt-1 font-heading text-2xl font-bold text-[var(--color-noir-gold)]">
                {formatPrice(simAmountUSD, activeInfo.code)}
              </p>
              <p className="font-mono text-[10px] text-[var(--text-muted)] mt-0.5">
                Conversion factor: 1 USD = {rates[activeInfo.code]} {activeInfo.code}
              </p>
            </div>
          </div>
        </div>

        {/* Exchange Rates Management Table */}
        <div>
          <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] mb-2">
            Customize Exchange Rates (1 USD = [Rate] in Foreign Currency)
          </h3>
          <p className="text-xs text-[var(--text-muted)] mb-3">
            Fine-tune custom conversion rates for Indian Rupee (INR), UAE Dirham (AED), Euro, etc.
          </p>

          <div className="overflow-x-auto border border-[var(--border-color)]">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[var(--border-color)] bg-[var(--bg-secondary)] font-heading text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                <tr>
                  <th className="px-4 py-2.5">Region &amp; Country</th>
                  <th className="px-4 py-2.5">Currency</th>
                  <th className="px-4 py-2.5">Symbol</th>
                  <th className="px-4 py-2.5">Exchange Rate (vs $1.00 USD)</th>
                  <th className="px-4 py-2.5 text-right">Preview for $100</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)]">
                {SUPPORTED_CURRENCIES.map((curr) => {
                  return (
                    <tr
                      key={curr.code}
                      className={currentCurrency === curr.code ? 'bg-[var(--color-noir-gold)]/5' : ''}
                    >
                      <td className="px-4 py-3 font-medium flex items-center gap-2">
                        <span className="text-base">{curr.flag}</span>
                        <span>{curr.country}</span>
                      </td>
                      <td className="px-4 py-3 font-mono font-bold text-[var(--text-primary)]">
                        {curr.code}
                      </td>
                      <td className="px-4 py-3 font-mono text-[var(--color-noir-gold)]">
                        {curr.symbol}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 max-w-[160px]">
                          <span className="text-[11px] font-mono text-[var(--text-muted)]">1 USD =</span>
                          <Input
                            type="number"
                            step="0.01"
                            disabled={curr.code === 'USD'}
                            value={rates[curr.code]}
                            onChange={(e) => handleRateChange(curr.code, e.target.value)}
                            className="font-mono text-xs py-1 px-2 h-8"
                          />
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right font-heading font-bold text-[var(--text-primary)]">
                        {formatPrice(100, curr.code)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ─── GENERAL ATELIER SETTINGS ─── */}
      <form onSubmit={handleSaveGeneral} className="max-w-2xl space-y-6">
        <div className="border border-[var(--border-color)] bg-[var(--bg-card)] p-6 sm:p-8 space-y-5">
          <div className="flex items-center gap-3 border-b border-[var(--border-color)] pb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--bg-secondary)] text-[var(--color-noir-gold)]">
              <Building className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-heading text-sm font-bold uppercase tracking-wider text-[var(--text-primary)]">
                General Store Identity &amp; Tax Policy
              </h2>
              <p className="text-xs text-[var(--text-muted)]">
                Atelier brand nomenclature, concierge email, and complimentary shipping limits.
              </p>
            </div>
          </div>

          <div>
            <label className="mb-1 block font-heading text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
              Store &amp; Atelier Brand Name
            </label>
            <Input value={storeName} onChange={(e) => setStoreName(e.target.value)} />
          </div>

          <div>
            <label className="mb-1 block font-heading text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
              Client Concierge Dispatch Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-[var(--text-muted)]" />
              <Input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block font-heading text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                Standard Sales Tax Rate (%)
              </label>
              <div className="relative">
                <Percent className="absolute left-3 top-2.5 h-4 w-4 text-[var(--text-muted)]" />
                <Input
                  value={taxRate}
                  onChange={(e) => setTaxRate(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block font-heading text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                Complimentary Shipping Threshold ({activeInfo.symbol})
              </label>
              <div className="relative">
                <Truck className="absolute left-3 top-2.5 h-4 w-4 text-[var(--text-muted)]" />
                <Input
                  value={freeShippingThreshold}
                  onChange={(e) => setFreeShippingThreshold(e.target.value)}
                  className="pl-9"
                />
              </div>
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
