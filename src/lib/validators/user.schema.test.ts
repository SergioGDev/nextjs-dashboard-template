import { describe, expect, it } from 'vitest';
import { createUserSchema } from './user.schema';

const messages = {
  nameRequired: 'NAME_TOO_SHORT',
  nameTooLong: 'NAME_TOO_LONG',
  emailRequired: 'REQUIRED_EMAIL',
  emailInvalid: 'INVALID_EMAIL',
  roleRequired: 'ROLE_REQUIRED',
  statusRequired: 'STATUS_REQUIRED',
};

describe('createUserSchema', () => {
  it('surfaces the injected messages on invalid input', () => {
    const schema = createUserSchema(messages);

    const shortNameResult = schema.safeParse({
      name: 'A',
      email: 'not-an-email',
      role: 'admin',
      status: 'active',
    });
    expect(shortNameResult.success).toBe(false);
    const issues = shortNameResult.success ? [] : shortNameResult.error.issues.map((i) => i.message);
    expect(issues).toContain(messages.nameRequired);
    expect(issues).toContain(messages.emailInvalid);
  });

  it('accepts valid input', () => {
    const schema = createUserSchema(messages);
    const result = schema.safeParse({
      name: 'Jane Doe',
      email: 'jane@example.com',
      role: 'editor',
      status: 'active',
    });
    expect(result.success).toBe(true);
  });
});
