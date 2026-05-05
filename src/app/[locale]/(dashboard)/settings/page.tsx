import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { SettingsContent } from './settings-content';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'settings' });
  return { title: t('metadata.title') };
}

export default function SettingsPage() {
  return <SettingsContent />;
}
