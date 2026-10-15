import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';

// ─── Route-level code splitting ──────────────────────────────────────────────
// Every page is lazily loaded so the initial bundle stays small.
const RootLayout = lazy(() => import('@/components/layout/RootLayout'));
const HomePage = lazy(() => import('@/pages/home/HomePage'));
const ShopPage = lazy(() => import('@/pages/shop/ShopPage'));
const CategoryPage = lazy(() => import('@/pages/shop/CategoryPage'));
const ProductPage = lazy(() => import('@/pages/product/ProductPage'));
const SearchPage = lazy(() => import('@/pages/shop/SearchPage'));
const NewArrivalsPage = lazy(() => import('@/pages/shop/NewArrivalsPage'));
const BestSellersPage = lazy(() => import('@/pages/shop/BestSellersPage'));
const TrendingPage = lazy(() => import('@/pages/shop/TrendingPage'));
const SalePage = lazy(() => import('@/pages/shop/SalePage'));
const WishlistPage = lazy(() => import('@/pages/wishlist/WishlistPage'));
const ComparePage = lazy(() => import('@/pages/shop/ComparePage'));
const CartPage = lazy(() => import('@/pages/cart/CartPage'));
const CheckoutPage = lazy(() => import('@/pages/checkout/CheckoutPage'));
const OrderConfirmationPage = lazy(() => import('@/pages/checkout/OrderConfirmationPage'));
const OrderTrackingPage = lazy(() => import('@/pages/checkout/OrderTrackingPage'));
const SignInPage = lazy(() => import('@/pages/auth/SignInPage'));
const SignUpPage = lazy(() => import('@/pages/auth/SignUpPage'));
const ForgotPasswordPage = lazy(() => import('@/pages/auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('@/pages/auth/ResetPasswordPage'));
const EmailVerificationPage = lazy(() => import('@/pages/auth/EmailVerificationPage'));
const AccountLayout = lazy(() => import('@/pages/account/AccountLayout'));
const DashboardPage = lazy(() => import('@/pages/account/DashboardPage'));
const ProfileSettingsPage = lazy(() => import('@/pages/account/ProfileSettingsPage'));
const AddressesPage = lazy(() => import('@/pages/account/AddressesPage'));
const OrdersPage = lazy(() => import('@/pages/account/OrdersPage'));
const OrderDetailPage = lazy(() => import('@/pages/account/OrderDetailPage'));
const AccountWishlistPage = lazy(() => import('@/pages/account/AccountWishlistPage'));
const ReviewsPage = lazy(() => import('@/pages/account/ReviewsPage'));
const SupportPage = lazy(() => import('@/pages/account/SupportPage'));
const AdminLayout = lazy(() => import('@/pages/admin/AdminLayout'));
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'));
const AdminAnalytics = lazy(() => import('@/pages/admin/AdminAnalytics'));
const AdminOrders = lazy(() => import('@/pages/admin/AdminOrders'));
const AdminProducts = lazy(() => import('@/pages/admin/AdminProducts'));
const AdminCategories = lazy(() => import('@/pages/admin/AdminCategories'));
const AdminInventory = lazy(() => import('@/pages/admin/AdminInventory'));
const AdminCustomers = lazy(() => import('@/pages/admin/AdminCustomers'));
const AdminCoupons = lazy(() => import('@/pages/admin/AdminCoupons'));
const AdminReviews = lazy(() => import('@/pages/admin/AdminReviews'));
const AdminReturns = lazy(() => import('@/pages/admin/AdminReturns'));
const AdminSubscribers = lazy(() => import('@/pages/admin/AdminSubscribers'));
const AdminDealers = lazy(() => import('@/pages/admin/AdminDealers'));
const AdminSettings = lazy(() => import('@/pages/admin/AdminSettings'));
const DealerLayout = lazy(() => import('@/pages/dealer/DealerLayout'));
const DealerDashboard = lazy(() => import('@/pages/dealer/DealerDashboard'));
const DealerCatalog = lazy(() => import('@/pages/dealer/DealerCatalog'));
const DealerQuickOrder = lazy(() => import('@/pages/dealer/DealerQuickOrder'));
const DealerOrders = lazy(() => import('@/pages/dealer/DealerOrders'));
const DealerRfq = lazy(() => import('@/pages/dealer/DealerRfq'));
const DealerProfilePage = lazy(() => import('@/pages/dealer/DealerProfilePage'));
const DealerRegister = lazy(() => import('@/pages/dealer/DealerRegister'));
const FaqPage = lazy(() => import('@/pages/informational/FaqPage'));
const ContactPage = lazy(() => import('@/pages/informational/ContactPage'));
const AboutPage = lazy(() => import('@/pages/informational/AboutPage'));
const ShippingPolicyPage = lazy(() => import('@/pages/informational/ShippingPolicyPage'));
const ReturnsPolicyPage = lazy(() => import('@/pages/informational/ReturnsPolicyPage'));
const PrivacyPolicyPage = lazy(() => import('@/pages/informational/PrivacyPolicyPage'));
const TermsPage = lazy(() => import('@/pages/informational/TermsPage'));
const NotFoundPage = lazy(() => import('@/pages/informational/NotFoundPage'));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'shop', element: <ShopPage /> },
      { path: 'shop/:categorySlug', element: <CategoryPage /> },
      { path: 'product/:slug', element: <ProductPage /> },
      { path: 'search', element: <SearchPage /> },
      { path: 'new-arrivals', element: <NewArrivalsPage /> },
      { path: 'best-sellers', element: <BestSellersPage /> },
      { path: 'trending', element: <TrendingPage /> },
      { path: 'sale', element: <SalePage /> },
      { path: 'wishlist', element: <WishlistPage /> },
      { path: 'compare', element: <ComparePage /> },
      { path: 'cart', element: <CartPage /> },
      { path: 'checkout', element: <CheckoutPage /> },
      { path: 'order-confirmation/:orderId', element: <OrderConfirmationPage /> },
      { path: 'track-order', element: <OrderTrackingPage /> },
      { path: 'signin', element: <SignInPage /> },
      { path: 'signup', element: <SignUpPage /> },
      { path: 'forgot-password', element: <ForgotPasswordPage /> },
      { path: 'reset-password', element: <ResetPasswordPage /> },
      { path: 'verify-email', element: <EmailVerificationPage /> },
      {
        path: 'account',
        element: <AccountLayout />,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: 'profile', element: <ProfileSettingsPage /> },
          { path: 'addresses', element: <AddressesPage /> },
          { path: 'orders', element: <OrdersPage /> },
          { path: 'orders/:orderId', element: <OrderDetailPage /> },
          { path: 'wishlist', element: <AccountWishlistPage /> },
          { path: 'reviews', element: <ReviewsPage /> },
          { path: 'support', element: <SupportPage /> },
        ],
      },
      {
        path: 'admin',
        element: <AdminLayout />,
        children: [
          { index: true, element: <AdminDashboard /> },
          { path: 'analytics', element: <AdminAnalytics /> },
          { path: 'orders', element: <AdminOrders /> },
          { path: 'products', element: <AdminProducts /> },
          { path: 'categories', element: <AdminCategories /> },
          { path: 'inventory', element: <AdminInventory /> },
          { path: 'dealers', element: <AdminDealers /> },
          { path: 'customers', element: <AdminCustomers /> },
          { path: 'coupons', element: <AdminCoupons /> },
          { path: 'reviews', element: <AdminReviews /> },
          { path: 'returns', element: <AdminReturns /> },
          { path: 'subscribers', element: <AdminSubscribers /> },
          { path: 'settings', element: <AdminSettings /> },
        ],
      },
      {
        path: 'dealer',
        element: <DealerLayout />,
        children: [
          { index: true, element: <DealerDashboard /> },
          { path: 'catalog', element: <DealerCatalog /> },
          { path: 'quick-order', element: <DealerQuickOrder /> },
          { path: 'orders', element: <DealerOrders /> },
          { path: 'rfq', element: <DealerRfq /> },
          { path: 'profile', element: <DealerProfilePage /> },
        ],
      },
      { path: 'dealer/register', element: <DealerRegister /> },
      { path: 'dealer/apply', element: <DealerRegister /> },
      { path: 'faq', element: <FaqPage /> },
      { path: 'contact', element: <ContactPage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'shipping', element: <ShippingPolicyPage /> },
      { path: 'returns', element: <ReturnsPolicyPage /> },
      { path: 'privacy', element: <PrivacyPolicyPage /> },
      { path: 'terms', element: <TermsPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
