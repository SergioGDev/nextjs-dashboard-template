import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { DashboardContent } from './dashboard-content';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'dashboard' });
  return { title: t('title') };
}

export default function DashboardPage() {
  return <DashboardContent />;
}
