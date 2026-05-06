'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export type TextareaSize = 'sm' | 'md' | 'lg';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
  size?: TextareaSize;
}

const sizeClass: Record<TextareaSize, string> = {
  sm: 'nx-textarea--sm',
  md: '',
  lg: 'nx-textarea--lg',
};

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, helperText, error, size = 'md', id, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="nx-field">
        {label && (
          <label htmlFor={textareaId} className="nx-label">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            'nx-textarea',
            sizeClass[size],
            error && 'is-error',
            className,
          )}
          {...props}
        />
        {(error || helperText) && (
          <p className={cn('nx-help', error && 'is-error')}>{error ?? helperText}</p>
        )}
      </div>
    );
  },
);
Textarea.displayName = 'Textarea';
