import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Currency } from '@/types';

export interface CurrencyConfig {
  code: Currency;
  name: string;
  symbol: string;
  flag: string;
  country: string;
  locale: string;
  defaultRate: number; // 1 USD = X Currency
}

export const SUPPORTED_CURRENCIES: CurrencyConfig[] = [
  {
    code: 'USD',
    name: 'US Dollar',
    symbol: '$',
    flag: '🇺🇸',
    country: 'United States',
    locale: 'en-US',
    defaultRate: 1.0,
  },
  {
    code: 'INR',
    name: 'Indian Rupee',
    symbol: '₹',
    flag: '🇮🇳',
    country: 'India',
    locale: 'en-IN',
    defaultRate: 83.5,
  },
  {
    code: 'AED',
    name: 'UAE Dirham',
    symbol: 'AED',
    flag: '🇦🇪',
    country: 'United Arab Emirates',
    locale: 'en-AE',
    defaultRate: 3.67,
  },
  {
    code: 'EUR',
    name: 'Euro',
    symbol: '€',
    flag: '🇪🇺',
    country: 'European Union',
    locale: 'de-DE',
    defaultRate: 0.92,
  },
  {
    code: 'GBP',
    name: 'British Pound',
    symbol: '£',
    flag: '🇬🇧',
    country: 'United Kingdom',
    locale: 'en-GB',
    defaultRate: 0.79,
  },
  {
    code: 'SAR',
    name: 'Saudi Riyal',
    symbol: 'SAR',
    flag: '🇸🇦',
    country: 'Saudi Arabia',
    locale: 'ar-SA',
    defaultRate: 3.75,
  },
  {
    code: 'CAD',
    name: 'Canadian Dollar',
    symbol: 'CA$',
    flag: '🇨🇦',
    country: 'Canada',
    locale: 'en-CA',
    defaultRate: 1.36,
  },
  {
    code: 'AUD',
    name: 'Australian Dollar',
    symbol: 'A$',
    flag: '🇦🇺',
    country: 'Australia',
    locale: 'en-AU',
    defaultRate: 1.52,
  },
  {
    code: 'JPY',
    name: 'Japanese Yen',
    symbol: '¥',
    flag: '🇯🇵',
    country: 'Japan',
    locale: 'ja-JP',
    defaultRate: 152.0,
  },
];

const DEFAULT_RATES: Record<Currency, number> = SUPPORTED_CURRENCIES.reduce(
  (acc, curr) => ({ ...acc, [curr.code]: curr.defaultRate }),
  {} as Record<Currency, number>
);

interface CurrencyState {
  currentCurrency: Currency;
  rates: Record<Currency, number>;
  // Actions
  setCurrency: (currency: Currency) => void;
  updateRate: (currency: Currency, rate: number) => void;
  resetRates: () => void;
  getCurrencyInfo: (code?: Currency) => CurrencyConfig;
  convert: (amountInUSD: number, targetCurrency?: Currency) => number;
}

export const useCurrencyStore = create<CurrencyState>()(
  persist(
    (set, get) => ({
      currentCurrency: 'USD',
      rates: DEFAULT_RATES,

      setCurrency: (currency) => set({ currentCurrency: currency }),

      updateRate: (currency, rate) =>
        set((state) => ({
          rates: {
            ...state.rates,
            [currency]: rate,
          },
        })),

      resetRates: () => set({ rates: DEFAULT_RATES }),

      getCurrencyInfo: (code) => {
        const target = code || get().currentCurrency;
        return (
          SUPPORTED_CURRENCIES.find((c) => c.code === target) || SUPPORTED_CURRENCIES[0]
        );
      },

      convert: (amountInUSD, targetCurrency) => {
        const cur = targetCurrency || get().currentCurrency;
        const rate = get().rates[cur] ?? 1.0;
        return amountInUSD * rate;
      },
    }),
    {
      name: 'afro-currency-store',
    }
  )
);
