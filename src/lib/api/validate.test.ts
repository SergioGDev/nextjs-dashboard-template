import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { validate } from './validate';
import { ApiError } from './errors';

const schema = z.object({ id: z.string(), count: z.number() });

describe('validate', () => {
  it('returns the typed value when data matches the schema', () => {
    const result = validate(schema, { id: 'abc', count: 3 });
    expect(result).toEqual({ id: 'abc', count: 3 });
  });

  it('throws an ApiError with code VALIDATION_ERROR when data does not match — not a ZodError', () => {
    expect(() => validate(schema, { id: 'abc', count: 'not-a-number' })).toThrow(ApiError);
    try {
      validate(schema, { id: 'abc', count: 'not-a-number' });
      throw new Error('validate() should have thrown');
    } catch (err) {
      expect(err).not.toBeInstanceOf(z.ZodError);
      expect(ApiError.is(err)).toBe(true);
      expect((err as ApiError).code).toBe('VALIDATION_ERROR');
    }
  });
});
