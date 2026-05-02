import { type z } from 'zod';
import { type UserSchema, type CreateUserInputSchema, type UpdateUserInputSchema } from '../schemas/users.schemas';

export type User = z.infer<typeof UserSchema>;
export type UserRole = User['role'];
export type UserStatus = User['status'];
export type CreateUserInput = z.infer<typeof CreateUserInputSchema>;
export type UpdateUserInput = z.infer<typeof UpdateUserInputSchema>;
