import { randomUUID } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { LoginAttemptGuard } from '../src/modules/auth/login-attempts.js';
import { parseSessionToken } from '../src/modules/auth/service.js';
import { createOpaqueToken, hashToken } from '../src/utils/crypto.js';

describe('authentication security primitives', () => {
  it('accepts only the exact server-issued session token format', () => {
    const sessionId = randomUUID();
    const secret = createOpaqueToken();
    expect(secret).toMatch(/^[A-Za-z0-9_-]{43}$/);
    expect(parseSessionToken(`${sessionId}.${secret}`)).toEqual({ sessionId, secret });
    expect(parseSessionToken(`${sessionId}.${secret}.suffix`)).toBeUndefined();
    expect(parseSessionToken(`${sessionId}.${secret.slice(1)}`)).toBeUndefined();
    expect(parseSessionToken(`00000000-0000-0000-0000-000000000000.${secret}`)).toBeUndefined();
    expect(parseSessionToken(undefined)).toBeUndefined();
  });

  it('derives fixed-length session hashes with a server-side key', () => {
    const token = createOpaqueToken();
    const first = hashToken(token, 'first-test-secret');
    expect(first).toMatch(/^[0-9a-f]{64}$/);
    expect(hashToken(token, 'first-test-secret')).toBe(first);
    expect(hashToken(token, 'second-test-secret')).not.toBe(first);
  });

  it('throttles normalized account identifiers without storing the email', () => {
    const guard = new LoginAttemptGuard('test-only-secret', 3, 1_000, 10);
    const start = 10_000;
    expect(guard.isBlocked(' PERSON@EXAMPLE.TEST ', start)).toBe(false);
    guard.recordFailure('person@example.test', start);
    guard.recordFailure('PERSON@example.test', start + 1);
    guard.recordFailure('person@example.test', start + 2);
    expect(guard.isBlocked('person@example.test', start + 3)).toBe(true);
    expect(guard.isBlocked('person@example.test', start + 1_001)).toBe(false);
    guard.recordFailure('person@example.test', start + 2_000);
    guard.reset('PERSON@EXAMPLE.TEST');
    expect(guard.isBlocked('person@example.test', start + 2_001)).toBe(false);
  });
});
