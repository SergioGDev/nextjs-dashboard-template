import { z } from 'zod';

export type ProfileSettingsValues = {
  name: string;
  email: string;
  bio?: string;
  website?: string;
};

export type NotificationSettingsValues = {
  emailNotifications: boolean;
  pushNotifications: boolean;
  weeklyDigest: boolean;
  marketingEmails: boolean;
};

export function createProfileSettingsSchema(messages: {
  nameMin: string;
  emailInvalid: string;
  bioMax: string;
  websiteInvalid: string;
}) {
  return z.object({
    name: z.string().min(2, messages.nameMin),
    email: z.string().email(messages.emailInvalid),
    bio: z.string().max(200, messages.bioMax).optional(),
    website: z.string().url(messages.websiteInvalid).optional().or(z.literal('')),
  });
}

export const notificationSettingsSchema = z.object({
  emailNotifications: z.boolean(),
  pushNotifications: z.boolean(),
  weeklyDigest: z.boolean(),
  marketingEmails: z.boolean(),
});
