import { describe, expect, it, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, screen } from '@/test/render';
import { NotificationBell } from './notification-bell';
import { useNotifications, type Notification } from '@features/notifications';

vi.mock('@features/notifications', () => ({
  useNotifications: vi.fn(),
}));

const messages = {
  common: {
    navigation: { notifications: 'Notifications' },
    feedback: { errorState: { retry: 'Try again' } },
  },
  notifications: {
    title: 'Notifications',
    unreadAriaLabel: '{count} unread notifications',
    empty: { title: 'No notifications', description: "You're all caught up." },
    error: { title: "Couldn't load notifications", description: 'Something went wrong. Try again.' },
  },
};

function mockNotificationsHook(overrides: Partial<ReturnType<typeof useNotifications>>) {
  vi.mocked(useNotifications).mockReturnValue({
    data: undefined,
    isLoading: false,
    isError: false,
    error: null,
    refetch: vi.fn(),
    ...overrides,
  } as unknown as ReturnType<typeof useNotifications>);
}

const notifications: Notification[] = [
  { id: '1', title: 'A', description: 'a desc', createdAt: '2026-08-01T00:00:00Z', read: false },
  { id: '2', title: 'B', description: 'b desc', createdAt: '2026-08-01T00:00:00Z', read: false },
  { id: '3', title: 'C', description: 'c desc', createdAt: '2026-07-01T00:00:00Z', read: true },
];

describe('NotificationBell', () => {
  it('badge count is the number of unread notifications in the data, not a literal', () => {
    mockNotificationsHook({ data: notifications });
    renderWithProviders(<NotificationBell />);

    // 2 of the 3 fixture notifications are unread — asserting the real filtered
    // count, not the old hardcoded `3`.
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('hides the badge entirely when there are no unread notifications', () => {
    mockNotificationsHook({ data: notifications.map((n) => ({ ...n, read: true })) });
    renderWithProviders(<NotificationBell />);

    expect(screen.queryByText(/^\d+$/)).not.toBeInTheDocument();
  });

  it('shows a typed skeleton while loading', async () => {
    mockNotificationsHook({ isLoading: true });
    const user = userEvent.setup();
    renderWithProviders(<NotificationBell />, { messages });

    await user.click(screen.getByRole('button', { name: 'Notifications' }));

    expect(screen.getByLabelText('Loading list')).toBeInTheDocument();
  });

  it('shows the error state with a working retry', async () => {
    const refetch = vi.fn();
    mockNotificationsHook({ isError: true, error: new Error('boom'), refetch });
    const user = userEvent.setup();
    renderWithProviders(<NotificationBell />, { messages });

    await user.click(screen.getByRole('button', { name: 'Notifications' }));
    expect(await screen.findByText("Couldn't load notifications")).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Try again' }));
    expect(refetch).toHaveBeenCalled();
  });

  it('shows the empty state when the list is empty', async () => {
    mockNotificationsHook({ data: [] });
    const user = userEvent.setup();
    renderWithProviders(<NotificationBell />, { messages });

    await user.click(screen.getByRole('button', { name: 'Notifications' }));
    expect(await screen.findByText('No notifications')).toBeInTheDocument();
  });
});
