import { create } from 'zustand';
import type { ToastItem } from './toast.types';
import { TOAST } from '@config/constants';

interface ToastStore {
  toasts: ToastItem[];
  add: (item: Omit<ToastItem, 'id'>) => void;
  remove: (id: string) => void;
  clear: () => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  add: (item) =>
    set((state) => {
      const next = [...state.toasts, { ...item, id: crypto.randomUUID() }];
      return { toasts: next.length > TOAST.MAX_VISIBLE ? next.slice(-TOAST.MAX_VISIBLE) : next };
    }),
  remove: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
  clear: () => set({ toasts: [] }),
}));
