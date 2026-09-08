import { useCallback, useEffect, useRef, useState } from 'react';

export type ConsentCategory = 'necessary' | 'statistics' | 'external';
type OptionalCategory = Exclude<ConsentCategory, 'necessary'>;
type Choices = Record<OptionalCategory, boolean>;
type ConsentRecord = { v: number; t: string; c: Choices };

const version = 2;
const cookieName = 'ca_consent';
const maxAgeSeconds = 60 * 60 * 24 * 365;
const denied: Choices = { statistics: false, external: false };
const granted: Choices = { statistics: true, external: true };

type Service = { name: string; provider: string; purpose: string; retention: string };
type CategoryInfo = {
  key: ConsentCategory;
  title: string;
  summary: string;
  services: Service[];
  note?: string;
};

const categories: CategoryInfo[] = [
  {
    key: 'necessary',
    title: 'Notwendig',
    summary: 'Ohne diese Funktionen kann die Website nicht sicher betrieben werden. Sie sind deshalb immer aktiv.',
    services: [
      {
        name: 'ca_consent',
        provider: 'Coding Agentur (eigener Server)',
        purpose: 'Speichert Ihre Auswahl in diesem Banner.',
        retention: '12 Monate',
      },
      {
        name: 'ca-lang',
        provider: 'Coding Agentur (eigener Server)',
        purpose: 'Merkt sich die gewählte Sprache (lokal im Browser).',
        retention: 'Bis Sie den Browserspeicher leeren',
      },
      {
        name: 'Cloudflare Turnstile',
        provider: 'Cloudflare, Inc., USA',
        purpose:
          'Schützt das Kontaktformular vor automatisierten Anfragen. Wird erst geladen, wenn Sie das Formular ausfüllen.',
        retention: 'Sitzung bis 30 Minuten',
      },
      {
        name: 'Cloudflare CDN',
        provider: 'Cloudflare, Inc., USA',
        purpose: 'Auslieferung und Angriffsschutz der Website.',
        retention: 'Sitzung',
      },
    ],
  },
  {
    key: 'statistics',
    title: 'Statistik',
    summary: 'Anonyme Reichweitenmessung, um die Website zu verbessern.',
    services: [],
    note: 'Aktuell setzen wir keinen Analyse-Dienst ein. Ihre Auswahl wird gespeichert und gilt, falls wir künftig eine datensparsame Messung einsetzen.',
  },
  {
    key: 'external',
    title: 'Externe Medien',
    summary: 'Inhalte von Drittanbietern, etwa Karten oder Videos.',
    services: [],
    note: 'Aktuell binden wir keine externen Medien ein. Schriften liefern wir von unserem eigenen Server aus.',
  },
];

function readConsent(): ConsentRecord | null {
  if (typeof document === 'undefined') return null;
  const raw = document.cookie.split('; ').find((entry) => entry.startsWith(`${cookieName}=`));
  if (!raw) return null;
  try {
    const value = JSON.parse(decodeURIComponent(raw.slice(cookieName.length + 1))) as unknown;
    if (typeof value !== 'object' || value === null) return null;
    const record = value as Partial<ConsentRecord>;
    if (record.v !== version || typeof record.c !== 'object' || record.c === null) return null;
    return {
      v: version,
      t: typeof record.t === 'string' ? record.t : '',
      c: { statistics: record.c.statistics === true, external: record.c.external === true },
    };
  } catch {
    return null;
  }
}

