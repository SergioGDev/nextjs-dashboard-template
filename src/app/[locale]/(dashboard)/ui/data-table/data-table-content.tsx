'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { Badge } from '@components/ui/badge';
import { Avatar } from '@components/ui/avatar';
import { DataTable } from '@components/ui/data-table';
import type { Column } from '@components/ui/data-table';
import {
  ShowcaseSection,
  ShowcaseDemo,
  ShowcaseGrid,
  PropsTable,
} from '@features/ui-showcase';
import { Link } from '@/i18n/navigation';
import { routes } from '@config/routes';
import type { PropDoc } from '@features/ui-showcase';

// ─── Demo data ────────────────────────────────────────────────────────────────

type DemoUser = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
  status: 'active' | 'inactive' | 'pending';
};

const ROLES = ['admin', 'user', 'guest'] as const;
const STATUSES = ['active', 'inactive', 'pending'] as const;
const NAMES = [
  'Ana García',    'Marco Rivera',   'Priya Patel',   'James Kim',      'Sofia Chen',
  'Lena Müller',   'Carlos López',   'Yuki Tanaka',   'Omar Hassan',    'Nina Kowalski',
  'David Okonkwo', 'Sara Johansson', 'Ali Reza',      'Emma Wilson',    'Leo Ferreira',
  'Hana Park',     'Lucas Martin',   'Aisha Diallo',  'Ryu Nakamura',  'Zoe Roberts',
  'Mateo Díaz',    'Ingrid Berg',    'Tariq Mahmoud', 'Mei Lin',        'Finn Obrien',
  'Amara Nwosu',   'Boris Petrov',   'Keiko Yamada',  'Diego Torres',   'Nadia Klein',
  'Kwame Mensah',  'Elsa Lindqvist', 'Rajan Singh',   'Claire Dupont',  'Miles Johnson',
];

const manyUsers: DemoUser[] = NAMES.map((name, i) => ({
  id: String(i + 1),
  name,
  email: `user${i + 1}@example.com`,
  role: ROLES[i % 3],
  status: STATUSES[i % 3],
}));

const smallUsers = manyUsers.slice(0, 5);

// ─── Column definitions (module-level — no state, no hooks) ──────────────────

const basicColumns: Column<DemoUser>[] = [
  { key: 'name',   header: 'Name',   sortable: true },
  { key: 'email',  header: 'Email',  sortable: true },
  { key: 'role',   header: 'Role',   sortable: true },
  { key: 'status', header: 'Status', sortable: true },
];

function statusBadge(u: DemoUser) {
  return (
    <Badge
      variant={
        u.status === 'active' ? 'success'
        : u.status === 'pending' ? 'warning'
        : 'neutral'
      }
    >
      {u.status}
    </Badge>
  );
}

const badgeColumns: Column<DemoUser>[] = [
  { key: 'name',   header: 'Name',   sortable: true },
  { key: 'email',  header: 'Email',  sortable: true },
  { key: 'role',   header: 'Role',   sortable: true },
  { key: 'status', header: 'Status', sortable: true, render: statusBadge },
];

