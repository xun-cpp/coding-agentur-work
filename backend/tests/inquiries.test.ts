import { afterEach, describe, expect, it, vi } from 'vitest';
import { createApp } from '../src/app/create-app.js';
import { readEnvironment } from '../src/config/env.js';
import type { DatabaseConnection } from '../src/db/client.js';
import { DevelopmentMailProvider } from '../src/mail/provider.js';

const database: DatabaseConnection = { close: async () => undefined };
const environment = readEnvironment({
  NODE_ENV: 'test',
  CORS_ORIGIN: 'http://localhost:4321',
  MAIL_FROM: 'service@example.invalid',
});
const validPayload = {
  company: 'Musterbetrieb',
  name: 'Max Mustermann',
  email: 'max@example.test',
  projectType: 'Website',
  message: 'Wir benötigen einen digitalen Unternehmensauftritt.',
  privacyAccepted: 'true',
};
const apps: ReturnType<typeof createApp>[] = [];
function testApp(dependencies: Omit<Parameters<typeof createApp>[1], 'database'> = {}) {
  const app = createApp(environment, { database, ...dependencies });
  apps.push(app);
  return app;
}
afterEach(async () => {
  await Promise.all(apps.splice(0).map((app) => app.close()));
});
describe('contact inquiry endpoint', () => {
  it('accepts a 5,000-character UTF-8 message and a full-size token within the 16 KiB form limit', async () => {
    const verify = vi.fn().mockResolvedValue(true);
    const create = vi.fn().mockResolvedValue({ id: 'test-inquiry', createdAt: new Date() });
    const payload = { ...validPayload, message: 'ä'.repeat(5000), turnstileToken: 't'.repeat(2048) };
    expect(Buffer.byteLength(JSON.stringify(payload))).toBeGreaterThan(8 * 1024);
    expect(Buffer.byteLength(JSON.stringify(payload))).toBeLessThan(16 * 1024);
    const response = await testApp({ humanVerifier: { verify }, inquiryRepository: { create } }).inject({
      method: 'POST',
      url: '/api/v1/inquiries',
      headers: {
        origin: 'http://localhost:4321',
        'x-requested-with': 'XMLHttpRequest',
        'content-type': 'application/json',
      },
      payload,
    });
    expect(response.statusCode).toBe(201);
    expect(verify).toHaveBeenCalledWith(payload.turnstileToken, '127.0.0.1', 'contact');
    expect(create).toHaveBeenCalledOnce();
  });

  it('rejects more than 16 KiB before verification, storage or mail delivery', async () => {
    const verify = vi.fn();
    const create = vi.fn();
    const send = vi.fn();
    const response = await testApp({
      humanVerifier: { verify },
      inquiryRepository: { create },
      mail: Object.assign(new DevelopmentMailProvider(), {
        sendInternalContactNotification: send,
        sendContactConfirmation: send,
      }),
    }).inject({
      method: 'POST',
      url: '/api/v1/inquiries',
      headers: {
        origin: 'http://localhost:4321',
        'x-requested-with': 'XMLHttpRequest',
        'content-type': 'application/json',
      },
      payload: { ...validPayload, message: '界'.repeat(5000), turnstileToken: 't'.repeat(2048) },
    });
    expect(response.statusCode).toBe(413);
    expect(verify).not.toHaveBeenCalled();
    expect(create).not.toHaveBeenCalled();
    expect(send).not.toHaveBeenCalled();
  });

  it('rejects missing or invalid verification without storing an inquiry or sending mail', async () => {
    const verify = vi.fn().mockResolvedValue(false);
    const create = vi.fn();
    const send = vi.fn();
    const app = testApp({
      humanVerifier: { verify },
      inquiryRepository: { create },
      mail: Object.assign(new DevelopmentMailProvider(), {
        sendInternalContactNotification: send,
        sendContactConfirmation: send,
      }),
    });
    for (const token of [undefined, 'invalid-token']) {
      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/inquiries',
        headers: {
          origin: 'http://localhost:4321',
          'x-requested-with': 'XMLHttpRequest',
          'content-type': 'application/json',
        },
        payload: { ...validPayload, ...(token ? { turnstileToken: token } : {}) },
      });
      expect(response.statusCode).toBe(400);
      expect(response.json().error.code).toBe('VERIFICATION_FAILED');
    }
    expect(create).not.toHaveBeenCalled();
    expect(send).not.toHaveBeenCalled();
  });

  it('accepts a valid, verified development inquiry', async () => {
    const response = await testApp().inject({
      method: 'POST',
      url: '/api/v1/inquiries',
      headers: {
        origin: 'http://localhost:4321',
        'x-requested-with': 'XMLHttpRequest',
        'content-type': 'application/json',
      },
      payload: validPayload,
    });
    expect(response.statusCode).toBe(201);
    expect(response.json()).toEqual({ data: { received: true } });
  });
  it('rejects unknown input fields and oversized bodies', async () => {
    const response = await testApp().inject({
      method: 'POST',
      url: '/api/v1/inquiries',
      headers: {
        origin: 'http://localhost:4321',
        'x-requested-with': 'XMLHttpRequest',
        'content-type': 'application/json',
      },
      payload: { ...validPayload, unexpected: true },
    });
    expect(response.statusCode).toBe(400);
  });
  it.each([
    { ...validPayload, company: '   ' },
    { ...validPayload, name: ' \t ' },
    { ...validPayload, message: '          ' },
    { ...validPayload, message: 'legitime Nachricht\u0000' },
    { ...validPayload, phone: '+49 123\r\nBcc: victim@example.test' },
    { ...validPayload, projectType: 'Website\nBcc: victim@example.test' },
  ])('rejects normalized-empty or control-character input', async (payload) => {
    const response = await testApp().inject({
      method: 'POST',
      url: '/api/v1/inquiries',
      headers: {
        origin: 'http://localhost:4321',
        'x-requested-with': 'XMLHttpRequest',
        'content-type': 'application/json',
      },
      payload,
    });
    expect(response.statusCode).toBe(400);
  });
  it('rejects requests without CSRF defenses', async () => {
    const response = await testApp().inject({
      method: 'POST',
      url: '/api/v1/inquiries',
      headers: { 'content-type': 'application/json' },
      payload: validPayload,
    });
    expect(response.statusCode).toBe(403);
  });
  it('rejects JSON-like media types instead of applying a prefix check', async () => {
    const response = await testApp().inject({
      method: 'POST',
      url: '/api/v1/inquiries',
      headers: {
        origin: 'http://localhost:4321',
        'x-requested-with': 'XMLHttpRequest',
        'content-type': 'application/jsonp',
      },
      payload: JSON.stringify(validPayload),
    });
    expect(response.statusCode).toBe(415);
  });
  it('does not process a honeypot submission', async () => {
    const response = await testApp().inject({
      method: 'POST',
      url: '/api/v1/inquiries',
      headers: {
        origin: 'http://localhost:4321',
        'x-requested-with': 'XMLHttpRequest',
        'content-type': 'application/json',
      },
      payload: { ...validPayload, website: 'bot' },
    });
    expect(response.statusCode).toBe(202);
  });
});
