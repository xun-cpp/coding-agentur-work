import { useEffect, useState } from 'react';

type User = { name: string; email: string; role: 'admin' | 'customer' };

function isUserResponse(value: unknown): value is { data: { user: User } } {
  if (typeof value !== 'object' || value === null || !('data' in value)) return false;
  const data = value.data;
  if (typeof data !== 'object' || data === null || !('user' in data)) return false;
  const user = data.user;
  return (
    typeof user === 'object' &&
    user !== null &&
    'name' in user &&
    typeof user.name === 'string' &&
    'email' in user &&
    typeof user.email === 'string' &&
    'role' in user &&
    (user.role === 'admin' || user.role === 'customer')
  );
}

export default function PortalGate({ apiBaseUrl }: { apiBaseUrl: string }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const endpoint = apiBaseUrl.replace(/\/+$/, '');

  useEffect(() => {
    let disposed = false;
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 10_000);
    void fetch(`${endpoint}/api/v1/auth/me`, {
      credentials: 'same-origin',
      redirect: 'error',
      signal: controller.signal,
    })
      .then(async (response) => (response.ok ? (response.json() as Promise<unknown>) : null))
      .then((value) => setUser(isUserResponse(value) ? value.data.user : null))
      .catch(() => setUser(null))
      .finally(() => {
        window.clearTimeout(timeout);
        if (!disposed) setReady(true);
      });
    return () => {
      disposed = true;
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [endpoint]);

  async function logout() {
    try {
      await fetch(`${endpoint}/api/v1/auth/logout`, {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-requested-with': 'XMLHttpRequest' },
        credentials: 'same-origin',
        redirect: 'error',
        body: '{}',
        signal: AbortSignal.timeout(8_000),
      });
    } finally {
      window.location.assign('/');
    }
  }

  if (!ready)
    return (
      <section className="portal-loading" aria-live="polite">
        <span />
        <p>Kundenbereich wird geladen …</p>
      </section>
    );
  if (!user)
    return (
      <section className="not-found">
        <div>
          <strong>GESCHÜTZTER BEREICH</strong>
          <h1>Bitte anmelden.</h1>
          <p>Das Kundenportal wird erst nach einer erfolgreichen, serverseitig geprüften Anmeldung angezeigt.</p>
          <a className="btn btn--signal" href="/login/">
            Zum Kundenlogin <span>→</span>
          </a>
        </div>
      </section>
    );
  return (
    <section className="portal">
      <div className="shell portal__shell">
        <aside className="portal__nav">
          <strong>CODING AGENTUR</strong>
          <nav>
            <a className="is-active" href="#uebersicht">
              Übersicht
            </a>
            <a href="#projekte">Projekte</a>
            <a href="#rechnungen">Rechnungen</a>
            <a href="#dokumente">Dokumente</a>
            <a href="#profil">Profil</a>
          </nav>
          <button onClick={() => void logout()}>Abmelden</button>
        </aside>
        <main className="portal__main">
          <p className="eyebrow">Kundenbereich</p>
          <h1>Guten Tag, {user.name}.</h1>
          <p className="portal__sub">Hier finden Sie die Informationen zu Ihren Projekten und Unterlagen.</p>
          <div className="portal__empty">
            <span>↗</span>
            <h2>Ihr Bereich wird eingerichtet.</h2>
            <p>
              Sobald ein Projekt oder Dokument für Sie freigegeben wurde, erscheint es hier. Bei Fragen erreichen Sie
              uns direkt über den vereinbarten Kontaktweg.
            </p>
          </div>
        </main>
      </div>
    </section>
  );
}
