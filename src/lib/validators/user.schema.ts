import { z } from 'zod';

export type UserFormValues = {
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer' | 'manager';
  status: 'active' | 'inactive';
};

export function createUserSchema(messages: {
  nameRequired: string;
  nameTooLong: string;
  emailRequired: string;
  emailInvalid: string;
  roleRequired: string;
  statusRequired: string;
}) {
  return z.object({
    name: z.string().min(2, messages.nameRequired).max(50, messages.nameTooLong),
    email: z.string().min(1, messages.emailRequired).email(messages.emailInvalid),
    role: z.enum(['admin', 'editor', 'viewer', 'manager'], {
      message: messages.roleRequired,
    }),
    status: z.enum(['active', 'inactive'], {
      message: messages.statusRequired,
    }),
  });
}
