import { z } from 'zod';

export const NotificationSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  createdAt: z.string(),
  read: z.boolean(),
});
