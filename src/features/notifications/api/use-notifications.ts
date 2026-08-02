'use client';

import { useQuery } from '@tanstack/react-query';
import { notificationsHandler } from './notifications.handler';
import { notificationsKeys } from './notifications.keys';

export function useNotifications() {
  return useQuery({
    queryKey: notificationsKeys.lists(),
    queryFn: ({ signal }) => notificationsHandler.getAll({ signal }),
  });
}
