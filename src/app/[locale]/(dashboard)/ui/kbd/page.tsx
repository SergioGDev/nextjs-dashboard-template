import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { KbdContent } from './kbd-content';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'kbd' });
  return { title: t('metadata.title') };
}

export default function KbdPage() {
  return <KbdContent />;
}
