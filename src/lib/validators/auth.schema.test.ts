import { describe, expect, it } from 'vitest';
import { createLoginSchema } from './auth.schema';

const messages = {
  emailRequired: 'REQUIRED_EMAIL',
  emailInvalid: 'INVALID_EMAIL',
  passwordRequired: 'REQUIRED_PASSWORD',
};

describe('createLoginSchema', () => {
  it('surfaces the injected messages on invalid input', () => {
    const schema = createLoginSchema(messages);

    const emptyResult = schema.safeParse({ email: '', password: '' });
    expect(emptyResult.success).toBe(false);
    const emptyIssues = emptyResult.success ? [] : emptyResult.error.issues.map((i) => i.message);
    expect(emptyIssues).toContain(messages.emailRequired);
    expect(emptyIssues).toContain(messages.passwordRequired);

    const badEmailResult = schema.safeParse({ email: 'not-an-email', password: 'secret' });
    expect(badEmailResult.success).toBe(false);
    const badEmailIssues = badEmailResult.success ? [] : badEmailResult.error.issues.map((i) => i.message);
    expect(badEmailIssues).toContain(messages.emailInvalid);
  });

  it('accepts valid input', () => {
    const schema = createLoginSchema(messages);
    const result = schema.safeParse({ email: 'user@example.com', password: 'secret' });
    expect(result.success).toBe(true);
  });
});
