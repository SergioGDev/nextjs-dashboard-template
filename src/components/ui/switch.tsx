'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  description?: string;
}

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, label, description, id, ...props }, ref) => {
    const switchId = id || label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <label htmlFor={switchId} className="flex items-start gap-3 cursor-pointer group">
        <div className="relative mt-0.5 shrink-0">
          <input ref={ref} type="checkbox" id={switchId} className="sr-only peer" {...props} />
          <div
            className={cn(
              'h-5 w-9 rounded-full border-2 border-transparent transition-all',
              'bg-[var(--border-strong)]',
              'peer-checked:bg-[var(--accent)]',
              'peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--accent)] peer-focus-visible:ring-offset-1',
              className
            )}
          />
          <div className="absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4" />
        </div>
        {(label || description) && (
          <div>
            {label && <span className="text-sm font-medium text-[var(--text-primary)]">{label}</span>}
            {description && <p className="text-xs text-[var(--text-muted)] mt-0.5">{description}</p>}
          </div>
        )}
      </label>
    );
  }
);
Switch.displayName = 'Switch';
