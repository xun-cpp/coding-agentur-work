import { afterEach, describe, expect, it, vi } from 'vitest';
import { ResendMailProvider } from '../src/mail/provider.js';

const provider = () =>
  new ResendMailProvider({
    apiKey: 'test-only-api-key',
    from: 'service@example.invalid',
    internalTo: 'contact@example.invalid',
  });
afterEach(() => vi.unstubAllGlobals());

describe('transactional mail boundary', () => {
  it('encodes user-controlled HTML and strips subject control characters', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response('{}', { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);
    await provider().sendInternalContactNotification({
      name: '<img src=x onerror=alert(1)>',
      company: '<b>Firma</b>',
      email: 'person@example.test',
      projectType: 'Website\r\nBcc: victim@example.test',
      message: 'Bitte <script>alert(1)</script> beachten.\nZweite Zeile.',
      phone: '+49 (5241) 12345',
      budget: '5000_15000',
    });
    const [, options] = fetchMock.mock.calls[0];
    const body = JSON.parse(options.body as string) as { subject: string; html: string };
    expect(body.subject).not.toMatch(/[\r\n]/);
    expect(body.html).toContain('&lt;img src=x onerror=alert(1)&gt;');
    expect(body.html).not.toContain('<img src=x');
    expect(body.html).toContain('Bitte &lt;script&gt;alert(1)&lt;/script&gt; beachten.<br />Zweite Zeile.');
    expect(body.html).not.toContain('<script>');
    expect(body.html).toContain('+49 (5241) 12345');
    expect(body.html).toContain('5.000 – 15.000 €');
    expect(options.redirect).toBe('error');
    expect(options.signal).toBeInstanceOf(AbortSignal);
  });

  it('allows only canonical HTTPS links in future transactional templates', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('{}', { status: 200 })));
    await expect(provider().sendPasswordReset('person@example.test', 'javascript:alert(1)')).rejects.toThrow(
      'unsafe_transactional_url',
    );
    await expect(provider().sendWelcome('person@example.test', 'https://evil.example/invite')).rejects.toThrow(
      'unsafe_transactional_url',
    );
    await expect(
      provider().sendInvoiceNotification('person@example.test', 'https://reference.example.invalid/portal/invoice/123'),
    ).resolves.toBeUndefined();
  });

  it('does not propagate provider response bodies into application errors', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('provider-secret-detail', { status: 400 })));
    await expect(
      provider().sendContactConfirmation({
        name: 'Max',
        company: 'Firma',
        email: 'max@example.test',
        projectType: 'Website',
        message: 'Bitte erstellen Sie eine Website.',
      }),
    ).rejects.toThrow('resend_send_failed_400');
    await expect(
      provider().sendContactConfirmation({
        name: 'Max',
        company: 'Firma',
        email: 'max@example.test',
        projectType: 'Website',
        message: 'Bitte erstellen Sie eine Website.',
      }),
    ).rejects.not.toThrow('provider-secret-detail');
  });
});
