'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SIDEBAR } from '@config/constants';

interface SidebarState {
  expandedGroups: string[];
  toggleGroup: (groupId: string) => void;
  setGroupExpanded: (groupId: string, expanded: boolean) => void;
}

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set) => ({
      expandedGroups: [],
      toggleGroup: (groupId) =>
        set((state) => ({
          expandedGroups: state.expandedGroups.includes(groupId)
            ? state.expandedGroups.filter((id) => id !== groupId)
            : [...state.expandedGroups, groupId],
        })),
      setGroupExpanded: (groupId, expanded) =>
        set((state) => ({
          expandedGroups: expanded
            ? state.expandedGroups.includes(groupId)
              ? state.expandedGroups
              : [...state.expandedGroups, groupId]
            : state.expandedGroups.filter((id) => id !== groupId),
        })),
    }),
    { name: SIDEBAR.STORAGE_KEY }
  )
);
