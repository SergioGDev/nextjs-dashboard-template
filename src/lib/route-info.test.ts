import { describe, expect, it } from 'vitest';
import { getRouteAncestors, getRouteLabel } from './route-info';
import { routes } from '@config/routes';

describe('getRouteLabel', () => {
  it('returns the link label for an exact match', () => {
    expect(getRouteLabel(routes.analytics)).toBe('sidebar.items.analytics');
  });

  it('returns the dashboard label for the root path', () => {
    expect(getRouteLabel('/')).toBe('sidebar.items.dashboard');
  });

  it('matches a dynamic segment via longest startsWith prefix', () => {
    // /users/123 has no sidebar entry of its own — it must resolve through
    // the /users link via prefix matching (item.exact is not set on it).
    expect(getRouteLabel(routes.users.detail('123'))).toBe('sidebar.items.users');
  });

  it('excludes links with exact:true from prefix matching', () => {
    // routes.reports.overview ('/reports') is exact:true. If it were NOT
    // excluded, '/reports/does-not-exist' would prefix-match it (since it
    // starts with '/reports/'). Because it IS excluded, and neither
    // scheduled nor archived match this path, there is no match at all.
    expect(getRouteLabel('/reports/does-not-exist')).toBe('sidebar.items.dashboard');
    expect(getRouteAncestors('/reports/does-not-exist')).toBeNull();
  });

  it('shows the UI section title for the /ui overview link', () => {
    expect(getRouteLabel(routes.ui.overview)).toBe('sidebar.sections.ui');
  });

  it('shows the group label, not the child "overview" label, for /reports', () => {
    expect(getRouteLabel(routes.reports.overview)).toBe('sidebar.items.reports');
  });

  it('falls back to the dashboard label for an unknown route', () => {
    expect(getRouteLabel('/this-route-does-not-exist')).toBe('sidebar.items.dashboard');
    expect(getRouteAncestors('/this-route-does-not-exist')).toBeNull();
  });
});

describe('getRouteAncestors', () => {
  it('returns the full section/group/link chain for a group child', () => {
    expect(getRouteAncestors(routes.ui.buttons)).toEqual({
      sectionId: 'ui',
      sectionLabel: 'sidebar.sections.ui',
      groupLabel: 'sidebar.items.uiComponents',
      groupHref: undefined,
      linkLabel: 'sidebar.items.uiButton',
      linkHref: routes.ui.buttons,
    });
  });

  it('flags a dynamic-segment match with isDynamicMatch', () => {
    const ancestors = getRouteAncestors(routes.users.detail('123'));
    expect(ancestors?.isDynamicMatch).toBe(true);
    expect(ancestors?.linkHref).toBe(routes.users.list);
  });
});
