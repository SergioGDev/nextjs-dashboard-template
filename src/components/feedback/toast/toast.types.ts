export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastItem {
  id: string;
  variant: ToastVariant;
  title: string;
  description?: string;
  duration: number;
  action?: ToastAction;
}

export interface ToastOptions {
  description?: string;
  duration?: number;
  action?: ToastAction;
}
