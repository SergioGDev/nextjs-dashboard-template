import { z } from 'zod';

export const profileSettingsSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  bio: z.string().max(200, 'Bio must be under 200 characters').optional(),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
});

export const notificationSettingsSchema = z.object({
  emailNotifications: z.boolean(),
  pushNotifications: z.boolean(),
  weeklyDigest: z.boolean(),
  marketingEmails: z.boolean(),
});

export type ProfileSettingsValues = z.infer<typeof profileSettingsSchema>;
export type NotificationSettingsValues = z.infer<typeof notificationSettingsSchema>;
