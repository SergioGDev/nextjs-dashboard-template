'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export type SwitchSize = 'sm' | 'md';

export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: string;
  description?: string;
  size?: SwitchSize;
}

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, label, description, id, size = 'md', ...props }, ref) => {
    const switchId = id || label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <label
        htmlFor={switchId}
        className={cn('flex items-start gap-3 cursor-pointer', className)}
      >
        <div className={cn('nx-switch', size === 'sm' && 'nx-switch--sm')}>
          <input ref={ref} type="checkbox" id={switchId} {...props} />
          <div className="nx-switch__track" />
          <div className="nx-switch__thumb" />
        </div>
        {(label || description) && (
          <div>
            {label && (
              <span className="text-sm font-medium text-[var(--text-primary)]">{label}</span>
            )}
            {description && (
              <p className="text-xs text-[var(--text-muted)] mt-0.5">{description}</p>
            )}
          </div>
        )}
      </label>
    );
  }
);
Switch.displayName = 'Switch';
