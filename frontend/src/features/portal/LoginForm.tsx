import { useCallback, useEffect, useRef, useState, type SubmitEvent } from 'react';
import Turnstile, { type VerificationStatus } from '../contact/Turnstile';
import '../../styles/inquiry.css';

type ErrorResponse = { error?: { message?: string } };

export default function LoginForm({ apiBaseUrl, turnstileSiteKey }: { apiBaseUrl: string; turnstileSiteKey?: string }) {
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const [token, setToken] = useState('');
  const [verification, setVerification] = useState<VerificationStatus>('idle');
  const [resetKey, setResetKey] = useState(0);
  const request = useRef<AbortController | null>(null);
  const onToken = useCallback((value: string) => setToken(value), []);
  const onStatus = useCallback((value: VerificationStatus) => setVerification(value), []);

  useEffect(
    () => () => {
      request.current?.abort();
      request.current = null;
    },
    [],
  );

  async function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (request.current) return;
    if (!event.currentTarget.reportValidity()) return;
    if (turnstileSiteKey && !token) {
      setError('Bitte schließen Sie die Sicherheitsprüfung ab.');
      return;
    }

    const form = new FormData(event.currentTarget);
    const email = form.get('email');
    const password = form.get('password');
    if (typeof email !== 'string' || typeof password !== 'string') {
      setError('Die Anmeldung konnte nicht verarbeitet werden.');
      return;
    }

    const controller = new AbortController();
    request.current = controller;
    setSending(true);
    setError('');
    const timeout = window.setTimeout(() => controller.abort(), 12_000);
    try {
      const response = await fetch(`${apiBaseUrl.replace(/\/+$/, '')}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-requested-with': 'XMLHttpRequest' },
        credentials: 'same-origin',
        redirect: 'error',
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
          ...(token ? { turnstileToken: token } : {}),
        }),
        signal: controller.signal,
      });
      const body = (await response.json().catch(() => null)) as ErrorResponse | null;
      if (request.current !== controller) return;
      if (!response.ok) throw new Error(body?.error?.message || 'Die Anmeldung war nicht möglich.');
      window.location.assign('/portal/');
    } catch (reason) {
      if (request.current !== controller) return;
      setError(
        reason instanceof DOMException && reason.name === 'AbortError'
          ? 'Die Anmeldung hat zu lange gedauert. Bitte versuchen Sie es erneut.'
          : reason instanceof Error
            ? reason.message
            : 'Die Anmeldung war nicht möglich.',
      );
      setToken('');
      setResetKey((value) => value + 1);
    } finally {
      window.clearTimeout(timeout);
      if (request.current === controller) {
        request.current = null;
        setSending(false);
      }
    }
  }

  return (
    <form onSubmit={submit} aria-busy={sending}>
      <label>
        E-Mail
        <input
          name="email"
          type="email"
          autoComplete="email"
          autoCapitalize="none"
          spellCheck={false}
          maxLength={254}
          required
          disabled={sending}
        />
      </label>
      <label>
        Passwort
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          minLength={12}
          maxLength={256}
          required
          disabled={sending}
        />
      </label>
      <Turnstile
        siteKey={turnstileSiteKey}
        active
        action="login"
        onToken={onToken}
        onStatus={onStatus}
        resetKey={resetKey}
      />
      <button className="btn btn--signal" disabled={sending || Boolean(turnstileSiteKey && !token)}>
        {sending ? (
          'Wird angemeldet …'
        ) : verification === 'interactive' ? (
          'Prüfung abschließen'
        ) : (
          <>
            Anmelden <span>→</span>
          </>
        )}
      </button>
      {error && (
        <p className="form__msg form__msg--error" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
