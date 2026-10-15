import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  CreditCard,
  Lock,
  ShieldCheck,
  ShoppingBag,
  Truck,
  Building,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { EmptyState } from '@/components/ui/EmptyState';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { useCartStore } from '@/store/cartStore';
import { useUserStore } from '@/store/userStore';
import { useToastStore } from '@/store/toastStore';
import { orderService } from '@/services/orderService';
import { formatPrice } from '@/utils/format';
import { useSeo } from '@/hooks/useSeo';
import { useReducedMotion } from '@/hooks/useUi';
import type { Address, PaymentMethod, DeliverySpeed } from '@/types';

export default function CheckoutPage() {
  useSeo({
    title: 'Checkout',
    description: 'Complete your NOIR & CO. purchase with secure delivery and discreet luxury packaging.',
  });

  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const toast = useToastStore();
  const { user, addresses, addOrder } = useUserStore();
  const {
    items,
    subtotal,
    discount,
    shipping,
    tax,
    couponCode,
    applyCoupon,
    removeCoupon,
    clearCart,
  } = useCartStore();

  const [email, setEmail] = useState(user?.email || 'customer@example.com');
  const [phone, setPhone] = useState('+1 (555) 234-5678');
  const [deliverySpeed, setDeliverySpeed] = useState<DeliverySpeed>('standard');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [couponInput, setCouponInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Default address values or from user
  const defaultAddr = addresses.find((a) => a.isDefault) || addresses[0];
  const [address, setAddress] = useState<Address>({
    id: defaultAddr?.id || 'addr-temp',
    label: 'home',
    firstName: user?.firstName || 'Valued',
    lastName: user?.lastName || 'Client',
    line1: defaultAddr?.line1 || '740 Park Avenue',
    line2: defaultAddr?.line2 || 'Apt 12B',
    city: defaultAddr?.city || 'New York',
    state: defaultAddr?.state || 'NY',
    zip: defaultAddr?.zip || '10021',
    country: defaultAddr?.country || 'United States',
    phone: defaultAddr?.phone || '+1 (555) 234-5678',
    isDefault: true,
  });

  // Credit card form state (mock)
  const [cardData, setCardData] = useState({
    number: '•••• •••• •••• 4242',
    name: `${address.firstName} ${address.lastName}`.trim(),
    expiry: '12/28',
    cvv: '888',
  });

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <EmptyState
          icon={<ShoppingBag className="h-10 w-10 text-[var(--color-noir-gold)]" />}
          title="Your bag is empty"
          message="Select items from our ready-to-wear or fine leather collections to proceed to checkout."
          action={
            <Button asChild>
              <Link to="/shop">Discover Collection</Link>
            </Button>
          }
        />
      </div>
    );
  }

  const shippingCost =
    deliverySpeed === 'overnight' ? 55 : deliverySpeed === 'express' ? 28 : shipping;
  const finalTotal = Math.round((subtotal - discount + shippingCost + tax) * 100) / 100;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const orderItems = items.map((item) => ({
        productId: item.productId,
        productName: item.product.name,
        productImage: item.product.images[0]?.url || '',
        price: item.price,
        quantity: item.quantity,
        selectedColor: item.selectedColor?.name,
        selectedSize: item.selectedSize?.label,
        subtotal: item.price * item.quantity,
      }));

      const newOrder = await orderService.create({
        items: orderItems,
        subtotal,
        shipping: shippingCost,
        tax,
        discount,
        total: finalTotal,
        shippingAddress: address,
        billingAddress: address,
        paymentMethod,
        couponCode: couponCode || undefined,
      });

      addOrder(newOrder);
      clearCart();
      toast.success('Order placed', 'Your order has been confirmed.');
      navigate(`/order-confirmation/${newOrder.id}`);
    } catch {
      toast.error('Order failed', 'There was an issue processing your order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] py-10 lg:py-16">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
        <Breadcrumbs
          items={[
            { label: 'Bag', href: '/cart' },
            { label: 'Checkout', href: '/checkout' },
          ]}
          className="mb-8"
        />

        <div className="mb-10 flex flex-col gap-2">
          <p className="font-heading text-[11px] font-semibold uppercase tracking-[0.25em] text-[var(--color-noir-gold)]">
            Express &amp; Secure Checkout
          </p>
          <h1 className="font-heading text-3xl font-extrabold tracking-tight text-[var(--text-primary)] sm:text-4xl">
            Complete Your Order
          </h1>
        </div>

        <div className="grid gap-12 lg:grid-cols-[1fr_420px]">
          {/* Checkout Steps Form */}
          <form onSubmit={handleSubmitOrder} className="space-y-10">
            {/* 1. Contact Information */}
            <motion.section
              initial={reduceMotion ? undefined : { opacity: 0, y: 12 }}
              animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              className="border border-[var(--border-color)] bg-[var(--bg-card)] p-6 sm:p-8"
            >
              <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4">
                <h2 className="flex items-center gap-3 font-heading text-lg font-bold uppercase tracking-wider text-[var(--text-primary)]">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-noir-charcoal)] font-mono text-xs text-[var(--color-noir-ivory)]">
                    1
                  </span>
                  Contact Information
                </h2>
                {!user && (
                  <span className="text-xs text-[var(--text-muted)]">
                    Already a member?{' '}
                    <Link to="/signin" className="font-semibold text-[var(--color-noir-gold)] underline">
                      Sign in
                    </Link>
                  </span>
                )}
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block font-heading text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@domain.com"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block font-heading text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                    Phone Number
                  </label>
                  <Input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>
            </motion.section>

            {/* 2. Shipping Address */}
            <motion.section
              initial={reduceMotion ? undefined : { opacity: 0, y: 12 }}
              animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="border border-[var(--border-color)] bg-[var(--bg-card)] p-6 sm:p-8"
            >
              <div className="border-b border-[var(--border-color)] pb-4">
                <h2 className="flex items-center gap-3 font-heading text-lg font-bold uppercase tracking-wider text-[var(--text-primary)]">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-noir-charcoal)] font-mono text-xs text-[var(--color-noir-ivory)]">
                    2
                  </span>
                  Shipping Address
                </h2>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block font-heading text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                    First Name
                  </label>
                  <Input
                    required
                    value={address.firstName}
                    onChange={(e) => setAddress({ ...address, firstName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block font-heading text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                    Last Name
                  </label>
                  <Input
                    required
                    value={address.lastName}
                    onChange={(e) => setAddress({ ...address, lastName: e.target.value })}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block font-heading text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                    Street Address
                  </label>
                  <Input
                    required
                    value={address.line1}
                    onChange={(e) => setAddress({ ...address, line1: e.target.value })}
                    placeholder="Street and number"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block font-heading text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                    Apartment, Suite, Unit (Optional)
                  </label>
                  <Input
                    value={address.line2 || ''}
                    onChange={(e) => setAddress({ ...address, line2: e.target.value })}
                    placeholder="Apt, Suite, Floor"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block font-heading text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                    City
                  </label>
                  <Input
                    required
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1.5 block font-heading text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                      State / Region
                    </label>
                    <Input
                      required
                      value={address.state}
                      onChange={(e) => setAddress({ ...address, state: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block font-heading text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                      Postal Code
                    </label>
                    <Input
                      required
                      value={address.zip}
                      onChange={(e) => setAddress({ ...address, zip: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </motion.section>

            {/* 3. Delivery Method */}
            <motion.section
              initial={reduceMotion ? undefined : { opacity: 0, y: 12 }}
              animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="border border-[var(--border-color)] bg-[var(--bg-card)] p-6 sm:p-8"
            >
              <div className="border-b border-[var(--border-color)] pb-4">
                <h2 className="flex items-center gap-3 font-heading text-lg font-bold uppercase tracking-wider text-[var(--text-primary)]">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-noir-charcoal)] font-mono text-xs text-[var(--color-noir-ivory)]">
                    3
                  </span>
                  Delivery Method
                </h2>
              </div>

              <div className="mt-6 space-y-3">
                {[
                  {
                    id: 'standard' as DeliverySpeed,
                    title: 'Complimentary White-Glove Standard',
                    time: '3-5 business days',
                    price: shipping === 0 ? 'Complimentary' : formatPrice(shipping),
                  },
                  {
                    id: 'express' as DeliverySpeed,
                    title: 'Priority Express Air',
                    time: '1-2 business days',
                    price: formatPrice(28),
                  },
                  {
                    id: 'overnight' as DeliverySpeed,
                    title: 'Direct Courier Overnight',
                    time: 'Next day by 10:30 AM',
                    price: formatPrice(55),
                  },
                ].map((opt) => (
                  <label
                    key={opt.id}
                    className={`flex cursor-pointer items-center justify-between border p-4 transition-all ${
                      deliverySpeed === opt.id
                        ? 'border-[var(--color-noir-gold)] bg-[var(--bg-secondary)]'
                        : 'border-[var(--border-color)] hover:border-[var(--text-muted)]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="deliverySpeed"
                        checked={deliverySpeed === opt.id}
                        onChange={() => setDeliverySpeed(opt.id)}
                        className="accent-[var(--color-noir-gold)]"
                      />
                      <div>
                        <p className="font-heading text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
                          {opt.title}
                        </p>
                        <p className="text-xs text-[var(--text-muted)]">{opt.time}</p>
                      </div>
                    </div>
                    <span className="font-heading text-xs font-bold text-[var(--text-primary)]">
                      {opt.price}
                    </span>
                  </label>
                ))}
              </div>
            </motion.section>

            {/* 4. Payment Method */}
            <motion.section
              initial={reduceMotion ? undefined : { opacity: 0, y: 12 }}
              animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="border border-[var(--border-color)] bg-[var(--bg-card)] p-6 sm:p-8"
            >
              <div className="border-b border-[var(--border-color)] pb-4">
                <h2 className="flex items-center gap-3 font-heading text-lg font-bold uppercase tracking-wider text-[var(--text-primary)]">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-noir-charcoal)] font-mono text-xs text-[var(--color-noir-ivory)]">
                    4
                  </span>
                  Payment
                </h2>
              </div>

              <div className="mt-6 space-y-4">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[
                    { id: 'card' as PaymentMethod, label: 'Credit Card', icon: CreditCard },
                    { id: 'apple-pay' as PaymentMethod, label: 'Apple Pay', icon: ShieldCheck },
                    { id: 'paypal' as PaymentMethod, label: 'PayPal', icon: Building },
                    { id: 'cod' as PaymentMethod, label: 'Upon Arrival', icon: Truck },
                  ].map((pm) => {
                    const Icon = pm.icon;
                    return (
                      <button
                        key={pm.id}
                        type="button"
                        onClick={() => setPaymentMethod(pm.id)}
                        className={`flex flex-col items-center justify-center gap-2 border p-3.5 transition-all ${
                          paymentMethod === pm.id
                            ? 'border-[var(--color-noir-gold)] bg-[var(--bg-secondary)] text-[var(--text-primary)]'
                            : 'border-[var(--border-color)] text-[var(--text-muted)] hover:border-[var(--text-muted)]'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="font-heading text-[10px] font-bold uppercase tracking-wider">
                          {pm.label}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {paymentMethod === 'card' && (
                  <div className="mt-4 border border-[var(--border-color)] bg-[var(--bg-secondary)]/50 p-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <label className="mb-1 block font-heading text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                          Card Number
                        </label>
                        <Input
                          value={cardData.number}
                          onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                          placeholder="4000 1234 5678 9010"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block font-heading text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                          Expiration
                        </label>
                        <Input
                          value={cardData.expiry}
                          onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                          placeholder="MM/YY"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block font-heading text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                          Security Code (CVV)
                        </label>
                        <Input
                          value={cardData.cvv}
                          onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                          placeholder="CVV"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.section>

            {/* Place Order CTA */}
            <div className="pt-2">
              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="w-full py-4 font-heading text-xs uppercase tracking-[0.25em]"
              >
                {isSubmitting ? 'Securing Transaction...' : `Place Order • ${formatPrice(finalTotal)}`}
              </Button>
              <p className="mt-3 flex items-center justify-center gap-2 text-center text-xs text-[var(--text-muted)]">
                <Lock className="h-3.5 w-3.5" />
                256-Bit SSL Encrypted &bull; Guaranteed Authentic
              </p>
            </div>
          </form>

          {/* Right Column: Order Summary */}
          <aside className="h-fit space-y-6 lg:sticky lg:top-28">
            <div className="border border-[var(--border-color)] bg-[var(--bg-card)] p-6 sm:p-7">
              <h3 className="border-b border-[var(--border-color)] pb-4 font-heading text-sm font-bold uppercase tracking-[0.18em] text-[var(--text-primary)]">
                Order Summary ({items.reduce((acc, i) => acc + i.quantity, 0)})
              </h3>

              {/* Items List */}
              <div className="max-h-64 divide-y divide-[var(--border-color)] overflow-y-auto py-2">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 py-3">
                    <img
                      src={item.product.images[0]?.url}
                      alt={item.product.name}
                      className="h-16 w-14 shrink-0 object-cover"
                    />
                    <div className="flex flex-1 flex-col justify-between text-xs">
                      <div>
                        <p className="font-heading font-medium text-[var(--text-primary)]">
                          {item.product.name}
                        </p>
                        <p className="text-[var(--text-muted)]">
                          Qty: {item.quantity}
                          {item.selectedColor ? ` • ${item.selectedColor.name}` : ''}
                          {item.selectedSize ? ` • Size ${item.selectedSize.label}` : ''}
                        </p>
                      </div>
                      <p className="font-heading font-bold text-[var(--text-primary)]">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Promo Code */}
              <div className="mt-4 border-t border-[var(--border-color)] pt-4">
                {couponCode ? (
                  <div className="flex items-center justify-between bg-[var(--bg-secondary)] px-3 py-2 text-xs">
                    <span className="font-mono text-[var(--color-noir-gold)]">
                      Code applied: {couponCode}
                    </span>
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="text-xs text-red-500 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Input
                      placeholder="Promo / Gift Code"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      className="text-xs uppercase"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        if (applyCoupon(couponInput)) {
                          toast.success('Promo applied', `${couponInput} activated.`);
                          setCouponInput('');
                        } else {
                          toast.error('Invalid promo', 'Promo code not recognized or expired.');
                        }
                      }}
                    >
                      Apply
                    </Button>
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="mt-6 space-y-2 border-t border-[var(--border-color)] pt-4 text-xs">
                <div className="flex justify-between text-[var(--text-secondary)]">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-[var(--color-noir-gold)]">
                    <span>Privilege Discount</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[var(--text-secondary)]">
                  <span>Shipping</span>
                  <span>{shippingCost === 0 ? 'Complimentary' : formatPrice(shippingCost)}</span>
                </div>
                <div className="flex justify-between text-[var(--text-secondary)]">
                  <span>Estimated Tax</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                <div className="flex justify-between border-t border-[var(--border-color)] pt-3 text-sm font-bold text-[var(--text-primary)]">
                  <span>Total</span>
                  <span className="font-heading text-lg">{formatPrice(finalTotal)}</span>
                </div>
              </div>
            </div>

            <div className="border border-[var(--border-color)] bg-[var(--bg-secondary)] p-4 text-center text-xs text-[var(--text-muted)]">
              <Link to="/cart" className="inline-flex items-center gap-1.5 hover:text-[var(--text-primary)]">
                <ArrowLeft className="h-3.5 w-3.5" />
                Return to shopping bag
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
