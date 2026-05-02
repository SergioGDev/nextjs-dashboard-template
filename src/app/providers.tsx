'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { useEffect } from 'react';
import { useUIStore } from '@/store/ui.store';
import { QUERY, THEME } from '@config/constants';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: QUERY.STALE_TIME, retry: QUERY.RETRY_COUNT },
  },
});

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
        <AccentSync>{children}</AccentSync>
      </NextThemesProvider>
    </QueryClientProvider>
  );
}
