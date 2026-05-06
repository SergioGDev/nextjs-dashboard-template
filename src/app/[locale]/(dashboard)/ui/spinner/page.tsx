import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { SpinnerContent } from './spinner-content';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'spinner' });
  return { title: t('metadata.title') };
}

export default function SpinnerPage() {
  return <SpinnerContent />;
}
