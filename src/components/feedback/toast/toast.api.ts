import { useToastStore } from './toast.store';
import type { ToastVariant, ToastOptions } from './toast.types';
import { TOAST } from '@config/constants';

function add(variant: ToastVariant, title: string, options?: ToastOptions) {
  useToastStore.getState().add({
    variant,
    title,
    description: options?.description,
    duration: options?.duration ?? TOAST.DURATION[variant],
  });
}

export const toast = {
  success: (title: string, options?: ToastOptions) => add('success', title, options),
  error: (title: string, options?: ToastOptions) => add('error', title, options),
  warning: (title: string, options?: ToastOptions) => add('warning', title, options),
  info: (title: string, options?: ToastOptions) => add('info', title, options),
  dismiss: (id: string) => useToastStore.getState().remove(id),
  clear: () => useToastStore.getState().clear(),
};
