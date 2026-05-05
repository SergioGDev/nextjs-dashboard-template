'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import { Tooltip } from '@components/ui/tooltip';
import type { SidebarLink as SidebarLinkType } from './sidebar.types';

const BADGE_CLASSES: Record<string, string> = {
  accent:  'bg-[var(--accent-muted)] text-[var(--accent)]',
  success: 'bg-[var(--success-muted)] text-[var(--success)]',
  warning: 'bg-[var(--warning-muted)] text-[var(--warning)]',
  error:   'bg-[var(--error-muted)] text-[var(--error)]',
  info:    'bg-[var(--info-muted)] text-[var(--info)]',
  neutral: 'bg-[var(--surface-raised)] text-[var(--text-secondary)] border border-[var(--border-strong)]',
};

interface SidebarLinkProps {
  item: SidebarLinkType;
  isActive: boolean;
  collapsed: boolean;
  isChild?: boolean;
}

export function SidebarLink({ item, isActive, collapsed, isChild = false }: SidebarLinkProps) {
  const t = useTranslations('common');
  const label = t(item.label);
  const Icon = item.icon;

  const baseClasses = cn(
    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
    collapsed ? 'justify-center px-2' : '',
    isChild && !collapsed ? 'text-[13px]' : '',
  );

  // In collapsed mode, links without icons show a small dot so they remain visible and tappable.
  const collapsedIcon = collapsed && !isChild
    ? Icon
      ? <Icon size={18} className="shrink-0" />
      : <span className="w-1.5 h-1.5 rounded-full bg-current opacity-50 shrink-0" />
    : null;

  if (item.disabled) {
    return (
      <div className={cn(baseClasses, 'opacity-40 cursor-not-allowed text-[var(--text-secondary)]')}>
        {collapsed && !isChild ? collapsedIcon : Icon && !isChild && <Icon size={18} className="shrink-0" />}
        {!collapsed && <span className="truncate">{label}</span>}
      </div>
    );
  }

  const linkEl = (
    <Link
      href={item.href}
      className={cn(
        baseClasses,
        isActive
          ? 'bg-[var(--accent-muted)] text-[var(--accent)]'
          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-raised)]',
      )}
    >
      {collapsed && !isChild ? collapsedIcon : Icon && !isChild && <Icon size={18} className="shrink-0" />}
      {!collapsed && <span className="flex-1 truncate">{label}</span>}
      {!collapsed && item.count !== undefined && (
        <span className="ml-auto text-xs font-mono text-[var(--text-muted)]">{item.count}</span>
      )}
      {!collapsed && item.badge && (
        <span className={cn('ml-auto text-xs font-medium px-1.5 py-0.5 rounded-full',
          BADGE_CLASSES[item.badge.variant ?? 'accent'])}>
          {item.badge.label}
        </span>
      )}
    </Link>
  );

  return collapsed && !isChild ? (
    <Tooltip content={label} side="right">{linkEl}</Tooltip>
  ) : linkEl;
}
