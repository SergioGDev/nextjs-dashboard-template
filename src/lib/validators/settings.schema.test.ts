import { describe, expect, it } from 'vitest';
import { createProfileSettingsSchema } from './settings.schema';

const messages = {
  nameMin: 'NAME_TOO_SHORT',
  emailInvalid: 'INVALID_EMAIL',
  bioMax: 'BIO_TOO_LONG',
  websiteInvalid: 'INVALID_WEBSITE',
};

describe('createProfileSettingsSchema', () => {
  it('surfaces the injected messages on invalid input', () => {
    const schema = createProfileSettingsSchema(messages);

    const result = schema.safeParse({
      name: 'A',
      email: 'not-an-email',
      website: 'not-a-url',
      emailNotifications: true,
      compactMode: false,
    });
    expect(result.success).toBe(false);
    const issues = result.success ? [] : result.error.issues.map((i) => i.message);
    expect(issues).toContain(messages.nameMin);
    expect(issues).toContain(messages.emailInvalid);
    expect(issues).toContain(messages.websiteInvalid);
  });

  it('accepts valid input with optional fields omitted', () => {
    const schema = createProfileSettingsSchema(messages);
    const result = schema.safeParse({
      name: 'Jane Doe',
      email: 'jane@example.com',
      website: '',
      emailNotifications: true,
      compactMode: false,
    });
    expect(result.success).toBe(true);
  });
});
