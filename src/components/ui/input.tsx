'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export type InputSize = 'sm' | 'md' | 'lg';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  size?: InputSize;
}

const sizeClass: Record<InputSize, string> = {
  sm: 'nx-input--sm',
  md: '',
  lg: 'nx-input--lg',
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, helperText, error, leftIcon, rightIcon, size = 'md', id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="nx-field">
        {label && (
          <label htmlFor={inputId} className="nx-label">
            {label}
          </label>
        )}
        <div className="nx-input-wrapper">
          {leftIcon && (
            <span className="nx-input-slot nx-input-slot--leading">{leftIcon}</span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'nx-input',
              sizeClass[size],
              leftIcon && 'has-leading',
              rightIcon && 'has-trailing',
              error && 'is-error',
              className,
            )}
            {...props}
          />
          {rightIcon && (
            <span className="nx-input-slot nx-input-slot--trailing">{rightIcon}</span>
          )}
        </div>
        {(error || helperText) && (
          <p className={cn('nx-help', error && 'is-error')}>{error ?? helperText}</p>
        )}
      </div>
    );
  },
);
Input.displayName = 'Input';
