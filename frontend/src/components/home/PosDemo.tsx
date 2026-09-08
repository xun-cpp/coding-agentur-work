import { useEffect, useReducer, useRef, useState } from 'react';
import { translate as t, type Language } from '../../lib/useLanguage';
import WidgetIcon from './WidgetIcon';
import { currency, initialPos, posReducer, products, totalCents } from './pos-model';

export default function PosDemo({
  language,
  previewStep,
  onInteract,
}: {
  language: Language;
  previewStep?: number;
  onInteract?: () => void;
}) {
  const [localState, dispatch] = useReducer(posReducer, initialPos);
  const state = previewStep === undefined ? localState : posReducer(initialPos, { type: 'frame', frame: previewStep });
  const [manual, setManual] = useState(false);
  const [paused, setPaused] = useState(true);
  const [reduced, setReduced] = useState(true);
  const [visible, setVisible] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const root = useRef<HTMLDivElement>(null);
  const frame = useRef(0);
  const total = totalCents(state.basket);
  const running = previewStep === undefined && visible && pageVisible && !paused && !manual && !reduced;
  const playing = previewStep !== undefined ? visible && pageVisible && !reduced : running;

  useEffect(() => {
    if (previewStep !== undefined) dispatch({ type: 'frame', frame: previewStep });
  }, [previewStep]);

  const interact = () => {
    if (previewStep !== undefined) dispatch({ type: 'frame', frame: previewStep });
    setManual(true);
    onInteract?.();
  };

  useEffect(() => {
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotion = () => setReduced(preference.matches);
    const updatePage = () => setPageVisible(!document.hidden);
    updateMotion();
    updatePage();
    preference.addEventListener('change', updateMotion);
    document.addEventListener('visibilitychange', updatePage);
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.15 });
    if (root.current) observer.observe(root.current);
    return () => {
      preference.removeEventListener('change', updateMotion);
      document.removeEventListener('visibilitychange', updatePage);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!running) return;
    const timer = setInterval(() => {
      frame.current = (frame.current + 1) % 7;
      dispatch({ type: 'frame', frame: frame.current });
    }, 1900);
    return () => clearInterval(timer);
  }, [running]);

  useEffect(() => {
    if (previewStep !== undefined || !manual || !pageVisible || !visible) return;
    if (state.phase !== 'payment' && state.phase !== 'approved') return;
    const phase = state.phase;
    const timer = setTimeout(() => dispatch({ type: phase === 'payment' ? 'approve' : 'receipt' }), reduced ? 0 : 1300);
    return () => clearTimeout(timer);
  }, [previewStep, manual, pageVisible, visible, reduced, state.phase]);

  const replay = () => {
    onInteract?.();
    dispatch({ type: 'reset' });
    frame.current = 0;
    setManual(false);
    setPaused(true);
  };
  const phaseIndex = state.phase === 'cart' ? 0 : state.phase === 'payment' ? 1 : 2;

  return (
    <div
      ref={root}
      className={`pos-demo pos-demo--${state.phase}`}
      data-phase={state.phase}
      data-playing={playing}
      data-motion-active={visible && pageVisible && !reduced && (previewStep !== undefined || manual || !paused)}
    >
      <div className="pos-console">
        <div className="pos-console__top">
          <span>
            <i /> {t(language, 'Kassensystem', 'POS system')}
          </span>
          <span>
            {t(language, 'Kasse 01', 'Register 01')} <b>···</b>
          </span>
        </div>
        <div className="pos-console__body">
          <div className="pos-catalogue">
            <div className="pos-catalogue__heading">
              <h3>{t(language, 'Was darf es sein?', 'What would you like?')}</h3>
              <span>{t(language, 'Frisch für Sie.', 'Freshly made.')}</span>
            </div>
            <div className="pos-products">
              {products.map((product) => (
                <button
                  type="button"
                  className={`pos-product${state.basket[product.id] ? ' is-added' : ''}`}
                  key={product.id}
                  aria-label={`${t(language, product.name, product.id === 'water' ? 'Water' : product.name)} ${t(language, 'hinzufügen', 'add')}`}
                  data-demonstrating={
                    ((previewStep === 1 || previewStep === 3) && product.id === 'cappuccino') ||
                    (previewStep === 2 && product.id === 'water')
                  }
                  disabled={state.phase === 'payment'}
                  onClick={() => {
                    interact();
                    dispatch({ type: 'add', id: product.id });
                  }}
                >
                  <span className={`product-object product-object--${product.kind}`} aria-hidden="true">
                    <i />
                    <b />
                    <em />
                  </span>
                  <span>{t(language, product.name, product.id === 'water' ? 'Water' : product.name)}</span>
                  <small>{currency(product.cents, language)}</small>
                  <span className="pos-product__plus" aria-hidden="true">
                    +
                  </span>
                </button>
              ))}
            </div>
          </div>
          <div className="pos-order">
            <div className="pos-order__title">
              <span>{t(language, 'Ihre Bestellung', 'Your order')}</span>
              <span>#024</span>
            </div>
            <ul className="pos-order__items" aria-label={t(language, 'Warenkorb', 'Basket')}>
              {products
                .filter((p) => state.basket[p.id])
                .map((product) => (
                  <li key={product.id}>
                    <span className="pos-quantity">{state.basket[product.id]}×</span>
                    <span>{t(language, product.name, product.id === 'water' ? 'Water' : product.name)}</span>
                    <b>{currency(product.cents * (state.basket[product.id] ?? 0), language)}</b>
                    <button
                      type="button"
                      aria-label={`${product.name} ${t(language, 'entfernen', 'remove')}`}
                      disabled={state.phase !== 'cart'}
                      onClick={() => {
                        interact();
                        dispatch({ type: 'remove', id: product.id });
                      }}
                    >
                      −
                    </button>
                  </li>
                ))}
              {total === 0 && (
                <li className="pos-order__empty">
                  <WidgetIcon name="pos" />
                  <span>{t(language, 'Wählen Sie einen Artikel.', 'Choose an item.')}</span>
                </li>
              )}
            </ul>
            <div className="pos-total">
              <span>{t(language, 'Gesamt', 'Total')}</span>
              <b>{currency(total, language)}</b>
            </div>
            <button
              type="button"
              className="pos-pay"
              data-demonstrating={previewStep === 4}
              disabled={total === 0 || state.phase !== 'cart'}
              onClick={() => {
                interact();
                dispatch({ type: 'pay' });
              }}
            >
              <span>
                {state.phase === 'cart'
                  ? t(language, 'Bezahlen', 'Pay')
                  : state.phase === 'payment'
                    ? t(language, 'Wird bezahlt …', 'Processing …')
                    : t(language, 'Bezahlt', 'Paid')}
              </span>
              <WidgetIcon name={state.phase === 'approved' || state.phase === 'receipt' ? 'check' : 'arrow'} />
            </button>
            <span className="pos-order__foot">
              {t(language, 'Nur eine Demo. Keine echte Zahlung.', 'Demo only. No real payment.')}
            </span>
          </div>
        </div>
        <div className="pos-console__base">
          <i />
        </div>
      </div>
      <div className="pos-terminal" aria-live={manual ? 'polite' : 'off'}>
        <div className="pos-terminal__speaker" />
        <div className="pos-terminal__screen">
          <span className="pos-terminal__ey">{t(language, 'KARTENZAHLUNG', 'CARD PAYMENT')}</span>
          <b className="pos-terminal__amount">{currency(total, language)}</b>
          <span className="pos-nfc" aria-hidden="true">
            <i />
            <i />
            <i />
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M6 9a6 6 0 0 1 0 6m4-10a12 12 0 0 1 0 14m4-18a19 19 0 0 1 0 22" />
            </svg>
          </span>
          <span className="pos-terminal__check" aria-hidden="true">
            <WidgetIcon name="check" />
          </span>
          <span className="pos-terminal__status">
            {state.phase === 'cart'
              ? t(language, 'Bereit', 'Ready')
              : state.phase === 'payment'
                ? t(language, 'Karte wird gelesen', 'Reading card')
                : t(language, 'Zahlung erfolgreich', 'Payment successful')}
          </span>
        </div>
        <div className="pos-terminal__brand">
          CA PAY <span>◉</span>
        </div>
      </div>

      <div className="pos-printer">
        <div className="pos-printer__feed">
          <div className="pos-receipt" aria-hidden={state.phase !== 'receipt'}>
            <span>{t(language, 'Ihr Kassensystem', 'Your POS system')}</span>
            <span>DEMO / #024</span>
            <i />
            <div>
              {t(language, 'Summe', 'Total')}
              <b>{currency(total, language)}</b>
            </div>
            <strong>✓ {t(language, 'BEZAHLT', 'PAID')}</strong>
            <span>{t(language, 'Vielen Dank!', 'Thank you!')}</span>
            <div className="pos-barcode" />
          </div>
        </div>
        <div className="pos-printer__body" aria-hidden="true">
          <i className="pos-printer__slot" />
          <span>THERMAL / 01</span>
          <i className="pos-printer__led" />
        </div>
      </div>
      <div className="pos-playback">
        <ol className="pos-steps" aria-label={t(language, 'Zahlungsablauf', 'Payment flow')}>
          {[
            ['Auswählen', 'Choose'],
            ['Bezahlen', 'Pay'],
            ['Fertig', 'Done'],
          ].map((label, index) => (
            <li key={label[0]} className={index <= phaseIndex ? 'is-active' : ''}>
              <span>{index < phaseIndex ? '✓' : `0${index + 1}`}</span>
              {label[language === 'de' ? 0 : 1]}
            </li>
          ))}
        </ol>
        <div className="pos-playback__buttons">
          <button type="button" aria-label={t(language, 'Demo neu starten', 'Restart demo')} onClick={replay}>
            <WidgetIcon name="reset" />
          </button>
          <button
            type="button"
            aria-label={t(
              language,
              playing ? 'Demo pausieren' : 'Demo abspielen',
              playing ? 'Pause demo' : 'Play demo',
            )}
            aria-pressed={playing}
            onClick={() => {
              if (playing) {
                interact();
                setManual(false);
                setPaused(true);
              } else {
                onInteract?.();
                setPaused(false);
                setManual(false);
                frame.current = 0;
                dispatch({ type: 'reset' });
                if (reduced) dispatch({ type: 'frame', frame: 3 });
              }
            }}
          >
            <WidgetIcon name={playing ? 'pause' : 'play'} />
          </button>
        </div>
      </div>
    </div>
  );
}
