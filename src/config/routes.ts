export const routes = {
  login: '/login',
  dashboard: '/',
  analytics: '/analytics',
  reports: {
    overview: '/reports',
    scheduled: '/reports/scheduled',
    archived: '/reports/archived',
  },
  settings: '/settings',
  users: {
    list: '/users',
    detail: (id: string) => `/users/${id}`,
  },
  ui: {
    overview: '/ui',
    toasts: '/ui/toasts',
    emptyStates: '/ui/empty-states',
    errorStates: '/ui/error-states',
    skeletons: '/ui/skeletons',
    sidebar: '/ui/sidebar',
    i18n: '/ui/i18n',
  },
} as const;
