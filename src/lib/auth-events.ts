// Custom event dispatched by the 401 interceptor when a protected request
// is rejected. SessionProvider listens and redirects to login.
export const AUTH_LOGOUT_EVENT = 'nexdash:auth:logout' as const;
