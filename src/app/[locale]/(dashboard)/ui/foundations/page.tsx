import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { FoundationsContent } from './foundations-content';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'foundations' });
  return { title: t('title') };
}

export default function FoundationsPage() {
  return <FoundationsContent />;
}
