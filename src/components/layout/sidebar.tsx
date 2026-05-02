'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  BarChart2,
  FileText,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/hooks/use-sidebar';
import { useUserStore } from '@/store/user.store';
import { Avatar } from '@/components/ui/avatar';
import { Tooltip } from '@/components/ui/tooltip';
import { routes } from '@config/routes';
import { env } from '@config/env';

const navItems = [
  { label: 'Dashboard', href: routes.dashboard, icon: LayoutDashboard },
  { label: 'Analytics', href: routes.analytics, icon: BarChart2 },
  { label: 'Reports', href: routes.reports, icon: FileText },
  { label: 'Users', href: routes.users.list, icon: Users },
  { label: 'Settings', href: routes.settings, icon: Settings },
];

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useSidebar();
  const pathname = usePathname();
  const currentUser = useUserStore((s) => s.currentUser);

  return (
    <aside
      className={cn(
        'flex flex-col h-full border-r border-[var(--border)] bg-[var(--surface)] transition-all duration-300 ease-in-out shrink-0',
        sidebarCollapsed ? 'w-16' : 'w-60'
      )}
    >
      {/* Logo */}
      <div className={cn('flex items-center h-14 px-4 border-b border-[var(--border)] shrink-0', sidebarCollapsed ? 'justify-center' : 'gap-2')}>
        <div className="h-7 w-7 rounded-lg bg-[var(--accent)] flex items-center justify-center shrink-0">
          <span className="text-white text-xs font-bold">N</span>
        </div>
        {!sidebarCollapsed && (
          <span className="font-semibold text-[var(--text-primary)] tracking-tight">{env.NEXT_PUBLIC_APP_NAME}</span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);
          const item = (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150',
                sidebarCollapsed ? 'justify-center px-2' : '',
                isActive
                  ? 'bg-[var(--accent-muted)] text-[var(--accent)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-raised)]'
              )}
            >
              <Icon size={18} className="shrink-0" />
              {!sidebarCollapsed && <span>{label}</span>}
            </Link>
          );
          return sidebarCollapsed ? (
            <Tooltip key={href} content={label} side="right">{item}</Tooltip>
          ) : item;
        })}
      </nav>

      {/* User section */}
      <div className="shrink-0 border-t border-[var(--border)] p-2">
        <div className={cn('flex items-center gap-2 rounded-lg p-2', sidebarCollapsed ? 'justify-center flex-col' : '')}>
          <Avatar
            src={currentUser?.avatar}
            alt={currentUser?.name}
            size="sm"
            className="shrink-0"
          />
          {!sidebarCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[var(--text-primary)] truncate">{currentUser?.name}</p>
              <p className="text-xs text-[var(--text-muted)] truncate">{currentUser?.role}</p>
            </div>
          )}
          {!sidebarCollapsed && (
            <button className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors p-1 rounded">
              <LogOut size={15} />
            </button>
          )}
        </div>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={toggleSidebar}
        className={cn(
          'shrink-0 flex items-center justify-center h-10 border-t border-[var(--border)]',
          'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-raised)] transition-colors'
        )}
        aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>
    </aside>
  );
}
