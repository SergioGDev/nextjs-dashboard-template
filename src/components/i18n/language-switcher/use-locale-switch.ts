'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import type { Locale } from '@config/i18n';

export function useLocaleSwitch() {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale() as Locale;

  function switchLocale(newLocale: Locale) {
    if (newLocale === currentLocale) return;
    router.replace(pathname, { locale: newLocale });
  }

  return { currentLocale, switchLocale };
}
