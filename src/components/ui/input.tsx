'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, label, leftIcon, rightIcon, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-[var(--text-primary)]">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <span className="absolute left-3 text-[var(--text-muted)] pointer-events-none">{leftIcon}</span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full h-9 rounded-lg border bg-[var(--surface)] text-[var(--text-primary)] text-sm',
              'placeholder:text-[var(--text-muted)] transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent',
              'disabled:opacity-40 disabled:cursor-not-allowed',
              error
                ? 'border-[var(--error)] focus:ring-[var(--error)]'
                : 'border-[var(--border)] hover:border-[var(--border-strong)]',
              leftIcon ? 'pl-9' : 'pl-3',
              rightIcon ? 'pr-9' : 'pr-3',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <span className="absolute right-3 text-[var(--text-muted)]">{rightIcon}</span>
          )}
        </div>
        {error && <p className="text-xs text-[var(--error)]">{error}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';
