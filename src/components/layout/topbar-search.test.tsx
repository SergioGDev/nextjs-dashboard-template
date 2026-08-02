import { describe, expect, it, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, screen } from '@/test/render';
import { TopbarSearch } from './topbar-search';
import { routes } from '@config/routes';

const push = vi.fn();

vi.mock('@/i18n/navigation', () => ({
  useRouter: () => ({ push }),
}));

// Scoped, not imported from the real common.json (see testing.md) — but this
// component translates every sidebarConfig entry before filtering, so the
// fixture mirrors the real key shape closely enough that "no match" assertions
// are meaningful rather than an artifact of untranslated fallback text.
const messages = {
  common: {
    navigation: {
      searchPlaceholder: 'Search…',
      searchEmpty: 'No routes found',
      searchResultsLabel: 'Search results',
    },
    sidebar: {
      sections: { workspace: 'Workspace', ui: 'UI' },
      items: {
        dashboard: 'Dashboard',
        analytics: 'Analytics',
        reports: 'Reports',
        reportsOverview: 'Overview',
        reportsScheduled: 'Scheduled',
        reportsArchived: 'Archived',
        users: 'Users',
        settings: 'Settings',
      },
    },
  },
};

const messagesEs = {
  common: {
    navigation: {
      searchPlaceholder: 'Buscar…',
      searchEmpty: 'No se encontraron rutas',
      searchResultsLabel: 'Resultados de búsqueda',
    },
    sidebar: {
      sections: { workspace: 'Espacio de trabajo', ui: 'UI' },
      items: {
        dashboard: 'Panel',
        analytics: 'Analíticas',
        reports: 'Informes',
        reportsOverview: 'Resumen',
        reportsScheduled: 'Programados',
        reportsArchived: 'Archivados',
        users: 'Usuarios',
        settings: 'Configuración',
      },
    },
  },
};

describe('TopbarSearch', () => {
  it('finds a route by its translated (EN) label and navigates to it on Enter', async () => {
    const user = userEvent.setup();
    renderWithProviders(<TopbarSearch />, { messages });

    await user.type(screen.getByRole('combobox'), 'Users');

    const option = await screen.findByRole('option', { name: 'Users' });
    expect(option).toBeInTheDocument();

    await user.keyboard('{Enter}');

    expect(push).toHaveBeenCalledWith(routes.users.list);
  });

  it('finds the same route by its translated (ES) label', async () => {
    const user = userEvent.setup();
    renderWithProviders(<TopbarSearch />, { messages: messagesEs, locale: 'es' });

    await user.type(screen.getByRole('combobox'), 'usuarios');

    expect(await screen.findByRole('option', { name: 'Usuarios' })).toBeInTheDocument();
  });

  it('shows the translated empty message when nothing matches', async () => {
    const user = userEvent.setup();
    renderWithProviders(<TopbarSearch />, { messages });

    await user.type(screen.getByRole('combobox'), 'zzz-does-not-exist');

    expect(await screen.findByText('No routes found')).toBeInTheDocument();
    expect(screen.queryByRole('option')).not.toBeInTheDocument();
  });
});
