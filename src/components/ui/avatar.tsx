'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: AvatarSize;
}

const sizeClass: Record<AvatarSize, string> = {
  xs: 'nx-avatar--xs',
  sm: 'nx-avatar--sm',
  md: 'nx-avatar--md',
  lg: 'nx-avatar--lg',
  xl: 'nx-avatar--xl',
};

export function Avatar({ className, src, alt, fallback, size = 'md', ...props }: AvatarProps) {
  const [error, setError] = React.useState(false);
  const initials = fallback ?? alt?.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() ?? '?';

  return (
    <div
      className={cn('nx-avatar', sizeClass[size], className)}
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
