import { afterEach, describe, expect, it, vi } from 'vitest';
import { readEnvironment } from '../src/config/env.js';
import { TurnstileVerifier } from '../src/security/turnstile.js';

const environment = readEnvironment({
  NODE_ENV: 'test',
  TURNSTILE_SECRET_KEY: 'test-only-turnstile-secret',
  TURNSTILE_EXPECTED_HOSTNAME: 'reference.example.invalid',
});

afterEach(() => vi.unstubAllGlobals());

describe('contact spam protection', () => {
  it('rejects a missing token without contacting Cloudflare', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    expect(await new TurnstileVerifier(environment).verify(undefined, undefined, 'contact')).toBe(false);
    expect(await new TurnstileVerifier(environment).verify('', undefined, 'contact')).toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('validates tokens on the server with the expected contact action and hostname', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(Response.json({ success: true, hostname: 'reference.example.invalid', action: 'contact' }));
    vi.stubGlobal('fetch', fetchMock);
    expect(await new TurnstileVerifier(environment).verify('test-only-token', '127.0.0.1', 'contact')).toBe(true);
    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toBe('https://challenges.cloudflare.com/turnstile/v0/siteverify');
    expect(options.method).toBe('POST');
    expect(options.body.get('response')).toBe('test-only-token');
    expect(options.body.get('remoteip')).toBe('127.0.0.1');
    expect(options.body.get('idempotency_key')).toMatch(/^[0-9a-f-]{36}$/);
    expect(options.signal).toBeInstanceOf(AbortSignal);
    expect(options.redirect).toBe('error');
  });

  it.each([
    { success: false, 'error-codes': ['timeout-or-duplicate'] },
    { success: true, hostname: 'other.example', action: 'contact' },
    { success: true, hostname: 'reference.example.invalid', action: 'login' },
    {},
    null,
  ])('rejects unsuccessful or mismatched verification: %j', async (body) => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json(body)));
    expect(
      await new TurnstileVerifier(environment).verify(`test-token-${JSON.stringify(body)}`, undefined, 'contact'),
    ).toBe(false);
  });

  it('does not allow submission when Cloudflare is unavailable', async () => {
    const fetchMock = vi
      .fn()
      .mockRejectedValueOnce(new TypeError('Network unavailable'))
      .mockResolvedValueOnce(new Response('Unavailable', { status: 503 }))
      .mockResolvedValueOnce(new Response('Invalid JSON', { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);
    const verifier = new TurnstileVerifier(environment);
    for (let attempt = 0; attempt < 3; attempt++)
      expect(await verifier.verify(`test-only-token-${attempt}`, undefined, 'contact')).toBe(false);
  });

  it('never disables verification in production when its secret is missing', async () => {
    const verifier = new TurnstileVerifier({ ...environment, NODE_ENV: 'production', TURNSTILE_SECRET_KEY: undefined });
    expect(await verifier.verify('test-only-token', undefined, 'contact')).toBe(false);
  });

  it('rejects a replay locally without sending the token to Cloudflare twice', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(Response.json({ success: true, hostname: 'reference.example.invalid', action: 'login' }));
    vi.stubGlobal('fetch', fetchMock);
    const verifier = new TurnstileVerifier(environment);
    expect(await verifier.verify('single-use-token', '127.0.0.1', 'login')).toBe(true);
    expect(await verifier.verify('single-use-token', '127.0.0.1', 'login')).toBe(false);
    expect(fetchMock).toHaveBeenCalledOnce();
  });

  it('rejects control characters and oversized provider responses', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response('x'.repeat(16 * 1024 + 1), { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);
    const verifier = new TurnstileVerifier(environment);
    expect(await verifier.verify('bad\ntoken', undefined, 'contact')).toBe(false);
    expect(await verifier.verify('printable-token', undefined, 'contact')).toBe(false);
    expect(fetchMock).toHaveBeenCalledOnce();
  });
});
