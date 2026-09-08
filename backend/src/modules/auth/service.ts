import argon2, { type HashOptions } from 'argon2';
import { randomBytes } from 'node:crypto';
import { and, eq, gt, lt, or } from 'drizzle-orm';
import type { Database } from '../../db/client.js';
import { sessions, users } from '../../db/schema.js';
import { createOpaqueToken, hashToken } from '../../utils/crypto.js';

export type AuthenticatedUser = { id: string; email: string; name: string; role: 'admin' | 'customer' };
export class AuthenticationError extends Error {
  readonly statusCode = 401;
}
const passwordHashingOptions: HashOptions = {
  type: argon2.argon2id,
  memoryCost: 19_456,
  timeCost: 2,
  parallelism: 1,
};
const decoyHashPromise = argon2.hash(randomBytes(32).toString('hex'), passwordHashingOptions);
export async function prepareAuthenticationTimingDefense(): Promise<void> {
  await decoyHashPromise;
}
function decoyHash(): Promise<string> {
  return decoyHashPromise;
}
const sessionTokenPattern =
  /^([0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})\.([A-Za-z0-9_-]{43})$/i;
const sessionLifetimeMs = 8 * 60 * 60 * 1000;
const sessionIdleTimeoutMs = 30 * 60 * 1000;
const sessionTouchIntervalMs = 5 * 60 * 1000;

export function parseSessionToken(sessionToken: string | undefined): { sessionId: string; secret: string } | undefined {
  if (!sessionToken) return undefined;
  const match = sessionTokenPattern.exec(sessionToken);
  return match?.[1] && match[2] ? { sessionId: match[1], secret: match[2] } : undefined;
}

export class ServiceUnavailableError extends Error {
  readonly statusCode = 503;
}
export class AuthService {
  constructor(
    private readonly database: Database | undefined,
    private readonly sessionSecret: string,
  ) {}
  private requireDatabase(): Database {
    if (!this.database) throw new ServiceUnavailableError();
    return this.database;
  }
  async login(email: string, password: string): Promise<{ user: AuthenticatedUser; sessionToken: string }> {
    const db = this.requireDatabase();
    const normalizedEmail = email.trim().toLowerCase();
    const [user] = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
        passwordHash: users.passwordHash,
        isActive: users.isActive,
      })
      .from(users)
      .where(eq(users.email, normalizedEmail))
      .limit(1);
    const comparisonHash = user?.passwordHash ?? (await decoyHash());
    const passwordMatches = await argon2.verify(comparisonHash, password).catch(() => false);
    if (!user || !user.isActive || !passwordMatches) throw new AuthenticationError();
    const now = new Date();
    await db
      .delete(sessions)
      .where(
        or(
          eq(sessions.userId, user.id),
          lt(sessions.expiresAt, now),
          lt(sessions.lastSeenAt, new Date(now.getTime() - sessionIdleTimeoutMs)),
        ),
      );
    const rawSecret = createOpaqueToken();
    const expiresAt = new Date(now.getTime() + sessionLifetimeMs);
    const [session] = await db
      .insert(sessions)
      .values({ userId: user.id, secretHash: hashToken(rawSecret, this.sessionSecret), expiresAt })
      .returning({ id: sessions.id });
    if (!session) throw new Error('Session konnte nicht erstellt werden.');
    return {
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
      sessionToken: `${session.id}.${rawSecret}`,
    };
  }
  async getUser(sessionToken: string | undefined): Promise<AuthenticatedUser> {
    const db = this.requireDatabase();
    const token = parseSessionToken(sessionToken);
    if (!token) throw new AuthenticationError();
    const now = new Date();
    const idleCutoff = new Date(now.getTime() - sessionIdleTimeoutMs);
    const secretHash = hashToken(token.secret, this.sessionSecret);
    const [row] = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
        isActive: users.isActive,
        lastSeenAt: sessions.lastSeenAt,
      })
      .from(sessions)
      .innerJoin(users, eq(sessions.userId, users.id))
      .where(
        and(
          eq(sessions.id, token.sessionId),
          eq(sessions.secretHash, secretHash),
          gt(sessions.expiresAt, now),
          gt(sessions.lastSeenAt, idleCutoff),
        ),
      )
      .limit(1);
    if (!row || !row.isActive) throw new AuthenticationError();
    if (row.lastSeenAt.getTime() < now.getTime() - sessionTouchIntervalMs) {
      await db
        .update(sessions)
        .set({ lastSeenAt: now })
        .where(and(eq(sessions.id, token.sessionId), eq(sessions.secretHash, secretHash)));
    }
    return { id: row.id, email: row.email, name: row.name, role: row.role };
  }
  async logout(sessionToken: string | undefined): Promise<void> {
    if (!this.database) return;
    const token = parseSessionToken(sessionToken);
    if (!token) return;
    await this.database
      .delete(sessions)
      .where(
        and(eq(sessions.id, token.sessionId), eq(sessions.secretHash, hashToken(token.secret, this.sessionSecret))),
      );
  }
}
