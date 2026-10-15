import type { Product, PaginatedResponse } from '@/types';
import { useProductStore } from '@/store/productStore';

const getAllProducts = (): Product[] => useProductStore.getState().products;

/**
 * Product catalog service.
 *
 * This is a local mock implementation. To connect a real backend, replace the
 * function bodies with `fetch()` calls and keep the signatures identical.
 * The service is UI-agnostic and is consumed via TanStack Query hooks.
 */

const LATENCY = 220; // simulated network delay (ms)

const delay = <T,>(value: T, ms = LATENCY): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

export interface ProductQuery {
  category?: string;
  subcategory?: string;
  brands?: string[];
  colors?: string[];
  sizes?: string[];
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  onSale?: boolean;
  inStock?: boolean;
  search?: string;
  sort?: 'featured' | 'newest' | 'price-asc' | 'price-desc' | 'rating' | 'bestselling';
  page?: number;
  pageSize?: number;
}

const applyFilters = (source: Product[], query: ProductQuery): Product[] => {
  let result = [...source];

  if (query.category) {
    result = result.filter((p) => p.category.toLowerCase() === query.category!.toLowerCase());
  }

  if (query.subcategory) {
    result = result.filter(
      (p) => p.subcategory?.toLowerCase() === query.subcategory!.toLowerCase()
    );
  }

  if (query.brands?.length) {
    const brands = query.brands.map((b) => b.toLowerCase());
    result = result.filter((p) => brands.includes(p.brand.toLowerCase()));
  }

  if (query.colors?.length) {
    const colors = query.colors.map((c) => c.toLowerCase());
    result = result.filter((p) =>
      p.colors?.some((c) => colors.includes(c.name.toLowerCase()))
    );
  }

  if (query.sizes?.length) {
    const sizes = query.sizes.map((s) => s.toLowerCase());
    result = result.filter((p) =>
      p.sizes?.some((s) => sizes.includes(s.label.toLowerCase()) && s.available)
    );
  }

  if (query.minPrice !== undefined) {
    result = result.filter((p) => p.price >= query.minPrice!);
  }

  if (query.maxPrice !== undefined) {
    result = result.filter((p) => p.price <= query.maxPrice!);
  }

  if (query.minRating !== undefined) {
    result = result.filter((p) => p.rating >= query.minRating!);
  }

  if (query.onSale) {
    result = result.filter((p) => p.discount !== undefined && p.discount > 0);
  }

  if (query.inStock) {
    result = result.filter((p) => p.stock > 0);
  }

  if (query.search) {
    const q = query.search.toLowerCase().trim();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.subcategory?.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  return result;
};

const applySort = (source: Product[], sort?: ProductQuery['sort']): Product[] => {
  const result = [...source];
  switch (sort) {
    case 'newest':
      return result.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    case 'price-asc':
      return result.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return result.sort((a, b) => b.price - a.price);
    case 'rating':
      return result.sort((a, b) => b.rating - a.rating);
    case 'bestselling':
      return result.sort(
        (a, b) => b.reviewCount * b.rating - a.reviewCount * a.rating
      );
    case 'featured':
    default:
      // Featured: best sellers and new arrivals first, then by rating.
      const rank: Record<string, number> = {
        'best-seller': 3,
        trending: 2,
        new: 1,
        sale: 1,
        default: 0,
      };
      return result.sort((a, b) => {
        const diff = rank[b.status] - rank[a.status];
        return diff !== 0 ? diff : b.rating - a.rating;
      });
  }
};

export const productService = {
  /** Paginated, filtered, sorted product listing. */
  async list(query: ProductQuery = {}): Promise<PaginatedResponse<Product>> {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 12;

    let result = applyFilters(getAllProducts(), query);
    result = applySort(result, query.sort);

    const total = result.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const start = (page - 1) * pageSize;
    const data = result.slice(start, start + pageSize);

    return delay({ data, total, page, pageSize, totalPages });
  },

  async getBySlug(slug: string): Promise<Product | null> {
    const found = getAllProducts().find((p) => p.slug === slug);
    if (!found) return delay(null);
    return delay(found);
  },

  async getById(id: string): Promise<Product | null> {
    const found = getAllProducts().find((p) => p.id === id);
    return delay(found ?? null);
  },

  async getRelated(productId: string, category: string, limit = 4): Promise<Product[]> {
    const related = getAllProducts()
      .filter((p) => p.id !== productId && p.category === category)
      .slice(0, limit);
    return delay(related);
  },

  /** Products commonly bought with the given product (demo heuristic: same category). */
  async getFrequentlyBoughtTogether(productId: string, limit = 3): Promise<Product[]> {
    const product = getAllProducts().find((p) => p.id === productId);
    if (!product) return delay([]);
    const others = getAllProducts()
      .filter((p) => p.id !== productId && p.category === product.category)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit);
    return delay(others);
  },

  async getNewArrivals(limit = 8): Promise<Product[]> {
    return delay(
      applySort(
        getAllProducts().filter((p) => p.status === 'new'),
        'newest'
      ).slice(0, limit)
    );
  },

  async getBestSellers(limit = 8): Promise<Product[]> {
    return delay(
      applySort(
        getAllProducts().filter((p) => p.status === 'best-seller'),
        'bestselling'
      ).slice(0, limit)
    );
  },

  async getTrending(limit = 8): Promise<Product[]> {
    return delay(
      applySort(
        getAllProducts().filter((p) => p.status === 'trending'),
        'bestselling'
      ).slice(0, limit)
    );
  },

  async getOnSale(limit = 12): Promise<Product[]> {
    return delay(
      applySort(
        getAllProducts().filter((p) => p.discount !== undefined && p.discount > 0),
        'price-desc'
      ).slice(0, limit)
    );
  },

  async getFeatured(limit = 6): Promise<Product[]> {
    return delay(
      applySort(
        getAllProducts().filter((p) => p.status === 'best-seller' || p.status === 'new'),
        'bestselling'
      ).slice(0, limit)
    );
  },

  async getRecommendations(limit = 8): Promise<Product[]> {
    // Demo: a deterministic "personalized" mix based on rating and recency.
    return delay(
      applySort(
        [...getAllProducts()].filter((p) => p.rating >= 4.6),
        'newest'
      ).slice(0, limit)
    );
  },

  async getAll(): Promise<Product[]> {
    return delay(getAllProducts());
  },

  /** Facet counts for building filter UI. */
  async getFacets(): Promise<{
    brands: { value: string; count: number }[];
    colors: { value: string; count: number }[];
    sizes: { value: string; count: number }[];
    priceRange: [number, number];
  }> {
    const brands = [...new Set(getAllProducts().map((p) => p.brand))].map((b) => ({
      value: b,
      count: getAllProducts().filter((p) => p.brand === b).length,
    }));
    const colorMap = new Map<string, number>();
    getAllProducts().forEach((p) =>
      p.colors?.forEach((c) => colorMap.set(c.name, (colorMap.get(c.name) ?? 0) + 1))
    );
    const sizeMap = new Map<string, number>();
    getAllProducts().forEach((p) =>
      p.sizes?.forEach((s) => sizeMap.set(s.label, (sizeMap.get(s.label) ?? 0) + 1))
    );
    const prices = getAllProducts().map((p) => p.price);
    return delay({
      brands,
      colors: [...colorMap.entries()].map(([value, count]) => ({ value, count })),
      sizes: [...sizeMap.entries()].map(([value, count]) => ({ value, count })),
      priceRange: [Math.min(...prices), Math.max(...prices)],
    });
  },
};
