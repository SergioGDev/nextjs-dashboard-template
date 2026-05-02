'use client';

import { useState, useMemo } from 'react';
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
import { formatDate } from '@lib/utils';
import Link from 'next/link';
import { routes } from '@config/routes';

const roleVariant: Record<UserRole, 'default' | 'success' | 'info' | 'warning'> = {
  admin: 'default',
  manager: 'info',
  editor: 'warning',
  viewer: 'success',
};

export default function UsersPage() {
  const { data: users, isLoading } = useUsers();
  const createUser = useCreateUser();
  const deleteUser = useDeleteUser();

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showCreate, setShowCreate] = useState(false);

  const filtered = useMemo(() => {
    return (users ?? []).filter((u) => {
      const matchSearch = !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
      const matchRole = !roleFilter || u.role === roleFilter;
      const matchStatus = !statusFilter || u.status === statusFilter;
      return matchSearch && matchRole && matchStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  async function handleCreate(values: UserFormValues) {
    await createUser.mutateAsync(values);
    setShowCreate(false);
  }

  const columns: Column<User>[] = [
    {
      key: 'name',
      header: 'User',
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
      header: 'Role',
      sortable: true,
      render: (row) => (
        <Badge variant={roleVariant[row.role]}>
          {row.role.charAt(0).toUpperCase() + row.role.slice(1)}
        </Badge>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (row) => (
        <Badge variant={row.status === 'active' ? 'success' : 'muted'}>
          {row.status}
        </Badge>
      ),
    },
    {
      key: 'lastLogin',
      header: 'Last Login',
      sortable: true,
      render: (row) => <span className="text-[var(--text-muted)] text-sm">{formatDate(row.lastLogin)}</span>,
    },
    {
      key: 'actions',
      header: '',
      render: (row) => (
        <div className="flex items-center gap-1 justify-end">
          <Link href={routes.users.detail(row.id)}>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Pencil size={14} />
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-[var(--error)] hover:bg-[var(--error-muted)]"
            onClick={() => deleteUser.mutate(row.id)}
          >
            <Trash2 size={14} />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-48 max-w-72">
          <Input
            placeholder="Search users…"
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
          placeholder="All roles"
        >
          <option value="admin">Admin</option>
          <option value="manager">Manager</option>
          <option value="editor">Editor</option>
          <option value="viewer">Viewer</option>
        </Select>
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-36"
          placeholder="All statuses"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </Select>
        <div className="ml-auto">
          <Button onClick={() => setShowCreate(true)}>
            <Plus size={15} />
            New User
          </Button>
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <DataTable<User>
            columns={columns}
            data={filtered}
            loading={isLoading}
            getRowId={(r) => r.id}
            pageSize={10}
            selectable
            emptyMessage="No users match your filters."
          />
        </CardContent>
      </Card>

      {/* Create dialog */}
      <Dialog
        open={showCreate}
        onClose={() => setShowCreate(false)}
        title="New User"
        description="Add a new user to your workspace."
      >
        <UserForm onSubmit={handleCreate} submitLabel="Create user" />
      </Dialog>
    </div>
  );
}
