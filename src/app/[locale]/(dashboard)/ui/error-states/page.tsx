import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { ErrorStatesContent } from './error-states-content';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'uiShowcase' });
  return { title: t('errorStates.metadata.title') };
}

export default function ErrorStatesPage() {
  return <ErrorStatesContent />;
}
