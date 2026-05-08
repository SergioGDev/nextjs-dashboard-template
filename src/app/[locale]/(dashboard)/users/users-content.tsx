'use client';

import { useState, useMemo } from 'react';
import { useTranslations, useFormatter } from 'next-intl';
import { Search, Plus, Pencil, Trash2 } from 'lucide-react';
import { DataTable, Column } from '@components/ui/data-table';
import { Avatar } from '@components/ui/avatar';
import { Badge } from '@components/ui/badge';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Select } from '@components/ui/select';
import { Dialog } from '@components/ui/dialog';
import { Card, CardContent } from '@components/ui/card';
import { useUsers, useCreateUser, useDeleteUser, User, UserRole, UserForm } from '@features/users';
import { UserFormValues } from '@lib/validators/user.schema';
import { Link } from '@/i18n/navigation';
import { routes } from '@config/routes';
import { TableSkeleton } from '@components/feedback/skeleton';
import { ErrorState } from '@components/feedback/error-state';
import { EmptyState } from '@components/feedback/empty-state';
import { toast } from '@components/feedback/toast';

const roleVariant: Record<UserRole, 'accent' | 'success' | 'info' | 'warning'> = {
  admin: 'accent',
  manager: 'info',
  editor: 'warning',
  viewer: 'success',
};

