import { type AuthUser } from '../types/auth.types';

// Public user info only — passwords live in app/api/auth/_mock-store.ts
export const mockAuthUsers: AuthUser[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@nexdash.com',
    role: 'admin',
    avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=6366F1&color=fff&size=128',
  },
  {
    id: '2',
    name: 'Regular User',
    email: 'user@nexdash.com',
    role: 'user',
    avatar: 'https://ui-avatars.com/api/?name=Regular+User&background=10B981&color=fff&size=128',
  },
];
