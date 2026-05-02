import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'muted';
}

const variantClasses = {
  default: 'bg-[var(--accent-muted)] text-[var(--accent)] border-[var(--accent-muted)]',
  success: 'bg-[var(--success-muted)] text-[var(--success)] border-[var(--success-muted)]',
  warning: 'bg-[var(--warning-muted)] text-[var(--warning)] border-[var(--warning-muted)]',
  error: 'bg-[var(--error-muted)] text-[var(--error)] border-[var(--error-muted)]',
  info: 'bg-[var(--info-muted)] text-[var(--info)] border-[var(--info-muted)]',
  muted: 'bg-[var(--surface-raised)] text-[var(--text-muted)] border-[var(--border)]',
};

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium',
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
}
