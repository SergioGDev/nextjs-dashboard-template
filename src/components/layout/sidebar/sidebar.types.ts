import type { LucideIcon } from 'lucide-react';

export type SidebarBadge = {
  label: string;
  variant?: 'accent' | 'success' | 'warning' | 'error' | 'info' | 'neutral';
};

export type SidebarLink = {
  type: 'link';
  label: string;
  href: string;
  icon?: LucideIcon;
  badge?: SidebarBadge;
  count?: number;
  disabled?: boolean;
};

export type SidebarGroup = {
  type: 'group';
  label: string;
  icon?: LucideIcon;
  badge?: SidebarBadge;
  children: SidebarLink[];
  defaultOpen?: boolean;
};

export type SidebarItem = SidebarLink | SidebarGroup;

export type SidebarSection = {
  id: string;
  title?: string;
  items: SidebarItem[];
};

export type SidebarConfig = SidebarSection[];
