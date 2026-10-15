import type { PaymentMethod } from '@/types';

/**
 * Payment service (demo — NO real payment processing).
 *
 * This build never collects, transmits, or stores real card data, and never
 * claims a payment succeeded. In production, card entry must happen inside a
 * provider-hosted element (Stripe Elements / Payment Element, Adyen, Braintree)
 * so the card number never touches this front end.
 *
 * ─── Production integration contract ────────────────────────────────────────
 *   POST /api/payments/intent    { amount, currency, orderId } -> { clientSecret }
 *   POST /api/payments/confirm   { paymentMethodId, clientSecret } -> { status }
 *   GET  /api/payments/:id
 *
 * Required environment variables (server-side only, never exposed to the client):
 *   STRIPE_SECRET_KEY=sk_live_...
 *   STRIPE_WEBHOOK_SECRET=whsec_...
 *   VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...   (the only key safe for the browser)
 */

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: 'requires_payment_method' | 'processing' | 'succeeded' | 'failed';
  clientSecret: string;
}

export interface PaymentConfirmation {
  success: boolean;
  transactionId?: string;
  error?: string;
  /** True when a real payment provider actually confirmed the charge. */
  providerVerified: boolean;
}

const delay = <T,>(value: T, ms = 800): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

export const paymentService = {
  /**
   * Creates a payment intent shape matching the Stripe PaymentIntent object.
   * In production this calls the backend; the backend creates the real intent.
   */
  async createIntent(amount: number, currency = 'USD'): Promise<PaymentIntent> {
    return delay({
      id: `pi_demo_${Date.now()}`,
      amount: Math.round(amount * 100),
      currency,
      status: 'requires_payment_method',
      clientSecret: `pi_demo_${Date.now()}_secret_demo`,
    });
  },

  /**
   * Demo confirmation. Always returns providerVerified: false so the UI is
   * forced to label the result as a demo outcome rather than a real charge.
   */
  async confirm(_method: PaymentMethod): Promise<PaymentConfirmation> {
    return delay(
      {
        success: true,
        transactionId: `txn_demo_${Date.now().toString(36)}`,
        providerVerified: false,
      },
      1200
    );
  },

  getSupportedMethods(): { id: PaymentMethod; label: string; description: string; demoOnly: boolean }[] {
    return [
      { id: 'card', label: 'Credit / Debit Card', description: 'Visa, Mastercard, Amex', demoOnly: true },
      { id: 'paypal', label: 'PayPal', description: 'Pay with your PayPal balance', demoOnly: true },
      { id: 'apple-pay', label: 'Apple Pay', description: 'One-tap checkout', demoOnly: true },
      { id: 'google-pay', label: 'Google Pay', description: 'One-tap checkout', demoOnly: true },
      { id: 'cod', label: 'Cash on Delivery', description: 'Pay when your order arrives', demoOnly: true },
    ];
  },
};
