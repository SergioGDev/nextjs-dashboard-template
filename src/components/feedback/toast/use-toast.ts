import { useToastStore } from './toast.store';
import { toast } from './toast.api';

export function useToast() {
  const toasts = useToastStore((s) => s.toasts);
  return { toasts, toast };
}
