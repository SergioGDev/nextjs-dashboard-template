import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { EmptyStatesContent } from './empty-states-content';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'uiShowcase' });
  return { title: t('emptyStates.metadata.title') };
}

export default function EmptyStatesPage() {
  return <EmptyStatesContent />;
}
