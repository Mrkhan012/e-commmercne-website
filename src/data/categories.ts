import type { Category } from '@/types';
import { INITIAL_CATEGORIES, useCategoryStore } from '@/store/categoryStore';

export const categories: Category[] = INITIAL_CATEGORIES;

export const getAllCategories = (): Category[] => {
  try {
    return useCategoryStore.getState().categories;
  } catch {
    return INITIAL_CATEGORIES;
  }
};

export const getCategoryBySlug = (slug: string): Category | undefined => {
  try {
    return useCategoryStore.getState().getCategoryBySlug(slug);
  } catch {
    return INITIAL_CATEGORIES.find((c) => c.slug.toLowerCase() === slug.toLowerCase());
  }
};

export const getCategoryById = (id: string): Category | undefined => {
  try {
    return useCategoryStore.getState().categories.find((c) => c.id === id);
  } catch {
    return INITIAL_CATEGORIES.find((c) => c.id === id);
  }
};

export const getFeaturedCategories = (): Category[] => {
  try {
    return useCategoryStore.getState().categories.filter((c) => c.featured);
  } catch {
    return INITIAL_CATEGORIES.filter((c) => c.featured);
  }
};
