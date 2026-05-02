'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { THEME } from '@config/constants';

interface UIState {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  accent: string;
  setAccent: (accent: string) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      accent: THEME.DEFAULT_ACCENT,
      setAccent: (accent) => set({ accent }),
    }),
    { name: THEME.UI_STORAGE_KEY }
  )
);
