import type { Order, OrderStatus } from '@/types';
import { generateOrderNumber, generateTrackingNumber } from '@/utils/format';
import type { Address } from '@/types';

/**
 * Order service (demo).
 *
 * Production contract:
 *   POST /api/orders          { items, shippingAddress, paymentMethod, coupon } -> { order }
 *   GET  /api/orders          -> Order[]
 *   GET  /api/orders/:id      -> Order
 *   POST /api/orders/:id/cancel
 */

const LATENCY = 500;
const delay = <T,>(value: T, ms = LATENCY): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

const STATUS_FLOW: OrderStatus[] = ['pending', 'processing', 'shipped', 'delivered'];

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Order placed',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  refunded: 'Refunded',
};

export interface CreateOrderInput {
  items: {
    productId: string;
    productName: string;
    productImage: string;
    price: number;
    quantity: number;
    selectedColor?: string;
    selectedSize?: string;
    subtotal: number;
  }[];
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: Order['paymentMethod'];
  couponCode?: string;
  notes?: string;
}

export const orderService = {
  /**
   * Creates a demo order. NOTE: no payment is captured here — this demo does not
   * charge any card. A production build must confirm payment with a provider
   * (e.g. Stripe) before marking an order paid.
   */
  async create(input: CreateOrderInput): Promise<Order> {
    const now = new Date().toISOString();
    const order: Order = {
      id: `order-${Date.now()}`,
      orderNumber: generateOrderNumber(),
      status: 'pending',
      items: input.items,
      subtotal: input.subtotal,
      shipping: input.shipping,
      tax: input.tax,
      discount: input.discount,
      total: input.total,
      shippingAddress: input.shippingAddress,
      billingAddress: input.billingAddress,
      paymentMethod: input.paymentMethod,
      trackingNumber: generateTrackingNumber(),
      couponCode: input.couponCode,
      notes: input.notes,
      timeline: [
        {
          status: 'pending',
          label: STATUS_LABELS.pending,
          timestamp: now,
          description: 'We received your order.',
        },
      ],
      createdAt: now,
      updatedAt: now,
      estimatedDelivery: new Date(Date.now() + 5 * 86400000).toISOString(),
    };
    return delay(order, 900);
  },

  async list(): Promise<Order[]> {
    // In production this would call the API; the store holds the demo orders.
    return delay([]);
  },

  async get(_orderId: string): Promise<Order | null> {
    return delay(null).then(() => null) as Promise<Order | null>;
  },

  async track(orderNumber: string): Promise<Order | null> {
    if (!orderNumber.trim()) return delay(null, 300);
    // Demo tracking: return null so the UI can show a clear "not found" state.
    return delay(null, 700);
  },

  /** Builds the display timeline for an order status. */
  buildTimeline(status: OrderStatus, createdAt: string): Order['timeline'] {
    const reachedIndex = STATUS_FLOW.indexOf(status);
    const base = new Date(createdAt).getTime();
    return STATUS_FLOW.slice(0, reachedIndex + 1).map((s, i) => ({
      status: s,
      label: STATUS_LABELS[s],
      timestamp: new Date(base + i * 86400000).toISOString(),
    }));
  },

  getStatusLabel: (status: OrderStatus): string => STATUS_LABELS[status],
};
