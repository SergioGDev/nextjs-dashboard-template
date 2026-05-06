import * as React from 'react';
import { cn } from '@/lib/utils';

export type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg';
export type SpinnerColor = 'current' | 'accent' | 'muted';

export interface SpinnerProps extends Omit<React.SVGAttributes<SVGSVGElement>, 'color'> {
  size?: SpinnerSize;
  color?: SpinnerColor;
  label?: string;
}

const sizeClasses: Record<SpinnerSize, string> = {
  xs: 'nx-spinner--xs',
  sm: 'nx-spinner--sm',
  md: 'nx-spinner--md',
  lg: 'nx-spinner--lg',
};

const colorClasses: Record<SpinnerColor, string> = {
  current: 'nx-spinner--current',
  accent: 'nx-spinner--accent',
  muted: 'nx-spinner--muted',
};

export function Spinner({
  size = 'md',
  color = 'current',
  label = 'Loading',
  className,
  ...props
}: SpinnerProps) {
  return (
    <svg
      className={cn('nx-spinner', sizeClasses[size], colorClasses[color], className)}
      viewBox="0 0 24 24"
      role="status"
      aria-label={label}
      {...props}
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        fill="none"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="40 60"
      />
    </svg>
  );
}
