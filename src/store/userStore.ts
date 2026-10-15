import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Address, Order, User, UserPreferences } from '@/types';

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  orders: Order[];
  addresses: Address[];
  isAuthModalOpen: boolean;
  authModalView: 'signin' | 'signup';
  // Actions
  signIn: (email: string, firstName?: string, lastName?: string, role?: 'customer' | 'admin') => void;
  signInAsAdmin: () => void;
  setRole: (role: 'customer' | 'admin') => void;
  toggleRole: () => void;
  signUp: (data: { firstName: string; lastName: string; email: string }) => void;
  signOut: () => void;
  updateProfile: (data: Partial<Pick<User, 'firstName' | 'lastName' | 'email' | 'phone'>>) => void;
  updatePreferences: (data: Partial<UserPreferences>) => void;
  addAddress: (address: Omit<Address, 'id'>) => void;
  updateAddress: (id: string, data: Partial<Address>) => void;
  removeAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  addOrder: (order: Order) => void;
  getOrder: (orderId: string) => Order | undefined;
  setAuthModalOpen: (open: boolean) => void;
  setAuthModalView: (view: 'signin' | 'signup') => void;
}

const defaultPreferences: UserPreferences = {
  newsletter: true,
  smsOffers: false,
  currency: 'USD',
  theme: 'light',
  notifications: true,
};

// Build a demo account. NOTE: this is a front-end-only demo session, not real auth.
const createDemoUser = (
  email: string,
  firstName = 'Demo',
  lastName = 'Customer',
  role?: 'customer' | 'admin'
): User => {
  const calculatedRole: 'customer' | 'admin' =
    role ?? (email.toLowerCase().includes('admin') ? 'admin' : 'customer');

  return {
    id: `user-${Date.now()}`,
    firstName,
    lastName,
    email,
    role: calculatedRole,
    createdAt: new Date().toISOString(),
    addresses: [],
    preferences: { ...defaultPreferences },
  };
};

// Demo orders so the account dashboard and order tracking are never empty.
const demoOrders: Order[] = [
  {
    id: 'order-demo-1',
    orderNumber: 'NC-2024-8842',
    status: 'delivered',
    items: [
      {
        productId: 'prod-004',
        productName: 'Cashmere Crewneck Sweater',
        productImage: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&q=80',
        price: 420,
        quantity: 1,
        selectedColor: 'Oatmeal',
        selectedSize: 'M',
        subtotal: 420,
      },
      {
        productId: 'prod-029',
        productName: 'Cashmere Scarf',
        productImage: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=400&q=80',
        price: 265,
        quantity: 1,
        selectedColor: 'Camel',
        subtotal: 265,
      },
    ],
    subtotal: 685,
    shipping: 0,
    tax: 54.8,
    discount: 0,
    total: 739.8,
    shippingAddress: {
      id: 'addr-demo-1',
      label: 'home',
      firstName: 'Demo',
      lastName: 'Customer',
      line1: '120 West 24th Street',
      line2: 'Apt 4B',
      city: 'New York',
      state: 'NY',
      zip: '10011',
      country: 'United States',
      phone: '+1 (212) 555-0147',
      isDefault: true,
    },
    billingAddress: {
      id: 'addr-demo-1',
      label: 'home',
      firstName: 'Demo',
      lastName: 'Customer',
      line1: '120 West 24th Street',
      line2: 'Apt 4B',
      city: 'New York',
      state: 'NY',
      zip: '10011',
      country: 'United States',
      phone: '+1 (212) 555-0147',
      isDefault: true,
    },
    paymentMethod: 'card',
    trackingNumber: '1ZNC88420FF118344',
    timeline: [
      { status: 'pending', label: 'Order placed', timestamp: '2024-10-02T10:24:00Z', description: 'We received your order.' },
      { status: 'processing', label: 'Processing', timestamp: '2024-10-02T14:10:00Z', description: 'Your items are being prepared.' },
      { status: 'shipped', label: 'Shipped', timestamp: '2024-10-03T09:00:00Z', description: 'Package handed to carrier.' },
      { status: 'delivered', label: 'Delivered', timestamp: '2024-10-06T13:45:00Z', description: 'Delivered to front desk.' },
    ],
    createdAt: '2024-10-02T10:24:00Z',
    updatedAt: '2024-10-06T13:45:00Z',
    estimatedDelivery: '2024-10-06',
  },
  {
    id: 'order-demo-2',
    orderNumber: 'NC-2024-9130',
    status: 'shipped',
    items: [
      {
        productId: 'prod-022',
        productName: 'Premium Wireless Over-Ear Headphones',
        productImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80',
        price: 349,
        quantity: 1,
        selectedColor: 'Champagne Gold',
        subtotal: 349,
      },
    ],
    subtotal: 349,
    shipping: 0,
    tax: 27.92,
    discount: 0,
    total: 376.92,
    shippingAddress: {
      id: 'addr-demo-1',
      label: 'home',
      firstName: 'Demo',
      lastName: 'Customer',
      line1: '120 West 24th Street',
      line2: 'Apt 4B',
      city: 'New York',
      state: 'NY',
      zip: '10011',
      country: 'United States',
      phone: '+1 (212) 555-0147',
      isDefault: true,
    },
    billingAddress: {
      id: 'addr-demo-1',
      label: 'home',
      firstName: 'Demo',
      lastName: 'Customer',
      line1: '120 West 24th Street',
      line2: 'Apt 4B',
      city: 'New York',
      state: 'NY',
      zip: '10011',
      country: 'United States',
      phone: '+1 (212) 555-0147',
      isDefault: true,
    },
    paymentMethod: 'card',
    trackingNumber: '1ZNC91300FF118502',
    timeline: [
      { status: 'pending', label: 'Order placed', timestamp: '2024-11-08T16:30:00Z', description: 'We received your order.' },
      { status: 'processing', label: 'Processing', timestamp: '2024-11-08T18:05:00Z', description: 'Your items are being prepared.' },
      { status: 'shipped', label: 'Shipped', timestamp: '2024-11-09T11:20:00Z', description: 'Package handed to carrier.' },
    ],
    createdAt: '2024-11-08T16:30:00Z',
    updatedAt: '2024-11-09T11:20:00Z',
    estimatedDelivery: '2024-11-13',
  },
];

