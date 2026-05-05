'use client';

import { useTranslations } from 'next-intl';
import { usePathname } from '@/i18n/navigation';
import { ChevronLeft, ChevronRight, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/hooks/use-sidebar';
import { useUserStore } from '@/store/user.store';
import { useLogoutAction } from '@/hooks/use-logout-action';
import { Avatar } from '@/components/ui/avatar';
import { env } from '@config/env';
import { sidebarConfig } from './sidebar.config';
import { SidebarSection } from './sidebar-section';
import { useExpandedGroups } from './use-expanded-groups';

export function Sidebar() {
  const t = useTranslations('common');
  const { sidebarCollapsed, toggleSidebar } = useSidebar();
  const pathname = usePathname();
  const user = useUserStore((s) => s.user);
  const { logout } = useLogoutAction();
  const { isExpanded, toggleGroup, toGroupId } = useExpandedGroups(sidebarConfig);

  return (
    <aside
      className={cn(
        'flex flex-col h-full border-r border-[var(--border)] bg-[var(--surface)] transition-all duration-300 ease-in-out shrink-0',
        sidebarCollapsed ? 'w-16' : 'w-60'
      )}
    >
      {/* Logo */}
      <div
        className={cn(
          'flex items-center h-14 px-4 border-b border-[var(--border)] shrink-0',
          sidebarCollapsed ? 'justify-center' : 'gap-2',
        )}
      >
        <div className="h-7 w-7 rounded-lg bg-[var(--accent)] flex items-center justify-center shrink-0">
          <span className="text-white text-xs font-bold">N</span>
        </div>
        {!sidebarCollapsed && (
          <span className="font-semibold text-[var(--text-primary)] tracking-tight">
            {env.NEXT_PUBLIC_APP_NAME}
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 px-2 overflow-y-auto">
        {sidebarConfig.map((section, i) => (
          <div key={section.id} className={i > 0 ? 'mt-4 pt-4 border-t border-[var(--border)]' : ''}>
            <SidebarSection
              section={section}
              collapsed={sidebarCollapsed}
              pathname={pathname}
              isExpanded={isExpanded}
              onToggleGroup={toggleGroup}
              toGroupId={toGroupId}
            />
          </div>
        ))}
      </nav>

      {/* User section */}
      <div className="shrink-0 border-t border-[var(--border)] p-2">
        <div
          className={cn(
            'flex items-center gap-2 rounded-lg p-2',
            sidebarCollapsed ? 'justify-center flex-col' : '',
          )}
        >
          {!user ? (
            <>
              <div className="h-8 w-8 rounded-full bg-[var(--surface-raised)] animate-pulse shrink-0" />
              {!sidebarCollapsed && (
                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="h-3 w-20 rounded bg-[var(--surface-raised)] animate-pulse" />
                  <div className="h-2.5 w-12 rounded bg-[var(--surface-raised)] animate-pulse" />
                </div>
              )}
            </>
          ) : (
            <>
              <Avatar src={user.avatar} alt={user.name} size="sm" className="shrink-0" />
              {!sidebarCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--text-primary)] truncate">{user.name}</p>
                  <p className="text-xs text-[var(--text-muted)] truncate">{user.role}</p>
                </div>
              )}
              {!sidebarCollapsed && (
                <button
                  onClick={logout}
                  className="text-[var(--text-muted)] hover:text-[var(--error)] transition-colors p-1 rounded"
                  aria-label={t('sidebar.actions.logOut')}
                >
                  <LogOut size={15} />
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={toggleSidebar}
        className={cn(
          'shrink-0 flex items-center justify-center h-10 border-t border-[var(--border)]',
          'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-raised)] transition-colors',
        )}
        aria-label={sidebarCollapsed ? t('sidebar.actions.expand') : t('sidebar.actions.collapse')}
      >
        {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>
    </aside>
  );
}
