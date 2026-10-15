import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Heart,
  Share2,
  Truck,
  RotateCcw,
  ShieldCheck,
  Check,
  Minus,
  Plus,
  Scale,
  Sparkles,
  Maximize2,
  Star,
  ThumbsUp,
  MessageSquare,
} from 'lucide-react';
import type { ProductColor, ProductSize, Review } from '@/types';
import { useProduct, useRelatedProducts } from '@/hooks/useQueries';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useCompareStore } from '@/store/compareStore';
import { useRecentlyViewedStore } from '@/store/recentlyViewedStore';
import { useToastStore } from '@/store/toastStore';
import { reviewService } from '@/services/reviewService';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { RatingStars } from '@/components/ui/RatingStars';
import { PriceDisplay } from '@/components/ui/PriceDisplay';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ProductCard } from '@/components/product/ProductCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { Dialog } from '@/components/ui/Dialog';
import { useSeo } from '@/hooks/useSeo';
import { useReducedMotion } from '@/hooks/useUi';
import { formatPrice } from '@/utils/format';
import { cn } from '@/utils/cn';

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const reduceMotion = useReducedMotion();

  const { data: product, isLoading, isError } = useProduct(slug);
  const { data: relatedProducts = [] } = useRelatedProducts(product?.id);

  const addItemToCart = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);

  const isInWishlist = useWishlistStore((state) => (product ? state.isInWishlist(product.id) : false));
  const toggleWishlist = useWishlistStore((state) => state.toggleItem);

  const isInCompare = useCompareStore((state) => (product ? state.isInCompare(product.id) : false));
  const toggleCompare = useCompareStore((state) => state.toggleItem);

  const addRecentlyViewed = useRecentlyViewedStore((state) => state.addItem);
  const toastSuccess = useToastStore((state) => state.success);
  const toastInfo = useToastStore((state) => state.info);

  // Component state
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [selectedColor, setSelectedColor] = useState<ProductColor | undefined>(undefined);
  const [selectedSize, setSelectedSize] = useState<ProductSize | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isWriteReviewOpen, setIsWriteReviewOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'specs' | 'shipping'>('details');

  // Reviews state
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewSort, setReviewSort] = useState<'helpful' | 'newest' | 'highest'>('helpful');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewTitle, setNewReviewTitle] = useState('');
  const [newReviewBody, setNewReviewBody] = useState('');
  const [newReviewAuthor, setNewReviewAuthor] = useState('');

  // Frequently bought together state
  const [fbtIncluded, setFbtIncluded] = useState<Record<string, boolean>>({});

  // Sync initial selections when product loads
  useEffect(() => {
    if (product) {
      addRecentlyViewed(product);
      setSelectedImageIdx(0);
      if (product.colors && product.colors.length > 0) {
        setSelectedColor(product.colors[0]);
      } else {
        setSelectedColor(undefined);
      }
      if (product.sizes && product.sizes.length > 0) {
        const available = product.sizes.find((s) => s.available) ?? product.sizes[0];
        setSelectedSize(available);
      } else {
        setSelectedSize(undefined);
      }
      setQuantity(1);

      // Load reviews
      setReviewsLoading(true);
      reviewService
        .list({ productId: product.id, sort: reviewSort })
        .then((res) => {
          setReviews(res.data);
        })
        .finally(() => setReviewsLoading(false));
    }
  }, [product?.id, reviewSort]);

  // Sync FBT initial checks
  useEffect(() => {
    if (relatedProducts.length > 0) {
      const initial: Record<string, boolean> = {};
      relatedProducts.slice(0, 2).forEach((p) => {
        initial[p.id] = true;
      });
      setFbtIncluded(initial);
    }
  }, [relatedProducts]);

  useSeo({
    title: product ? `${product.name} — ${product.brand}` : 'Product Details',
    description: product?.shortDescription ?? product?.description ?? 'Discover luxury essentials at AFRO & CO.',
  });

  if (isLoading) {
    return (
      <div className="mx-auto max-w-[1600px] px-4 py-12 sm:px-6 lg:px-10">
        <Skeleton className="h-6 w-48 mb-8" />
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7 space-y-4">
            <Skeleton className="aspect-[4/5] w-full" />
            <div className="grid grid-cols-4 gap-4">
              <Skeleton className="aspect-square" />
              <Skeleton className="aspect-square" />
              <Skeleton className="aspect-square" />
              <Skeleton className="aspect-square" />
            </div>
          </div>
          <div className="lg:col-span-5 space-y-6">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="py-24">
        <EmptyState
          title="Product not found"
          message="The piece you are looking for may have been retired or moved to an archive collection."
          action={
            <Link to="/shop">
              <Button>Return to Catalog</Button>
            </Link>
          }
        />
      </div>
    );
  }

  const currentImage = product.images[selectedImageIdx] ?? product.images[0];

  const handleAddToCart = () => {
    addItemToCart(product, quantity, selectedColor, selectedSize);
    toastSuccess('Added to bag', `${quantity}× ${product.name} added to your shopping bag.`);
    openCart();
  };

  const handleAddFbtBundle = () => {
    // Add main product
    addItemToCart(product, 1, selectedColor, selectedSize);
    // Add selected related products
    relatedProducts.slice(0, 2).forEach((p) => {
      if (fbtIncluded[p.id]) {
        addItemToCart(p, 1, p.colors?.[0], p.sizes?.[0]);
      }
    });
    toastSuccess('Bundle added', 'Selected ensemble items have been added to your bag.');
    openCart();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.shortDescription,
          url: window.location.href,
        });
      } catch {
        // Ignored if cancelled
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toastInfo('Link copied', 'Product link copied to clipboard.');
    }
  };

  const handleHelpfulVote = (reviewId: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, helpful: r.helpful + 1 } : r))
    );
    toastSuccess('Feedback recorded', 'Thank you for your feedback.');
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewTitle.trim() || !newReviewBody.trim()) return;

    const newRev: Review = {
      id: `rev-${Date.now()}`,
      productId: product.id,
      userId: 'guest-1',
      userName: newReviewAuthor.trim() || 'Verified Client',
      rating: newReviewRating,
      title: newReviewTitle.trim(),
      body: newReviewBody.trim(),
      isVerifiedPurchase: true,
      createdAt: new Date().toISOString(),
      helpful: 0,
    };

    setReviews([newRev, ...reviews]);
    setIsWriteReviewOpen(false);
    setNewReviewTitle('');
    setNewReviewBody('');
    toastSuccess('Review submitted', 'Your review has been published. Thank you for sharing your impression.');
  };

  // Frequently bought together calculations
  const fbtProducts = relatedProducts.slice(0, 2);
  const fbtBundlePrice =
    product.price +
    fbtProducts.reduce((sum, p) => (fbtIncluded[p.id] ? sum + p.price : sum), 0);

  return (
    <div className="bg-[var(--bg-primary)]">
      {/* ─── Breadcrumb ────────────────────────────────────────────────────────── */}
      <div className="border-b border-[var(--border-color)] bg-[var(--bg-secondary)]/40">
        <div className="mx-auto max-w-[1600px] px-4 py-3 sm:px-6 lg:px-10">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Shop', href: '/shop' },
              { label: product.category, href: `/shop/${product.category.toLowerCase()}` },
              { label: product.name },
            ]}
          />
        </div>
      </div>

      <div className="mx-auto max-w-[1600px] px-4 py-8 sm:px-6 lg:px-10 lg:py-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          {/* ─── Left column: Gallery ────────────────────────────────────────────── */}
          <div className="lg:col-span-7">
            <div className="flex flex-col-reverse gap-4 sm:flex-row">
              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto sm:w-20 sm:flex-col sm:overflow-visible">
                  {product.images.map((img, idx) => (
                    <button
                      key={img.id ?? idx}
                      type="button"
                      onClick={() => setSelectedImageIdx(idx)}
                      className={cn(
                        'relative aspect-[4/5] w-16 shrink-0 overflow-hidden border bg-[var(--bg-secondary)] transition-all sm:w-full',
                        selectedImageIdx === idx
                          ? 'border-[var(--text-primary)] ring-1 ring-[var(--text-primary)]'
                          : 'border-[var(--border-color)] opacity-60 hover:opacity-100'
                      )}
                    >
                      <img src={img.url} alt={img.alt} className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Main image */}
              <div className="relative flex-1 overflow-hidden border border-[var(--border-color)] bg-[var(--bg-secondary)]">
                <div className="group relative aspect-[4/5] w-full cursor-zoom-in overflow-hidden">
                  <motion.img
                    key={currentImage?.url}
                    initial={reduceMotion ? undefined : { opacity: 0.3 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    src={currentImage?.url}
                    alt={currentImage?.alt ?? product.name}
                    className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                    onClick={() => setIsZoomOpen(true)}
                  />

                  {/* Zoom hint overlay */}
                  <button
                    type="button"
                    onClick={() => setIsZoomOpen(true)}
                    className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--bg-primary)]/80 text-[var(--text-primary)] backdrop-blur-md transition-colors hover:bg-[var(--bg-primary)]"
                    aria-label="Enlarge image"
                  >
                    <Maximize2 className="h-4 w-4" />
                  </button>

                  {/* Badge */}
                  {product.status !== 'default' && (
                    <div className="absolute left-4 top-4">
                      <Badge variant={product.status === 'sale' ? 'sale' : 'default'}>
                        {product.status.replace('-', ' ')}
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Product editorial highlight strip */}
            <div className="mt-8 grid grid-cols-3 gap-4 border-y border-[var(--border-color)] py-6">
              <div className="flex items-center gap-3">
                <Truck className="h-5 w-5 text-[var(--color-noir-gold)] shrink-0" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-primary)]">
                    Complimentary Shipping
                  </p>
                  <p className="text-[11px] text-[var(--text-muted)]">On orders over $150</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <RotateCcw className="h-5 w-5 text-[var(--color-noir-gold)] shrink-0" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-primary)]">
                    30-Day Returns
                  </p>
                  <p className="text-[11px] text-[var(--text-muted)]">Doorstep courier pickup</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-[var(--color-noir-gold)] shrink-0" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-primary)]">
                    Atelier Certified
                  </p>
                  <p className="text-[11px] text-[var(--text-muted)]">Numbered authenticity</p>
                </div>
              </div>
            </div>
          </div>

          {/* ─── Right column: Product Details & Purchase Form ───────────────────── */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              {/* Brand & Category */}
              <div className="flex items-center justify-between">
                <p className="font-heading text-xs font-bold uppercase tracking-[0.25em] text-[var(--color-noir-gold)]">
                  {product.brand}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => toggleWishlist(product)}
                    className={cn(
                      'flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border-color)] transition-colors',
                      isInWishlist
                        ? 'border-red-500 bg-red-50 text-red-600 dark:bg-red-950/40'
                        : 'hover:border-[var(--text-primary)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                    )}
                    aria-label={isInWishlist ? 'Remove from wishlist' : 'Save to wishlist'}
                  >
                    <Heart className={cn('h-4 w-4', isInWishlist && 'fill-current')} />
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleCompare(product)}
                    className={cn(
                      'flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border-color)] transition-colors',
                      isInCompare
                        ? 'border-[var(--text-primary)] bg-[var(--text-primary)] text-[var(--bg-primary)]'
                        : 'hover:border-[var(--text-primary)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                    )}
                    aria-label={isInCompare ? 'In comparison' : 'Compare piece'}
                  >
                    <Scale className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleShare}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border-color)] text-[var(--text-muted)] transition-colors hover:border-[var(--text-primary)] hover:text-[var(--text-primary)]"
                    aria-label="Share product"
                  >
                    <Share2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Title */}
              <h1 className="mt-3 font-heading text-3xl font-extrabold tracking-tight text-[var(--text-primary)] lg:text-4xl">
                {product.name}
              </h1>

              {/* Ratings and Reviews Link */}
              <div className="mt-3 flex items-center gap-3">
                <RatingStars rating={product.rating} size="sm" />
                <span className="text-xs font-semibold text-[var(--text-primary)]">
                  {product.rating.toFixed(1)}
                </span>
                <span className="text-[var(--text-muted)] text-xs">•</span>
                <a
                  href="#customer-reviews"
                  className="text-xs text-[var(--text-muted)] underline-offset-4 hover:underline"
                >
                  {product.reviewCount} customer reviews
                </a>
              </div>

              {/* Price */}
              <div className="mt-5 flex items-baseline gap-4">
                <PriceDisplay
                  price={product.price}
                  originalPrice={product.originalPrice}
                  currency={product.currency}
                  size="lg"
                />
                {product.discount && product.discount > 0 && (
                  <span className="rounded-none bg-red-600 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-white">
                    Save {product.discount}%
                  </span>
                )}
              </div>

              {/* Short description */}
              <p className="mt-5 text-sm leading-relaxed text-[var(--text-muted)]">
                {product.shortDescription || product.description}
              </p>

              {/* Stock status indicator */}
              <div className="mt-4 flex items-center gap-2 text-xs">
                {product.stock > 0 ? (
                  <>
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-emerald-700 dark:text-emerald-400 font-medium">
                      In Stock {product.stock <= 5 && `— Only ${product.stock} pieces remaining`}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="h-2 w-2 rounded-full bg-red-500" />
                    <span className="text-red-600 font-medium">Temporarily out of stock</span>
                  </>
                )}
              </div>

              {/* Color selector */}
              {product.colors && product.colors.length > 0 && (
                <div className="mt-6 border-t border-[var(--border-color)] pt-6">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
                      Color: <span className="font-normal text-[var(--text-muted)]">{selectedColor?.name}</span>
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2.5">
                    {product.colors.map((c) => (
                      <button
                        key={c.slug}
                        type="button"
                        onClick={() => setSelectedColor(c)}
                        className={cn(
                          'relative h-8 w-8 rounded-full border border-[var(--border-color)] transition-all',
                          selectedColor?.slug === c.slug
                            ? 'ring-2 ring-[var(--color-noir-gold)] ring-offset-2 ring-offset-[var(--bg-primary)] scale-110 shadow-sm'
                            : 'hover:scale-105'
                        )}
                        style={{ backgroundColor: c.hex }}
                        aria-label={c.name}
                        title={c.name}
                      >
                        {selectedColor?.slug === c.slug && (
                          <Check
                            className={cn(
                              'absolute inset-0 m-auto h-3.5 w-3.5',
                              ['#ffffff', '#fff', '#f8fafc', '#fafafa'].includes(c.hex.toLowerCase())
                                ? 'text-black'
                                : 'text-white'
                            )}
                          />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size selector */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mt-6 border-t border-[var(--border-color)] pt-6">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
                      Size: <span className="font-normal text-[var(--text-muted)]">{selectedSize?.label}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsSizeGuideOpen(true)}
                      className="text-xs text-[var(--color-noir-gold)] underline-offset-4 hover:underline"
                    >
                      Size Guide
                    </button>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {product.sizes.map((s) => (
                      <button
                        key={s.slug}
                        type="button"
                        disabled={!s.available}
                        onClick={() => setSelectedSize(s)}
                        className={cn(
                          'flex h-10 min-w-12 items-center justify-center border px-3 text-xs font-semibold uppercase tracking-wider transition-all',
                          selectedSize?.slug === s.slug
                            ? 'border-[var(--color-noir-gold)] bg-[var(--color-noir-gold)] text-[var(--brand-contrast-text,#0A0A0A)] font-bold shadow-sm'
                            : s.available
                            ? 'border-[var(--border-color)] bg-transparent text-[var(--text-primary)] hover:border-[var(--color-noir-gold)] hover:text-[var(--color-noir-gold)]'
                            : 'border-[var(--border-color)] bg-[var(--bg-secondary)]/50 text-[var(--text-muted)]/40 line-through cursor-not-allowed'
                        )}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity selector & Add to Bag */}
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <div className="flex h-12 items-center border border-[var(--border-color)] bg-[var(--bg-primary)]">
                  <button
                    type="button"
                    disabled={quantity <= 1}
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="flex h-full w-12 items-center justify-center text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)] disabled:opacity-30"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-10 text-center font-heading text-sm font-bold text-[var(--text-primary)]">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    disabled={quantity >= product.stock}
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    className="flex h-full w-12 items-center justify-center text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)] disabled:opacity-30"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>

                <Button
                  size="lg"
                  className="h-12 flex-1"
                  disabled={product.stock <= 0}
                  onClick={handleAddToCart}
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  {product.stock > 0 ? `Add to Bag • ${formatPrice(product.price * quantity, product.currency)}` : 'Out of Stock'}
                </Button>
              </div>
            </div>

            {/* Accordion / Tabs section */}
            <div className="mt-10 border-t border-[var(--border-color)] pt-6">
              <div className="flex border-b border-[var(--border-color)]">
                <button
                  type="button"
                  onClick={() => setActiveTab('details')}
                  className={cn(
                    'pb-3 text-xs font-bold uppercase tracking-wider transition-colors mr-6',
                    activeTab === 'details'
                      ? 'border-b-2 border-[var(--color-noir-gold)] text-[var(--color-noir-gold)]'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                  )}
                >
                  Details &amp; Care
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('specs')}
                  className={cn(
                    'pb-3 text-xs font-bold uppercase tracking-wider transition-colors mr-6',
                    activeTab === 'specs'
                      ? 'border-b-2 border-[var(--color-noir-gold)] text-[var(--color-noir-gold)]'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                  )}
                >
                  Specifications
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('shipping')}
                  className={cn(
                    'pb-3 text-xs font-bold uppercase tracking-wider transition-colors',
                    activeTab === 'shipping'
                      ? 'border-b-2 border-[var(--color-noir-gold)] text-[var(--color-noir-gold)]'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                  )}
                >
                  Shipping &amp; Returns
                </button>
              </div>

              <div className="py-4 text-xs leading-relaxed text-[var(--text-muted)]">
                {activeTab === 'details' && (
                  <div className="space-y-3">
                    <p>{product.description}</p>
                    {product.features && product.features.length > 0 && (
                      <ul className="list-inside list-disc space-y-1 pt-2">
                        {product.features.map((f, i) => (
                          <li key={i}>{f}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}

                {activeTab === 'specs' && (
                  <div className="grid grid-cols-2 gap-y-2">
                    {product.specifications ? (
                      Object.entries(product.specifications).map(([key, val]) => (
                        <div key={key} className="contents">
                          <span className="font-semibold text-[var(--text-primary)]">{key}:</span>
                          <span>{val}</span>
                        </div>
                      ))
                    ) : (
                      <>
                        <span className="font-semibold text-[var(--text-primary)]">Category:</span>
                        <span>{product.category}</span>
                        <span className="font-semibold text-[var(--text-primary)]">Material:</span>
                        <span>Virgin Wool &amp; Silk blend</span>
                        <span className="font-semibold text-[var(--text-primary)]">Origin:</span>
                        <span>Crafted in Italy</span>
                      </>
                    )}
                  </div>
                )}

                {activeTab === 'shipping' && (
                  <div className="space-y-2">
                    <p>
                      {product.shippingInfo ||
                        'Orders placed before 2:00 PM EST ship the same business day in signature gift packaging.'}
                    </p>
                    <p>
                      {product.returnPolicy ||
                        'Complimentary courier pickup available within 30 days of delivery. Returns must be in original condition with security tags attached.'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ─── Frequently Bought Together ────────────────────────────────────────── */}
        {fbtProducts.length > 0 && (
          <section className="mt-20 border-t border-[var(--border-color)] pt-16">
            <h2 className="font-heading text-2xl font-bold tracking-tight text-[var(--text-primary)]">
              Frequently Styled Together
            </h2>
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              Curated by our atelier stylists to complete this silhouette.
            </p>

            <div className="mt-8 flex flex-col gap-8 rounded-none border border-[var(--border-color)] bg-[var(--bg-secondary)]/30 p-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap items-center gap-4">
                {/* Main product tile */}
                <div className="flex items-center gap-3">
                  <div className="h-20 w-16 overflow-hidden border border-[var(--border-color)] bg-[var(--bg-secondary)]">
                    <img src={product.images[0]?.url} alt={product.name} className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[var(--text-primary)] max-w-[140px] truncate">
                      {product.name}
                    </p>
                    <p className="text-xs font-bold text-[var(--text-primary)]">
                      {formatPrice(product.price, product.currency)}
                    </p>
                    <span className="text-[10px] text-[var(--color-noir-gold)] font-medium">This Piece</span>
                  </div>
                </div>

                {fbtProducts.map((p) => (
                  <div key={p.id} className="flex items-center gap-3">
                    <span className="text-xl font-light text-[var(--text-muted)]">+</span>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={fbtIncluded[p.id] ?? false}
                        onChange={(e) => setFbtIncluded({ ...fbtIncluded, [p.id]: e.target.checked })}
                        className="rounded border-[var(--border-color)] accent-[var(--text-primary)]"
                      />
                      <div className="h-20 w-16 overflow-hidden border border-[var(--border-color)] bg-[var(--bg-secondary)]">
                        <img src={p.images[0]?.url} alt={p.name} className="h-full w-full object-cover" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-[var(--text-primary)] max-w-[140px] truncate">
                          {p.name}
                        </p>
                        <p className="text-xs font-bold text-[var(--text-primary)]">
                          {formatPrice(p.price, p.currency)}
                        </p>
                      </div>
                    </label>
                  </div>
                ))}
              </div>

              {/* Bundle Action */}
              <div className="border-t border-[var(--border-color)] pt-4 lg:border-t-0 lg:border-l lg:pl-8 lg:pt-0">
                <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider">Total Ensemble</p>
                <p className="font-heading text-2xl font-bold text-[var(--text-primary)]">
                  {formatPrice(fbtBundlePrice, product.currency)}
                </p>
                <Button className="mt-3 w-full" onClick={handleAddFbtBundle}>
                  Add Ensemble to Bag
                </Button>
              </div>
            </div>
          </section>
        )}

        {/* ─── Customer Reviews Section ────────────────────────────────────────── */}
        <section id="customer-reviews" className="mt-24 border-t border-[var(--border-color)] pt-16">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-heading text-xs font-bold uppercase tracking-[0.24em] text-[var(--color-noir-gold)]">
                Verified Impressions
              </p>
              <h2 className="mt-2 font-heading text-3xl font-extrabold tracking-tight text-[var(--text-primary)]">
                Client Experiences
              </h2>
            </div>
            <Button variant="outline" onClick={() => setIsWriteReviewOpen(true)}>
              <MessageSquare className="mr-2 h-4 w-4" />
              Write a Review
            </Button>
          </div>

          {/* Rating summary cards */}
          <div className="mt-10 grid grid-cols-1 gap-8 rounded-none border border-[var(--border-color)] bg-[var(--bg-secondary)]/20 p-8 md:grid-cols-3">
            <div className="flex flex-col items-center justify-center border-b border-[var(--border-color)] pb-6 text-center md:border-b-0 md:border-r md:pb-0 md:pr-6">
              <span className="font-heading text-5xl font-extrabold text-[var(--text-primary)]">
                {product.rating.toFixed(1)}
              </span>
              <div className="mt-2">
                <RatingStars rating={product.rating} size="md" />
              </div>
              <p className="mt-2 text-xs text-[var(--text-muted)]">
                Based on {product.reviewCount} verified purchases
              </p>
            </div>

            <div className="flex flex-col justify-center space-y-2 border-b border-[var(--border-color)] pb-6 md:border-b-0 md:border-r md:pb-0 md:pr-6">
              {[5, 4, 3, 2, 1].map((stars) => {
                const count = reviews.filter((r) => r.rating === stars).length;
                const pct = reviews.length > 0 ? (count / reviews.length) * 100 : stars === 5 ? 85 : 15;
                return (
                  <div key={stars} className="flex items-center gap-3 text-xs">
                    <span className="w-12 text-[var(--text-muted)]">{stars} stars</span>
                    <div className="h-2 flex-1 overflow-hidden bg-[var(--bg-secondary)]">
                      <div
                        className="h-full bg-[var(--color-noir-gold)] transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="w-8 text-right text-[var(--text-muted)]">{Math.round(pct)}%</span>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-col items-center justify-center text-center">
              <p className="font-heading text-3xl font-bold text-[var(--text-primary)]">98%</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-[var(--text-primary)]">
                Recommend This Piece
              </p>
              <p className="mt-2 max-w-[200px] text-[11px] text-[var(--text-muted)]">
                Clients highlight exemplary fabric drape and true-to-measure tailoring.
              </p>
            </div>
          </div>

          {/* Review list */}
          <div className="mt-10">
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-primary)]">
                Showing {reviews.length} Reviews
              </span>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-[var(--text-muted)]">Sort by:</span>
                <select
                  value={reviewSort}
                  onChange={(e) => setReviewSort(e.target.value as any)}
                  aria-label="Sort reviews by"
                  className="bg-transparent border border-[var(--border-color)] px-2.5 py-1 text-xs text-[var(--text-primary)] focus:outline-none"
                >
                  <option value="helpful">Most Helpful</option>
                  <option value="newest">Most Recent</option>
                  <option value="highest">Highest Rating</option>
                </select>
              </div>
            </div>

            {reviewsLoading ? (
              <div className="py-12 text-center text-xs text-[var(--text-muted)]">Loading impressions...</div>
            ) : reviews.length === 0 ? (
              <div className="py-12 text-center text-xs text-[var(--text-muted)]">
                Be the first to share an impression of this piece.
              </div>
            ) : (
              <div className="divide-y divide-[var(--border-color)]">
                {reviews.map((r) => (
                  <div key={r.id} className="py-6 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <RatingStars rating={r.rating} size="sm" />
                        <span className="text-xs font-bold text-[var(--text-primary)]">{r.title}</span>
                      </div>
                      <span className="text-[11px] text-[var(--text-muted)]">
                        {new Date(r.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>

                    <p className="text-xs leading-relaxed text-[var(--text-muted)]">{r.body}</p>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-2 text-[11px] text-[var(--text-muted)]">
                        <span className="font-semibold text-[var(--text-primary)]">{r.userName}</span>
                        {r.isVerifiedPurchase && (
                          <span className="inline-flex items-center gap-1 text-[var(--color-noir-gold)]">
                            <Check className="h-3 w-3" /> Verified Purchase
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleHelpfulVote(r.id)}
                        className="flex items-center gap-1.5 text-[11px] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                      >
                        <ThumbsUp className="h-3.5 w-3.5" />
                        Helpful ({r.helpful})
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ─── Related Products ────────────────────────────────────────────────── */}
        {relatedProducts.length > 0 && (
          <section className="mt-24 border-t border-[var(--border-color)] pt-16">
            <div className="flex items-end justify-between">
              <div>
                <p className="font-heading text-xs font-bold uppercase tracking-[0.24em] text-[var(--color-noir-gold)]">
                  The Wardrobe Edit
                </p>
                <h2 className="mt-2 font-heading text-3xl font-extrabold tracking-tight text-[var(--text-primary)]">
                  You May Also Admire
                </h2>
              </div>
              <Link
                to={`/shop/${product.category.toLowerCase()}`}
                className="hidden text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] hover:underline sm:inline-block"
              >
                Explore {product.category} →
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
              {relatedProducts.slice(0, 4).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* ─── Lightbox / Zoom Dialog ────────────────────────────────────────────── */}
      <Dialog
        open={isZoomOpen}
        onClose={() => setIsZoomOpen(false)}
        title={product.name}
        description="High-resolution atelier view"
        size="lg"
      >
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-black">
          <img
            src={currentImage?.url}
            alt={currentImage?.alt ?? product.name}
            className="h-full w-full object-contain"
          />
        </div>
      </Dialog>

      {/* ─── Size Guide Dialog ─────────────────────────────────────────────────── */}
      <Dialog
        open={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
        title="Atelier Sizing Guide"
        description="Measurements in inches. For custom tailoring inquiries, please contact our concierge."
      >
        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[var(--border-color)] font-heading uppercase tracking-wider text-[var(--text-primary)]">
                <th className="py-2.5">Size</th>
                <th className="py-2.5">Chest</th>
                <th className="py-2.5">Waist</th>
                <th className="py-2.5">Hips</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)] text-[var(--text-muted)]">
              <tr>
                <td className="py-2 font-semibold text-[var(--text-primary)]">XS (34)</td>
                <td className="py-2">34 - 36"</td>
                <td className="py-2">28 - 30"</td>
                <td className="py-2">34 - 36"</td>
              </tr>
              <tr>
                <td className="py-2 font-semibold text-[var(--text-primary)]">S (36)</td>
                <td className="py-2">36 - 38"</td>
                <td className="py-2">30 - 32"</td>
                <td className="py-2">36 - 38"</td>
              </tr>
              <tr>
                <td className="py-2 font-semibold text-[var(--text-primary)]">M (38)</td>
                <td className="py-2">38 - 40"</td>
                <td className="py-2">32 - 34"</td>
                <td className="py-2">38 - 40"</td>
              </tr>
              <tr>
                <td className="py-2 font-semibold text-[var(--text-primary)]">L (40)</td>
                <td className="py-2">40 - 42"</td>
                <td className="py-2">34 - 36"</td>
                <td className="py-2">40 - 42"</td>
              </tr>
              <tr>
                <td className="py-2 font-semibold text-[var(--text-primary)]">XL (42)</td>
                <td className="py-2">42 - 44"</td>
                <td className="py-2">36 - 38"</td>
                <td className="py-2">42 - 44"</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Dialog>

      {/* ─── Write a Review Dialog ─────────────────────────────────────────────── */}
      <Dialog
        open={isWriteReviewOpen}
        onClose={() => setIsWriteReviewOpen(false)}
        title="Share Your Impression"
        description="Your review helps discerning clients discover exceptional tailoring."
      >
        <form onSubmit={handleAddReview} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold uppercase tracking-wider text-[var(--text-primary)] mb-1">
              Your Rating
            </label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setNewReviewRating(star)}
                  className="p-1 text-[var(--color-noir-gold)] transition-transform hover:scale-125"
                >
                  <Star
                    className={cn(
                      'h-5 w-5',
                      star <= newReviewRating ? 'fill-[var(--color-noir-gold)]' : 'text-gray-300'
                    )}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-semibold uppercase tracking-wider text-[var(--text-primary)] mb-1">
              Your Name
            </label>
            <input
              type="text"
              required
              value={newReviewAuthor}
              onChange={(e) => setNewReviewAuthor(e.target.value)}
              placeholder="e.g. Eleanor Vance"
              className="w-full border border-[var(--border-color)] bg-[var(--bg-secondary)] px-3 py-2 text-xs text-[var(--text-primary)] focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold uppercase tracking-wider text-[var(--text-primary)] mb-1">
              Headline
            </label>
            <input
              type="text"
              required
              value={newReviewTitle}
              onChange={(e) => setNewReviewTitle(e.target.value)}
              placeholder="Summarize your impression"
              className="w-full border border-[var(--border-color)] bg-[var(--bg-secondary)] px-3 py-2 text-xs text-[var(--text-primary)] focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold uppercase tracking-wider text-[var(--text-primary)] mb-1">
              Impression Details
            </label>
            <textarea
              required
              rows={4}
              value={newReviewBody}
              onChange={(e) => setNewReviewBody(e.target.value)}
              placeholder="Share how the fabric feels, drape, sizing, and styling details..."
              className="w-full border border-[var(--border-color)] bg-[var(--bg-secondary)] px-3 py-2 text-xs text-[var(--text-primary)] focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setIsWriteReviewOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Publish Impression</Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
