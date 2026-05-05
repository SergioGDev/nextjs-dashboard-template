import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { I18nContent } from './i18n-content';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'uiShowcase' });
  return { title: t('i18n.metadata.title') };
}

export default function I18nPage() {
  return <I18nContent />;
}
