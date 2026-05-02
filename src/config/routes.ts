export const routes = {
  login: '/login',
  dashboard: '/',
  analytics: '/analytics',
  reports: '/reports',
  settings: '/settings',
  users: {
    list: '/users',
    detail: (id: string) => `/users/${id}`,
  },
} as const;
