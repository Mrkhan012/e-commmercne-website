import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Coupon {
  code: string;
  description: string;
  type: 'percentage' | 'fixed' | 'free_shipping';
  value: number; // percentage (0-100), fixed amount, or 0 for free shipping
  minSpend?: number;
  maxDiscount?: number;
  expiresAt?: string;
  active: boolean;
}

export interface CouponValidation {
  valid: boolean;
  discount: number;
  freeShipping: boolean;
  message: string;
}

export const DEFAULT_COUPONS: Coupon[] = [
  {
    code: 'NOIR10',
    description: '10% off your order',
    type: 'percentage',
    value: 10,
    minSpend: 100,
    active: true,
  },
  {
    code: 'WELCOME15',
    description: '15% off your first order',
    type: 'percentage',
    value: 15,
    minSpend: 50,
    active: true,
  },
  {
    code: 'VIP20',
    description: '20% off orders over $500',
    type: 'percentage',
    value: 20,
    minSpend: 500,
    maxDiscount: 200,
    active: true,
  },
  {
    code: 'FREESHIP',
    description: 'Free standard shipping',
    type: 'free_shipping',
    value: 0,
    active: true,
  },
  {
    code: 'SAVE50',
    description: '$50 off orders over $300',
    type: 'fixed',
    value: 50,
    minSpend: 300,
    active: true,
  },
  {
    code: 'EXPIRED5',
    description: 'Expired demo coupon (inactive)',
    type: 'percentage',
    value: 5,
    active: false,
  },
];

interface CouponState {
  coupons: Coupon[];
  bannerPromoText: string;
  bannerActive: boolean;
  addCoupon: (coupon: Coupon) => void;
  updateCoupon: (code: string, updates: Partial<Coupon>) => void;
  deleteCoupon: (code: string) => void;
  toggleCouponStatus: (code: string) => void;
  updateBanner: (text: string, active: boolean) => void;
  resetCoupons: () => void;
  validateCoupon: (code: string, subtotal: number) => CouponValidation;
}

export const useCouponStore = create<CouponState>()(
  persist(
    (set, get) => ({
      coupons: DEFAULT_COUPONS,
      bannerPromoText: 'Complimentary worldwide shipping on orders over $200 · Use code WELCOME15 for 15% off',
      bannerActive: true,

      updateBanner: (bannerPromoText, bannerActive) => set({ bannerPromoText, bannerActive }),

      addCoupon: (newCoupon) =>
        set((state) => {
          const upperCode = newCoupon.code.toUpperCase().trim();
          const exists = state.coupons.some((c) => c.code.toUpperCase() === upperCode);
          if (exists) {
            return {
              coupons: state.coupons.map((c) =>
                c.code.toUpperCase() === upperCode ? { ...newCoupon, code: upperCode } : c
              ),
            };
          }
          return {
            coupons: [{ ...newCoupon, code: upperCode }, ...state.coupons],
          };
        }),

      updateCoupon: (code, updates) =>
        set((state) => ({
          coupons: state.coupons.map((c) =>
            c.code.toUpperCase() === code.toUpperCase() ? { ...c, ...updates } : c
          ),
        })),

      deleteCoupon: (code) =>
        set((state) => ({
          coupons: state.coupons.filter((c) => c.code.toUpperCase() !== code.toUpperCase()),
        })),

      toggleCouponStatus: (code) =>
        set((state) => ({
          coupons: state.coupons.map((c) =>
            c.code.toUpperCase() === code.toUpperCase() ? { ...c, active: !c.active } : c
          ),
        })),

      resetCoupons: () => set({ coupons: DEFAULT_COUPONS }),

      validateCoupon: (code, subtotal) => {
        const list = get().coupons;
        const coupon = list.find((c) => c.code.toUpperCase() === code.toUpperCase());

        if (!coupon) {
          return {
            valid: false,
            discount: 0,
            freeShipping: false,
            message: 'Invalid or expired promotional code.',
          };
        }

        if (!coupon.active) {
          return {
            valid: false,
            discount: 0,
            freeShipping: false,
            message: 'This promotional offer is currently inactive.',
          };
        }

        if (coupon.minSpend && subtotal < coupon.minSpend) {
          return {
            valid: false,
            discount: 0,
            freeShipping: false,
            message: `Offer requires a minimum purchase of $${coupon.minSpend}.`,
          };
        }

        if (coupon.type === 'percentage') {
          let discount = Math.round(((subtotal * coupon.value) / 100) * 100) / 100;
          if (coupon.maxDiscount) {
            discount = Math.min(discount, coupon.maxDiscount);
          }
          return {
            valid: true,
            discount,
            freeShipping: false,
            message: `Privilege offer applied: ${coupon.value}% savings!`,
          };
        }

        if (coupon.type === 'fixed') {
          const discount = Math.min(coupon.value, subtotal);
          return {
            valid: true,
            discount,
            freeShipping: false,
            message: `Privilege offer applied: $${coupon.value} savings!`,
          };
        }

        if (coupon.type === 'free_shipping') {
          return {
            valid: true,
            discount: 0,
            freeShipping: true,
            message: 'Privilege offer applied: Complimentary shipping.',
          };
        }

        return { valid: false, discount: 0, freeShipping: false, message: 'Invalid coupon.' };
      },
    }),
    {
      name: 'afro-coupons-storage',
    }
  )
);
