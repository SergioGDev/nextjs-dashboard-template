'use client';

import { useTranslations } from 'next-intl';
import { SidebarLink } from './sidebar-link';
import { SidebarGroup } from './sidebar-group';
import type { SidebarSection as SidebarSectionType } from './sidebar.types';

interface SidebarSectionProps {
  section: SidebarSectionType;
  collapsed: boolean;
  pathname: string;
  isExpanded: (groupId: string) => boolean;
  onToggleGroup: (groupId: string) => void;
  toGroupId: (sectionId: string, label: string) => string;
}

export function SidebarSection({
  section,
  collapsed,
  pathname,
  isExpanded,
  onToggleGroup,
  toGroupId,
}: SidebarSectionProps) {
  const t = useTranslations('common');

  return (
    <div className="space-y-0.5">
      {!collapsed && section.title && (
        <p className="px-3 py-1 text-[10px] font-medium text-[var(--text-muted)] tracking-wider uppercase">
          {t(section.title)}
        </p>
      )}
      {section.items.map((item) => {
        if (item.type === 'link') {
          const isActive =
            item.href === '/'
              ? pathname === '/'
              : pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <SidebarLink
              key={item.href}
              item={item}
              isActive={isActive}
              collapsed={collapsed}
            />
          );
        }

        const groupId = toGroupId(section.id, item.label);
        const isGroupExpanded = isExpanded(groupId);
        const isGroupActive = item.children.some(
          (child) => pathname === child.href || pathname.startsWith(child.href + '/')
        );

        return (
          <SidebarGroup
            key={groupId}
            item={item}
            isExpanded={isGroupExpanded}
            isActive={isGroupActive}
            collapsed={collapsed}
            activeHref={pathname}
            onToggle={() => onToggleGroup(groupId)}
          />
        );
      })}
    </div>
  );
}
