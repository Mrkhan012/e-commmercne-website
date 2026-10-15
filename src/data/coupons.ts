import {
  type Coupon,
  type CouponValidation,
  DEFAULT_COUPONS,
  useCouponStore,
} from '@/store/couponStore';

export type { Coupon, CouponValidation };

export const coupons: Coupon[] = DEFAULT_COUPONS;

export const findCoupon = (code: string): Coupon | undefined => {
  try {
    return useCouponStore
      .getState()
      .coupons.find((c) => c.code.toUpperCase() === code.toUpperCase() && c.active);
  } catch {
    return DEFAULT_COUPONS.find((c) => c.code.toUpperCase() === code.toUpperCase() && c.active);
  }
};

export const validateCoupon = (code: string, subtotal: number): CouponValidation => {
  try {
    return useCouponStore.getState().validateCoupon(code, subtotal);
  } catch {
    return { valid: false, discount: 0, freeShipping: false, message: 'Invalid coupon.' };
  }
};
