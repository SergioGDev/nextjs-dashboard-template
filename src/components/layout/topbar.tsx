'use client';

import { usePathname } from 'next/navigation';
import { Bell, Search } from 'lucide-react';
import { ThemeToggle } from './theme-toggle';
import { Breadcrumbs } from './breadcrumbs';
import { Avatar } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { useUserStore } from '@/store/user.store';

const pageTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/analytics': 'Analytics',
  '/reports': 'Reports',
  '/users': 'Users',
  '/settings': 'Settings',
};

export function Topbar() {
  const pathname = usePathname();
  const currentUser = useUserStore((s) => s.currentUser);

  const title = Object.entries(pageTitles).findLast(([key]) => pathname.startsWith(key))?.[1] ?? 'Dashboard';

  return (
    <header className="h-14 flex items-center gap-4 px-6 border-b border-[var(--border)] bg-[var(--surface)] shrink-0">
      {/* Title + breadcrumbs */}
      <div className="flex flex-col justify-center min-w-0">
        <h1 className="text-base font-semibold text-[var(--text-primary)] leading-tight">{title}</h1>
        <Breadcrumbs />
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Search */}
      <div className="hidden md:block w-56">
        <Input
          placeholder="Search…"
          leftIcon={<Search size={14} />}
          className="h-8 text-xs"
        />
      </div>

      {/* Notification bell */}
      <button className="relative text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
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
            <Avatar src={currentUser?.avatar} alt={currentUser?.name} size="sm" />
            <span className="hidden md:block text-sm font-medium text-[var(--text-primary)]">
              {currentUser?.name?.split(' ')[0]}
            </span>
          </button>
        }
      >
        <div className="px-3 py-2 border-b border-[var(--border)]">
          <p className="text-sm font-medium text-[var(--text-primary)]">{currentUser?.name}</p>
          <p className="text-xs text-[var(--text-muted)]">{currentUser?.email}</p>
        </div>
        <DropdownMenuItem onClick={() => {}}>Profile</DropdownMenuItem>
        <DropdownMenuItem onClick={() => {}}>Settings</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => {}} destructive>Log out</DropdownMenuItem>
      </DropdownMenu>
    </header>
  );
}
