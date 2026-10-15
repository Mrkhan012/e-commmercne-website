import { HeroSection } from '@/components/home/HeroSection';
import { CategoryShowcase } from '@/components/home/CategoryShowcase';
import { NewArrivalsCarousel } from '@/components/home/NewArrivalsCarousel';
import { BestSellersGrid } from '@/components/home/BestSellersGrid';
import { PromoBanner } from '@/components/home/PromoBanner';
import { BrandStory } from '@/components/home/BrandStory';
import { FeaturedCollection } from '@/components/home/FeaturedCollection';
import { TrendingSection } from '@/components/home/TrendingSection';
import { ProductRecommendations } from '@/components/home/ProductRecommendations';
import { Testimonials } from '@/components/home/Testimonials';
import { BenefitsStrip } from '@/components/home/BenefitsStrip';
import { InstagramGallery } from '@/components/home/InstagramGallery';
import { HomeFaq } from '@/components/home/HomeFaq';
import { RecentlyViewedSection } from '@/components/home/RecentlyViewedSection';

/**
 * Homepage. Sections are ordered to alternate rhythm and background so no two
 * consecutive blocks read the same: dark hero, light grid, dark carousel,
 * tinted grid, dark promo, light editorial, light collection, light trending,
 * tinted recommendations, light testimonials, tinted benefits, light gallery,
 * tinted FAQ, light recently viewed.
 */
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CategoryShowcase />
      <NewArrivalsCarousel />
      <BestSellersGrid />
      <PromoBanner />
      <BrandStory />
      <FeaturedCollection />
      <TrendingSection />
      <ProductRecommendations />
      <Testimonials />
      <BenefitsStrip />
      <InstagramGallery />
      <HomeFaq />
      <RecentlyViewedSection />
    </>
  );
}
