import { z } from 'zod';

export const userSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name is too long'),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  role: z.enum(['admin', 'editor', 'viewer', 'manager']).refine((v) => v !== undefined, { message: 'Please select a valid role' }),
  status: z.enum(['active', 'inactive']).refine((v) => v !== undefined, { message: 'Please select a status' }),
});

export type UserFormValues = z.infer<typeof userSchema>;
