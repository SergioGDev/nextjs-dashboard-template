import { describe, expect, it, vi } from 'vitest';
import { ApiError } from '@lib/api/errors';
import { api } from '@lib/api/client';
import { authHandler } from './auth.handler';

// OPCIÓN A (vi.mock del módulo cliente). Mocking the actual module the handler
// imports — '@lib/api/client', not the '@lib/api' barrel — keeps the test coupled
// to what auth.handler.ts really calls (see `import { api } from '@lib/api/client'`).
// vi.mock calls are hoisted above these imports by Vitest's transform.
vi.mock('@lib/api/client', () => ({
  api: { get: vi.fn(), post: vi.fn() },
}));

const validSession = {
  user: {
    id: '1',
    name: 'Jane Doe',
    email: 'jane@example.com',
    role: 'admin',
    avatar: 'https://ui-avatars.com/api/?name=Jane',
  },
  expiresAt: '2099-01-01T00:00:00.000Z',
};

describe('authHandler.me', () => {
  it('resolves to null on a 401 — no session is not an app error', async () => {
    vi.mocked(api.get).mockRejectedValueOnce(new ApiError(401, 'Unauthorized'));
    await expect(authHandler.me()).resolves.toBeNull();
  });

  it('propagates non-401 errors', async () => {
    vi.mocked(api.get).mockRejectedValueOnce(new ApiError(500, 'Server error'));
    await expect(authHandler.me()).rejects.toThrow(ApiError);
  });

  it('returns the validated session on success', async () => {
    vi.mocked(api.get).mockResolvedValueOnce(validSession);
    await expect(authHandler.me()).resolves.toEqual(validSession);
  });
});
