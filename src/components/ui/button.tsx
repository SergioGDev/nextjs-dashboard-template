'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Spinner, type SpinnerSize } from './spinner';

export type ButtonVariant = 'default' | 'secondary' | 'ghost' | 'outline' | 'destructive' | 'link';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

interface ButtonBaseProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
}

type IconOnlyProps = {
  iconOnly: true;
  'aria-label': string;
};

type LabeledProps = {
  iconOnly?: false;
};

export type ButtonProps = ButtonBaseProps & (IconOnlyProps | LabeledProps);

const variantClasses: Record<ButtonVariant, string> = {
  default: 'bg-[var(--accent)] text-[var(--accent-foreground)] hover:bg-[var(--accent-hover)] shadow-sm',
  secondary: 'bg-[var(--surface-raised)] text-[var(--text-primary)] hover:bg-[var(--border-strong)] border border-[var(--border)]',
  ghost: 'text-[var(--text-secondary)] hover:bg-[var(--surface-raised)] hover:text-[var(--text-primary)]',
  outline: 'border border-[var(--border-strong)] text-[var(--text-primary)] hover:bg-[var(--surface-raised)]',
  destructive: 'bg-[var(--error)] text-white hover:opacity-90',
  link: 'text-[var(--accent)] underline-offset-4 hover:underline p-0 h-auto',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-xs gap-1.5',
  md: 'h-9 px-4 text-sm gap-2',
  lg: 'h-11 px-6 text-base gap-2',
  icon: 'h-9 w-9 p-0',
};

const iconOnlyClasses: Record<Exclude<ButtonSize, 'icon'>, string> = {
  sm: 'h-8 w-8 p-0',
  md: 'h-9 w-9 p-0',
  lg: 'h-11 w-11 p-0',
};

const spinnerSizeFor: Record<ButtonSize, SpinnerSize> = {
  sm: 'xs',
  md: 'sm',
  lg: 'md',
  icon: 'sm',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'default',
      size = 'md',
      loading,
      disabled,
      iconOnly,
      fullWidth,
      children,
      ...props
    },
    ref,
  ) => {
    const computedSizeClass = iconOnly && size !== 'icon'
      ? iconOnlyClasses[size]
      : sizeClasses[size];

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'relative inline-flex items-center justify-center rounded-lg font-medium transition-all duration-150',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]',
          'disabled:pointer-events-none disabled:opacity-40',
          variantClasses[variant],
          computedSizeClass,
          fullWidth && 'w-full',
          className,
        )}
        {...props}
      >
        {loading && (
          <span className="absolute inset-0 inline-flex items-center justify-center" aria-hidden="false">
            <Spinner size={spinnerSizeFor[size]} color="current" />
          </span>
        )}
        {loading ? (
          <span aria-hidden="true" className="invisible inline-flex items-center justify-center gap-[inherit]">
            {children}
          </span>
        ) : (
          children
        )}
      </button>
    );
  },
);
Button.displayName = 'Button';
