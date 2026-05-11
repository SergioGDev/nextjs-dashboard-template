'use client';

import * as React from 'react';
import Image from 'next/image';
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

const sizePx: Record<AvatarSize, number> = {
  xs: 24,
  sm: 32,
  md: 36,
  lg: 44,
  xl: 64,
};

export function Avatar({ className, src, alt, fallback, size = 'md', ...props }: AvatarProps) {
  const [error, setError] = React.useState(false);
  const initials = fallback ?? alt?.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() ?? '?';
  const px = sizePx[size];

  return (
    <div
      className={cn('nx-avatar', sizeClass[size], className)}
      {...props}
    >
      {src && !error ? (
        <Image
          src={src}
          alt={alt ?? ''}
          width={px}
          height={px}
          onError={() => setError(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
}