const demoAddresses: Address[] = [
  {
    id: 'addr-demo-1',
    label: 'home',
    firstName: 'Demo',
    lastName: 'Customer',
    line1: '120 West 24th Street',
    line2: 'Apt 4B',
    city: 'New York',
    state: 'NY',
    zip: '10011',
    country: 'United States',
    phone: '+1 (212) 555-0147',
    isDefault: true,
  },
  {
    id: 'addr-demo-2',
    label: 'work',
    firstName: 'Demo',
    lastName: 'Customer',
    line1: '55 Water Street',
    line2: 'Floor 12',
    city: 'New York',
    state: 'NY',
    zip: '10041',
    country: 'United States',
    isDefault: false,
  },
];

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      orders: [],
      addresses: [],
      isAuthModalOpen: false,
      authModalView: 'signin',

      signIn: (email, firstName, lastName, role) => {
        const user = createDemoUser(email, firstName, lastName, role);
        set({
          user: { ...user, addresses: demoAddresses },
          isAuthenticated: true,
          orders: demoOrders,
          addresses: demoAddresses,
        });
      },

      signInAsAdmin: () => {
        const user = createDemoUser('director@afro.co', 'Atelier', 'Director', 'admin');
        set({
          user: { ...user, addresses: demoAddresses },
          isAuthenticated: true,
          orders: demoOrders,
          addresses: demoAddresses,
        });
      },

      setRole: (role) =>
        set((state) => (state.user ? { user: { ...state.user, role } } : state)),

      toggleRole: () =>
        set((state) => {
          if (!state.user) return state;
          const nextRole = state.user.role === 'admin' ? 'customer' : 'admin';
          return { user: { ...state.user, role: nextRole } };
        }),

      signUp: (data) => {
        const user = createDemoUser(data.email, data.firstName, data.lastName);
        set({
          user,
          isAuthenticated: true,
          orders: [],
          addresses: [],
        });
      },

      signOut: () =>
        set({ user: null, isAuthenticated: false, orders: [], addresses: [] }),

      updateProfile: (data) =>
        set((state) =>
          state.user ? { user: { ...state.user, ...data } } : state
        ),

      updatePreferences: (data) =>
        set((state) =>
          state.user
            ? { user: { ...state.user, preferences: { ...state.user.preferences, ...data } } }
            : state
        ),

      addAddress: (address) =>
        set((state) => {
          const id = `addr-${Date.now()}`;
          const newAddresses = [...state.addresses, { ...address, id }];
          // First address added becomes the default.
          const normalized = newAddresses.map((a) => ({
            ...a,
            isDefault: address.isDefault ? a.id === id : newAddresses.length === 1,
          }));
          const user = state.user ? { ...state.user, addresses: normalized } : state.user;
          return { addresses: normalized, user };
        }),

      updateAddress: (id, data) =>
        set((state) => {
          const newAddresses = state.addresses.map((a) => (a.id === id ? { ...a, ...data } : a));
          const user = state.user ? { ...state.user, addresses: newAddresses } : state.user;
          return { addresses: newAddresses, user };
        }),

      removeAddress: (id) =>
        set((state) => {
          const remaining = state.addresses.filter((a) => a.id !== id);
          // Promote a new default if we removed the default address.
          if (remaining.length > 0 && !remaining.some((a) => a.isDefault)) {
            remaining[0] = { ...remaining[0], isDefault: true };
          }
          const user = state.user ? { ...state.user, addresses: remaining } : state.user;
          return { addresses: remaining, user };
        }),

      setDefaultAddress: (id) =>
        set((state) => {
          const newAddresses = state.addresses.map((a) => ({ ...a, isDefault: a.id === id }));
          const user = state.user ? { ...state.user, addresses: newAddresses } : state.user;
          return { addresses: newAddresses, user };
        }),

      addOrder: (order) =>
        set((state) => ({ orders: [order, ...state.orders] })),

      getOrder: (orderId) => get().orders.find((o) => o.id === orderId),

      setAuthModalOpen: (open) => set({ isAuthModalOpen: open }),
      setAuthModalView: (view) => set({ authModalView: view }),
    }),
    {
      name: 'noir-user',
    }
  )
);
