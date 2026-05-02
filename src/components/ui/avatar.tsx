import * as React from 'react';
import { cn } from '@/lib/utils';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const sizeClasses = {
  xs: 'h-6 w-6 text-xs',
  sm: 'h-8 w-8 text-xs',
  md: 'h-9 w-9 text-sm',
  lg: 'h-11 w-11 text-base',
  xl: 'h-16 w-16 text-xl',
};

export function Avatar({ className, src, alt, fallback, size = 'md', ...props }: AvatarProps) {
  const [error, setError] = React.useState(false);
  const initials = fallback ?? alt?.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() ?? '?';

  return (
    <div
      className={cn(
        'relative inline-flex shrink-0 items-center justify-center rounded-full overflow-hidden',
        'bg-[var(--surface-raised)] text-[var(--text-secondary)] font-semibold select-none',
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {src && !error ? (
        <img
          src={src}
          alt={alt ?? ''}
          onError={() => setError(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
}
