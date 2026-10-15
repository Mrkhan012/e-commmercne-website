// ─── AFRO & CO. — Shared TypeScript Types ─────────────────────────────────────

// ─── Enums ────────────────────────────────────────────────────────────────────

export type Theme = 'light' | 'dark';
export type Currency = 'USD' | 'EUR' | 'GBP';
export type ProductStatus = 'new' | 'best-seller' | 'trending' | 'sale' | 'default';
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
export type PaymentMethod = 'card' | 'paypal' | 'apple-pay' | 'google-pay' | 'cod';
export type DeliverySpeed = 'standard' | 'express' | 'overnight';

// ─── Core Entities ─────────────────────────────────────────────────────────────

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  width: number;
  height: number;
}

export interface ProductColor {
  name: string;
  hex: string;
  slug: string;
}

export interface ProductSize {
  label: string;
  slug: string;
  available: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  brand: string;
  category: string;
  subcategory?: string;
  price: number;
  originalPrice?: number;
  discount?: number; // percentage 0-100
  currency: Currency;
  description: string;
  shortDescription: string;
  images: ProductImage[];
  colors?: ProductColor[];
  sizes?: ProductSize[];
  stock: number;
  rating: number;
  reviewCount: number;
  specifications?: Record<string, string>;
  features?: string[];
  tags: string[];
  status: ProductStatus;
  shippingInfo?: string;
  returnPolicy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image: string;
  productCount: number;
  subcategories?: Subcategory[];
  featured?: boolean;
}

export interface Subcategory {
  id: string;
  name: string;
  slug: string;
  productCount: number;
}

// ─── Cart ─────────────────────────────────────────────────────────────────────

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  selectedColor?: ProductColor;
  selectedSize?: ProductSize;
  price: number; // locked price at time of add
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  couponCode?: string;
}

// ─── Wishlist ─────────────────────────────────────────────────────────────────

export interface WishlistItem {
  productId: string;
  product: Product;
  addedAt: string;
}

// ─── User / Auth ──────────────────────────────────────────────────────────────

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: 'customer' | 'admin';
  createdAt: string;
  addresses: Address[];
  preferences: UserPreferences;
}

export interface Address {
  id: string;
  label: 'home' | 'work' | 'other';
  firstName: string;
  lastName: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone?: string;
  isDefault: boolean;
}

export interface UserPreferences {
  newsletter: boolean;
  smsOffers: boolean;
  currency: Currency;
  theme: Theme;
  notifications: boolean;
}

// ─── Orders ───────────────────────────────────────────────────────────────────

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
  subtotal: number;
}

export interface OrderTimelineEvent {
  status: OrderStatus;
  label: string;
  timestamp: string;
  description?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: PaymentMethod;
  trackingNumber?: string;
  trackingUrl?: string;
  timeline: OrderTimelineEvent[];
  couponCode?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  estimatedDelivery?: string;
}

// ─── Reviews ──────────────────────────────────────────────────────────────────

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  body: string;
  isVerifiedPurchase: boolean;
  helpful: number;
  images?: string[];
  createdAt: string;
  responses?: ReviewResponse[];
}

export interface ReviewResponse {
  id: string;
  userName: string;
  body: string;
  createdAt: string;
}

export interface ReviewSummary {
  productId: string;
  averageRating: number;
  totalReviews: number;
  distribution: Record<number, number>; // star -> count
}

// ─── Checkout ─────────────────────────────────────────────────────────────────

export interface CheckoutState {
  step: number;
  contact: {
    email: string;
    phone?: string;
    subscribeNewsletter: boolean;
  };
  shippingAddress: Address | null;
  billingAddress: Address | null;
  billingSameAsShipping: boolean;
  deliveryMethod: {
    id: DeliverySpeed;
    name: string;
    price: number;
    estimatedDays: string;
  } | null;
  paymentMethod: PaymentMethod | null;
  couponCode: string;
  couponDiscount: number;
  orderNotes?: string;
  acceptedTerms: boolean;
}

// ─── Filters & Search ─────────────────────────────────────────────────────────

export interface ProductFilters {
  categories: string[];
  brands: string[];
  priceRange: [number, number];
  colors: string[];
  sizes: string[];
  rating: number | null;
  onSale: boolean;
  inStock: boolean;
  status: ProductStatus[];
}

export type SortOption =
  | 'featured'
  | 'newest'
  | 'price-asc'
  | 'price-desc'
  | 'rating'
  | 'bestselling';

export interface SearchSuggestion {
  type: 'product' | 'category' | 'brand' | 'trending';
  text: string;
  slug?: string;
  productId?: string;
  image?: string;
}

// ─── Admin ────────────────────────────────────────────────────────────────────

export interface AdminStats {
  totalRevenue: number;
  revenueChange: number;
  totalOrders: number;
  ordersChange: number;
  totalCustomers: number;
  customersChange: number;
  averageOrderValue: number;
  aovChange: number;
}

export interface AdminChartDataPoint {
  date: string;
  revenue: number;
  orders: number;
  visitors: number;
}

export interface AdminOrder {
  id: string;
  orderNumber: string;
  customer: string;
  email: string;
  total: number;
  status: OrderStatus;
  items: number;
  createdAt: string;
}

export interface AdminLowStockProduct {
  id: string;
  name: string;
  sku: string;
  stock: number;
  category: string;
}

// ─── UI Primitives ─────────────────────────────────────────────────────────────

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
  duration?: number;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface Tab {
  id: string;
  label: string;
  icon?: string;
  count?: number;
}

export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface DataTableColumn<T> {
  key: keyof T | string;
  header: string;
  render?: (row: T) => React.ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  selectable?: boolean;
  selectedIds?: string[];
  onSelectChange?: (ids: string[]) => void;
  pagination?: PaginationState;
  onPageChange?: (page: number) => void;
  emptyMessage?: string;
  loading?: boolean;
}

// ─── Service Interfaces ────────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
