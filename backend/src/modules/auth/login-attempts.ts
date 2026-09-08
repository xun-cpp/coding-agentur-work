import { createHmac } from 'node:crypto';

type AttemptState = { failures: number; expiresAt: number };

export class LoginAttemptGuard {
  private readonly attempts = new Map<string, AttemptState>();

  constructor(
    private readonly secret: string,
    private readonly maximumAttempts = 5,
    private readonly windowMs = 15 * 60 * 1000,
    private readonly maximumEntries = 10_000,
  ) {}

  private key(email: string): string {
    return createHmac('sha256', this.secret).update(email.trim().toLowerCase()).digest('base64url');
  }

  private activeState(email: string, now = Date.now()): AttemptState | undefined {
    const key = this.key(email);
    const state = this.attempts.get(key);
    if (state && state.expiresAt <= now) {
      this.attempts.delete(key);
      return undefined;
    }
    return state;
  }

  isBlocked(email: string, now = Date.now()): boolean {
    return (this.activeState(email, now)?.failures ?? 0) >= this.maximumAttempts;
  }

  recordFailure(email: string, now = Date.now()): void {
    const key = this.key(email);
    const current = this.activeState(email, now);
    if (!current && this.attempts.size >= this.maximumEntries) {
      const oldest = this.attempts.keys().next().value as string | undefined;
      if (oldest) this.attempts.delete(oldest);
    }
    this.attempts.set(key, {
      failures: Math.min((current?.failures ?? 0) + 1, this.maximumAttempts),
      expiresAt: current?.expiresAt ?? now + this.windowMs,
    });
  }

  reset(email: string): void {
    this.attempts.delete(this.key(email));
  }
}
