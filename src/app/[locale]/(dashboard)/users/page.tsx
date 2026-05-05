import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { UsersContent } from './users-content';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'users' });
  return { title: t('metadata.title') };
}

export default function UsersPage() {
  return <UsersContent />;
}
