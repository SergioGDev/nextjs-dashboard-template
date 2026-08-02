import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { PaginationContent } from './pagination-content';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'pagination' });
  return { title: t('metadata.title') };
}

export default function PaginationPage() {
  return <PaginationContent />;
}
