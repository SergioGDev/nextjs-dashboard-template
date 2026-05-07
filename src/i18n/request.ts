import { getRequestConfig } from 'next-intl/server';
import { locales, defaultLocale } from '@config/i18n';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !locales.includes(locale as (typeof locales)[number])) {
    locale = defaultLocale;
  }

  return {
    locale,
    messages: await loadMessages(locale),
  };
});

async function loadMessages(locale: string) {
  const [
    common,
    auth,
    dashboard,
    analytics,
    users,
    reports,
    settings,
    uiShowcase,
    foundations,
    buttons,
    buttonsGroup,
    spinner,
    inputs,
    textarea,
    card,
    badge,
    avatar,
    separator,
  ] = await Promise.all([
    import(`../messages/${locale}/common.json`).then((m) => m.default),
    import(`../features/auth/i18n/${locale}.json`).then((m) => m.default),
    import(`../features/dashboard/i18n/${locale}.json`).then((m) => m.default),
    import(`../features/analytics/i18n/${locale}.json`).then((m) => m.default),
    import(`../features/users/i18n/${locale}.json`).then((m) => m.default),
    import(`../features/reports/i18n/${locale}.json`).then((m) => m.default),
    import(`../features/settings/i18n/${locale}.json`).then((m) => m.default),
    import(`../features/ui-showcase/i18n/${locale}.json`).then((m) => m.default),
    import(`../features/ui-showcase/i18n/foundations-${locale}.json`).then((m) => m.default),
    import(`../features/ui-showcase/i18n/buttons-${locale}.json`).then((m) => m.default),
    import(`../features/ui-showcase/i18n/buttons-group-${locale}.json`).then((m) => m.default),
    import(`../features/ui-showcase/i18n/spinner-${locale}.json`).then((m) => m.default),
    import(`../features/ui-showcase/i18n/inputs-${locale}.json`).then((m) => m.default),
    import(`../features/ui-showcase/i18n/textarea-${locale}.json`).then((m) => m.default),
    import(`../features/ui-showcase/i18n/card-${locale}.json`).then((m) => m.default),
    import(`../features/ui-showcase/i18n/badge-${locale}.json`).then((m) => m.default),
    import(`../features/ui-showcase/i18n/avatar-${locale}.json`).then((m) => m.default),
    import(`../features/ui-showcase/i18n/separator-${locale}.json`).then((m) => m.default),
  ]);

  return {
    common,
    auth,
    dashboard,
    analytics,
    users,
    reports,
    settings,
    uiShowcase,
    foundations,
    buttons,
    buttonsGroup,
    spinner,
    inputs,
    textarea,
    card,
    badge,
    avatar,
    separator,
  };
}
