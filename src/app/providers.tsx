'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { useEffect } from 'react';
import { useUIStore } from '@/store/ui.store';
import { QUERY, THEME } from '@config/constants';
import { addResponseInterceptor } from '@lib/api';
import { AUTH_LOGOUT_EVENT } from '@/lib/auth-events';
import { Toaster } from '@components/feedback/toast';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: QUERY.STALE_TIME, retry: QUERY.RETRY_COUNT },
  },
});

// URLs where a 401 is expected and should NOT trigger forced logout.
// /auth/me → "no session" is a normal state, not an expiry.
// /auth/login → "wrong password" is a user error, not a session issue.
const AUTH_EXEMPT = ['/auth/me', '/auth/login'];

function AuthInterceptor() {
  useEffect(() => {
    return addResponseInterceptor((response, config) => {
      if (
        response.status === 401 &&
        !AUTH_EXEMPT.some((path) => config.url.includes(path))
      ) {
        window.dispatchEvent(new CustomEvent(AUTH_LOGOUT_EVENT));
      }
      return response;
    });
  }, []);
  return null;
}

function AccentSync({ children }: { children: React.ReactNode }) {
  const accent = useUIStore((s) => s.accent);
  useEffect(() => {
    document.documentElement.setAttribute('data-accent', accent);
  }, [accent]);
  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <NextThemesProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem={false}
        storageKey={THEME.STORAGE_KEY}
        value={{ light: 'theme-light', dark: 'theme-dark' }}
        disableTransitionOnChange
      >
        <AuthInterceptor />
        <Toaster />
        <AccentSync>{children}</AccentSync>
      </NextThemesProvider>
    </QueryClientProvider>
  );
}