function writeConsent(choices: Choices): ConsentRecord {
  const record: ConsentRecord = { v: version, t: new Date().toISOString(), c: choices };
  const secure = location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${cookieName}=${encodeURIComponent(JSON.stringify(record))}; Path=/; Max-Age=${maxAgeSeconds}; SameSite=Lax${secure}`;
  return record;
}

declare global {
  interface Window {
    caConsent?: {
      get(): Choices & { necessary: true };
      allows(category: ConsentCategory): boolean;
      open(): void;
    };
  }
}

function publish(choices: Choices) {
  document.documentElement.dataset.consentStatistics = String(choices.statistics);
  document.documentElement.dataset.consentExternal = String(choices.external);
  document.dispatchEvent(new CustomEvent('ca:consent', { detail: { necessary: true, ...choices } }));
}

export default function CookieConsent() {
  const [decided, setDecided] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [choices, setChoices] = useState<Choices>(denied);
  const dialog = useRef<HTMLDivElement>(null);
  const banner = useRef<HTMLDivElement>(null);
  const restoreFocus = useRef<HTMLElement | null>(null);

  const apply = useCallback((next: Choices, close = true) => {
    const record = writeConsent(next);
    setChoices(record.c);
    publish(record.c);
    if (close) {
      setSettingsOpen(false);
      setDecided(true);
      restoreFocus.current?.focus();
      restoreFocus.current = null;
    }
  }, []);

  useEffect(() => {
    const stored = readConsent();
    setChoices(stored?.c ?? denied);
    setDecided(Boolean(stored));
    publish(stored?.c ?? denied);

    const open = () => {
      restoreFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      setChoices(readConsent()?.c ?? denied);
      setSettingsOpen(true);
    };
    window.caConsent = {
      get: () => ({ necessary: true, ...(readConsent()?.c ?? denied) }),
      allows: (category) => category === 'necessary' || (readConsent()?.c ?? denied)[category as OptionalCategory],
      open,
    };
    window.addEventListener('reference-application:open-cookie-settings', open);
    return () => {
      window.removeEventListener('reference-application:open-cookie-settings', open);
      delete window.caConsent;
    };
  }, []);

  useEffect(() => {
    if (!settingsOpen) return;
    const element = dialog.current;
    if (!element) return;
    const focusable = () =>
      [...element.querySelectorAll<HTMLElement>('button, [href], input, [tabindex]:not([tabindex="-1"])')].filter(
        (node) => !node.hasAttribute('disabled'),
      );
    focusable()[0]?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setSettingsOpen(false);
        restoreFocus.current?.focus();
        return;
      }
      if (event.key !== 'Tab') return;
      const nodes = focusable();
      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [settingsOpen]);

  useEffect(() => {
    if (!decided && !settingsOpen) banner.current?.focus();
  }, [decided, settingsOpen]);

  const showBanner = !decided && !settingsOpen;
  if (!showBanner && !settingsOpen) return null;

  return (
    <>
      {showBanner && (
        <div
          className="cookie-consent"
          role="dialog"
          aria-modal="false"
          aria-labelledby="cookie-consent-title"
          tabIndex={-1}
          ref={banner}
        >
          <p className="cookie-consent__eyebrow">Datenschutz</p>
          <h2 id="cookie-consent-title">Sie entscheiden.</h2>
          <p className="cookie-consent__text">
            Notwendige Funktionen halten diese Seite sicher und nutzbar. Alles andere – Statistik und externe Medien –
            aktivieren wir nur mit Ihrer Einwilligung. Sie können die Auswahl jederzeit ändern.
          </p>
          <p className="cookie-consent__links">
            <a href="/datenschutz/">Datenschutz</a>
            <span aria-hidden="true">·</span>
            <a href="/impressum/">Impressum</a>
          </p>
          <div className="cookie-consent__actions">
            <button type="button" onClick={() => apply(denied)}>
              Nur notwendige
            </button>
            <button type="button" onClick={() => apply(granted)}>
              Alle akzeptieren
            </button>
          </div>
          <button
            className="cookie-consent__more"
            type="button"
            onClick={() => {
              restoreFocus.current = null;
              setSettingsOpen(true);
            }}
          >
            Einstellungen ansehen
          </button>
        </div>
      )}

      {settingsOpen && (
        <div className="cookie-modal" role="presentation">
          <div
            className="cookie-modal__panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cookie-modal-title"
            ref={dialog}
          >
            <div className="cookie-modal__head">
              <div>
                <p className="cookie-consent__eyebrow">Datenschutz-Einstellungen</p>
                <h2 id="cookie-modal-title">Was darf gespeichert werden?</h2>
              </div>
              <button
                className="cookie-modal__close"
                type="button"
                aria-label="Einstellungen schließen"
                onClick={() => {
                  setSettingsOpen(false);
                  restoreFocus.current?.focus();
                }}
              >
                ✕
              </button>
            </div>

            <div className="cookie-modal__body">
              {categories.map((category) => {
                const locked = category.key === 'necessary';
                const active = locked || choices[category.key as OptionalCategory];
                return (
                  <section className="cookie-group" key={category.key}>
                    <div className="cookie-group__head">
                      <div>
                        <h3>{category.title}</h3>
                        <p>{category.summary}</p>
                      </div>
                      <label className={`cookie-switch${locked ? ' cookie-switch--locked' : ''}`}>
                        <input
                          type="checkbox"
                          checked={active}
                          disabled={locked}
                          onChange={(event) =>
                            setChoices((current) => ({ ...current, [category.key]: event.target.checked }))
                          }
                        />
                        <span aria-hidden="true" />
                        <em>{locked ? 'Immer aktiv' : active ? 'Aktiv' : 'Inaktiv'}</em>
                      </label>
                    </div>
                    {category.note && <p className="cookie-group__note">{category.note}</p>}
                    {category.services.length > 0 && (
                      <ul className="cookie-services">
                        {category.services.map((service) => (
                          <li key={service.name}>
                            <b>{service.name}</b>
                            <span>{service.purpose}</span>
                            <span className="cookie-services__meta">
                              {service.provider} · {service.retention}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </section>
                );
              })}

              <p className="cookie-modal__legal">
                Rechtsgrundlage für optionale Dienste ist Ihre Einwilligung nach Art. 6 Abs. 1 lit. a DSGVO und § 25
                Abs. 1 TTDSG. Notwendige Funktionen beruhen auf § 25 Abs. 2 Nr. 2 TTDSG. Ihre Auswahl wird mit Zeitpunkt
                und Version dokumentiert und gilt 12 Monate. Details in der{' '}
                <a href="/datenschutz/">Datenschutzerklärung</a>.
              </p>
            </div>

            <div className="cookie-modal__actions">
              <button type="button" className="cookie-modal__ghost" onClick={() => apply(denied)}>
                Alle ablehnen
              </button>
              <button type="button" className="cookie-modal__ghost" onClick={() => apply(choices)}>
                Auswahl speichern
              </button>
              <button type="button" className="cookie-modal__primary" onClick={() => apply(granted)}>
                Alle akzeptieren
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
