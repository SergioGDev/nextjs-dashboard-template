import { z } from 'zod';
import { mockNotifications } from './_mock-data';
import { NotificationSchema } from '../schemas/notifications.schemas';
import { randomDelay } from '@lib/utils';
import { USE_MOCKS } from '@lib/api/config';
import { api } from '@lib/api/client';
import { validate } from '@lib/api/validate';
import { type Notification } from '../types/notifications.types';

type Opts = { signal?: AbortSignal };

// Read-only in B13.1 (DECISIÓN 4) — `const`, not `let`, per data-layer.md.
// Extension point: a future "mark as read" mutation would flip this to
// `let notificationsStore`, add `markAsRead(id)` here, a `useMarkNotificationAsRead`
// mutation hook that invalidates `notificationsKeys.lists()`, and a toast in the
// component that calls it (toasts live in the component, never in the hook).
const notificationsStore: Notification[] = [...mockNotifications];

export const notificationsHandler = {
  async getAll(opts: Opts = {}) {
    if (USE_MOCKS) {
      await randomDelay(opts.signal);
      return validate(z.array(NotificationSchema), [...notificationsStore]);
    }
    const data = await api.get<unknown>('/notifications', opts);
    return validate(z.array(NotificationSchema), data);
  },
};
