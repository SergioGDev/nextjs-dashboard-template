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
    },
  },
};

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
