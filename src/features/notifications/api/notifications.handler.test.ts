import { describe, expect, it } from 'vitest';
import { notificationsHandler } from './notifications.handler';
import { mockNotifications } from './_mock-data';

describe('notificationsHandler.getAll', () => {
  it('resolves the validated mock list — same length as the fixture', async () => {
    const notifications = await notificationsHandler.getAll();
    expect(notifications).toHaveLength(mockNotifications.length);
  });

  it('the unread count comes from the data, not a literal — matches the fixture', async () => {
    const notifications = await notificationsHandler.getAll();
    const unreadCount = notifications.filter((n) => !n.read).length;
    const expectedUnread = mockNotifications.filter((n) => !n.read).length;

    expect(unreadCount).toBe(expectedUnread);
    expect(unreadCount).toBeGreaterThan(0);
  });
});