export function UsersContent() {
  const t = useTranslations('users');
  const format = useFormatter();

  const { data: users, isLoading, isError, error, refetch } = useUsers();
  const createUser = useCreateUser();
  const deleteUser = useDeleteUser();

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [showBulkDelete, setShowBulkDelete] = useState(false);
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [tableKey, setTableKey] = useState(0);

  const hasFilters = search.length > 0 || roleFilter !== '' || statusFilter !== '';

  function clearFilters() {
    setSearch('');
    setRoleFilter('');
    setStatusFilter('');
  }

  const filtered = useMemo(() => {
    return (users ?? []).filter((u) => {
      const matchSearch = !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
      const matchRole = !roleFilter || u.role === roleFilter;
      const matchStatus = !statusFilter || u.status === statusFilter;
      return matchSearch && matchRole && matchStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  async function handleCreate(values: UserFormValues) {
    try {
      await createUser.mutateAsync(values);
      setShowCreate(false);
      toast.success(t('toasts.created'));
    } catch {
      toast.error(t('toasts.createFailed'));
    }
  }

  async function handleBulkDelete() {
    const ids = Array.from(selected);
    setBulkDeleting(true);
    const results = await Promise.allSettled(
      ids.map((id) => deleteUser.mutateAsync(id))
    );
    setBulkDeleting(false);
    const failed = results.filter((r) => r.status === 'rejected').length;
    const succeeded = ids.length - failed;
    if (failed === 0) {
      toast.success(t('toasts.bulkDeleted', { count: succeeded }));
    } else if (succeeded === 0) {
      toast.error(t('toasts.bulkDeleteAllFailed'));
    } else {
      toast.error(t('toasts.bulkDeletePartial', { succeeded, failed }));
    }
    setSelected(new Set());
    setTableKey((k) => k + 1);
    setShowBulkDelete(false);
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    deleteUser.mutate(deleteTarget.id, {
      onSuccess: () => {
        toast.success(t('toasts.deleted'));
        setDeleteTarget(null);
      },
      onError: () => {
        toast.error(t('toasts.deleteFailed'));
        setDeleteTarget(null);
      },
    });
  }

  const columns: Column<User>[] = [
    {
      key: 'name',
      header: t('columns.user'),
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <Avatar src={row.avatar} alt={row.name} size="sm" />
          <div>
            <Link href={routes.users.detail(row.id)} className="font-medium text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors text-sm">
              {row.name}
            </Link>
            <p className="text-xs text-[var(--text-muted)]">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      header: t('columns.role'),
      sortable: true,
      render: (row) => (
        <Badge variant={roleVariant[row.role]}>
          {t(`roles.${row.role}`)}
        </Badge>
      ),
    },
    {
      key: 'status',
      header: t('columns.status'),
      sortable: true,
      render: (row) => (
        <Badge variant={row.status === 'active' ? 'success' : 'neutral'}>
          {t(`statuses.${row.status}`)}
        </Badge>
      ),
    },
    {
      key: 'lastLogin',
      header: t('columns.lastLogin'),
      sortable: true,
      render: (row) => (
        <span className="text-[var(--text-muted)] text-sm">
          {format.dateTime(new Date(row.lastLogin), { year: 'numeric', month: 'short', day: 'numeric' })}
        </span>
      ),
    },
    {
      key: 'actions',
      header: '',
      render: (row) => (
        <div className="flex items-center gap-1 justify-end">
          <Link href={routes.users.detail(row.id)}>
            <Button variant="ghost" iconOnly size="sm" aria-label={t('actions.edit')}>
              <Pencil size={14} />
            </Button>
          </Link>
          <Button
            variant="ghost"
            iconOnly
            size="sm"
            aria-label={t('actions.delete')}
            className="text-[var(--error)] hover:bg-[var(--error-muted)]"
            onClick={() => setDeleteTarget(row)}
          >
            <Trash2 size={14} />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-48 max-w-72">
          <Input
            placeholder={t('filters.searchPlaceholder')}
            leftIcon={<Search size={14} />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9"
          />
        </div>
        <Select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="w-36"
          placeholder={t('filters.roleFilter.all')}
        >
          <option value="admin">{t('roles.admin')}</option>
          <option value="manager">{t('roles.manager')}</option>
          <option value="editor">{t('roles.editor')}</option>
          <option value="viewer">{t('roles.viewer')}</option>
        </Select>
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-36"
          placeholder={t('filters.statusFilter.all')}
        >
          <option value="active">{t('statuses.active')}</option>
          <option value="inactive">{t('statuses.inactive')}</option>
        </Select>
        <div className="ml-auto">
          <Button onClick={() => setShowCreate(true)}>
            <Plus size={15} />
            {t('actions.newUser')}
          </Button>
        </div>
      </div>

      {selected.size > 0 && (
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface-raised)]">
          <span className="text-sm text-[var(--text-secondary)]">
            {t('bulkActions.selected', { count: selected.size })}
          </span>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setShowBulkDelete(true)}
          >
            <Trash2 size={13} />
            {t('bulkActions.delete')}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => { setSelected(new Set()); setTableKey((k) => k + 1); }}
          >
            {t('bulkActions.clear')}
          </Button>
        </div>
      )}

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-4">
              <TableSkeleton rows={10} columns={5} />
            </div>
          ) : isError ? (
            <ErrorState title={t('errors.loadFailed')} onRetry={() => refetch()} error={error} />
          ) : !filtered.length ? (
            hasFilters ? (
              <EmptyState
                variant="search"
                title={t('empty.noResults.title')}
                description={t('empty.noResults.description')}
                secondaryAction={
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    {t('filters.clearFilters')}
                  </Button>
                }
              />
            ) : (
              <EmptyState
                variant="default"
                title={t('empty.noUsers.title')}
                description={t('empty.noUsers.description')}
                action={
                  <Button onClick={() => setShowCreate(true)}>
                    <Plus size={15} />
                    {t('actions.newUser')}
                  </Button>
                }
              />
            )
          ) : (
            <DataTable<User>
              key={tableKey}
              columns={columns}
              data={filtered}
              getRowId={(r) => r.id}
              pageSize={10}
              selectable
              onSelectionChange={setSelected}
            />
          )}
        </CardContent>
      </Card>

      <Dialog
        open={showCreate}
        onClose={() => setShowCreate(false)}
        title={t('createDialog.title')}
        description={t('createDialog.description')}
      >
        <UserForm onSubmit={handleCreate} submitLabel={t('form.createLabel')} />
      </Dialog>

      <Dialog
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        title={t('deleteDialog.title')}
        description={t('deleteDialog.description', { name: deleteTarget?.name ?? '' })}
      >
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" onClick={() => setDeleteTarget(null)}>
            {t('deleteDialog.cancel')}
          </Button>
          <Button
            variant="destructive"
            loading={deleteUser.isPending}
            onClick={confirmDelete}
          >
            {t('deleteDialog.confirm')}
          </Button>
        </div>
      </Dialog>

      <Dialog
        open={showBulkDelete}
        onClose={!bulkDeleting ? () => setShowBulkDelete(false) : () => {}}
        title={t('bulkDeleteDialog.title')}
        description={t('bulkDeleteDialog.description', { count: selected.size })}
      >
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" onClick={() => setShowBulkDelete(false)} disabled={bulkDeleting}>
            {t('bulkDeleteDialog.cancel')}
          </Button>
          <Button variant="destructive" loading={bulkDeleting} onClick={handleBulkDelete}>
            {t('bulkDeleteDialog.confirm')}
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