const avatarColumns: Column<DemoUser>[] = [
  {
    key: 'name',
    header: 'User',
    render: (u) => (
      <div className="flex items-center gap-3">
        <Avatar alt={u.name} size="sm" />
        <div>
          <p className="text-sm font-medium text-[var(--text-primary)]">{u.name}</p>
          <p className="text-xs text-[var(--text-muted)]">{u.email}</p>
        </div>
      </div>
    ),
  },
  { key: 'role',   header: 'Role',   sortable: true },
  { key: 'status', header: 'Status', sortable: true, render: statusBadge },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function DataTableContent() {
  const t = useTranslations('dataTable');
  const tNote = useTranslations('uiShowcase.localizationNote');

  const [selectedCount, setSelectedCount] = React.useState(0);

  const propsRows: PropDoc[] = [
    { prop: 'columns',           type: 'Column<T>[]',               required: true,  description: t('props.columns') },
    { prop: 'data',              type: 'T[]',                       required: true,  description: t('props.data') },
    { prop: 'loading',           type: 'boolean',                   default: 'false', description: t('props.loading') },
    { prop: 'pageSize',          type: 'number',                    default: '10',   description: t('props.pageSize') },
    { prop: 'selectable',        type: 'boolean',                   default: 'false', description: t('props.selectable') },
    { prop: 'getRowId',          type: '(row: T) => string',                         description: t('props.getRowId') },
    { prop: 'emptyMessage',      type: 'string',                                     description: t('props.emptyMessage') },
    { prop: 'searchable',        type: 'boolean',                   default: 'false', description: t('props.searchable') },
    { prop: 'searchPlaceholder', type: 'string',                                     description: t('props.searchPlaceholder') },
    { prop: 'onSelectionChange', type: '(ids: Set<string>) => void',                 description: t('props.onSelectionChange') },
    { prop: 'className',         type: 'string',                                     description: t('props.className') },
  ];

  const columnPropsRows: PropDoc[] = [
    { prop: 'key',       type: 'keyof T | string',       required: true,  description: t('columnProps.key') },
    { prop: 'header',    type: 'string',                  required: true,  description: t('columnProps.header') },
    { prop: 'render',    type: '(row: T) => ReactNode',                    description: t('columnProps.render') },
    { prop: 'sortable',  type: 'boolean',                 default: 'false', description: t('columnProps.sortable') },
    { prop: 'className', type: 'string',                                   description: t('columnProps.className') },
  ];

  return (
    <div className="space-y-10">

      {/* ── Header ── */}
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">{t('header.title')}</h1>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-2xl">
          {t('header.subtitle')}
        </p>
        <pre className="mt-3 rounded-lg bg-[var(--surface-raised)] border border-[var(--border)] px-4 py-3 text-xs font-mono text-[var(--text-secondary)] overflow-x-auto">
          {`import { DataTable } from '@components/ui/data-table';\nimport type { Column } from '@components/ui/data-table';`}
        </pre>
      </div>

      {/* ── Basic ── */}
      <ShowcaseSection
        title={t('sections.basic.title')}
        description={t('sections.basic.description')}
      >
        <ShowcaseDemo
          title={t('sections.basic.title')}
          align="start"
          code={`const columns: Column<User>[] = [
  { key: 'name',   header: 'Name',   sortable: true },
  { key: 'email',  header: 'Email',  sortable: true },
  { key: 'role',   header: 'Role',   sortable: true },
  { key: 'status', header: 'Status', sortable: true },
];

<DataTable columns={columns} data={users} getRowId={(r) => r.id} />`}
        >
          <DataTable
            columns={basicColumns}
            data={smallUsers}
            getRowId={(r) => r.id}
          />
        </ShowcaseDemo>
      </ShowcaseSection>

      {/* ── With status badges ── */}
      <ShowcaseSection
        title={t('sections.badges.title')}
        description={t('sections.badges.description')}
      >
        <ShowcaseDemo
          title={t('sections.badges.title')}
          align="start"
          code={`{
  key: 'status',
  header: 'Status',
  sortable: true,
  render: (u) => (
    <Badge
      variant={
        u.status === 'active'  ? 'success'
        : u.status === 'pending' ? 'warning'
        : 'neutral'
      }
    >
      {u.status}
    </Badge>
  ),
}`}
        >
          <DataTable
            columns={badgeColumns}
            data={smallUsers}
            getRowId={(r) => r.id}
          />
        </ShowcaseDemo>
      </ShowcaseSection>

      {/* ── With avatars ── */}
      <ShowcaseSection
        title={t('sections.avatars.title')}
        description={t('sections.avatars.description')}
      >
        <ShowcaseDemo
          title={t('sections.avatars.title')}
          align="start"
          code={`{
  key: 'name',
  header: 'User',
  render: (u) => (
    <div className="flex items-center gap-3">
      <Avatar alt={u.name} size="sm" />
      <div>
        <p className="text-sm font-medium">{u.name}</p>
        <p className="text-xs text-[var(--text-muted)]">{u.email}</p>
      </div>
    </div>
  ),
}`}
        >
          <DataTable
            columns={avatarColumns}
            data={smallUsers}
            getRowId={(r) => r.id}
          />
        </ShowcaseDemo>
      </ShowcaseSection>

      {/* ── Pagination ── */}
      <ShowcaseSection
        title={t('sections.pagination.title')}
        description={t('sections.pagination.description')}
      >
        <ShowcaseDemo
          title={t('sections.pagination.title')}
          align="start"
          code={`<DataTable
  columns={columns}
  data={manyUsers}   // 35 rows
  getRowId={(r) => r.id}
  pageSize={10}
/>`}
        >
          <DataTable
            columns={badgeColumns}
            data={manyUsers}
            getRowId={(r) => r.id}
            pageSize={10}
          />
        </ShowcaseDemo>
      </ShowcaseSection>

      {/* ── Search ── */}
      <ShowcaseSection
        title={t('sections.search.title')}
        description={t('sections.search.description')}
      >
        <ShowcaseDemo
          title={t('sections.search.title')}
          align="start"
          code={`<DataTable
  columns={columns}
  data={manyUsers}
  getRowId={(r) => r.id}
  searchable
  searchPlaceholder="Search users…"
/>`}
        >
          <DataTable
            columns={badgeColumns}
            data={manyUsers}
            getRowId={(r) => r.id}
            searchable
            searchPlaceholder={t('demos.search.placeholder')}
          />
        </ShowcaseDemo>
      </ShowcaseSection>

      {/* ── Selection ── */}
      <ShowcaseSection
        title={t('sections.selection.title')}
        description={t('sections.selection.description')}
      >
        <ShowcaseDemo
          title={t('sections.selection.title')}
          align="start"
          code={`const [count, setCount] = useState(0);

<DataTable
  columns={columns}
  data={users}
  getRowId={(r) => r.id}
  selectable
  onSelectionChange={(ids) => setCount(ids.size)}
/>`}
        >
          <div className="w-full space-y-3">
            <div className="flex items-center gap-2 min-h-[1.5rem]">
              {selectedCount > 0 ? (
                <>
                  <Badge variant="accent">{selectedCount}</Badge>
                  <span className="text-sm text-[var(--text-secondary)]">
                    {t('demos.selection.selected', { count: selectedCount })}
                  </span>
                </>
              ) : (
                <span className="text-sm text-[var(--text-muted)]">
                  {t('demos.selection.noneSelected')}
                </span>
              )}
            </div>
            <DataTable
              columns={basicColumns}
              data={smallUsers}
              getRowId={(r) => r.id}
              selectable
              onSelectionChange={(ids) => setSelectedCount(ids.size)}
            />
          </div>
        </ShowcaseDemo>
      </ShowcaseSection>

      {/* ── Loading & empty states ── */}
      <ShowcaseSection
        title={t('sections.loading.title')}
        description={t('sections.loading.description')}
      >
        <ShowcaseDemo
          title={t('sections.loading.title')}
          align="start"
          code={`<DataTable columns={columns} data={[]} loading />`}
        >
          <DataTable columns={basicColumns} data={[]} loading />
        </ShowcaseDemo>
      </ShowcaseSection>

      <ShowcaseSection
        title={t('sections.empty.title')}
        description={t('sections.empty.description')}
      >
        <ShowcaseGrid columns={2}>
          <ShowcaseDemo
            title="Default message"
            align="start"
            code={`<DataTable columns={columns} data={[]} getRowId={(r) => r.id} />`}
          >
            <DataTable
              columns={basicColumns}
              data={[]}
              getRowId={(r) => r.id}
            />
          </ShowcaseDemo>
          <ShowcaseDemo
            title="Custom message"
            align="start"
            code={`<DataTable
  columns={columns}
  data={[]}
  getRowId={(r) => r.id}
  emptyMessage="No users match the selected filters."
/>`}
          >
            <DataTable
              columns={basicColumns}
              data={[]}
              getRowId={(r) => r.id}
              emptyMessage={t('demos.empty.customMessage')}
            />
          </ShowcaseDemo>
        </ShowcaseGrid>
      </ShowcaseSection>

      {/* ── Server-side note ── */}
      <ShowcaseSection title={t('sections.serverSide.title')}>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 space-y-4">
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            {t('sections.serverSide.description')}
          </p>
          <pre className="rounded-lg bg-[var(--surface-raised)] border border-[var(--border)] px-4 py-3 text-xs font-mono text-[var(--text-secondary)] overflow-x-auto">{`// Manage page state externally
const [page, setPage] = useState(1);
const { data, isLoading } = useQuery({
  queryKey: ['users', page],
  queryFn: () => fetchUsers({ page, pageSize: 10 }),
});

// Pass the pre-paginated slice + loading flag
<DataTable
  columns={columns}
  data={data?.rows ?? []}
  loading={isLoading}
  getRowId={(r) => r.id}
  pageSize={10}
/>`}</pre>
        </div>
      </ShowcaseSection>

      {/* ── Feedback pattern ── */}
      <ShowcaseSection
        title={t('sections.feedbackPattern.title')}
        description={t('sections.feedbackPattern.description')}
      >
        <pre className="rounded-lg bg-[var(--surface-raised)] border border-[var(--border)] px-4 py-3 text-xs font-mono text-[var(--text-secondary)] overflow-x-auto">{`import { TableSkeleton } from '@components/feedback/skeleton';
import { ErrorState } from '@components/feedback/error-state';

function UserTable() {
  const { data, isLoading, isError, refetch, error } = useUsers();

  if (isLoading) return <TableSkeleton />;
  if (isError)   return <ErrorState onRetry={() => refetch()} error={error} />;

  // DataTable renders its own "no data" row for empty arrays
  return (
    <DataTable
      columns={columns}
      data={data}
      getRowId={(r) => r.id}
      pageSize={10}
    />
  );
}`}</pre>
      </ShowcaseSection>

      {/* ── Keyboard navigation ── */}
      <ShowcaseSection title={t('sections.keyboard.title')}>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            {t('sections.keyboard.description')}
          </p>
        </div>
      </ShowcaseSection>

      {/* ── DataTable props ── */}
      <ShowcaseSection
        title={t('sections.props.title')}
        description={t('sections.props.description')}
      >
        <PropsTable rows={propsRows} />
      </ShowcaseSection>

      {/* ── Column props ── */}
      <ShowcaseSection
        title={t('sections.columnProps.title')}
        description={t('sections.columnProps.description')}
      >
        <PropsTable rows={columnPropsRows} />
      </ShowcaseSection>

      {/* ── Localization ── */}
      <ShowcaseSection title={tNote('title')}>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 space-y-3">
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            {tNote('description')}
          </p>
          <Link
            href={routes.ui.i18n}
            className="inline-flex text-sm font-medium text-[var(--accent)] hover:underline"
          >
            {tNote('linkLabel')}
          </Link>
        </div>
      </ShowcaseSection>

    </div>
  );
}
