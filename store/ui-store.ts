// store/ui-store.ts
import { create } from "zustand";

interface UIState {
  isMobileMenuOpen: boolean;
  isMobileFiltersOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  setMobileFiltersOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isMobileMenuOpen: false,
  isMobileFiltersOpen: false,
  setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
  setMobileFiltersOpen: (open) => set({ isMobileFiltersOpen: open }),
}));
