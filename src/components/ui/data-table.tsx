'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { ChevronUp, ChevronDown, ChevronsUpDown, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from './table';
import { Input } from './input';
import { Skeleton } from './skeleton';
import { Button } from './button';
import { cn } from '@lib/utils';

export interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  pageSize?: number;
  selectable?: boolean;
  getRowId?: (row: T) => string;
  className?: string;
  emptyMessage?: string;
  /** Renders a search input above the table. Filters all columns by raw string value. */
  searchable?: boolean;
  searchPlaceholder?: string;
  /** Called synchronously inside every selection handler — never in render body. */
  onSelectionChange?: (ids: Set<string>) => void;
}

type SortDir = 'asc' | 'desc' | null;

export function DataTable<T extends object>({
  columns,
  data,
  loading,
  pageSize = 10,
  selectable,
  getRowId,
  className,
  emptyMessage,
  searchable,
  searchPlaceholder,
  onSelectionChange,
}: DataTableProps<T>) {
  const t = useTranslations('common');
  const [sortKey, setSortKey] = React.useState<string | null>(null);
  const [sortDir, setSortDir] = React.useState<SortDir>(null);
  const [page, setPage] = React.useState(1);
  const [selected, setSelected] = React.useState<Set<string>>(new Set());
  const [query, setQuery] = React.useState('');

  // 1. Filter — raw column values only (col.render returns ReactNode, not filterable)
  const filteredData = React.useMemo(() => {
    if (!searchable || query === '') return data;
    const q = query.toLowerCase();
    return data.filter((row) =>
      columns.some((col) => {
        const val = (row as Record<string, unknown>)[String(col.key)];
        return String(val ?? '').toLowerCase().includes(q);
      })
    );
  }, [data, query, searchable, columns]);

  // 2. Sort (applied on top of filtered)
  const sortedData = React.useMemo(() => {
    if (!sortKey || !sortDir) return filteredData;
    return [...filteredData].sort((a, b) => {
      const av = (a as Record<string, unknown>)[sortKey] ?? '';
      const bv = (b as Record<string, unknown>)[sortKey] ?? '';
      const cmp = String(av).localeCompare(String(bv), undefined, { numeric: true });
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [filteredData, sortKey, sortDir]);

  // 3. Paginate
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const pageData = sortedData.slice((page - 1) * pageSize, page * pageSize);

  function handleSort(key: string) {
    if (sortKey !== key) { setSortKey(key); setSortDir('asc'); }
    else if (sortDir === 'asc') setSortDir('desc');
    else { setSortKey(null); setSortDir(null); }
    setPage(1);
  }

  function toggleRow(id: string) {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelected(next);
    onSelectionChange?.(next);
  }

  function toggleAll() {
    const pageIds = pageData.map((r) => getRowId?.(r) ?? '');
    const allPageSelected = pageIds.length > 0 && pageIds.every((id) => selected.has(id));
    let next: Set<string>;
    if (allPageSelected) {
      // Deselect only current-page rows — preserves cross-page selections
      next = new Set(selected);
      pageIds.forEach((id) => next.delete(id));
    } else {
      // Add current-page rows to existing selection (union)
      next = new Set([...selected, ...pageIds]);
    }
    setSelected(next);
    onSelectionChange?.(next);
  }

  const SortIcon = ({ colKey }: { colKey: string }) => {
    if (sortKey !== colKey) return <ChevronsUpDown size={13} className="opacity-40" />;
    if (sortDir === 'asc') return <ChevronUp size={13} />;
    return <ChevronDown size={13} />;
  };

  if (loading) {
    return (
      <div className={cn('space-y-2', className)}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-11 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className={cn('nx-data-table', className)}>
      {searchable && (
        <div className="nx-data-table__toolbar">
          <Input
            size="sm"
            placeholder={searchPlaceholder ?? t('table.searchPlaceholder')}
            leftIcon={<Search size={14} />}
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(1); }}
            aria-label={searchPlaceholder ?? t('table.searchPlaceholder')}
          />
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            {selectable && (
              <TableHead className="w-10">
                <input
                  type="checkbox"
                  checked={pageData.length > 0 && pageData.every((r) => selected.has(getRowId?.(r) ?? ''))}
                  onChange={toggleAll}
                  className="accent-[var(--accent)]"
                />
              </TableHead>
            )}
            {columns.map((col) => (
              <TableHead key={String(col.key)} className={col.className}>
                {col.sortable ? (
                  <button
                    onClick={() => handleSort(String(col.key))}
                    className="nx-data-table__sort-btn"
                  >
                    {col.header}
                    <SortIcon colKey={String(col.key)} />
                  </button>
                ) : col.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {pageData.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length + (selectable ? 1 : 0)}
                className="text-center text-[var(--text-muted)] py-12"
              >
                {query !== '' ? t('table.noResults') : (emptyMessage ?? t('table.empty'))}
              </TableCell>
            </TableRow>
          ) : (
            pageData.map((row, i) => {
              const id = getRowId?.(row) ?? String(i);
              return (
                <TableRow key={id} className={selected.has(id) ? 'bg-[var(--accent-muted)]' : ''}>
                  {selectable && (
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selected.has(id)}
                        onChange={() => toggleRow(id)}
                        className="accent-[var(--accent)]"
                      />
                    </TableCell>
                  )}
                  {columns.map((col) => (
                    <TableCell key={String(col.key)} className={col.className}>
                      {col.render ? col.render(row) : String((row as Record<string, unknown>)[String(col.key)] ?? '')}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <div className="nx-data-table__pagination">
          <p className="nx-data-table__showing">
            {t('table.showing', {
              start: (page - 1) * pageSize + 1,
              end: Math.min(page * pageSize, sortedData.length),
              total: sortedData.length,
            })}
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              iconOnly
              aria-label={t('table.previousPage')}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft size={16} />
            </Button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const p = i + 1;
              return (
                <Button
                  key={p}
                  variant={page === p ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setPage(p)}
                  className="h-8 w-8 p-0"
                >
                  {p}
                </Button>
              );
            })}
            <Button
              variant="ghost"
              iconOnly
              aria-label={t('table.nextPage')}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
