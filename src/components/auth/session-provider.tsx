'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from '@/i18n/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { useSession, useLogout } from '@features/auth';
import { useUserStore } from '@/store/user.store';
import { routes } from '@config/routes';
import { AUTH_LOGOUT_EVENT } from '@/lib/auth-events';

// Bridge between TanStack Query session cache and the global user.store.
// Mounts once in (dashboard)/layout. Not needed on auth pages.
export function SessionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: session, isFetching } = useSession();
  const { mutateAsync: logout } = useLogout();
  const setUser = useUserStore((s) => s.setUser);
  const clearedRef = useRef(false);

  // Sync session → store; redirect if session resolves to null (invalid cookie)
  useEffect(() => {
    if (session === undefined) return;
    // Don't act on stale null while a refetch is in flight (prevents premature logout)
    if (isFetching) return;
    setUser(session ? session.user : null);
    if (session === null && !clearedRef.current) {
      clearedRef.current = true;
      // Stale cookie (e.g. mock store wiped after dev server restart) — clear it
      // server-side before redirecting, otherwise proxy.ts sees the cookie at
      // /login and bounces back to /.
      logout().catch(() => {}).finally(() => router.push(routes.login));
    }
  }, [session, isFetching, setUser, router, logout]);

  // Handle forced logout triggered by the 401 interceptor
  useEffect(() => {
    async function onForcedLogout() {
      setUser(null);
      try { await logout(); } catch { /* still proceed to redirect */ }
      queryClient.clear();
      router.push(routes.login);
    }
    window.addEventListener(AUTH_LOGOUT_EVENT, onForcedLogout);
    return () => window.removeEventListener(AUTH_LOGOUT_EVENT, onForcedLogout);
  }, [setUser, queryClient, router, logout]);

  return <>{children}</>;
}
