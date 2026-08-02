import { type Notification } from '../types/notifications.types';

export const mockNotifications: Notification[] = [
  {
    id: 'n1',
    title: 'New user registered',
    description: 'Sofia Martinez just created an account.',
    createdAt: '2026-08-02T08:15:00Z',
    read: false,
  },
  {
    id: 'n2',
    title: 'Report ready',
    description: '"Monthly Analytics Digest" finished processing.',
    createdAt: '2026-08-02T07:40:00Z',
    read: false,
  },
  {
    id: 'n3',
    title: 'Payment received',
    description: 'Invoice #4021 was paid in full.',
    createdAt: '2026-08-01T18:05:00Z',
    read: false,
  },
  {
    id: 'n4',
    title: 'Weekly summary',
    description: 'Your weekly analytics summary is available.',
    createdAt: '2026-08-01T09:00:00Z',
    read: true,
  },
  {
    id: 'n5',
    title: 'Server maintenance',
    description: 'Scheduled maintenance completed successfully.',
    createdAt: '2026-07-30T22:30:00Z',
    read: true,
  },
  {
    id: 'n6',
    title: 'New comment',
    description: 'James Lee commented on the Q1 report.',
    createdAt: '2026-07-29T11:20:00Z',
    read: true,
  },
];
