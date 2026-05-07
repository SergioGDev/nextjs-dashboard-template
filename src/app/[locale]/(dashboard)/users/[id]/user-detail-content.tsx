'use client';

import { useTranslations, useFormatter } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { ArrowLeft, Mail, Calendar, Clock } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@components/ui/card';
import { Avatar } from '@components/ui/avatar';
import { Badge } from '@components/ui/badge';
import { Button } from '@components/ui/button';
import { Skeleton } from '@components/ui/skeleton';
import { useUser, useUpdateUser, UserRole, UserForm } from '@features/users';
import { UserFormValues } from '@lib/validators/user.schema';
import { routes } from '@config/routes';
import { UserCardSkeleton, FormSkeleton } from '@components/feedback/skeleton';
import { ErrorState } from '@components/feedback/error-state';
import { EmptyState } from '@components/feedback/empty-state';
import { toast } from '@components/feedback/toast';

const roleVariant: Record<UserRole, 'accent' | 'success' | 'info' | 'warning'> = {
  admin: 'accent',
  manager: 'info',
  editor: 'warning',
  viewer: 'success',
};

interface UserDetailContentProps {
  id: string;
}

export function UserDetailContent({ id }: UserDetailContentProps) {
  const t = useTranslations('users');
  const format = useFormatter();

  const { data: user, isLoading, isError, error, refetch } = useUser(id);
  const updateUser = useUpdateUser();

  async function handleUpdate(values: UserFormValues) {
    if (!user) return;
    try {
      await updateUser.mutateAsync({ id: user.id, ...values });
      toast.success(t('toasts.updated'));
    } catch {
      toast.error(t('toasts.updateFailed'));
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-3xl space-y-6">
        <Skeleton className="h-8 w-32" />
        <Card>
          <CardContent>
            <UserCardSkeleton />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-24" />
          </CardHeader>
          <CardContent>
            <FormSkeleton fields={4} />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-3xl">
        <ErrorState
          title={t('errors.userLoadFailed')}
          onRetry={() => refetch()}
          error={error}
        />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-3xl">
        <EmptyState
          variant="error"
          title={t('detail.notFound.title')}
          description={t('detail.notFound.description')}
          secondaryAction={
            <Link href={routes.users.list}>
              <Button variant="secondary">
                <ArrowLeft size={14} />
                {t('detail.notFound.backToUsers')}
              </Button>
            </Link>
          }
        />
      </div>
    );
  }

  const joinedDate = format.dateTime(new Date(user.createdAt), { year: 'numeric', month: 'short', day: 'numeric' });
  const lastLoginDate = format.dateTime(new Date(user.lastLogin), { year: 'numeric', month: 'short', day: 'numeric' });

  return (
    <div className="max-w-3xl space-y-6">
      <Link href={routes.users.list}>
        <Button variant="ghost" size="sm" className="gap-1.5 -ml-1">
          <ArrowLeft size={14} />
          {t('detail.backToUsers')}
        </Button>
      </Link>

      <Card>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Avatar src={user.avatar} alt={user.name} size="xl" />
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h2 className="text-xl font-bold text-[var(--text-primary)]">{user.name}</h2>
                <Badge variant={roleVariant[user.role]}>
                  {t(`roles.${user.role}`)}
                </Badge>
                <Badge variant={user.status === 'active' ? 'success' : 'neutral'}>
                  {t(`statuses.${user.status}`)}
                </Badge>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-[var(--text-muted)]">
                <span className="flex items-center gap-1.5"><Mail size={13} />{user.email}</span>
                <span className="flex items-center gap-1.5"><Calendar size={13} />{t('detail.fields.joined', { date: joinedDate })}</span>
                <span className="flex items-center gap-1.5"><Clock size={13} />{t('detail.fields.lastLogin', { date: lastLoginDate })}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('detail.editTitle')}</CardTitle>
        </CardHeader>
        <CardContent>
          <UserForm
            defaultValues={{ name: user.name, email: user.email, role: user.role, status: user.status }}
            onSubmit={handleUpdate}
            submitLabel={t('form.updateLabel')}
          />
        </CardContent>
      </Card>
    </div>
  );
}
