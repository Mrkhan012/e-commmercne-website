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

export const coupons: Coupon[] = [
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

export const findCoupon = (code: string): Coupon | undefined =>
  coupons.find((c) => c.code.toUpperCase() === code.toUpperCase() && c.active);

export interface CouponValidation {
  valid: boolean;
  discount: number;
  freeShipping: boolean;
  message: string;
}

/**
 * Validates a coupon against a subtotal and returns the resulting discount.
 * Pure function — no side effects — so it can be reused in cart and checkout.
 */
export const validateCoupon = (code: string, subtotal: number): CouponValidation => {
  const coupon = findCoupon(code);

  if (!coupon) {
    return { valid: false, discount: 0, freeShipping: false, message: 'Invalid or expired coupon code.' };
  }

  if (!coupon.active) {
    return { valid: false, discount: 0, freeShipping: false, message: 'This coupon is no longer active.' };
  }

  if (coupon.minSpend && subtotal < coupon.minSpend) {
    return {
      valid: false,
      discount: 0,
      freeShipping: false,
      message: `Coupon requires a minimum spend of $${coupon.minSpend}.`,
    };
  }

  if (coupon.type === 'percentage') {
    let discount = Math.round((subtotal * coupon.value) / 100 * 100) / 100;
    if (coupon.maxDiscount) {
      discount = Math.min(discount, coupon.maxDiscount);
    }
    return { valid: true, discount, freeShipping: false, message: `Coupon applied: ${coupon.value}% off.` };
  }

  if (coupon.type === 'fixed') {
    const discount = Math.min(coupon.value, subtotal);
    return { valid: true, discount, freeShipping: false, message: `Coupon applied: $${coupon.value} off.` };
  }

  if (coupon.type === 'free_shipping') {
    return { valid: true, discount: 0, freeShipping: true, message: 'Coupon applied: free shipping.' };
  }

  return { valid: false, discount: 0, freeShipping: false, message: 'Invalid coupon.' };
};
