import { type z } from 'zod';
import {
  type LoginInputSchema,
  type AuthUserSchema,
  type AuthSessionSchema,
} from '../schemas/auth.schemas';

export type LoginInput = z.infer<typeof LoginInputSchema>;
export type AuthUser = z.infer<typeof AuthUserSchema>;
export type AuthSession = z.infer<typeof AuthSessionSchema>;
