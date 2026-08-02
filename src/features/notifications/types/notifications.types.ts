import { type z } from 'zod';
import { type NotificationSchema } from '../schemas/notifications.schemas';

export type Notification = z.infer<typeof NotificationSchema>;
