import { useCurrencyStore } from '@/store/currencyStore';
import type { Currency } from '@/types';

export const formatPrice = (
  price: number,
  currency?: string,
  autoConvert: boolean = true
): string => {
  const store = useCurrencyStore.getState();
  const current = store.currentCurrency || 'USD';
  const targetCode = (currency && currency !== 'USD' ? currency : current) as Currency;
  const info = store.getCurrencyInfo(targetCode);

  let finalAmount = price;
  // If price is base USD and target currency is different, auto-convert
  if (autoConvert && (!currency || currency === 'USD') && current !== 'USD') {
    const rate = store.rates[current] ?? 1.0;
    finalAmount = price * rate;
  }

  try {
    return new Intl.NumberFormat(info.locale, {
      style: 'currency',
      currency: info.code,
      minimumFractionDigits: info.code === 'JPY' ? 0 : 2,
      maximumFractionDigits: info.code === 'JPY' ? 0 : 2,
    }).format(finalAmount);
  } catch {
    return `${info.symbol}${finalAmount.toFixed(2)}`;
  }
};

export const formatPriceCompact = (
  price: number,
  currency?: string,
  autoConvert: boolean = true
): string => {
  const store = useCurrencyStore.getState();
  const current = store.currentCurrency || 'USD';
  const targetCode = (currency && currency !== 'USD' ? currency : current) as Currency;
  const info = store.getCurrencyInfo(targetCode);

  let finalAmount = price;
  if (autoConvert && (!currency || currency === 'USD') && current !== 'USD') {
    const rate = store.rates[current] ?? 1.0;
    finalAmount = price * rate;
  }

  try {
    return new Intl.NumberFormat(info.locale, {
      style: 'currency',
      currency: info.code,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(finalAmount);
  } catch {
    return `${info.symbol}${Math.round(finalAmount)}`;
  }
};

export const formatDate = (date: string | Date, format: 'short' | 'long' = 'short'): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  if (format === 'long') {
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

export const formatDateTime = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US').format(num);
};

export const formatCompactNumber = (num: number): string => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

export const truncate = (text: string, maxLength: number): string =>
  text.length <= maxLength ? text : `${text.slice(0, maxLength).trim()}…`;

export const slugify = (text: string): string =>
  text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const generateOrderNumber = (): string =>
  `NC-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

export const generateTrackingNumber = (): string =>
  `1Z${Math.random().toString(36).slice(2, 12).toUpperCase()}`;

export const pluralize = (count: number, singular: string, plural?: string): string =>
  count === 1 ? singular : plural ?? `${singular}s`;

export const isEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);
