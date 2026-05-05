import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { ToastsContent } from './toasts-content';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'uiShowcase' });
  return { title: t('toasts.metadata.title') };
}

export default function ToastsPage() {
  return <ToastsContent />;
}
