'use client';

import { useEffect } from 'react';
import { useUIStore } from '@/store/ui.store';
import { useIsMobile } from './use-media-query';

export function useSidebar() {
  const { sidebarCollapsed, toggleSidebar, setSidebarCollapsed } = useUIStore();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile) setSidebarCollapsed(true);
  }, [isMobile, setSidebarCollapsed]);

  return { sidebarCollapsed, toggleSidebar, setSidebarCollapsed };
}
