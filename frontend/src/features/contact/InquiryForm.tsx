import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type SubmitEvent,
  type SyntheticEvent,
  type ReactNode,
} from 'react';
import { site } from '../../config/site';
import Turnstile, { type VerificationStatus } from './Turnstile';
import {
  projectTypes,
  budgets,
  fieldOrder,
  readPayload,
  validate,
  type FieldName,
  type FieldErrors,
  type ValidationCode,
} from './inquiry-model';
import '../../styles/inquiry.css';

type Failure =
  'validation' | 'verification' | 'rateLimit' | 'offline' | 'unconfirmed' | 'timeout' | 'origin' | 'tooLarge';
type Status = { phase: 'idle' | 'sending' | 'success' } | { phase: 'error'; reason: Failure };
type Language = 'de' | 'en';

const validationCopy: Record<ValidationCode, [string, string]> = {
  required: ['Bitte ausfüllen.', 'Please fill in this field.'],
  name: ['Bitte mindestens 2 Zeichen eingeben.', 'Please enter at least 2 characters.'],
  email: ['Bitte eine gültige E-Mail-Adresse eingeben.', 'Please enter a valid email address.'],
  phone: ['Bitte eine gültige Telefonnummer eingeben.', 'Please enter a valid phone number.'],
  message: ['Bitte mindestens 10 Zeichen eingeben.', 'Please enter at least 10 characters.'],
  tooLong: ['Bitte die Eingabe kürzen.', 'Please shorten this entry.'],
  projectType: ['Bitte eine Projektart auswählen.', 'Please choose a project type.'],
  budget: ['Bitte einen gültigen Budgetrahmen auswählen.', 'Please choose a valid budget range.'],
  privacy: ['Bitte der Verarbeitung Ihrer Angaben zustimmen.', 'Please agree to the processing of your details.'],
};

const failureCopy: Record<Failure, [string, string]> = {
  validation: ['Bitte prüfen Sie die markierten Felder.', 'Please check the highlighted fields.'],
  verification: ['Bitte schließen Sie die Sicherheitsprüfung ab.', 'Please complete the security check.'],
  rateLimit: [
    'Zu viele Anfragen. Bitte versuchen Sie es in 15 Minuten erneut.',
    'Too many requests. Please try again in 15 minutes.',
  ],
  offline: ['Sie sind offline. Ihre Eingaben bleiben erhalten.', 'You are offline. Your details have been kept.'],
  unconfirmed: [
    'Der Eingang konnte nicht bestätigt werden. Bitte fragen Sie vor dem erneuten Senden per E-Mail nach.',
    'We could not confirm receipt. Please check with us by email before sending again.',
  ],
  timeout: [
    'Die Bestätigung dauert zu lange. Bitte fragen Sie vor dem erneuten Senden per E-Mail nach.',
    'Confirmation is taking too long. Please check with us by email before sending again.',
  ],
  origin: [
    'Bitte öffnen Sie das Formular erneut über die offizielle Website.',
    'Please reopen the form from the official website.',
  ],
  tooLarge: ['Ihre Nachricht ist zu groß. Bitte kürzen Sie den Text.', 'Your message is too large. Please shorten it.'],
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function responseFailure(status: number, body: unknown): Failure {
  const code = isRecord(body) && isRecord(body.error) ? body.error.code : undefined;
  if (status === 429) return 'rateLimit';
  if (status === 403) return 'origin';
  if (status === 413) return 'tooLarge';
  if (code === 'VERIFICATION_FAILED') return 'verification';
  if (code === 'VALIDATION_ERROR') return 'validation';
  return 'unconfirmed';
}

function Field({
  id,
  label,
  optional,
  required,
  error,
  full = false,
  children,
}: {
  id: string;
  label: string;
  optional?: string;
  required?: string;
  error?: string;
  full?: boolean;
  children: ReactNode;
}) {
  return (
    <div className={`inquiry__field${full ? ' inquiry__full' : ''}`}>
      <label htmlFor={id}>
        {label}
        {required ? <span className="inquiry__required">{required}</span> : optional && <span>{optional}</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="inquiry__field-error">
          {error}
        </p>
      )}
    </div>
  );
}

