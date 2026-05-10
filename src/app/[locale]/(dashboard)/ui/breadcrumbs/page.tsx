import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { BreadcrumbsContent } from './breadcrumbs-content';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'breadcrumbs' });
  return { title: t('metadata.title') };
}

export default function BreadcrumbsPage() {
  return <BreadcrumbsContent />;
}
