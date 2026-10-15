import type { Product } from '@/types';
import { products as allProducts } from '@/data/products';

/**
 * Search service (demo) — powers the search overlay autocomplete.
 *
 * Production contract:
 *   GET /api/search?q&limit -> { products, categories, brands, suggestions }
 */

const LATENCY = 90;
const delay = <T,>(value: T, ms = LATENCY): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

export interface SearchResult {
  products: Product[];
  categories: { name: string; slug: string; count: number }[];
  brands: { name: string; count: number }[];
  suggestions: string[];
  total: number;
}

const TRENDING_QUERIES = ['cashmere', 'overcoat', 'sneakers', 'perfume', 'tote bag', 'linen shirt'];

export const searchService = {
  async query(q: string, limit = 6): Promise<SearchResult> {
    const term = q.toLowerCase().trim();

    if (!term) {
      return delay({
        products: [],
        categories: [],
        brands: [],
        suggestions: TRENDING_QUERIES,
        total: 0,
      });
    }

    const matchedProducts = allProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.brand.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term) ||
        p.subcategory?.toLowerCase().includes(term) ||
        p.tags.some((t) => t.toLowerCase().includes(term))
    );

    const products = matchedProducts
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit);

    const categoryMap = new Map<string, number>();
    matchedProducts.forEach((p) =>
      categoryMap.set(p.category, (categoryMap.get(p.category) ?? 0) + 1)
    );

    const brandMap = new Map<string, number>();
    matchedProducts.forEach((p) => brandMap.set(p.brand, (brandMap.get(p.brand) ?? 0) + 1));

    const nameSuggestions = [...new Set(matchedProducts.map((p) => p.name))].slice(0, 5);

    return delay({
      products,
      categories: [...categoryMap.entries()].map(([name, count]) => ({ name, slug: name.toLowerCase(), count })),
      brands: [...brandMap.entries()].map(([name, count]) => ({ name, count })),
      suggestions: nameSuggestions.length ? nameSuggestions : TRENDING_QUERIES,
      total: matchedProducts.length,
    });
  },

  async trending(): Promise<string[]> {
    return delay(TRENDING_QUERIES);
  },
};
