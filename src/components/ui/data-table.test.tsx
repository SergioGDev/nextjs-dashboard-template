import { describe, expect, it } from 'vitest';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, screen } from '@/test/render';
import { DataTable, type Column } from './data-table';

interface Row {
  id: string;
  name: string;
  status: 'active' | 'inactive';
}

const rows: Row[] = [
  { id: '1', name: 'Alice', status: 'active' },
  { id: '2', name: 'Bob', status: 'inactive' },
  { id: '3', name: 'Charlie', status: 'active' },
];

const columns: Column<Row>[] = [
  { key: 'name', header: 'Name' },
  {
    key: 'status',
    header: 'Status',
    // D-5: this render transforms the raw value — the filter never sees the
    // transformed text, only the raw column value (see data-table.tsx:58-68
    // and docs/B9-audit.md D-5). Deliberately used below to prove the limit.
    render: (row) => (row.status === 'active' ? 'Currently active' : 'Currently inactive'),
  },
];

const messages = {
  common: {
    table: {
      searchPlaceholder: 'Search…',
      noResults: 'No results found',
      empty: 'No data',
      showing: 'Showing {start}–{end} of {total}',
      pagination: 'Pagination',
      previousPage: 'Previous page',
      nextPage: 'Next page',
      goToPage: 'Go to page {page}',
    },
  },
};

// 25 rows / pageSize 10 → 3 pages. Used only by the clamping test below.
const manyRows: Row[] = Array.from({ length: 25 }, (_, i) => ({
  id: String(i + 1),
  name: `User ${i + 1}`,
  status: i % 2 === 0 ? 'active' : 'inactive',
}));

describe('DataTable — search filter', () => {
  it('filters rows to those matching the query in any raw column value', async () => {
    const user = userEvent.setup();
    renderWithProviders(<DataTable columns={columns} data={rows} searchable getRowId={(r) => r.id} />, {
      messages,
    });

    await user.type(screen.getByRole('textbox'), 'bob');

    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.queryByText('Alice')).not.toBeInTheDocument();
    expect(screen.queryByText('Charlie')).not.toBeInTheDocument();
  });

  it('matches case-insensitively', async () => {
    const user = userEvent.setup();
    renderWithProviders(<DataTable columns={columns} data={rows} searchable getRowId={(r) => r.id} />, {
      messages,
    });

    await user.type(screen.getByRole('textbox'), 'ALICE');

    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.queryByText('Bob')).not.toBeInTheDocument();
  });

  it('shows the "no results" message when the query matches nothing', async () => {
    const user = userEvent.setup();
    renderWithProviders(<DataTable columns={columns} data={rows} searchable getRowId={(r) => r.id} />, {
      messages,
    });

    await user.type(screen.getByRole('textbox'), 'zzzzz');

    expect(screen.getByText(messages.common.table.noResults)).toBeInTheDocument();
  });

  it('D-5 contract: a query matching only the rendered (transformed) value finds nothing', async () => {
    const user = userEvent.setup();
    renderWithProviders(<DataTable columns={columns} data={rows} searchable getRowId={(r) => r.id} />, {
      messages,
    });

    // "Currently active" is what col.render() displays, but the filter reads
    // the raw `status` field ('active' / 'inactive'), never the rendered
    // string. This documents the known limitation — it is not a passing
    // feature test, it is proof the limitation exists as described.
    await user.type(screen.getByRole('textbox'), 'currently');

    expect(screen.getByText(messages.common.table.noResults)).toBeInTheDocument();
  });
});

describe('DataTable — page clamping', () => {
  // Regression: `data` can shrink from outside (consumers filter before passing
  // it in — users-content.tsx does exactly that with its role/status filters).
  // Without clamping, the internal page stayed out of range and the table
  // sliced to an empty array, showing "no results" while matches existed.
  it('shows rows instead of an empty page when data shrinks below the current page', async () => {
    const user = userEvent.setup();
    const simpleColumns: Column<Row>[] = [{ key: 'name', header: 'Name' }];

    const { rerender } = renderWithProviders(
      <DataTable columns={simpleColumns} data={manyRows} pageSize={10} getRowId={(r) => r.id} />,
      { messages },
    );

    await user.click(screen.getByRole('button', { name: 'Go to page 3' }));
    expect(screen.getByText('User 21')).toBeInTheDocument();

    // Parent filters the data down to a single page while we sit on page 3.
    rerender(
      <DataTable columns={simpleColumns} data={manyRows.slice(0, 3)} pageSize={10} getRowId={(r) => r.id} />,
    );

    expect(screen.getByText('User 1')).toBeInTheDocument();
    expect(screen.queryByText(messages.common.table.noResults)).not.toBeInTheDocument();
  });
});
