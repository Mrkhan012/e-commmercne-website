import { useEffect } from 'react';

/**
 * Sets document metadata (title, description, Open Graph, canonical) per route.
 * A production build would use a server-rendered SEO solution, but this gives
 * correct metadata for client-side navigation.
 */
export const useSeo = (options: {
  title: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
}): void => {
  useEffect(() => {
    const siteName = 'AFRO & CO.';
    const fullTitle = options.title.includes(siteName)
      ? options.title
      : `${options.title} | ${siteName}`;

    document.title = fullTitle;

    const setMeta = (selector: string, attr: string, value: string, contentAttr = 'content') => {
      let el = document.head.querySelector<HTMLMetaElement>(selector);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, attr.startsWith('og:') ? 'property' : 'name');
        document.head.appendChild(el);
      }
      el.setAttribute(contentAttr, value);
    };

    if (options.description) {
      setMeta('meta[name="description"]', 'name', options.description);
      setMeta('meta[property="og:description"]', 'property', options.description);
    }
    setMeta('meta[property="og:title"]', 'property', fullTitle);
    setMeta('meta[property="og:type"]', 'property', options.type ?? 'website');
    setMeta('meta[name="twitter:card"]', 'name', 'summary_large_image');
    setMeta('meta[name="twitter:title"]', 'name', fullTitle);
    if (options.description) {
      setMeta('meta[name="twitter:description"]', 'name', options.description);
    }
    if (options.image) {
      setMeta('meta[property="og:image"]', 'property', options.image);
      setMeta('meta[name="twitter:image"]', 'name', options.image);
    }
    if (options.url) {
      let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
      if (!link) {
        link = document.createElement('link');
        link.rel = 'canonical';
        document.head.appendChild(link);
      }
      link.href = options.url;
    }
  }, [options.title, options.description, options.image, options.url, options.type]);
};

/** Injects Product structured data (JSON-LD) for rich search results. */
export const useProductStructuredData = (data: {
  name: string;
  description: string;
  image: string;
  price: number;
  currency: string;
  rating: number;
  reviewCount: number;
  slug: string;
  brand: string;
  inStock: boolean;
}): void => {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: data.name,
      description: data.description,
      image: data.image,
      brand: { '@type': 'Brand', name: data.brand },
      offers: {
        '@type': 'Offer',
        price: data.price,
        priceCurrency: data.currency,
        availability: data.inStock
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: data.rating,
        reviewCount: data.reviewCount,
      },
    });
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, [data]);
};
