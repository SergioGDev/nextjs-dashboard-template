'use client';

import { useCallback, useSyncExternalStore } from 'react';

// useSyncExternalStore is the React-blessed primitive for subscribing to
// browser APIs — it sidesteps the `react-hooks/set-state-in-effect` rule
// that flags useState+useEffect implementations.
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (notify: () => void) => {
      const media = window.matchMedia(query);
      media.addEventListener('change', notify);
      return () => media.removeEventListener('change', notify);
    },
    [query]
  );

  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query]);
  const getServerSnapshot = () => false;

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function useIsMobile(): boolean {
  return useMediaQuery('(max-width: 768px)');
}
