import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { SESSION_COOKIE, sessionStore } from '../_mock-store';

const BodySchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  bio: z.string().optional(),
  website: z.string().optional(),
  emailNotifications: z.boolean().optional(),
  compactMode: z.boolean().optional(),
});

export async function POST(request: NextRequest) {
  const sessionId = request.cookies.get(SESSION_COOKIE)?.value;

  if (!sessionId) {
    return NextResponse.json({ message: 'Not authenticated', code: 'UNAUTHORIZED' }, { status: 401 });
  }

  const session = sessionStore.get(sessionId);

  if (!session || new Date(session.expiresAt) <= new Date()) {
    if (session) sessionStore.delete(sessionId);
    return NextResponse.json({ message: 'Session not found or expired', code: 'SESSION_NOT_FOUND' }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = BodySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: 'Invalid request body', code: 'VALIDATION_ERROR' }, { status: 400 });
  }

  const updatedUser = {
    ...session.user,
    ...parsed.data,
    // Preserve immutable server-side fields
    id: session.user.id,
    role: session.user.role,
    avatar: session.user.avatar,
  };

  sessionStore.set(sessionId, { user: updatedUser, expiresAt: session.expiresAt });

  return NextResponse.json({ user: updatedUser, expiresAt: session.expiresAt });
}
