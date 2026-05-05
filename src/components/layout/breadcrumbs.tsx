'use client';

import { useTranslations } from 'next-intl';
import { usePathname, Link } from '@/i18n/navigation';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const routeLabelKeys: Record<string, string> = {
  '': 'sidebar.items.dashboard',
  analytics: 'sidebar.items.analytics',
  reports: 'sidebar.items.reports',
  users: 'sidebar.items.users',
  settings: 'sidebar.items.settings',
  ui: 'sidebar.sections.ui',
  toasts: 'sidebar.items.toasts',
  'empty-states': 'sidebar.items.emptyStates',
  'error-states': 'sidebar.items.errorStates',
  skeletons: 'sidebar.items.skeletons',
  i18n: 'sidebar.items.i18n',
  sidebar: 'sidebar.items.uiSidebar',
  scheduled: 'sidebar.items.reportsScheduled',
  archived: 'sidebar.items.reportsArchived',
};

// Virtual group labels for UI sub-pages — these segments have no URL but appear in breadcrumbs
const uiGroupLabelKeys: Record<string, string> = {
  toasts: 'sidebar.items.uiComponents',
  'empty-states': 'sidebar.items.uiComponents',
  'error-states': 'sidebar.items.uiComponents',
  skeletons: 'sidebar.items.uiComponents',
  i18n: 'sidebar.items.uiComponents',
  sidebar: 'sidebar.items.uiLayout',
};

interface Crumb {
  label: string;
  href: string | null;
}

export function Breadcrumbs() {
  const t = useTranslations('common');
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  const crumbs: Crumb[] = [
    { label: t('sidebar.items.dashboard'), href: '/' },
    ...segments.map((seg, i) => ({
      label: routeLabelKeys[seg] ? t(routeLabelKeys[seg]) : seg.charAt(0).toUpperCase() + seg.slice(1),
      href: '/' + segments.slice(0, i + 1).join('/'),
    })),
  ].filter((c, i, arr) => i === 0 || c.label !== arr[0].label);

  // Inject virtual group label between /ui and its child pages
  if (segments.length === 2 && segments[0] === 'ui' && uiGroupLabelKeys[segments[1]]) {
    crumbs.splice(crumbs.length - 1, 0, {
      label: t(uiGroupLabelKeys[segments[1]]),
      href: null,
    });
  }

  if (crumbs.length <= 1) return null;

  return (
    <nav className="flex items-center gap-1 text-sm">
      {crumbs.map((crumb, i) => (
        <span key={`${crumb.href ?? crumb.label}-${i}`} className="flex items-center gap-1">
          {i > 0 && <ChevronRight size={13} className="text-[var(--text-muted)]" />}
          {i < crumbs.length - 1 ? (
            crumb.href ? (
              <Link
                href={crumb.href}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
              >
                {crumb.label}
              </Link>
            ) : (
              <span className="text-[var(--text-muted)]">{crumb.label}</span>
            )
          ) : (
            <span className={cn('text-[var(--text-primary)] font-medium')}>{crumb.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
