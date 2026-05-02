'use client';

import { use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, Calendar, Clock } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@components/ui/card';
import { Avatar } from '@components/ui/avatar';
import { Badge } from '@components/ui/badge';
import { Button } from '@components/ui/button';
import { Skeleton } from '@components/ui/skeleton';
import { useUser, useUpdateUser, UserRole, UserForm } from '@features/users';
import { UserFormValues } from '@lib/validators/user.schema';
import { formatDate } from '@lib/utils';
import { routes } from '@config/routes';

const roleVariant: Record<UserRole, 'default' | 'success' | 'info' | 'warning'> = {
  admin: 'default',
  manager: 'info',
  editor: 'warning',
  viewer: 'success',
};

export default function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: user, isLoading } = useUser(id);
  const updateUser = useUpdateUser();

  async function handleUpdate(values: UserFormValues) {
    if (!user) return;
    await updateUser.mutateAsync({ id: user.id, ...values });
  }

  if (isLoading) {
    return (
      <div className="max-w-3xl space-y-6">
        <Skeleton className="h-8 w-32" />
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-56" />
            </div>
          </div>
        </div>
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-64 gap-4 text-center">
        <p className="text-lg font-semibold text-[var(--text-primary)]">User not found</p>
        <Link href={routes.users.list}>
          <Button variant="secondary">
            <ArrowLeft size={14} />
            Back to users
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">
      <Link href={routes.users.list}>
        <Button variant="ghost" size="sm" className="gap-1.5 -ml-1">
          <ArrowLeft size={14} />
          Back to users
        </Button>
      </Link>

      {/* Profile card */}
      <Card>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Avatar src={user.avatar} alt={user.name} size="xl" />
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h2 className="text-xl font-bold text-[var(--text-primary)]">{user.name}</h2>
                <Badge variant={roleVariant[user.role]}>
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </Badge>
                <Badge variant={user.status === 'active' ? 'success' : 'muted'}>{user.status}</Badge>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-[var(--text-muted)]">
                <span className="flex items-center gap-1.5"><Mail size={13} />{user.email}</span>
                <span className="flex items-center gap-1.5"><Calendar size={13} />Joined {formatDate(user.createdAt)}</span>
                <span className="flex items-center gap-1.5"><Clock size={13} />Last login {formatDate(user.lastLogin)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit form */}
      <Card>
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <UserForm
            defaultValues={{ name: user.name, email: user.email, role: user.role, status: user.status }}
            onSubmit={handleUpdate}
            submitLabel="Update user"
            initialData={user}
          />
        </CardContent>
      </Card>
    </div>
  );
}
