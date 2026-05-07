import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { SeparatorContent } from './separator-content';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'separator' });
  return { title: t('metadata.title') };
}

export default function SeparatorPage() {
  return <SeparatorContent />;
}
