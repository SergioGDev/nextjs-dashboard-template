import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { ThemeToggleContent } from './theme-toggle-content';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'themeToggle' });
  return { title: t('metadata.title') };
}

export default function ThemeTogglePage() {
  return <ThemeToggleContent />;
}
