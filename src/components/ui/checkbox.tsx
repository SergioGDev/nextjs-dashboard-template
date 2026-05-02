'use client';

import * as React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  description?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, description, id, ...props }, ref) => {
    const checkId = id || label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <label htmlFor={checkId} className="flex items-start gap-3 cursor-pointer group">
        <div className="relative mt-0.5 shrink-0">
          <input
            ref={ref}
            type="checkbox"
            id={checkId}
            className="sr-only peer"
            {...props}
          />
          <div
            className={cn(
              'h-4 w-4 rounded border transition-all',
              'border-[var(--border-strong)] bg-[var(--surface)]',
              'peer-checked:bg-[var(--accent)] peer-checked:border-[var(--accent)]',
              'peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--accent)] peer-focus-visible:ring-offset-1',
              'group-hover:border-[var(--accent)]',
              className
            )}
          />
          <Check
            size={10}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 pointer-events-none"
          />
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
Checkbox.displayName = 'Checkbox';
