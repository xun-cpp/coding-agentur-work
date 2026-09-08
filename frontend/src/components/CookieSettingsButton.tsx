const openSettings = () => window.dispatchEvent(new Event('reference-application:open-cookie-settings'));

export default function CookieSettingsButton({ variant = 'footer' }: { variant?: 'footer' | 'corner' }) {
  if (variant === 'corner') {
    return (
      <button
        className="cookie-settings-button cookie-settings-button--corner"
        type="button"
        aria-label="Datenschutz-Einstellungen öffnen"
        title="Datenschutz-Einstellungen"
        onClick={openSettings}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path d="M5 8h14M5 16h14" />
          <circle cx="9" cy="8" r="2.2" />
          <circle cx="15" cy="16" r="2.2" />
        </svg>
      </button>
    );
  }
  return (
    <button className="cookie-settings-button cookie-settings-button--footer" type="button" onClick={openSettings}>
      Cookie-Einstellungen
    </button>
  );
}
