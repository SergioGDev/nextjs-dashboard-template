'use client';

import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  placeholder?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, id, children, placeholder, ...props }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={selectId} className="text-sm font-medium text-[var(--text-primary)]">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={cn(
              'w-full h-9 rounded-lg border bg-[var(--surface)] text-[var(--text-primary)] text-sm pl-3 pr-8',
              'appearance-none cursor-pointer transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent',
              'disabled:opacity-40 disabled:cursor-not-allowed',
              error
                ? 'border-[var(--error)]'
                : 'border-[var(--border)] hover:border-[var(--border-strong)]',
              className
            )}
            {...props}
          >
            {placeholder && <option value="">{placeholder}</option>}
            {children}
          </select>
          <ChevronDown
            size={14}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none"
          />
        </div>
        {error && <p className="text-xs text-[var(--error)]">{error}</p>}
      </div>
    );
  }
);
Select.displayName = 'Select';
