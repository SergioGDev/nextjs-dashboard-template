import { z } from 'zod';

export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  role: z.enum(['admin', 'editor', 'viewer', 'manager']),
  avatar: z.string(),
  status: z.enum(['active', 'inactive']),
  createdAt: z.string(),
  lastLogin: z.string(),
});

export const CreateUserInputSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  role: z.enum(['admin', 'editor', 'viewer', 'manager']),
  status: z.enum(['active', 'inactive']),
});

export const UpdateUserInputSchema = CreateUserInputSchema.partial().extend({
  id: z.string(),
});
