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
const productionEnvironment = readEnvironment({
  NODE_ENV: 'production',
  PORT: '3001',
  DATABASE_URL: ['postgresql://runtime', 'test-password@127.0.0.1:5432/reference_application'].join(':'),
  SESSION_SECRET: 's'.repeat(48),
  TURNSTILE_SECRET_KEY: 'turnstile-test-secret',
  TURNSTILE_EXPECTED_HOSTNAME: 'reference.example.invalid',
  MAIL_PROVIDER: 'resend',
  MAIL_FROM: 'service@example.invalid',
  MAIL_API_KEY: `test-${'m'.repeat(24)}`,
  MAIL_INTERNAL_TO: 'contact@example.invalid',
  CORS_ORIGIN: 'https://reference.example.invalid',
});
const database: DatabaseConnection = { close: async () => undefined };
const apps: ReturnType<typeof createApp>[] = [];
const csrfHeaders = {
  origin: environment.CORS_ORIGIN,
  'x-requested-with': 'XMLHttpRequest',
  'content-type': 'application/json',
};

function testApp(humanVerifier?: HumanVerifier) {
  const app = createApp(environment, { database, ...(humanVerifier ? { humanVerifier } : {}) });
  apps.push(app);
  return app;
}

afterEach(async () => {
  await Promise.all(apps.splice(0).map((app) => app.close()));
});

describe('HTTP and browser trust boundaries', () => {
  it('sets non-cacheable API security headers without exposing framework details', async () => {
    const response = await testApp().inject({ method: 'GET', url: '/health' });
    expect(response.statusCode).toBe(200);
    expect(response.headers['x-content-type-options']).toBe('nosniff');
    expect(response.headers['x-frame-options']).toBe('DENY');
    expect(response.headers['cache-control']).toBe('no-store');
    expect(response.headers['content-security-policy']).toContain("default-src 'none'");
    expect(response.headers['x-request-id']).toMatch(/^[0-9a-f-]{36}$/);
    expect(response.headers['x-powered-by']).toBeUndefined();
  });

  it('rejects untrusted and overbroad CORS preflights', async () => {
    const app = testApp();
    const wrongOrigin = await app.inject({
      method: 'OPTIONS',
      url: '/api/v1/inquiries',
      headers: {
        origin: 'https://evil.example',
        'access-control-request-method': 'POST',
        'access-control-request-headers': 'content-type,x-requested-with',
      },
    });
    expect(wrongOrigin.statusCode).toBe(403);
    expect(wrongOrigin.headers['access-control-allow-origin']).toBeUndefined();
    const wrongMethod = await app.inject({
      method: 'OPTIONS',
      url: '/api/v1/inquiries',
      headers: {
        origin: environment.CORS_ORIGIN,
        'access-control-request-method': 'DELETE',
        'access-control-request-headers': 'content-type,x-requested-with',
      },
    });
    expect(wrongMethod.statusCode).toBe(403);
    const accepted = await app.inject({
      method: 'OPTIONS',
      url: '/api/v1/inquiries',
      headers: {
        origin: environment.CORS_ORIGIN,
        'access-control-request-method': 'POST',
        'access-control-request-headers': 'content-type,x-requested-with',
      },
    });
    expect(accepted.statusCode).toBe(204);
    expect(accepted.headers['access-control-allow-origin']).toBe(environment.CORS_ORIGIN);
    expect(accepted.headers['access-control-allow-methods']).toBe('GET, POST');
  });

  it('rejects cross-site Fetch Metadata even when a caller forges the Origin header', async () => {
    const response = await testApp().inject({
      method: 'POST',
      url: '/api/v1/inquiries',
      headers: { ...csrfHeaders, 'sec-fetch-site': 'cross-site' },
      payload: {},
    });
    expect(response.statusCode).toBe(403);
    expect(response.json().error.code).toBe('CSRF_REJECTED');
  });

  it('rejects a poisoned Host header again at the application boundary in production', async () => {
    const app = createApp(productionEnvironment, { database });
    app.log.level = 'silent';
    apps.push(app);
    const response = await app.inject({ method: 'GET', url: '/api/v1/auth/me', headers: { host: 'attacker.example' } });
    expect(response.statusCode).toBe(421);
    expect(response.json()).toEqual({
      error: { code: 'MISDIRECTED_REQUEST', message: 'Die Anfrage konnte nicht verarbeitet werden.' },
    });
  });

  it('turns malformed JSON into a safe 400 response without parser details', async () => {
    const response = await testApp().inject({
      method: 'POST',
      url: '/api/v1/inquiries',
      headers: csrfHeaders,
      payload: '{"message":',
    });
    expect(response.statusCode).toBe(400);
    expect(response.json()).toEqual({ error: { code: 'BAD_REQUEST', message: 'Die Anfrage ist ungültig.' } });
    expect(response.body).not.toMatch(/stack|SyntaxError|node_modules/i);
  });

  it('does not trust CF-Connecting-IP at the application socket', async () => {
    const verify = vi.fn().mockResolvedValue(true);
    const humanVerifier: HumanVerifier = { verify };
    const response = await testApp(humanVerifier).inject({
      method: 'POST',
      url: '/api/v1/inquiries',
      headers: { ...csrfHeaders, 'cf-connecting-ip': '203.0.113.99' },
      payload: {
        company: 'Musterbetrieb',
        name: 'Max Mustermann',
        email: 'max@example.test',
        projectType: 'Website',
        message: 'Wir benötigen einen digitalen Unternehmensauftritt.',
        privacyAccepted: 'true',
        turnstileToken: 'valid-token',
      },
    });
    expect(response.statusCode).toBe(201);
    expect(verify).toHaveBeenCalledWith('valid-token', '127.0.0.1', 'contact');
  });

  it('returns a generic inventory-safe response for unknown routes', async () => {
    const response = await testApp().inject({ method: 'GET', url: '/api/v99/internal/admin' });
    expect(response.statusCode).toBe(404);
    expect(response.json().error.code).toBe('NOT_FOUND');
    expect(response.body).not.toContain('/opt/');
  });
});
