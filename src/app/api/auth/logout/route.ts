import { NextRequest, NextResponse } from 'next/server';
import { env } from '@config/env';
import { SESSION_COOKIE, sessionStore } from '../_mock-store';

export async function POST(request: NextRequest) {
  const sessionId = request.cookies.get(SESSION_COOKIE)?.value;

  if (sessionId) {
    sessionStore.delete(sessionId);
  }

  const response = NextResponse.json({}, { status: 200 });
  response.cookies.set(SESSION_COOKIE, '', {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });

  return response;
}
