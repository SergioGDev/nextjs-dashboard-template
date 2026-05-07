'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export type BadgeVariant = 'accent' | 'neutral' | 'success' | 'warning' | 'error' | 'info';

export type BadgeProps = Omit<React.HTMLAttributes<HTMLSpanElement>, 'aria-label'> & {
  variant?: BadgeVariant;
  leadingIcon?: React.ReactNode;
} & (
  | { onRemove: () => void; 'aria-label': string }
  | { onRemove?: never; 'aria-label'?: string }
);

const variantClass: Record<BadgeVariant, string> = {
  accent: 'nx-badge--accent',
  neutral: 'nx-badge--neutral',
  success: 'nx-badge--success',
  warning: 'nx-badge--warning',
  error: 'nx-badge--error',
  info: 'nx-badge--info',
};

export function Badge({
  className,
  variant = 'accent',
  leadingIcon,
  onRemove,
  children,
  'aria-label': ariaLabel,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn('nx-badge', variantClass[variant], className)}
      aria-label={onRemove ? undefined : ariaLabel}
      {...props}
    >
      {leadingIcon}
      {children}
      {onRemove && (
        <button
          type="button"
          className="nx-badge__remove"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          aria-label={ariaLabel}
        >
          <X size={10} strokeWidth={2.5} />
        </button>
      )}
    </span>
  );
}
