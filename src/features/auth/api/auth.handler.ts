import { api } from '@lib/api/client';
import { ApiError } from '@lib/api/errors';
import { validate } from '@lib/api/validate';
import { USE_MOCKS } from '@lib/api/config';
import { AuthSessionSchema, LoginResponseSchema } from '../schemas/auth.schemas';
import { type LoginInput, type AuthSession } from '../types/auth.types';

type Opts = { signal?: AbortSignal };

export const authHandler = {
  async login(input: LoginInput, opts: Opts = {}): Promise<AuthSession> {
    const path = USE_MOCKS ? '/api/auth/login' : '/auth/login';
    const data = await api.post<unknown>(path, input, opts);
    return validate(LoginResponseSchema, data).session;
  },

  async logout(opts: Opts = {}): Promise<void> {
    const path = USE_MOCKS ? '/api/auth/logout' : '/auth/logout';
    await api.post<void>(path, undefined, opts);
  },

  async me(opts: Opts = {}): Promise<AuthSession | null> {
    const path = USE_MOCKS ? '/api/auth/me' : '/auth/me';
    try {
      const data = await api.get<unknown>(path, opts);
      return validate(AuthSessionSchema, data);
    } catch (err) {
      if (ApiError.is(err) && err.status === 401) return null;
      throw err;
    }
  },
};
