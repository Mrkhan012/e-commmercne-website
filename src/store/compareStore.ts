import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '@/types';

interface CompareState {
  items: Product[];
  isOpen: boolean;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  toggleItem: (product: Product) => void;
  clearCompare: () => void;
  openCompare: () => void;
  closeCompare: () => void;
  isInCompare: (productId: string) => boolean;
}

const MAX_COMPARE = 4;

export const useCompareStore = create<CompareState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product) =>
        set((state) => {
          if (state.items.some((p) => p.id === product.id)) return state;
          if (state.items.length >= MAX_COMPARE) {
            // Replace the oldest item to stay within the comparison limit.
            return { items: [...state.items.slice(1), product] };
          }
          return { items: [...state.items, product] };
        }),

      removeItem: (productId) =>
        set((state) => ({ items: state.items.filter((p) => p.id !== productId) })),

      toggleItem: (product) =>
        set((state) => {
          const exists = state.items.some((p) => p.id === product.id);
          if (exists) {
            return { items: state.items.filter((p) => p.id !== product.id) };
          }
          if (state.items.length >= MAX_COMPARE) {
            return { items: [...state.items.slice(1), product] };
          }
          return { items: [...state.items, product] };
        }),

      clearCompare: () => set({ items: [] }),
      openCompare: () => set({ isOpen: true }),
      closeCompare: () => set({ isOpen: false }),
      isInCompare: (productId) => get().items.some((p) => p.id === productId),
    }),
    {
      name: 'noir-compare',
      partialize: (state) => ({ items: state.items }),
    }
  )
);
