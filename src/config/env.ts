import { z } from 'zod';

const clientSchema = z.object({
  NEXT_PUBLIC_API_URL: z
    .union([z.string().url(), z.literal('')])
    .default('')
    .describe('Base URL of the backend API. Empty string means same-origin.'),
  NEXT_PUBLIC_USE_MOCKS: z
    .enum(['true', 'false'])
    .default('true')
    .transform((v) => v === 'true'),
  NEXT_PUBLIC_APP_NAME: z.string().default('NexDash'),
});

const serverSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
});

function parseEnv() {
  const clientResult = clientSchema.safeParse(process.env);
  const serverResult = serverSchema.safeParse(process.env);

  if (!clientResult.success || !serverResult.success) {
    const issues = [
      ...(clientResult.success ? [] : clientResult.error.issues),
      ...(serverResult.success ? [] : serverResult.error.issues),
    ];
    console.error('❌ Invalid environment variables:');
    issues.forEach((issue) => {
      console.error(`  - ${issue.path.join('.')}: ${issue.message}`);
    });
    throw new Error('Invalid environment variables — see console for details');
  }

  return { ...clientResult.data, ...serverResult.data };
}

export const env = parseEnv();
