'use client';

import { useTranslations } from 'next-intl';
import { usePathname } from '@/i18n/navigation';
import { Bell, Search } from 'lucide-react';
import { ThemeToggle } from './theme-toggle';
import { Breadcrumbs } from './breadcrumbs';
import { Avatar } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { LanguageSwitcher } from '@/components/i18n/language-switcher';
import { useUserStore } from '@/store/user.store';
import { useLogoutAction } from '@/hooks/use-logout-action';

const pageTitleKeys: Record<string, string> = {
  '/': 'sidebar.items.dashboard',
  '/analytics': 'sidebar.items.analytics',
  '/reports': 'sidebar.items.reports',
  '/reports/scheduled': 'sidebar.items.reportsScheduled',
  '/reports/archived': 'sidebar.items.reportsArchived',
  '/users': 'sidebar.items.users',
  '/settings': 'sidebar.items.settings',
  '/ui': 'sidebar.sections.ui',
};

export function Topbar() {
  const t = useTranslations('common');
  const pathname = usePathname();
  const user = useUserStore((s) => s.user);
  const { logout, isPending: isLoggingOut } = useLogoutAction();

  const titleKey = Object.entries(pageTitleKeys).findLast(([key]) => pathname.startsWith(key))?.[1] ?? 'sidebar.items.dashboard';

  return (
    <header className="h-14 flex items-center gap-4 px-6 border-b border-[var(--border)] bg-[var(--surface)] shrink-0">
      {/* Title + breadcrumbs */}
      <div className="flex flex-col justify-center min-w-0">
        <h1 className="text-base font-semibold text-[var(--text-primary)] leading-tight">{t(titleKey)}</h1>
        <Breadcrumbs />
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Search */}
      <div className="hidden md:block w-56">
        <Input
          placeholder={t('navigation.searchPlaceholder')}
          leftIcon={<Search size={14} />}
          className="h-8 text-xs"
        />
      </div>

      {/* Language switcher */}
      <LanguageSwitcher variant="compact" />

      {/* Notification bell */}
      <button
        className="relative text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
        aria-label={t('navigation.notifications')}
      >
        <Bell size={18} />
        <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-[var(--accent)] text-white text-[9px] font-bold flex items-center justify-center">
          3
        </span>
      </button>

      {/* Theme toggle */}
      <ThemeToggle />

      {/* User dropdown */}
      <DropdownMenu
        align="right"
        trigger={
          <button className="flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-[var(--surface-raised)] transition-colors">
            {user ? (
              <>
                <Avatar src={user.avatar} alt={user.name} size="sm" />
                <span className="hidden md:block text-sm font-medium text-[var(--text-primary)]">
                  {user.name.split(' ')[0]}
                </span>
              </>
            ) : (
              <div className="h-8 w-8 rounded-full bg-[var(--surface-raised)] animate-pulse" />
            )}
          </button>
        }
      >
        <div className="px-3 py-2 border-b border-[var(--border)]">
          <p className="text-sm font-medium text-[var(--text-primary)]">{user?.name}</p>
          <p className="text-xs text-[var(--text-muted)]">{user?.email}</p>
        </div>
        <DropdownMenuItem onClick={() => {}}>{t('userMenu.profile')}</DropdownMenuItem>
        <DropdownMenuItem onClick={() => {}}>{t('userMenu.settings')}</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout} destructive>
          {isLoggingOut ? t('userMenu.signingOut') : t('userMenu.signOut')}
        </DropdownMenuItem>
      </DropdownMenu>
    </header>
  );
}
