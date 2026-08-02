import { User, UserRole, UserStatus } from '../types/user.types';

// Deterministic generator (no Math.random, no relative `new Date()`) — see
// docs/CHANGELOG.md B13.2. 10 first names × 7 last names = 70 unique pairs,
// no repeats: first cycles every 10 entries, last advances every 10 entries.
const FIRST_NAMES = [
  'Aria', 'Marcus', 'Sofia', 'James', 'Luna',
  'Ethan', 'Nadia', 'Kai', 'Isabelle', 'Omar',
] as const;

const LAST_NAMES = [
  'Blackwood', 'Chen', 'Reyes', 'Okafor', 'Petrov', 'Walsh', 'Russo',
] as const;

const AVATAR_COLORS = [
  '6366F1', '10B981', 'F43F5E', 'F59E0B', '06B6D4',
  '8B5CF6', 'EC4899', '14B8A6', 'EF4444', 'F97316',
] as const;

// Weighted so viewer/editor are more common than manager/admin.
const ROLE_CYCLE: UserRole[] = [
  'viewer', 'editor', 'manager', 'admin', 'editor',
  'viewer', 'manager', 'editor', 'viewer', 'admin',
];

const USER_COUNT = 70;

function isoDate(base: string, dayOffset: number, hour: number, minute: number): string {
  const d = new Date(base);
  d.setUTCDate(d.getUTCDate() + dayOffset);
  d.setUTCHours(hour, minute, 0, 0);
  return d.toISOString();
}

function buildUser(index: number): User {
  // Both cycle per-entry with coprime periods (10 and 7), so the 70 pairs are
  // unique AND every page shows a mix of surnames. Advancing the surname every
  // FIRST_NAMES.length entries would make each page of 10 share one surname.
  const first = FIRST_NAMES[index % FIRST_NAMES.length];
  const last = LAST_NAMES[index % LAST_NAMES.length];
  const name = `${first} ${last}`;
  const email = `${first.toLowerCase()}.${last.toLowerCase()}@nexdash.io`;
  const color = AVATAR_COLORS[index % AVATAR_COLORS.length];
  const role = ROLE_CYCLE[index % ROLE_CYCLE.length];
  const status: UserStatus = index % 5 === 4 ? 'inactive' : 'active';

  return {
    id: String(index + 1),
    name,
    email,
    role,
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${color}&color=fff&size=128`,
    status,
    createdAt: isoDate('2024-01-15', index * 5, 8 + (index % 10), (index * 7) % 60),
    lastLogin: isoDate('2026-01-05', index * 3, 7 + (index % 12), (index * 11) % 60),
  };
}

export const mockUsers: User[] = Array.from({ length: USER_COUNT }, (_, i) => buildUser(i));
