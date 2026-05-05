import { z } from 'zod';

export const LoginInputSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const AuthUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  role: z.enum(['admin', 'user']),
  avatar: z.string(),
});

export const AuthSessionSchema = z.object({
  user: AuthUserSchema,
  expiresAt: z.string(),
});

export const LoginResponseSchema = z.object({
  session: AuthSessionSchema,
});
