'use client';

import { useTranslations } from 'next-intl';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SidebarLink } from './sidebar-link';
import { SidebarPopover } from './sidebar-popover';
import type { SidebarGroup as SidebarGroupType } from './sidebar.types';

interface SidebarGroupProps {
  item: SidebarGroupType;
  isExpanded: boolean;
  isActive: boolean;
  collapsed: boolean;
  activeHref: string;
  onToggle: () => void;
}

export function SidebarGroup({
  item,
  isExpanded,
  isActive,
  collapsed,
  activeHref,
  onToggle,
}: SidebarGroupProps) {
  const t = useTranslations('common');
  const label = t(item.label);
  const Icon = item.icon;

  if (collapsed) {
    return <SidebarPopover item={item} activeHref={activeHref} isActive={isActive} />;
  }

  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isExpanded}
        className={cn(
          'w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
          isActive && !isExpanded
            ? 'bg-[var(--accent-muted)] text-[var(--accent)]'
            : isActive
            ? 'text-[var(--accent)]'
            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-raised)]',
        )}
      >
        {Icon && <Icon size={18} className="shrink-0" />}
        <span className="flex-1 text-left truncate">{label}</span>
        {item.badge && (
          <span className="text-xs font-medium px-1.5 py-0.5 rounded-full bg-[var(--surface-raised)] text-[var(--text-muted)]">
            {item.badge.label}
          </span>
        )}
        <ChevronDown
          size={14}
          className={cn(
            'shrink-0 transition-transform duration-[120ms] ease-out',
            isExpanded && 'rotate-180',
          )}
        />
      </button>

      {/* Collapse animation via grid-template-rows technique */}
      <div className={cn('nx-sidebar-collapse', isExpanded ? 'is-open' : 'is-closed')}>
        <div>
          {/* Guide line: left border aligns with center of parent icon, continuous across all children */}
          <div className="pt-0.5 pb-1 space-y-0.5 ml-[22px] border-l border-[var(--border-strong)]">
            {item.children.map((child) => {
              const isChildActive =
                activeHref === child.href || activeHref.startsWith(child.href + '/');
              return (
                <SidebarLink
                  key={child.href}
                  item={child}
                  isActive={isChildActive}
                  collapsed={false}
                  isChild
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
