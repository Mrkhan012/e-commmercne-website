import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Category, Subcategory } from '@/types';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-1',
    name: 'Clothing',
    slug: 'clothing',
    description: 'Elevated essentials and statement pieces for the modern wardrobe.',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80',
    productCount: 142,
    featured: true,
    subcategories: [
      { id: 'sub-1-1', name: 'Tops & Shirts', slug: 'tops-shirts', productCount: 48 },
      { id: 'sub-1-2', name: 'Trousers & Jeans', slug: 'trousers-jeans', productCount: 35 },
      { id: 'sub-1-3', name: 'Jackets & Coats', slug: 'jackets-coats', productCount: 28 },
      { id: 'sub-1-4', name: 'Dresses & Skirts', slug: 'dresses-skirts', productCount: 31 },
    ],
  },
  {
    id: 'cat-2',
    name: 'Shoes',
    slug: 'shoes',
    description: 'Crafted footwear that defines every step with intention.',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80',
    productCount: 87,
    featured: true,
    subcategories: [
      { id: 'sub-2-1', name: 'Sneakers', slug: 'sneakers', productCount: 32 },
      { id: 'sub-2-2', name: 'Boots', slug: 'boots', productCount: 22 },
      { id: 'sub-2-3', name: 'Loafers', slug: 'loafers', productCount: 18 },
      { id: 'sub-2-4', name: 'Heels', slug: 'heels', productCount: 15 },
    ],
  },
  {
    id: 'cat-3',
    name: 'Bags & Accessories',
    slug: 'bags-accessories',
    description: 'Sculptural bags and refined accessories for the discerning collector.',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80',
    productCount: 94,
    featured: true,
    subcategories: [
      { id: 'sub-3-1', name: 'Handbags', slug: 'handbags', productCount: 36 },
      { id: 'sub-3-2', name: 'Backpacks', slug: 'backpacks', productCount: 18 },
      { id: 'sub-3-3', name: 'Wallets', slug: 'wallets', productCount: 22 },
      { id: 'sub-3-4', name: 'Belts', slug: 'belts', productCount: 18 },
    ],
  },
  {
    id: 'cat-4',
    name: 'Watches & Jewelry',
    slug: 'watches-jewelry',
    description: 'Timeless horology and jewellery that transcends seasons.',
    image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&q=80',
    productCount: 63,
    featured: false,
    subcategories: [
      { id: 'sub-4-1', name: 'Watches', slug: 'watches', productCount: 28 },
      { id: 'sub-4-2', name: 'Necklaces', slug: 'necklaces', productCount: 20 },
      { id: 'sub-4-3', name: 'Rings', slug: 'rings', productCount: 15 },
    ],
  },
  {
    id: 'cat-5',
    name: 'Home & Lifestyle',
    slug: 'home-lifestyle',
    description: 'Curated objects for elevated living and considered spaces.',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
    productCount: 118,
    featured: false,
    subcategories: [
      { id: 'sub-5-1', name: 'Furniture', slug: 'furniture', productCount: 34 },
      { id: 'sub-5-2', name: 'Lighting', slug: 'lighting', productCount: 22 },
      { id: 'sub-5-3', name: 'Decor', slug: 'decor', productCount: 38 },
      { id: 'sub-5-4', name: 'Kitchen', slug: 'kitchen', productCount: 24 },
    ],
  },
  {
    id: 'cat-6',
    name: 'Beauty & Personal Care',
    slug: 'beauty-personal-care',
    description: 'Refined rituals and premium formulations for conscious self-care.',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80',
    productCount: 76,
    featured: false,
    subcategories: [
      { id: 'sub-6-1', name: 'Skincare', slug: 'skincare', productCount: 32 },
      { id: 'sub-6-2', name: 'Fragrance', slug: 'fragrance', productCount: 24 },
      { id: 'sub-6-3', name: 'Haircare', slug: 'haircare', productCount: 20 },
    ],
  },
  {
    id: 'cat-7',
    name: 'Electronics & Gadgets',
    slug: 'electronics-gadgets',
    description: 'Technology that merges seamlessly with the premium lifestyle.',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
    productCount: 52,
    featured: false,
    subcategories: [
      { id: 'sub-7-1', name: 'Audio', slug: 'audio', productCount: 20 },
      { id: 'sub-7-2', name: 'Wearables', slug: 'wearables', productCount: 16 },
      { id: 'sub-7-3', name: 'Accessories', slug: 'electronics-accessories', productCount: 16 },
    ],
  },
];

const generateCategorySlug = (name: string): string =>
  name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

export interface CreateCategoryInput {
  name: string;
  slug?: string;
  description?: string;
  image?: string;
  subcategories?: string[];
  featured?: boolean;
}

interface CategoryState {
  categories: Category[];
  addCategory: (input: CreateCategoryInput) => Category;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  resetCategories: () => void;
  getCategoryBySlug: (slug: string) => Category | undefined;
}

export const useCategoryStore = create<CategoryState>()(
  persist(
    (set, get) => ({
      categories: INITIAL_CATEGORIES,

      addCategory: (input) => {
        const id = `cat-${Date.now().toString(36)}`;
        const slug = input.slug?.trim() || generateCategorySlug(input.name);

        const parsedSubs: Subcategory[] = (input.subcategories || []).map((subName, idx) => ({
          id: `sub-${id}-${idx + 1}`,
          name: subName.trim(),
          slug: generateCategorySlug(subName),
          productCount: 0,
        }));

        const newCategory: Category = {
          id,
          name: input.name.trim(),
          slug,
          description:
            input.description?.trim() ||
            `Curated ${input.name.trim()} collection handcrafted with timeless luxury.`,
          image:
            input.image?.trim() ||
            'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80',
          productCount: 0,
          subcategories: parsedSubs.length > 0 ? parsedSubs : undefined,
          featured: Boolean(input.featured),
        };

        set((state) => ({
          categories: [...state.categories, newCategory],
        }));

        return newCategory;
      },

      updateCategory: (id, updates) =>
        set((state) => ({
          categories: state.categories.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          ),
        })),

      deleteCategory: (id) =>
        set((state) => ({
          categories: state.categories.filter((c) => c.id !== id),
        })),

      resetCategories: () => set({ categories: INITIAL_CATEGORIES }),

      getCategoryBySlug: (slug) =>
        get().categories.find((c) => c.slug.toLowerCase() === slug.toLowerCase()),
    }),
    {
      name: 'afro-categories-storage',
    }
  )
);
