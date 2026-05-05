import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { UserDetailContent } from './user-detail-content';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'users' });
  return { title: t('metadata.title') };
}

export default async function UserDetailPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { id } = await params;
  return <UserDetailContent id={id} />;
}
