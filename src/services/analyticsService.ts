import type { AdminChartDataPoint, AdminStats } from '@/types';

/**
 * Analytics service (demo) — supplies the admin dashboard datasets.
 *
 * Production contract:
 *   GET /api/admin/analytics?from&to&granularity -> { stats, series }
 */

const LATENCY = 300;
const delay = <T,>(value: T, ms = LATENCY): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

// Deterministic pseudo-random series so charts look realistic and stay stable.
const seededSeries = (days: number, base: number, variance: number): AdminChartDataPoint[] => {
  const out: AdminChartDataPoint[] = [];
  const today = new Date();
  let seed = 42;
  const rand = () => {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    return seed / 2147483648;
  };
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const weekend = d.getDay() === 0 || d.getDay() === 6;
    const seasonal = weekend ? 0.72 : 1;
    const trend = 1 + (days - i) / (days * 6);
    const revenue = Math.round(base * seasonal * trend * (0.75 + rand() * variance));
    out.push({
      date: d.toISOString().slice(0, 10),
      revenue,
      orders: Math.round(revenue / 165),
      visitors: Math.round(revenue * (2.4 + rand())),
    });
  }
  return out;
};

const RANGE_DAYS: Record<string, number> = {
  '7d': 7,
  '30d': 30,
  '90d': 90,
  '12m': 365,
};

export const analyticsService = {
  async getStats(range: string = '30d'): Promise<AdminStats> {
    const series = seededSeries(RANGE_DAYS[range] ?? 30, 4200, 0.55);
    const totalRevenue = series.reduce((s, d) => s + d.revenue, 0);
    const totalOrders = series.reduce((s, d) => s + d.orders, 0);
    return delay({
      totalRevenue,
      revenueChange: 12.4,
      totalOrders,
      ordersChange: 8.1,
      totalCustomers: 2847,
      customersChange: 15.3,
      averageOrderValue: totalOrders > 0 ? Math.round((totalRevenue / totalOrders) * 100) / 100 : 0,
      aovChange: 4.2,
    });
  },

  async getSeries(range: string = '30d'): Promise<AdminChartDataPoint[]> {
    return delay(seededSeries(RANGE_DAYS[range] ?? 30, 4200, 0.55));
  },

  async getRevenueByCategory(): Promise<{ name: string; value: number }[]> {
    return delay([
      { name: 'Clothing', value: 38400 },
      { name: 'Shoes', value: 24100 },
      { name: 'Bags', value: 19800 },
      { name: 'Watches', value: 15200 },
      { name: 'Home', value: 12400 },
      { name: 'Beauty', value: 9800 },
      { name: 'Electronics', value: 7600 },
    ]);
  },

  async getOrderStatusBreakdown(): Promise<{ name: string; value: number }[]> {
    return delay([
      { name: 'Delivered', value: 68 },
      { name: 'Shipped', value: 17 },
      { name: 'Processing', value: 9 },
      { name: 'Pending', value: 4 },
      { name: 'Cancelled', value: 2 },
    ]);
  },

  async getBestSellingProducts(): Promise<{ id: string; name: string; sales: number; revenue: number }[]> {
    return delay([
      { id: 'prod-004', name: 'Cashmere Crewneck Sweater', sales: 214, revenue: 89880 },
      { id: 'prod-001', name: 'Structured Wool Blend Overcoat', sales: 156, revenue: 108420 },
      { id: 'prod-022', name: 'Premium Wireless Over-Ear Headphones', sales: 142, revenue: 49558 },
      { id: 'prod-006', name: 'Minimalist Leather Sneakers', sales: 131, revenue: 45195 },
      { id: 'prod-020', name: 'Signature Unisex Eau de Parfum', sales: 118, revenue: 23010 },
      { id: 'prod-009', name: 'Structured Leather Tote', sales: 96, revenue: 57120 },
    ]);
  },
};
