import { type ZodType } from 'zod';
import { ApiError } from './errors';

export function validate<T>(schema: ZodType<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new ApiError(0, 'Response did not match expected schema', 'VALIDATION_ERROR', {
      issues: result.error.issues,
    });
  }
  return result.data;
}
