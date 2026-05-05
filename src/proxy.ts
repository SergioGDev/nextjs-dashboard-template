import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from '@/i18n/routing';
import { routes } from '@config/routes';
import { defaultLocale, locales, type Locale } from '@config/i18n';

const intlMiddleware = createMiddleware(routing);

const SESSION_COOKIE = 'nexdash_session';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip API routes, Next.js internals, and static files
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    /\.\w+$/.test(pathname)
  ) {
    return NextResponse.next();
  }

  // Run intl middleware first: resolves locale and may redirect (e.g. / → /en/)
  const intlResponse = intlMiddleware(request);

  // Determine the "effective" URL after intl processing.
  // If intl redirected, the location header holds the target.
  const location = intlResponse.headers.get('location');
  const effectivePath = location ? new URL(location).pathname : pathname;

  // Extract locale and the path without locale prefix
  const localeMatch = effectivePath.match(/^\/([a-z]{2})(\/|$)/);
  const resolvedLocale: Locale = locales.includes(localeMatch?.[1] as Locale)
    ? (localeMatch![1] as Locale)
    : defaultLocale;
  const pathWithoutLocale = localeMatch
    ? effectivePath.slice(resolvedLocale.length + 1) || '/'
    : effectivePath;

  const hasSession = !!request.cookies.get(SESSION_COOKIE)?.value;
  const isLoginRoute = pathWithoutLocale === routes.login;

  // No session + protected route → redirect to locale-prefixed login
  if (!hasSession && !isLoginRoute) {
    return NextResponse.redirect(new URL(`/${resolvedLocale}${routes.login}`, request.url));
  }

  // Has session + login route → redirect to locale-prefixed dashboard
  if (hasSession && isLoginRoute) {
    return NextResponse.redirect(new URL(`/${resolvedLocale}${routes.dashboard === '/' ? '' : routes.dashboard}`, request.url));
  }

  return intlResponse;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
};
