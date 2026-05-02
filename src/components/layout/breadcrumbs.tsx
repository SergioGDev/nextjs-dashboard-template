'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const routeLabels: Record<string, string> = {
  '': 'Dashboard',
  analytics: 'Analytics',
  reports: 'Reports',
  users: 'Users',
  settings: 'Settings',
};

export function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  const crumbs = [
    { label: 'Dashboard', href: '/' },
    ...segments.map((seg, i) => ({
      label: routeLabels[seg] ?? seg.charAt(0).toUpperCase() + seg.slice(1),
      href: '/' + segments.slice(0, i + 1).join('/'),
    })),
  ].filter((c, i, arr) => i === 0 || c.label !== arr[0].label);

  if (crumbs.length <= 1) return null;

  return (
    <nav className="flex items-center gap-1 text-sm">
      {crumbs.map((crumb, i) => (
        <span key={crumb.href} className="flex items-center gap-1">
          {i > 0 && <ChevronRight size={13} className="text-[var(--text-muted)]" />}
          {i < crumbs.length - 1 ? (
            <Link
              href={crumb.href}
              className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            >
              {crumb.label}
            </Link>
          ) : (
            <span className={cn('text-[var(--text-primary)] font-medium')}>{crumb.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
