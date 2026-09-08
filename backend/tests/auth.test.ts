import { afterEach, describe, expect, it, vi } from 'vitest';
import { createApp } from '../src/app/create-app.js';
import { readEnvironment } from '../src/config/env.js';
import type { DatabaseConnection } from '../src/db/client.js';
import type { HumanVerifier } from '../src/security/turnstile.js';

const environment = readEnvironment({
  NODE_ENV: 'test',
  CORS_ORIGIN: 'http://localhost:4321',
  MAIL_FROM: 'service@example.invalid',
});
const database: DatabaseConnection = { close: async () => undefined };
const apps: ReturnType<typeof createApp>[] = [];
function testApp(humanVerifier?: HumanVerifier) {
  const app = createApp(environment, { database, ...(humanVerifier ? { humanVerifier } : {}) });
  apps.push(app);
  return app;
}
const csrfHeaders = {
  origin: 'http://localhost:4321',
  'x-requested-with': 'XMLHttpRequest',
  'content-type': 'application/json',
};
afterEach(async () => {
  await Promise.all(apps.splice(0).map((app) => app.close()));
});
describe('authentication boundary', () => {
  it('does not expose a portal session without an authenticated server-side session', async () => {
    const response = await testApp().inject({ method: 'GET', url: '/api/v1/auth/me' });
    expect(response.statusCode).toBe(503);
    expect(response.json().error.code).toBe('SERVICE_UNAVAILABLE');
  });
  it('requires CSRF defenses before accepting a login payload', async () => {
    const response = await testApp().inject({
      method: 'POST',
      url: '/api/v1/auth/login',
      headers: { 'content-type': 'application/json' },
      payload: { email: 'person@example.test', password: 'eine-ausreichend-lange-passphrase' },
    });
    expect(response.statusCode).toBe(403);
  });
  it('fails closed when the database is unavailable', async () => {
    const response = await testApp().inject({
      method: 'POST',
      url: '/api/v1/auth/login',
      headers: csrfHeaders,
      payload: { email: 'person@example.test', password: 'eine-ausreichend-lange-passphrase' },
    });
    expect(response.statusCode).toBe(503);
  });
  it('requires a server-verified login action before password verification', async () => {
    const verify = vi.fn().mockResolvedValue(false);
    const response = await testApp({ verify }).inject({
      method: 'POST',
      url: '/api/v1/auth/login',
      headers: csrfHeaders,
      payload: {
        email: 'person@example.test',
        password: 'eine-ausreichend-lange-passphrase',
        turnstileToken: 'login-token',
      },
    });
    expect(response.statusCode).toBe(400);
    expect(response.json().error.code).toBe('VERIFICATION_FAILED');
    expect(verify).toHaveBeenCalledWith('login-token', '127.0.0.1', 'login');
  });
});
