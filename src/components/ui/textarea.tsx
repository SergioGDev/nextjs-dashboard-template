'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={textareaId} className="text-sm font-medium text-[var(--text-primary)]">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            'w-full min-h-20 rounded-lg border bg-[var(--surface)] text-[var(--text-primary)] text-sm px-3 py-2',
            'placeholder:text-[var(--text-muted)] transition-colors resize-y',
            'focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent',
            'disabled:opacity-40 disabled:cursor-not-allowed',
            error
              ? 'border-[var(--error)]'
              : 'border-[var(--border)] hover:border-[var(--border-strong)]',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-[var(--error)]">{error}</p>}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';
