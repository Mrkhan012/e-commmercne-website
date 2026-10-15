import { useQuery, useMutation } from '@tanstack/react-query';
import { productService, type ProductQuery } from '@/services/productService';
import { reviewService, type ReviewQuery } from '@/services/reviewService';
import { analyticsService } from '@/services/analyticsService';
import { searchService, type SearchResult } from '@/services/searchService';

// ─── Query Keys ──────────────────────────────────────────────────────────────
export const queryKeys = {
  products: (query: ProductQuery) => ['products', query] as const,
  product: (slug: string) => ['product', slug] as const,
  productById: (id: string) => ['product', id] as const,
  related: (id: string) => ['related', id] as const,
  frequentlyBought: (id: string) => ['frequently-bought', id] as const,
  newArrivals: ['new-arrivals'] as const,
  bestSellers: ['best-sellers'] as const,
  trending: ['trending'] as const,
  onSale: ['on-sale'] as const,
  featured: ['featured'] as const,
  recommendations: ['recommendations'] as const,
  facets: ['facets'] as const,
  reviews: (query: ReviewQuery) => ['reviews', query] as const,
  adminStats: (range: string) => ['admin-stats', range] as const,
  adminSeries: (range: string) => ['admin-series', range] as const,
  revenueByCategory: ['revenue-by-category'] as const,
  orderStatusBreakdown: ['order-status-breakdown'] as const,
  bestSellingProducts: ['best-selling-products'] as const,
  search: (q: string) => ['search', q] as const,
};

// ─── Product Hooks ───────────────────────────────────────────────────────────

export const useProducts = (query: ProductQuery) =>
  useQuery({
    queryKey: queryKeys.products(query),
    queryFn: () => productService.list(query),
    placeholderData: (previous) => previous,
  });

export const useProduct = (slug: string | undefined) =>
  useQuery({
    queryKey: queryKeys.product(slug ?? ''),
    queryFn: () => productService.getBySlug(slug!),
    enabled: !!slug,
  });

export const useProductById = (id: string | undefined) =>
  useQuery({
    queryKey: queryKeys.productById(id ?? ''),
    queryFn: () => productService.getById(id!),
    enabled: !!id,
  });

export const useRelatedProducts = (id: string | undefined) =>
  useQuery({
    queryKey: queryKeys.related(id ?? ''),
    queryFn: async () => {
      // Resolve the product first so we can filter by its own category.
      const product = await productService.getById(id!);
      if (!product) return [];
      return productService.getRelated(product.id, product.category, 4);
    },
    enabled: !!id,
  });

export const useFrequentlyBoughtTogether = (id: string | undefined) =>
  useQuery({
    queryKey: queryKeys.frequentlyBought(id ?? ''),
    queryFn: () => productService.getFrequentlyBoughtTogether(id!, 3),
    enabled: !!id,
  });

export const useNewArrivals = () =>
  useQuery({ queryKey: queryKeys.newArrivals, queryFn: () => productService.getNewArrivals() });

export const useBestSellers = () =>
  useQuery({ queryKey: queryKeys.bestSellers, queryFn: () => productService.getBestSellers() });

export const useTrendingProducts = () =>
  useQuery({ queryKey: queryKeys.trending, queryFn: () => productService.getTrending() });

export const useSaleProducts = () =>
  useQuery({ queryKey: queryKeys.onSale, queryFn: () => productService.getOnSale() });

export const useFeaturedProducts = () =>
  useQuery({ queryKey: queryKeys.featured, queryFn: () => productService.getFeatured() });

export const useRecommendations = () =>
  useQuery({ queryKey: queryKeys.recommendations, queryFn: () => productService.getRecommendations() });

export const useFacets = () =>
  useQuery({ queryKey: queryKeys.facets, queryFn: () => productService.getFacets() });

// ─── Review Hooks ────────────────────────────────────────────────────────────

export const useReviews = (query: ReviewQuery) =>
  useQuery({
    queryKey: queryKeys.reviews(query),
    queryFn: () => reviewService.list(query),
    enabled: !!query.productId,
  });

export const useCreateReview = () =>
  useMutation({
    mutationFn: ({ productId, input }: { productId: string; input: Parameters<typeof reviewService.create>[1] }) =>
      reviewService.create(productId, input),
  });

// ─── Search Hook ─────────────────────────────────────────────────────────────

export const useSearch = (q: string, enabled = true) =>
  useQuery<SearchResult>({
    queryKey: queryKeys.search(q),
    queryFn: () => searchService.query(q),
    enabled: enabled && q.trim().length > 0,
  });

// ─── Admin Hooks ─────────────────────────────────────────────────────────────

export const useAdminStats = (range: string) =>
  useQuery({
    queryKey: queryKeys.adminStats(range),
    queryFn: () => analyticsService.getStats(range),
  });

export const useAdminSeries = (range: string) =>
  useQuery({
    queryKey: queryKeys.adminSeries(range),
    queryFn: () => analyticsService.getSeries(range),
  });

export const useRevenueByCategory = () =>
  useQuery({ queryKey: queryKeys.revenueByCategory, queryFn: () => analyticsService.getRevenueByCategory() });

export const useOrderStatusBreakdown = () =>
  useQuery({ queryKey: queryKeys.orderStatusBreakdown, queryFn: () => analyticsService.getOrderStatusBreakdown() });

export const useBestSellingProducts = () =>
  useQuery({ queryKey: queryKeys.bestSellingProducts, queryFn: () => analyticsService.getBestSellingProducts() });
