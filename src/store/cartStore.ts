import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Cart, CartItem, Product } from '@/types';
import { validateCoupon } from '@/data/coupons';

// ─── Shipping Rules (demo) ───────────────────────────────────────────────────
export const SHIPPING_RULES = {
  freeThreshold: 200,
  standard: 12,
  express: 28,
  overnight: 55,
  taxRate: 0.08, // 8% demo sales tax
} as const;

export interface CartState extends Cart {
  isOpen: boolean;
  couponError: string | null;
  freeShipping: boolean;
  // Actions
  addItem: (
    product: Product,
    quantity?: number,
    selectedColor?: CartItem['selectedColor'],
    selectedSize?: CartItem['selectedSize'],
    customPrice?: number,
    isWholesale?: boolean
  ) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  itemCount: () => number;
}

// Two cart lines are the same product only when color AND size match.
const lineId = (productId: string, colorSlug?: string, sizeSlug?: string): string =>
  `${productId}__${colorSlug ?? 'default'}__${sizeSlug ?? 'default'}`;

const calculateTotals = (
  items: CartItem[],
  couponDiscount: number,
  freeShippingCoupon: boolean
): Pick<Cart, 'subtotal' | 'discount' | 'shipping' | 'tax' | 'total'> => {
  const subtotal = Math.round(items.reduce((sum, item) => sum + item.price * item.quantity, 0) * 100) / 100;
  const discount = Math.min(couponDiscount, subtotal);
  const afterDiscount = subtotal - discount;

  let shipping = 0;
  if (items.length > 0 && afterDiscount < SHIPPING_RULES.freeThreshold) {
    shipping = SHIPPING_RULES.standard;
  }
  if (freeShippingCoupon && items.length > 0) {
    shipping = 0;
  }

  const tax = Math.round(afterDiscount * SHIPPING_RULES.taxRate * 100) / 100;
  const total = Math.round((afterDiscount + shipping + tax) * 100) / 100;

  return { subtotal, discount, shipping, tax, total };
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      subtotal: 0,
      discount: 0,
      shipping: 0,
      tax: 0,
      total: 0,
      couponCode: undefined,
      couponError: null,
      freeShipping: false,
      isOpen: false,

      addItem: (product, quantity = 1, selectedColor, selectedSize, customPrice, isWholesale) =>
        set((state) => {
          const id = lineId(product.id, selectedColor?.slug, selectedSize?.slug);
          const existing = state.items.find((item) => item.id === id);
          const maxQty = isWholesale ? Math.max(product.stock * 10, 500) : Math.max(product.stock, 1);
          const unitPrice = customPrice !== undefined ? customPrice : product.price;

          let newItems: CartItem[];
          if (existing) {
            newItems = state.items.map((item) =>
              item.id === id
                ? {
                    ...item,
                    quantity: Math.min(item.quantity + quantity, maxQty),
                    price: unitPrice,
                    customPrice,
                    isWholesale: isWholesale ?? item.isWholesale,
                  }
                : item
            );
          } else {
            newItems = [
              ...state.items,
              {
                id,
                productId: product.id,
                product,
                quantity: Math.min(quantity, maxQty),
                selectedColor,
                selectedSize,
                price: unitPrice,
                customPrice,
                isWholesale,
              },
            ];
          }

          const totals = calculateTotals(newItems, state.discount, state.freeShipping);
          return { items: newItems, ...totals, isOpen: true };
        }),

      removeItem: (itemId) =>
        set((state) => {
          const newItems = state.items.filter((item) => item.id !== itemId);
          const totals = calculateTotals(newItems, state.discount, state.freeShipping);
          return { items: newItems, ...totals };
        }),

      updateQuantity: (itemId, quantity) =>
        set((state) => {
          if (quantity <= 0) {
            const newItems = state.items.filter((item) => item.id !== itemId);
            const totals = calculateTotals(newItems, state.discount, state.freeShipping);
            return { items: newItems, ...totals };
          }
          const newItems = state.items.map((item) =>
            item.id === itemId
              ? { ...item, quantity: Math.min(quantity, Math.max(item.product.stock, 1)) }
              : item
          );
          const totals = calculateTotals(newItems, state.discount, state.freeShipping);
          return { items: newItems, ...totals };
        }),

      clearCart: () =>
        set({
          items: [],
          subtotal: 0,
          discount: 0,
          shipping: 0,
          tax: 0,
          total: 0,
          couponCode: undefined,
          couponError: null,
          freeShipping: false,
        }),

      applyCoupon: (code) => {
        const { subtotal } = get();
        const result = validateCoupon(code, subtotal);
        if (!result.valid) {
          set({ couponError: result.message });
          return false;
        }
        const totals = calculateTotals(get().items, result.discount, result.freeShipping);
        set({
          couponCode: code.toUpperCase(),
          couponError: null,
          freeShipping: result.freeShipping,
          ...totals,
        });
        return true;
      },

      removeCoupon: () => {
        const totals = calculateTotals(get().items, 0, false);
        set({
          couponCode: undefined,
          couponError: null,
          freeShipping: false,
          ...totals,
        });
      },

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      itemCount: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
    }),
    {
      name: 'noir-cart',
      partialize: (state) => ({
        items: state.items,
        subtotal: state.subtotal,
        discount: state.discount,
        shipping: state.shipping,
        tax: state.tax,
        total: state.total,
        couponCode: state.couponCode,
        freeShipping: state.freeShipping,
      }),
    }
  )
);
