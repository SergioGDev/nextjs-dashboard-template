import { defineRouting } from 'next-intl/routing';
import { locales, defaultLocale, LOCALE_COOKIE } from '@config/i18n';

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: 'always',
  localeDetection: true,
  localeCookie: { name: LOCALE_COOKIE },
});