export default function InquiryForm({
  apiBaseUrl,
  turnstileSiteKey,
  compact = false,
}: {
  apiBaseUrl: string;
  turnstileSiteKey?: string;
  compact?: boolean;
}) {
  const id = useId();
  const [language, setLanguage] = useState<Language>('de');
  const [hydrated, setHydrated] = useState(false);
  const [status, setStatus] = useState<Status>({ phase: 'idle' });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [token, setToken] = useState('');
  const [verification, setVerification] = useState<VerificationStatus>('idle');
  const [verificationRequested, setVerificationRequested] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const request = useRef<AbortController | null>(null);
  const feedback = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const t = (de: string, en: string) => (language === 'en' ? en : de);
  const onToken = useCallback((value: string) => {
    setToken(value);
    if (value)
      setStatus((current) =>
        current.phase === 'error' && current.reason === 'verification' ? { phase: 'idle' } : current,
      );
  }, []);
  const onVerification = useCallback((value: VerificationStatus) => setVerification(value), []);
  const needsCheck = Boolean(turnstileSiteKey && !token);
  const endpoint = `${apiBaseUrl.replace(/\/+$/, '')}/api/v1/inquiries`;

  useEffect(() => {
    const updateLanguage = () => setLanguage(document.documentElement.lang === 'en' ? 'en' : 'de');
    updateLanguage();
    setHydrated(true);
    document.addEventListener('ca:lang', updateLanguage);
    return () => {
      document.removeEventListener('ca:lang', updateLanguage);
      request.current?.abort();
      request.current = null;
    };
  }, []);

  useEffect(() => {
    if (status.phase === 'success' || (status.phase === 'error' && status.reason !== 'validation'))
      feedback.current?.focus();
  }, [status]);

  useEffect(() => {
    if (!turnstileSiteKey || verificationRequested || !formRef.current) return;
    if (typeof IntersectionObserver === 'undefined') {
      setVerificationRequested(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        setVerificationRequested(true);
        observer.disconnect();
      },
      { rootMargin: '240px' },
    );
    observer.observe(formRef.current);
    return () => observer.disconnect();
  }, [turnstileSiteKey, verificationRequested]);

  const field = (name: FieldName) => ({
    id: `${id}-${name}`,
    name,
    'aria-invalid': Boolean(errors[name]),
    'aria-describedby': errors[name] ? `${id}-${name}-error` : undefined,
  });
  const errorFor = (name: FieldName) => {
    const code = errors[name];
    return code ? t(...validationCopy[code]) : undefined;
  };

  function requestVerification(event: SyntheticEvent<HTMLFormElement>) {
    const control = event.target;
    if (
      turnstileSiteKey &&
      (control instanceof HTMLInputElement ||
        control instanceof HTMLSelectElement ||
        control instanceof HTMLTextAreaElement) &&
      control.name !== 'website'
    ) {
      setVerificationRequested(true);
    }
  }

  function clearFieldError(event: SyntheticEvent<HTMLFormElement>) {
    const input = event.target;
    if (!(
      input instanceof HTMLInputElement ||
      input instanceof HTMLSelectElement ||
      input instanceof HTMLTextAreaElement
    ))
      return;
    const name = fieldOrder.find((fieldName) => fieldName === input.name);
    if (!name || !errors[name]) return;
    const next = { ...errors };
    delete next[name];
    setErrors(next);
    if (!Object.keys(next).length && status.phase === 'error' && status.reason === 'validation')
      setStatus({ phase: 'idle' });
  }

  async function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (request.current || status.phase === 'success') return;
    const form = event.currentTarget;
    const payload = readPayload(new FormData(form), token);
    const invalid = validate(payload);
    setErrors(invalid);
    const firstInvalid = fieldOrder.find((name) => invalid[name]);
    if (firstInvalid) {
      setStatus({ phase: 'error', reason: 'validation' });
      const control = form.elements.namedItem(firstInvalid);
      if (control instanceof HTMLElement) control.focus();
      return;
    }
    if (needsCheck) {
      setVerificationRequested(true);
      setStatus({ phase: 'error', reason: 'verification' });
      return;
    }
    if (!navigator.onLine) {
      setStatus({ phase: 'error', reason: 'offline' });
      return;
    }

    const body = JSON.stringify(payload);
    if (new TextEncoder().encode(body).byteLength > 16 * 1024) {
      setErrors({ message: 'tooLong' });
      setStatus({ phase: 'error', reason: 'tooLarge' });
      return;
    }

    const controller = new AbortController();
    request.current = controller;
    setStatus({ phase: 'sending' });
    let timedOut = false;
    const timeout = window.setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, 18_000);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
        credentials: 'same-origin',
        redirect: 'error',
        body,
        signal: controller.signal,
      });
      let result: unknown;
      try {
        result = await response.json();
      } catch {
        result = null;
      }
      if (request.current !== controller) return;
      if (!response.ok) {
        setStatus({ phase: 'error', reason: responseFailure(response.status, result) });
      } else if (isRecord(result) && isRecord(result.data) && result.data.received === true) {
        form.reset();
        setStatus({ phase: 'success' });
      } else {
        setStatus({ phase: 'error', reason: 'unconfirmed' });
      }
    } catch {
      if (request.current === controller) setStatus({ phase: 'error', reason: timedOut ? 'timeout' : 'unconfirmed' });
    } finally {
      window.clearTimeout(timeout);
      if (request.current === controller) {
        request.current = null;
        setToken('');
        setResetKey((value) => value + 1);
      }
    }
  }

  return (
    <form
      ref={formRef}
      className={`inquiry${compact ? ' inquiry--compact' : ''}`}
      aria-label={t('Kontaktformular', 'Contact form')}
      aria-busy={status.phase === 'sending'}
      method="post"
      action={endpoint}
      onSubmit={submit}
      onChange={clearFieldError}
      onFocusCapture={requestVerification}
      onInputCapture={requestVerification}
      noValidate
    >
      {status.phase === 'success' ? (
        <div className="inquiry__success" ref={feedback} tabIndex={-1} role="status">
          <span className="inquiry__success-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="m5 12 4 4L19 6" />
            </svg>
          </span>
          <h3>{t('Nachricht angekommen.', 'Message received.')}</h3>
          <p>
            {t(
              'Danke für Ihre Anfrage. Wir melden uns persönlich bei Ihnen.',
              'Thank you for your enquiry. We will get back to you personally.',
            )}
          </p>
          <button
            className="inquiry__again"
            type="button"
            onClick={() => {
              setVerificationRequested(false);
              setStatus({ phase: 'idle' });
              requestAnimationFrame(() =>
                formRef.current?.querySelector<HTMLInputElement>('[name="company"]')?.focus(),
              );
            }}
          >
            {t('Weitere Nachricht', 'Another message')} <span aria-hidden="true">↗</span>
          </button>
        </div>
      ) : (
        <>
          <fieldset className="inquiry__grid" disabled={status.phase === 'sending'}>
            <legend className="sr-only">
              {t('Ihre Kontaktdaten und Nachricht', 'Your contact details and message')}
            </legend>
            <Field id={`${id}-company`} label={t('Unternehmen', 'Company')} error={errorFor('company')}>
              <input {...field('company')} autoComplete="organization" maxLength={120} required />
            </Field>
            <Field id={`${id}-name`} label={t('Ihr Name', 'Your name')} error={errorFor('name')}>
              <input {...field('name')} autoComplete="name" minLength={2} maxLength={120} required />
            </Field>
            <Field
              id={`${id}-email`}
              label={t('E-Mail', 'Email')}
              required={t('erforderlich', 'required')}
              error={errorFor('email')}
            >
              <input
                {...field('email')}
                type="email"
                autoComplete="email"
                autoCapitalize="none"
                spellCheck={false}
                maxLength={254}
                required
              />
            </Field>
            <Field
              id={`${id}-phone`}
              label={t('Telefon', 'Phone')}
              optional={t('optional', 'optional')}
              error={errorFor('phone')}
            >
              <input
                {...field('phone')}
                type="tel"
                autoComplete="tel"
                maxLength={40}
                placeholder={t('Wenn Rückruf lieber ist', 'If you prefer a call')}
              />
            </Field>
            <Field
              id={`${id}-projectType`}
              label={t('Was planen Sie?', 'What are you planning?')}
              error={errorFor('projectType')}
            >
              <select {...field('projectType')} defaultValue="" required>
                <option value="" disabled>
                  {t('Bitte auswählen', 'Please choose')}
                </option>
                {projectTypes.map(([value, en]) => (
                  <option key={value} value={value}>
                    {t(value, en)}
                  </option>
                ))}
              </select>
            </Field>
            {!compact && (
              <Field
                id={`${id}-budget`}
                label={t('Budgetrahmen', 'Budget')}
                optional="optional"
                error={errorFor('budget')}
              >
                <select {...field('budget')} defaultValue="">
                  {budgets.map(([value, de, en]) => (
                    <option key={value} value={value}>
                      {t(de, en)}
                    </option>
                  ))}
                </select>
              </Field>
            )}
            <Field id={`${id}-message`} label={t('Ihre Idee', 'Your idea')} error={errorFor('message')} full>
              <textarea
                {...field('message')}
                rows={compact ? 3 : 4}
                minLength={10}
                maxLength={5000}
                required
                placeholder={t('Was möchten Sie umsetzen?', 'What would you like to build?')}
              />
            </Field>
            <div className="inquiry__privacy inquiry__full">
              <label htmlFor={`${id}-privacyAccepted`}>
                <input {...field('privacyAccepted')} type="checkbox" value="true" required />
                <span>
                  {t(
                    'Ich stimme der Verarbeitung meiner Angaben gemäß ',
                    'I agree to my details being processed in accordance with the ',
                  )}
                  <a href="/datenschutz/">{t('Datenschutzerklärung', 'privacy policy')}</a>
                  {t(' zu.', '.')}
                </span>
              </label>
              {errors.privacyAccepted && (
                <p id={`${id}-privacyAccepted-error`} className="inquiry__field-error">
                  {errorFor('privacyAccepted')}
                </p>
              )}
            </div>
          </fieldset>

          <div className="inquiry__trap" aria-hidden="true">
            <label>
              {t('Dieses Feld bitte leer lassen', 'Leave this field empty')}
              <input name="website" tabIndex={-1} autoComplete="off" maxLength={120} />
            </label>
          </div>
          <Turnstile
            siteKey={turnstileSiteKey}
            active={verificationRequested}
            onToken={onToken}
            onStatus={onVerification}
            resetKey={resetKey}
            language={language}
          />

          <div className="inquiry__foot">
            <a className="inquiry__mail" href={`mailto:${site.contactEmail}`}>
              {t('Lieber per E-Mail?', 'Prefer email?')} <span aria-hidden="true">↗</span>
            </a>
            <button
              className="inquiry__submit"
              type="submit"
              disabled={!hydrated || status.phase === 'sending' || (verificationRequested && needsCheck)}
            >
              {status.phase === 'sending'
                ? t('Wird gesendet …', 'Sending …')
                : needsCheck && verificationRequested
                  ? verification === 'error'
                    ? t('Prüfung erforderlich', 'Check required')
                    : verification === 'interactive'
                      ? t('Bitte Prüfung bestätigen', 'Please complete the check')
                      : t('Sicherheitsprüfung …', 'Security check …')
                  : t('Nachricht senden', 'Send message')}
              {status.phase === 'sending' ? (
                <span className="inquiry__spinner" aria-hidden="true" />
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5 12h14m-6-6 6 6-6 6" />
                </svg>
              )}
            </button>
          </div>

          {status.phase === 'error' && (
            <div className="inquiry__feedback" ref={feedback} tabIndex={-1} role="alert">
              <p>{t(...failureCopy[status.reason])}</p>
              {status.reason !== 'validation' && status.reason !== 'verification' && (
                <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>
              )}
            </div>
          )}
          <noscript>
            <p className="inquiry__feedback">
              Für das Formular ist JavaScript erforderlich. Schreiben Sie uns an{' '}
              <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>.
            </p>
          </noscript>
        </>
      )}
    </form>
  );
}
