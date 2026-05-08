import { NextRequest, NextResponse } from 'next/server';
import { SESSION_COOKIE, sessionStore } from '../_mock-store';

export async function GET(request: NextRequest) {
  const sessionId = request.cookies.get(SESSION_COOKIE)?.value;

  if (!sessionId) {
    return NextResponse.json(
      { message: 'Not authenticated', code: 'UNAUTHORIZED' },
      { status: 401 }
    );
  }

  const session = sessionStore.get(sessionId);

  if (!session) {
    return NextResponse.json(
      { message: 'Session not found or expired', code: 'SESSION_NOT_FOUND' },
      { status: 401 }
    );
  }

  if (new Date(session.expiresAt) <= new Date()) {
    sessionStore.delete(sessionId);
    return NextResponse.json(
      { message: 'Session expired', code: 'SESSION_EXPIRED' },
      { status: 401 }
    );
  }

  return NextResponse.json({ user: session.user, expiresAt: session.expiresAt });
}
