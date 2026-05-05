import type { SidebarLink } from './sidebar.types';

export function isLinkActive(item: SidebarLink, pathname: string): boolean {
  if (item.exact || item.href === '/') return pathname === item.href;
  return pathname === item.href || pathname.startsWith(item.href + '/');
}
