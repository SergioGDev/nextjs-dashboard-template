import type { ReactElement, ReactNode } from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NextIntlClientProvider } from 'next-intl';

export * from '@testing-library/react';

type Messages = Record<string, unknown>;

const DEFAULT_LOCALE = 'en';

// Deliberately empty by default (see docs/testing.md — OPCIÓN B). Tests declare
// only the strings they actually exercise via the `messages` option, so a copy
// change elsewhere in the app can never break an unrelated test.
const DEFAULT_MESSAGES: Messages = {};

interface RenderWithProvidersOptions extends Omit<RenderOptions, 'wrapper'> {
  locale?: string;
  messages?: Messages;
}

// A fresh QueryClient per call — never shared at module scope — so cached data
// from one test can never leak into the next (see docs/testing.md, hallazgo A).
function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, staleTime: 0 },
    },
  });
}

export function renderWithProviders(
  ui: ReactElement,
  { locale = DEFAULT_LOCALE, messages = DEFAULT_MESSAGES, ...options }: RenderWithProvidersOptions = {},
) {
  const queryClient = createTestQueryClient();

  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </QueryClientProvider>
    );
  }

  return render(ui, { wrapper: Wrapper, ...options });
}
