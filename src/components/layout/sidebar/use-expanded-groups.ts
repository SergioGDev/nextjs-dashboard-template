'use client';

import { useCallback, useEffect, useMemo, useRef } from 'react';
import { usePathname } from '@/i18n/navigation';
import { useSidebarStore } from '@store/sidebar.store';
import type { SidebarConfig } from './sidebar.types';

export function toGroupId(sectionId: string, label: string): string {
  return `${sectionId}.${label.toLowerCase().replace(/\s+/g, '-')}`;
}

function findActiveGroupId(config: SidebarConfig, pathname: string): string | null {
  for (const section of config) {
    for (const item of section.items) {
      if (item.type === 'group') {
        const groupId = toGroupId(section.id, item.label);
        const isActive = item.children.some(
          (child) => pathname === child.href || pathname.startsWith(child.href + '/')
        );
        if (isActive) return groupId;
      }
    }
  }
  return null;
}

export function useExpandedGroups(config: SidebarConfig) {
  const { expandedGroups, toggleGroup, setGroupExpanded } = useSidebarStore();
  const pathname = usePathname();

  const activeGroupId = useMemo(
    () => findActiveGroupId(config, pathname),
    [config, pathname]
  );

  // Auto-expand the active group on initial load and on route change.
  // If the user manually closed the group (toggleGroup removes it from store),
  // navigating to a child of that group re-expands it — the store is the source of truth.
  const prevPathnameRef = useRef<string | null>(null);
  useEffect(() => {
    if (pathname !== prevPathnameRef.current) {
      prevPathnameRef.current = pathname;
      if (activeGroupId) {
        setGroupExpanded(activeGroupId, true);
      }
    }
  }, [pathname, activeGroupId, setGroupExpanded]);

  const isExpanded = useCallback(
    (groupId: string) => expandedGroups.includes(groupId),
    [expandedGroups]
  );

  return { isExpanded, toggleGroup, toGroupId };
}
