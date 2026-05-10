'use client';

import { useTranslations } from 'next-intl';
import { usePathname, Link } from '@/i18n/navigation';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getRouteAncestors } from '@/lib/route-info';

export interface Crumb {
  label: string;
  href: string | null;
}

export interface BreadcrumbsProps {
  /** When provided, used directly instead of auto-derivation from the pathname. */
  crumbs?: Crumb[];
}

// ─── Auto-derivation ──────────────────────────────────────────────────────────

function buildCrumbs(pathname: string, t: (key: string) => string): Crumb[] {
  const dashboard: Crumb = { label: t('sidebar.items.dashboard'), href: '/' };

  if (pathname === '/') return [dashboard];

  const ancestors = getRouteAncestors(pathname);
  if (!ancestors) return [dashboard];

  const crumbs: Crumb[] = [dashboard];

  // /ui overview page: [Dashboard, UI(bold)]
  if (ancestors.linkHref === '/ui') {
    crumbs.push({ label: t('sidebar.sections.ui'), href: null });
    return crumbs;
  }

  // Any other UI-section page: prepend a "UI" crumb (with link)
  if (ancestors.sectionId === 'ui') {
    crumbs.push({ label: t('sidebar.sections.ui'), href: '/ui' });
  }

  // Group crumb — skip when the matched link IS the group overview
  if (ancestors.groupLabel && ancestors.linkHref !== ancestors.groupHref) {
    if (ancestors.groupHref) {
      // Clickable group (e.g. "Reports" for /reports/scheduled)
      crumbs.push({ label: t(ancestors.groupLabel), href: ancestors.groupHref });
    } else {
      // Virtual non-clickable group (e.g. "Components" in /ui/toasts)
      crumbs.push({ label: t(ancestors.groupLabel), href: null });
    }
  }

  // Group overview: the link IS the group → show group label as current
  if (ancestors.groupLabel && ancestors.linkHref === ancestors.groupHref) {
    crumbs.push({ label: t(ancestors.groupLabel), href: null });
    return crumbs;
  }

  // Dynamic segment (e.g. /users/123 matched via /users prefix)
  if (ancestors.isDynamicMatch && pathname !== ancestors.linkHref) {
    crumbs.push({ label: t(ancestors.linkLabel), href: ancestors.linkHref });
    const extra = pathname.slice(ancestors.linkHref.length + 1).split('/')[0];
    if (extra) crumbs.push({ label: extra, href: null });
    return crumbs;
  }

  // Normal link crumb (current page)
  crumbs.push({ label: t(ancestors.linkLabel), href: null });
  return crumbs;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function Breadcrumbs({ crumbs: controlledCrumbs }: BreadcrumbsProps = {}) {
  const t = useTranslations('common');
  const pathname = usePathname();

  const crumbs = controlledCrumbs ?? buildCrumbs(pathname, t);

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
