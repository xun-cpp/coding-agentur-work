import { createHash, randomUUID } from 'node:crypto';
import { z } from 'zod';
import type { Environment } from '../config/env.js';

const turnstileResponseSchema = z
  .object({
    success: z.boolean(),
    hostname: z.string().optional(),
    action: z.string().optional(),
    'error-codes': z.array(z.string()).optional(),
  })
  .passthrough();

const tokenPattern = /^[\x21-\x7e]{1,2048}$/;
const replayWindowMs = 5 * 60 * 1000;
const maximumReplayEntries = 10_000;

export type TurnstileAction = 'contact' | 'login';
export interface HumanVerifier {
  verify(token: string | undefined, remoteIp: string | undefined, action: TurnstileAction): Promise<boolean>;
}

export class TurnstileVerifier {
  private readonly consumedTokens = new Map<string, number>();

  constructor(private readonly environment: Environment) {}

  private reserveToken(token: string): boolean {
    const now = Date.now();
    for (const [hash, expiresAt] of this.consumedTokens) {
      if (expiresAt > now) break;
      this.consumedTokens.delete(hash);
    }
    const tokenHash = createHash('sha256').update(token).digest('base64url');
    if (this.consumedTokens.has(tokenHash)) return false;
    if (this.consumedTokens.size >= maximumReplayEntries) {
      const oldest = this.consumedTokens.keys().next().value as string | undefined;
      if (oldest) this.consumedTokens.delete(oldest);
    }
    this.consumedTokens.set(tokenHash, now + replayWindowMs);
    return true;
  }

  async verify(token: string | undefined, remoteIp: string | undefined, action: TurnstileAction): Promise<boolean> {
    if (!this.environment.TURNSTILE_SECRET_KEY) return this.environment.NODE_ENV !== 'production';
    if (!token || !tokenPattern.test(token) || !this.reserveToken(token)) return false;
    const data = new URLSearchParams({
      secret: this.environment.TURNSTILE_SECRET_KEY,
      response: token,
      idempotency_key: randomUUID(),
    });
    if (remoteIp && remoteIp.length <= 64) data.set('remoteip', remoteIp);
    try {
      const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        headers: { 'content-type': 'application/x-www-form-urlencoded', accept: 'application/json' },
        redirect: 'error',
        body: data,
        signal: AbortSignal.timeout(4_000),
      });
      if (!response.ok) return false;
      const declaredLength = Number(response.headers.get('content-length') ?? 0);
      if (declaredLength > 16 * 1024) return false;
      const body = await response.text();
      if (Buffer.byteLength(body, 'utf8') > 16 * 1024) return false;
      const parsed = turnstileResponseSchema.safeParse(JSON.parse(body));
      if (!parsed.success) return false;
      const result = parsed.data;
      if (!result.success) return false;
      if (
        !this.environment.TURNSTILE_EXPECTED_HOSTNAME ||
        result.hostname !== this.environment.TURNSTILE_EXPECTED_HOSTNAME
      )
        return false;
      return result.action === action;
    } catch {
      return false;
    }
  }
}
