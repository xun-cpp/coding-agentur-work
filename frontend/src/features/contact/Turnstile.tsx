import { useEffect, useRef, useState } from 'react';

export type VerificationStatus = 'idle' | 'loading' | 'interactive' | 'verified' | 'error';
export type VerificationAction = 'contact' | 'login';
type VerificationFailure = 'unavailable' | 'expired';
type WidgetSize = 'normal' | 'compact';
type TurnstileApi = {
  render(
    container: HTMLElement,
    options: {
      sitekey: string;
      action: string;
      theme: 'light';
      size: WidgetSize;
      appearance: 'always';
      language: string;
      'response-field': false;
      'refresh-expired': 'auto';
      'refresh-timeout': 'manual';
      retry: 'never';
      callback: (token: string) => void;
      'expired-callback': () => void;
      'error-callback': (code: string) => boolean;
      'timeout-callback': () => void;
      'unsupported-callback': () => void;
      'before-interactive-callback': () => void;
    },
  ): string | undefined;
  remove(widgetId: string): void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

let scriptPromise: Promise<TurnstileApi> | undefined;

function loadTurnstile(): Promise<TurnstileApi> {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise<TurnstileApi>((resolve, reject) => {
    let script = document.querySelector<HTMLScriptElement>('script[data-turnstile="true"]');
    if (script?.dataset.loadState === 'error') {
      script.remove();
      script = null;
    }
    const isNew = !script;
    const element = script ?? document.createElement('script');
    const cleanup = () => {
      window.clearTimeout(timeout);
      element.removeEventListener('load', onLoad);
      element.removeEventListener('error', onError);
    };
    const onError = () => {
      cleanup();
      element.dataset.loadState = 'error';
      reject(new Error('Turnstile could not be loaded.'));
    };
    const onLoad = () => {
      if (!window.turnstile) {
        onError();
        return;
      }
      cleanup();
      element.dataset.loadState = 'ready';
      resolve(window.turnstile);
    };
    const timeout = window.setTimeout(onError, 12_000);
    element.addEventListener('load', onLoad);
    element.addEventListener('error', onError);
    if (isNew) {
      element.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      element.async = true;
      element.defer = true;
      element.dataset.turnstile = 'true';
      document.head.append(element);
    }
  }).catch((error: unknown) => {
    scriptPromise = undefined;
    throw error;
  });
  return scriptPromise;
}

function widgetSizeForWidth(width: number): WidgetSize {
  return width >= 300 ? 'normal' : 'compact';
}

export default function Turnstile({
  siteKey,
  active = false,
  action = 'contact',
  onToken,
  onStatus,
  resetKey = 0,
  language = 'de',
}: {
  siteKey?: string;
  active?: boolean;
  action?: VerificationAction;
  onToken: (token: string) => void;
  onStatus?: (status: VerificationStatus) => void;
  resetKey?: number;
  language?: 'de' | 'en';
}) {
  const container = useRef<HTMLDivElement>(null);
  const widget = useRef<string | undefined>(undefined);
  const [generation, setGeneration] = useState(0);
  const [failure, setFailure] = useState<VerificationFailure | null>(null);
  const [size, setSize] = useState<WidgetSize | null>(null);
  const [rendered, setRendered] = useState(false);

  useEffect(() => {
    const element = container.current;
    if (!siteKey || !active || !element) {
      setSize(null);
      return;
    }
    const measure = () => {
      const width = Number.parseFloat(window.getComputedStyle(element).width);
      if (width > 0) setSize(widgetSizeForWidth(width));
    };
    measure();
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', measure);
      return () => window.removeEventListener('resize', measure);
    }
    const observer = new ResizeObserver(([entry]) => {
      if (entry && entry.contentRect.width > 0) setSize(widgetSizeForWidth(entry.contentRect.width));
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [siteKey, active]);

  useEffect(() => {
    if (!siteKey || !active || !size || !container.current) return;
    let disposed = false;
    let watchdog: number | undefined;
    setFailure(null);
    setRendered(false);
    onToken('');
    onStatus?.('loading');
    const fail = (reason: VerificationFailure = 'unavailable') => {
      if (disposed) return;
      window.clearTimeout(watchdog);
      onToken('');
      onStatus?.('error');
      setFailure(reason);
    };
    const waitForVerification = () => {
      window.clearTimeout(watchdog);
      watchdog = window.setTimeout(() => fail(), 25_000);
    };
    waitForVerification();

    void loadTurnstile()
      .then((api) => {
        if (disposed || !container.current) return;
        widget.current = api.render(container.current, {
          sitekey: siteKey,
          action,
          theme: 'light',
          size,
          appearance: 'always',
          language,
          'response-field': false,
          'refresh-expired': 'auto',
          'refresh-timeout': 'manual',
          retry: 'never',
          callback: (token) => {
            if (disposed) return;
            window.clearTimeout(watchdog);
            setFailure(null);
            onToken(token);
            onStatus?.('verified');
          },
          'expired-callback': () => {
            if (disposed) return;
            setFailure(null);
            onToken('');
            onStatus?.('loading');
            waitForVerification();
          },
          'error-callback': () => {
            fail();
            return true;
          },
          'timeout-callback': () => fail('expired'),
          'unsupported-callback': () => fail(),
          'before-interactive-callback': () => {
            if (disposed) return;
            window.clearTimeout(watchdog);
            setFailure(null);
            onToken('');
            onStatus?.('interactive');
          },
        });
        if (widget.current === undefined) fail();
        else setRendered(true);
      })
      .catch(() => fail());

    return () => {
      disposed = true;
      window.clearTimeout(watchdog);
      if (widget.current !== undefined) window.turnstile?.remove(widget.current);
      widget.current = undefined;
    };
  }, [siteKey, active, size, action, onToken, onStatus, language, generation, resetKey]);

  if (!siteKey) return null;
  return (
    <div className="inquiry__verification" data-widget-size={size ?? undefined}>
      <p className="inquiry__verification-label">{language === 'en' ? 'Security check' : 'Sicherheitsprüfung'}</p>
      <div className="inquiry__verification-frame">
        <div className="inquiry__verification-widget" ref={container} />
        {!rendered && !failure && (
          <span className="inquiry__verification-loading" role="status">
            {active
              ? language === 'en'
                ? 'Loading spam protection …'
                : 'Spam-Schutz wird geladen …'
              : 'Cloudflare Turnstile'}
          </span>
        )}
      </div>
      {failure && (
        <div className="inquiry__verification-error" role="status">
          <p>
            {failure === 'expired'
              ? language === 'en'
                ? 'The security check expired. Please restart it.'
                : 'Die Sicherheitsprüfung ist abgelaufen. Bitte starten Sie sie erneut.'
              : language === 'en'
                ? 'The security check could not be completed.'
                : 'Die Sicherheitsprüfung konnte nicht abgeschlossen werden.'}
          </p>
          <button type="button" onClick={() => setGeneration((value) => value + 1)}>
            {language === 'en' ? 'Try check again' : 'Prüfung neu starten'} <span aria-hidden="true">↻</span>
          </button>
        </div>
      )}
    </div>
  );
}
