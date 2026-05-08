// In-memory session store for mock auth backend.
// ⚠ Sessions survive HMR and Route Handler bundle isolation (globalThis singleton).
//   Sessions are lost only on full dev server restart — by design for mock mode.

type MockCredentials = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  avatar: string;
};

export type SessionData = {
  user: Omit<MockCredentials, 'password'>;
  expiresAt: string;
};

const MOCK_USERS: MockCredentials[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@nexdash.com',
    password: 'admin123',
    role: 'admin',
    avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=6366F1&color=fff&size=128',
  },
  {
    id: '2',
    name: 'Regular User',
    email: 'user@nexdash.com',
    password: 'user123',
    role: 'user',
    avatar: 'https://ui-avatars.com/api/?name=Regular+User&background=10B981&color=fff&size=128',
  },
];

export const SESSION_COOKIE = 'nexdash_session';
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days in seconds

// globalThis singleton: survives HMR and Next.js per-bundle module isolation.
const g = globalThis as typeof globalThis & {
  _nexdashSessionStore?: Map<string, SessionData>;
};
export const sessionStore: Map<string, SessionData> =
  g._nexdashSessionStore ?? (g._nexdashSessionStore = new Map());

export function findMockUser(
  email: string,
  password: string
): Omit<MockCredentials, 'password'> | undefined {
  const found = MOCK_USERS.find((u) => u.email === email && u.password === password);
  if (!found) return undefined;
  return { id: found.id, name: found.name, email: found.email, role: found.role, avatar: found.avatar };
}
