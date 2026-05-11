import { z } from 'zod';

export type ProfileSettingsValues = {
  name: string;
  email: string;
  bio?: string;
  website?: string;
  emailNotifications: boolean;
  compactMode: boolean;
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
    emailNotifications: z.boolean(),
    compactMode: z.boolean(),
  });
}

