'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { usePathname } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import { routes } from '@config/routes';
import type { SubnavItem } from '../types/showcase.types';

const NAV_ITEMS: SubnavItem[] = [
  { label: 'subnav.items.overview', href: routes.ui.overview },
  { label: 'subnav.items.toasts', href: routes.ui.toasts, group: 'subnav.groups.components' },
  { label: 'subnav.items.emptyStates', href: routes.ui.emptyStates, group: 'subnav.groups.components' },
  { label: 'subnav.items.errorStates', href: routes.ui.errorStates, group: 'subnav.groups.components' },
  { label: 'subnav.items.skeletons', href: routes.ui.skeletons, group: 'subnav.groups.components' },
  { label: 'subnav.items.sidebar', href: routes.ui.sidebar, group: 'subnav.groups.layout' },
];

export function UiSubnav() {
  const t = useTranslations('uiShowcase');
  const tCommon = useTranslations('uiShowcase.common');
  const pathname = usePathname();

  const grouped: { group: string | undefined; items: SubnavItem[] }[] = [];
  for (const item of NAV_ITEMS) {
    const last = grouped[grouped.length - 1];
    if (last && last.group === item.group) {
      last.items.push(item);
    } else {
      grouped.push({ group: item.group, items: [item] });
    }
  }

  return (
    <nav className="p-3 space-y-5">
      {grouped.map(({ group, items }, gi) => (
        <div key={gi} className="space-y-0.5">
          {group && (
            <p className="px-2 mb-2 text-[10px] font-medium text-[var(--text-muted)] tracking-wider uppercase">
              {t(group)}
            </p>
          )}
          {items.map((item) => {
            const isActive = item.href === routes.ui.overview
              ? pathname === routes.ui.overview
              : pathname.startsWith(item.href);

            if (item.disabled) {
              return (
                <div
                  key={item.href}
                  className="flex items-center justify-between px-2 py-1.5 rounded-md text-sm font-medium opacity-40 cursor-not-allowed select-none text-[var(--text-secondary)]"
                >
                  <span>{t(item.label)}</span>
                  <span className="text-[10px] text-[var(--text-muted)] font-normal">{tCommon('soon')}</span>
                </div>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center px-2 py-1.5 rounded-md text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-[var(--accent-muted)] text-[var(--accent)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-raised)]',
                )}
              >
                {t(item.label)}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
