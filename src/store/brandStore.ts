import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface BrandColorPreset {
  id: string;
  name: string;
  hex: string;
  description: string;
}

export const BRAND_COLOR_PRESETS: BrandColorPreset[] = [
  { id: 'gold', name: 'Imperial Gold', hex: '#C8A97E', description: 'Heritage luxury & warm atelier aesthetic' },
  { id: 'emerald', name: 'Emerald Royale', hex: '#10B981', description: 'Fine jewellery & prestigious heritage' },
  { id: 'sapphire', name: 'Sapphire Noir', hex: '#2563EB', description: 'Executive precision & modern nautical blue' },
  { id: 'crimson', name: 'Crimson Velvet', hex: '#E11D48', description: 'Haute couture passion & bold statement' },
  { id: 'amethyst', name: 'Imperial Violet', hex: '#8B5CF6', description: 'Bespoke distinction & sovereign elegance' },
  { id: 'amber', name: 'Cognac Amber', hex: '#D97706', description: 'Artisanal leathercraft & warm golden glow' },
  { id: 'platinum', name: 'Monochrome Slate', hex: '#71717A', description: 'Minimalist quiet luxury & clean architectural poise' },
];

interface BrandState {
  siteName: string;
  siteSubtitle: string;
  primaryColor: string;
  activePresetId: string;
  supportEmail: string;
  supportPhone: string;
  // Actions
  setSiteName: (name: string) => void;
  setSiteSubtitle: (subtitle: string) => void;
  setPrimaryColor: (hex: string, presetId?: string) => void;
  setSupportEmail: (email: string) => void;
  setSupportPhone: (phone: string) => void;
  resetBrandSettings: () => void;
}

const DEFAULT_BRAND = {
  siteName: 'AFRO & CO.',
  siteSubtitle: 'Haute Atelier & Luxury Goods',
  primaryColor: '#C8A97E',
  activePresetId: 'gold',
  supportEmail: 'concierge@afro.co',
  supportPhone: '+1 (800) 555-NOIR',
};

const applyColorToDOM = (hex: string) => {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.style.setProperty('--color-noir-gold', hex);
  root.style.setProperty('--shadow-gold', `0 0 20px ${hex}33`);
};

export const useBrandStore = create<BrandState>()(
  persist(
    (set) => ({
      ...DEFAULT_BRAND,

      setSiteName: (siteName) => {
        set({ siteName });
        if (typeof document !== 'undefined') {
          // Update base document title if currently default
          if (document.title.includes('AFRO & CO.')) {
            document.title = document.title.replace('AFRO & CO.', siteName);
          }
        }
      },

      setSiteSubtitle: (siteSubtitle) => set({ siteSubtitle }),

      setPrimaryColor: (hex, presetId = 'custom') => {
        applyColorToDOM(hex);
        set({ primaryColor: hex, activePresetId: presetId });
      },

      setSupportEmail: (supportEmail) => set({ supportEmail }),
      setSupportPhone: (supportPhone) => set({ supportPhone }),

      resetBrandSettings: () => {
        applyColorToDOM(DEFAULT_BRAND.primaryColor);
        set({ ...DEFAULT_BRAND });
      },
    }),
    {
      name: 'afro_brand_settings',
    }
  )
);

// Apply custom brand color on initial load
if (typeof window !== 'undefined') {
  try {
    const raw = localStorage.getItem('afro_brand_settings');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.state?.primaryColor) {
        applyColorToDOM(parsed.state.primaryColor);
      }
    }
  } catch {
    // Fall back to default
    applyColorToDOM(DEFAULT_BRAND.primaryColor);
  }
}
