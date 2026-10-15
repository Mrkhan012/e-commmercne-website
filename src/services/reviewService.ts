import type { Review, ReviewSummary } from '@/types';
import { reviews as allReviews } from '@/data/reviews';

/**
 * Review service (demo).
 *
 * Production contract:
 *   GET  /api/products/:id/reviews?page&sort
 *   POST /api/products/:id/reviews  { rating, title, body } -> Review
 *   POST /api/reviews/:id/helpful
 */

const LATENCY = 250;
const delay = <T,>(value: T, ms = LATENCY): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

export interface ReviewQuery {
  productId: string;
  sort?: 'newest' | 'oldest' | 'highest' | 'lowest' | 'helpful';
  page?: number;
  pageSize?: number;
}

export const reviewService = {
  async list(query: ReviewQuery): Promise<{ data: Review[]; total: number; summary: ReviewSummary }> {
    const result = allReviews.filter((r) => r.productId === query.productId);

    switch (query.sort) {
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'highest':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'lowest':
        result.sort((a, b) => a.rating - b.rating);
        break;
      case 'helpful':
      default:
        result.sort((a, b) => b.helpful - a.helpful);
        break;
    }

    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 5;
    const start = (page - 1) * pageSize;
    const data = result.slice(start, start + pageSize);

    const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    result.forEach((r) => {
      distribution[r.rating] = (distribution[r.rating] || 0) + 1;
    });
    const avg =
      result.length > 0
        ? Math.round((result.reduce((s, r) => s + r.rating, 0) / result.length) * 10) / 10
        : 0;

    return delay({
      data,
      total: result.length,
      summary: {
        productId: query.productId,
        averageRating: avg,
        totalReviews: result.length,
        distribution,
      },
    });
  },

  async create(productId: string, input: { rating: number; title: string; body: string }): Promise<Review> {
    const review: Review = {
      id: `rev-${Date.now()}`,
      productId,
      userId: 'current-user',
      userName: 'You',
      rating: input.rating,
      title: input.title,
      body: input.body,
      isVerifiedPurchase: false,
      helpful: 0,
      createdAt: new Date().toISOString(),
    };
    allReviews.unshift(review);
    return delay(review, 600);
  },

  async markHelpful(reviewId: string): Promise<void> {
    const review = allReviews.find((r) => r.id === reviewId);
    if (review) review.helpful += 1;
    return delay(undefined, 200);
  },
};
