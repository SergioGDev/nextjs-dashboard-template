import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { SwitchContent } from './switch-content';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'switch' });
  return { title: t('metadata.title') };
}

export default function SwitchPage() {
  return <SwitchContent />;
}
