import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '@/types';
import { products as initialProducts } from '@/data/products';

interface ProductState {
  products: Product[];
  addProduct: (productData: Partial<Product> & { name: string; price: number; category: string }) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  resetProducts: () => void;
}

const generateSlug = (name: string): string =>
  name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const useProductStore = create<ProductState>()(
  persist(
    (set) => ({
      products: initialProducts,

      addProduct: (data) => {
        const now = new Date().toISOString();
        const id = `prod-${Date.now().toString(36)}`;
        const slug = data.slug?.trim() || `${generateSlug(data.name)}-${Math.floor(Math.random() * 1000)}`;
        const discount =
          data.originalPrice && data.originalPrice > data.price
            ? Math.round(((data.originalPrice - data.price) / data.originalPrice) * 100)
            : undefined;

        const newProduct: Product = {
          id,
          name: data.name,
          slug,
          brand: data.brand || 'AFRO & CO.',
          category: data.category,
          subcategory: data.subcategory || undefined,
          price: Number(data.price),
          originalPrice: data.originalPrice ? Number(data.originalPrice) : undefined,
          discount,
          currency: data.currency || 'USD',
          description: data.description || `${data.name} designed with artisanal precision by AFRO & CO.`,
          shortDescription: data.shortDescription || data.name,
          images:
            data.images && data.images.length > 0
              ? data.images
              : [
                  {
                    id: `img-${id}-1`,
                    url: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80',
                    alt: data.name,
                    width: 800,
                    height: 800,
                  },
                ],
          colors: data.colors || [
            { name: 'Onyx Black', hex: '#0A0A0A', slug: 'onyx-black' },
            { name: 'Atelier Ivory', hex: '#F9F8F5', slug: 'atelier-ivory' },
          ],
          sizes: data.sizes || [
            { label: 'S', slug: 's', available: true },
            { label: 'M', slug: 'm', available: true },
            { label: 'L', slug: 'l', available: true },
            { label: 'XL', slug: 'xl', available: true },
          ],
          stock: data.stock !== undefined ? Number(data.stock) : 25,
          rating: data.rating || 5.0,
          reviewCount: data.reviewCount || 0,
          tags: data.tags || ['luxury', 'new-arrival', data.category.toLowerCase()],
          status: data.status || 'new',
          shippingInfo: 'Complimentary priority white-glove courier',
          returnPolicy: '30-day atelier return window',
          createdAt: now,
          updatedAt: now,
        };

        set((state) => ({
          products: [newProduct, ...state.products],
        }));

        return newProduct;
      },

      updateProduct: (id, updates) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
          ),
        }));
      },

      deleteProduct: (id) => {
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        }));
      },

      resetProducts: () => {
        set({ products: initialProducts });
      },
    }),
    {
      name: 'afro-products-storage',
    }
  )
);
