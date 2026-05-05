import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { env } from '@config/env';
import { findMockUser, SESSION_COOKIE, SESSION_MAX_AGE, sessionStore } from '../_mock-store';

const BodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = BodySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: 'Invalid request body', code: 'VALIDATION_ERROR' },
      { status: 400 }
    );
  }

  const user = findMockUser(parsed.data.email, parsed.data.password);

  if (!user) {
    return NextResponse.json(
      { message: 'Invalid email or password', code: 'INVALID_CREDENTIALS' },
      { status: 401 }
    );
  }

  const sessionId = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE * 1000).toISOString();
  sessionStore.set(sessionId, { user, expiresAt });

  const response = NextResponse.json({ session: { user, expiresAt } });
  response.cookies.set(SESSION_COOKIE, sessionId, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  });

  return response;
}
