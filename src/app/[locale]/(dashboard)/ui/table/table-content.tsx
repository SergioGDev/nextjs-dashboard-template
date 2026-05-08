'use client';

import { useTranslations } from 'next-intl';
import { MoreHorizontal } from 'lucide-react';
import {
  ShowcaseSection,
  ShowcaseDemo,
  ShowcaseGrid,
  PropsTable,
  Anatomy,
} from '@features/ui-showcase';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@components/ui/table';
import { Badge } from '@components/ui/badge';
import { Avatar } from '@components/ui/avatar';
import { Button } from '@components/ui/button';
import { DropdownMenu, DropdownMenuItem, DropdownMenuSeparator } from '@components/ui/dropdown-menu';
import { Link } from '@/i18n/navigation';
import { routes } from '@config/routes';
import type { PropDoc, AnatomyPart } from '@features/ui-showcase';

// ---------------------------------------------------------------------------
// Shared demo data — works in both locales; international names, no translation
// ---------------------------------------------------------------------------

const USERS = [
  { id: '1', name: 'Ana García',    email: 'ana@example.com',    role: 'Admin',   status: 'active'   as const, revenue: 12_400, joined: '2023-01-14' },
  { id: '2', name: 'Marco Rivera',  email: 'marco@example.com',  role: 'Editor',  status: 'active'   as const, revenue:  8_730, joined: '2023-03-22' },
  { id: '3', name: 'Priya Patel',   email: 'priya@example.com',  role: 'Viewer',  status: 'inactive' as const, revenue:  3_200, joined: '2023-06-05' },
  { id: '4', name: 'James Kim',     email: 'james@example.com',  role: 'Manager', status: 'active'   as const, revenue: 21_900, joined: '2022-11-30' },
  { id: '5', name: 'Sofia Chen',    email: 'sofia@example.com',  role: 'Viewer',  status: 'active'   as const, revenue:  5_560, joined: '2023-08-18' },
];

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export function TableContent() {
  const t = useTranslations('table');
  const tNote = useTranslations('uiShowcase.localizationNote');

  const anatomyParts: AnatomyPart[] = [
    { name: 'Table',       type: 'component', required: true,  description: t('anatomy.table') },
    { name: 'TableHeader', type: 'component', required: false, description: t('anatomy.tableHeader') },
    { name: 'TableBody',   type: 'component', required: true,  description: t('anatomy.tableBody') },
    { name: 'TableRow',    type: 'component', required: true,  description: t('anatomy.tableRow') },
    { name: 'TableHead',   type: 'component', required: false, description: t('anatomy.tableHead') },
    { name: 'TableCell',   type: 'component', required: true,  description: t('anatomy.tableCell') },
  ];

  const propsRows: PropDoc[] = [
    { prop: 'Table',       type: 'HTMLAttributes<HTMLTableElement>',        description: 'Wraps <table> in an overflow-x-auto container; className applied to <table>.' },
    { prop: 'TableHeader', type: 'HTMLAttributes<HTMLTableSectionElement>', description: 'Maps to <thead>. Accepts className and all thead attributes.' },
    { prop: 'TableBody',   type: 'HTMLAttributes<HTMLTableSectionElement>', description: 'Maps to <tbody>. Last row border is removed via CSS.' },
    { prop: 'TableRow',    type: 'HTMLAttributes<HTMLTableRowElement>',     description: 'Maps to <tr>. Includes border-bottom and hover background.' },
    { prop: 'TableHead',   type: 'ThHTMLAttributes<HTMLTableCellElement>',  description: 'Maps to <th>. Uppercase, muted text, 2.5rem height.' },
    { prop: 'TableCell',   type: 'TdHTMLAttributes<HTMLTableCellElement>',  description: 'Maps to <td>. Standard padding, primary text color.' },
  ];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">{t('header.title')}</h1>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-2xl">
          {t('header.subtitle')}
        </p>
        <pre className="mt-3 rounded-lg bg-[var(--surface-raised)] border border-[var(--border)] px-4 py-3 text-xs font-mono text-[var(--text-secondary)] overflow-x-auto">
          {`import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@components/ui/table';`}
        </pre>
      </div>

      {/* Anatomy */}
      <ShowcaseSection
        title={t('sections.anatomy.title')}
        description={t('sections.anatomy.description')}
      >
        <Anatomy
          render={
            <div className="font-mono text-xs text-[var(--text-secondary)] space-y-1 text-left">
              <div className="text-[var(--accent)]">{'<Table>'}</div>
              <div className="pl-4 text-[var(--text-muted)]">{'<TableHeader>'}</div>
              <div className="pl-8 text-[var(--text-muted)]">{'<TableRow>'}</div>
              <div className="pl-12">{'<TableHead />'} <span className="text-[var(--text-muted)]">× N</span></div>
              <div className="pl-4 text-[var(--text-muted)]">{'<TableBody>'}</div>
              <div className="pl-8 text-[var(--text-muted)]">{'<TableRow />'} <span className="text-[var(--text-muted)]">× N</span></div>
              <div className="pl-12">{'<TableCell />'} <span className="text-[var(--text-muted)]">× N</span></div>
              <div className="text-[var(--accent)]">{'</Table>'}</div>
            </div>
          }
          parts={anatomyParts}
        />
      </ShowcaseSection>

      {/* Basic table */}
      <ShowcaseSection
        title={t('sections.basic.title')}
        description={t('sections.basic.description')}
      >
        <ShowcaseDemo
          title={t('sections.basic.title')}
          code={`<Table>
  <TableHeader>
    <TableRow className="hover:bg-transparent">
      <TableHead>Name</TableHead>
      <TableHead>Email</TableHead>
      <TableHead>Role</TableHead>
      <TableHead>Joined</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {users.map((u) => (
      <TableRow key={u.id}>
        <TableCell>{u.name}</TableCell>
        <TableCell>{u.email}</TableCell>
        <TableCell>{u.role}</TableCell>
        <TableCell>{u.joined}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>`}
        >
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {USERS.map((u) => (
                <TableRow key={u.id}>
                  <TableCell>{u.name}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>{u.role}</TableCell>
                  <TableCell>{u.joined}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ShowcaseDemo>
      </ShowcaseSection>

      {/* With status badges */}
      <ShowcaseSection
        title={t('sections.badges.title')}
        description={t('sections.badges.description')}
      >
        <ShowcaseDemo
          title={t('sections.badges.title')}
          code={`<TableCell>
  <Badge variant={u.status === 'active' ? 'success' : 'neutral'}>
    {u.status}
  </Badge>
</TableCell>`}
        >
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {USERS.map((u) => (
                <TableRow key={u.id}>
                  <TableCell>{u.name}</TableCell>
                  <TableCell>{u.role}</TableCell>
                  <TableCell>
                    <Badge variant={u.status === 'active' ? 'success' : 'neutral'}>
                      {u.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ShowcaseDemo>
      </ShowcaseSection>

      {/* With actions column */}
      <ShowcaseSection
        title={t('sections.actions.title')}
        description={t('sections.actions.description')}
      >
        <ShowcaseDemo
          title={t('sections.actions.title')}
          code={`<TableHead className="w-10" />  {/* empty label — convention for actions col */}

<TableCell>
  <DropdownMenu
    trigger={
      <Button variant="ghost" iconOnly size="sm" aria-label="Row actions">
        <MoreHorizontal size={15} />
      </Button>
    }
  >
    <DropdownMenuItem onClick={() => {}}>Edit</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem onClick={() => {}} destructive>Delete</DropdownMenuItem>
  </DropdownMenu>
</TableCell>`}
        >
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {USERS.map((u) => (
                <TableRow key={u.id}>
                  <TableCell>{u.name}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>{u.role}</TableCell>
                  <TableCell>
                    <DropdownMenu
                      trigger={
                        <Button variant="ghost" iconOnly size="sm" aria-label="Row actions">
                          <MoreHorizontal size={15} />
                        </Button>
                      }
                    >
                      <DropdownMenuItem onClick={() => {}}>Edit</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => {}} destructive>Delete</DropdownMenuItem>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ShowcaseDemo>
      </ShowcaseSection>

      {/* Right-aligned numbers */}
      <ShowcaseSection
        title={t('sections.numbers.title')}
        description={t('sections.numbers.description')}
      >
        <ShowcaseDemo
          title={t('sections.numbers.title')}
          code={`<TableHead className="text-right">Revenue</TableHead>

<TableCell className="text-right font-mono tabular-nums">
  {'$' + u.revenue.toLocaleString()}
</TableCell>`}
        >
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {USERS.map((u) => (
                <TableRow key={u.id}>
                  <TableCell>{u.name}</TableCell>
                  <TableCell>{u.role}</TableCell>
                  <TableCell className="text-right font-mono tabular-nums">
                    {'$' + u.revenue.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ShowcaseDemo>
      </ShowcaseSection>

      {/* With avatars */}
      <ShowcaseSection
        title={t('sections.avatars.title')}
        description={t('sections.avatars.description')}
      >
        <ShowcaseDemo
          title={t('sections.avatars.title')}
          code={`<TableCell>
  <div className="flex items-center gap-3">
    <Avatar alt={u.name} size="sm" />
    <span>{u.name}</span>
  </div>
</TableCell>`}
        >
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {USERS.map((u) => (
                <TableRow key={u.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar alt={u.name} size="sm" />
                      <span>{u.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>{u.role}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ShowcaseDemo>
      </ShowcaseSection>

      {/* Table vs DataTable */}
      <ShowcaseSection title={t('sections.usage.title')}>
        <ShowcaseGrid columns={2}>
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 space-y-3">
            <h3 className="text-sm font-semibold">{t('sections.usage.tableWhenTitle')}</h3>
            <ul className="space-y-1.5 text-sm text-[var(--text-secondary)]">
              {(t.raw('sections.usage.tableWhen') as string[]).map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[var(--accent)] shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 space-y-3">
            <h3 className="text-sm font-semibold">{t('sections.usage.dataTableWhenTitle')}</h3>
            <ul className="space-y-1.5 text-sm text-[var(--text-secondary)]">
              {(t.raw('sections.usage.dataTableWhen') as string[]).map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[var(--accent)] shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </ShowcaseGrid>
        <p className="mt-3 text-xs text-[var(--text-muted)]">{t('sections.usage.note')}</p>
      </ShowcaseSection>

      {/* Props */}
      <ShowcaseSection
        title={t('sections.props.title')}
        description={t('sections.props.description')}
      >
        <PropsTable rows={propsRows} />
        <p className="mt-3 text-xs text-[var(--text-muted)]">{t('props.extendsNote')}</p>
      </ShowcaseSection>

      {/* Localization */}
      <ShowcaseSection title={tNote('title')}>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 space-y-3">
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{tNote('description')}</p>
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
