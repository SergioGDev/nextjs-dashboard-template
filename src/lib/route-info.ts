/**
 * Single source of truth for route labels and ancestor chains.
 *
 * Reads sidebarConfig and derives the i18n key and structural ancestry for
 * any pathname. Both Topbar (page title) and Breadcrumbs consume this —
 * adding a route to sidebarConfig updates both automatically.
 *
 * Returns i18n keys, never translated strings. Call t(key) at the consumer.
 */
import { sidebarConfig } from '@/components/layout/sidebar/sidebar.config';

export interface RouteAncestors {
  sectionId: string;
  sectionLabel?: string;   // e.g. 'sidebar.sections.ui'
  groupLabel?: string;     // e.g. 'sidebar.items.uiComponents'
  groupHref?: string;      // href of the group overview child (exact: true)
  linkLabel: string;       // e.g. 'sidebar.items.toasts'
  linkHref: string;        // e.g. '/ui/toasts'
  isDynamicMatch?: boolean; // true when matched via startsWith, not exact
}

/**
 * Walk sidebarConfig looking for the best match for `pathname`.
 * Strategy: exact match wins immediately; otherwise track the longest
 * startsWith prefix match (mirrors the original findLast logic in Topbar).
 * Links with `exact: true` are excluded from prefix matching.
 */
function findAncestors(pathname: string): RouteAncestors | null {
  let bestMatch: RouteAncestors | null = null;
  let bestMatchLength = -1;

  for (const section of sidebarConfig) {
    for (const item of section.items) {
      if (item.type === 'link') {
        // Exact match
        if (item.href === pathname) {
          return {
            sectionId: section.id,
            sectionLabel: section.title,
            linkLabel: item.label,
            linkHref: item.href,
          };
        }
        // Prefix match for dynamic segments (e.g. /users/123 → /users)
        if (!item.exact && pathname.startsWith(item.href + '/') && item.href.length > bestMatchLength) {
          bestMatchLength = item.href.length;
          bestMatch = {
            sectionId: section.id,
            sectionLabel: section.title,
            linkLabel: item.label,
            linkHref: item.href,
            isDynamicMatch: true,
          };
        }
      } else if (item.type === 'group') {
        // The group's "overview" link is the first child with exact: true
        const overviewChild = item.children.find((c) => c.exact);
        const groupHref = overviewChild?.href;

        for (const child of item.children) {
          // Exact match
          if (child.href === pathname) {
            return {
              sectionId: section.id,
              sectionLabel: section.title,
              groupLabel: item.label,
              groupHref,
              linkLabel: child.label,
              linkHref: child.href,
            };
          }
          // Prefix match
          if (!child.exact && pathname.startsWith(child.href + '/') && child.href.length > bestMatchLength) {
            bestMatchLength = child.href.length;
            bestMatch = {
              sectionId: section.id,
              sectionLabel: section.title,
              groupLabel: item.label,
              groupHref,
              linkLabel: child.label,
              linkHref: child.href,
              isDynamicMatch: true,
            };
          }
        }
      }
    }
  }

  return bestMatch;
}

/**
 * Returns the i18n key for the page title that matches `pathname`.
 *
 * Rules applied (in priority order):
 *  1. Root `/` → 'sidebar.items.dashboard'
 *  2. Group overview link (linkHref === groupHref) → group label (not the
 *     "Overview" child label).  E.g. /reports → 'sidebar.items.reports'.
 *  3. UI-section top-level link (no group) → section title
 *     'sidebar.sections.ui'.  Keeps the /ui* area showing "UI".
 *  4. All other links → link label.
 *  5. No match → 'sidebar.items.dashboard' fallback.
 */
export function getRouteLabel(pathname: string): string {
  if (pathname === '/') return 'sidebar.items.dashboard';

  const ancestors = findAncestors(pathname);
  if (!ancestors) return 'sidebar.items.dashboard';

  // Group overview: show the group's name, not the child's "Overview" label
  if (ancestors.groupLabel && ancestors.groupHref && ancestors.linkHref === ancestors.groupHref) {
    return ancestors.groupLabel;
  }

  // UI section top-level links: keep showing "UI" as the title
  if (ancestors.sectionId === 'ui' && !ancestors.groupLabel) {
    return ancestors.sectionLabel ?? ancestors.linkLabel;
  }

  return ancestors.linkLabel;
}

/**
 * Returns the structural ancestors of `pathname` for breadcrumb construction.
 * Returns null when no match is found.
 */
export function getRouteAncestors(pathname: string): RouteAncestors | null {
  return findAncestors(pathname);
}

export interface SearchableRoute {
  label: string; // i18n key, relative to the 'common' namespace
  href: string;
}

/**
 * Flattens sidebarConfig into every navigable link (top-level and nested
 * inside groups) for the topbar route search. Single source of truth —
 * consumers translate `label` themselves before filtering.
 */
export function getSearchableRoutes(): SearchableRoute[] {
  const results: SearchableRoute[] = [];

  for (const section of sidebarConfig) {
    for (const item of section.items) {
      if (item.type === 'link') {
        results.push({ label: item.label, href: item.href });
      } else {
        for (const child of item.children) {
          results.push({ label: child.label, href: child.href });
        }
      }
    }
  }

  return results;
}
