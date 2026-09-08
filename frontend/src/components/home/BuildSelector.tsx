import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
import { useLanguage, translate as t } from '../../lib/useLanguage';
import WidgetIcon, { type WidgetIconName } from './WidgetIcon';
import PosDemo from './PosDemo';
import { AppDemo, PortalDemo, WebsiteDemo } from './ProductDemos';
import { useProductScroll } from './useProductScroll';
import '../../styles/product-lab.css';

const services = [
  {
    key: 'pos',
    icon: 'pos',
    de: 'Kassensysteme',
    en: 'POS systems',
    opening: 'So könnte Ihr',
    product: ['Kassensystem', 'point of sale'],
    caption: ['Vom ersten Artikel bis zum Beleg.', 'From the first item to the receipt.'],
    url: '/kassensysteme/',
  },
  {
    key: 'web',
    icon: 'web',
    de: 'Websites',
    en: 'Websites',
    opening: 'So könnte Ihre',
    product: ['Website', 'website'],
    caption: ['Ein Auftritt mit eigener Identität.', 'A presence with its own identity.'],
    url: '/websites/',
  },
  {
    key: 'app',
    icon: 'app',
    de: 'iOS & Android',
    en: 'iOS & Android',
    opening: 'So könnte Ihre',
    product: ['App', 'app'],
    caption: ['Eine App, die sich richtig anfühlt.', 'An app that feels right.'],
    url: '/apps/',
  },
  {
    key: 'portal',
    icon: 'portal',
    de: 'Web-Apps',
    en: 'Web apps',
    opening: 'So könnte Ihre',
    product: ['Web-App', 'web app'],
    caption: ['Ihr Unternehmen. Alles im Blick.', 'Your business. All in view.'],
    url: '/web-apps/',
  },
] as const satisfies readonly {
  key: string;
  icon: WidgetIconName;
  de: string;
  en: string;
  opening: string;
  product: readonly [string, string];
  caption: readonly [string, string];
  url: string;
}[];

export default function BuildSelector() {
  const language = useLanguage();
  const [manualSelection, setManualSelection] = useState(0);
  const [automatic, setAutomatic] = useState(true);
  const [pausedAt, setPausedAt] = useState<number | null>(null);
  const story = useProductScroll();
  const scrolling = automatic && story.available;

  useEffect(() => {
    if (automatic || pausedAt === null || story.nudge <= pausedAt + 1) return;
    setPausedAt(null);
    setAutomatic(true);
  }, [story.nudge, automatic, pausedAt]);
  const selected = scrolling ? story.frame.chapter : manualSelection;
  const previewStep = scrolling ? story.frame.step : undefined;
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const id = useId();
  const service = services[selected];
  const titleService = services[scrolling ? story.frame.titleChapter : selected];
  const phase = scrolling ? story.frame.phase : 'manual';
  const ending = phase === 'outro';
  const demoHidden = scrolling && phase !== 'demo';
  const introHidden = scrolling ? phase === 'demo' || ending : story.available;
  const select = (index: number) => {
    setManualSelection(index);
    setAutomatic(false);
    setPausedAt(story.nudge);
  };
  const interact = () => select(selected);
  const lock = (index: number) => {
    setManualSelection(index);
    setAutomatic(false);
    setPausedAt(null);
  };
  const selectByKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next = index;
    if (event.key === 'ArrowRight') next = (index + 1) % services.length;
    else if (event.key === 'ArrowLeft') next = (index + services.length - 1) % services.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = services.length - 1;
    else return;
    event.preventDefault();
    select(next);
    buttons.current[next]?.focus();
  };
  return (
    <div
      className="product-story"
      ref={story.root}
      data-enhanced={story.available}
      data-mode={scrolling ? 'scroll' : 'manual'}
      data-chapter={service.key}
      data-phase={phase}
      data-step={previewStep}
    >
      <div className="product-story__sticky" ref={story.panel}>
        <div className="product-lab">
          <div className="product-lab__toolbar">
            <div
              className="product-lab__tabs"
              role="tablist"
              aria-label={t(language, 'Leistung ausprobieren', 'Try a service')}
            >
              {services.map((item, index) => (
                <button
                  type="button"
                  key={item.key}
                  ref={(element) => {
                    buttons.current[index] = element;
                  }}
                  id={`${id}-tab-${index}`}
                  role="tab"
                  aria-selected={selected === index}
                  aria-controls={`${id}-panel`}
                  tabIndex={selected === index ? 0 : -1}
                  onClick={() => select(index)}
                  onKeyDown={(event) => selectByKey(event, index)}
                >
                  <WidgetIcon name={item.icon} />
                  <span>{item[language]}</span>
                </button>
              ))}
            </div>
            <span className="product-lab__live">
              <i />
              {t(
                language,
                scrolling ? 'SCROLL-DEMO' : 'SELBST AUSPROBIEREN',
                scrolling ? 'SCROLL DEMO' : 'TRY IT YOURSELF',
              )}
            </span>
          </div>
          <div
            className="product-lab__viewport"
            ref={story.viewport}
            id={`${id}-panel`}
            role="tabpanel"
            aria-labelledby={`${id}-tab-${selected}`}
            tabIndex={0}
          >
            <div className="product-lab__grid" aria-hidden="true" />
            <div className="product-story__intro" aria-hidden={introHidden}>
              <div className="product-story__planes" aria-hidden="true">
                <i />
                <i />
                <i />
              </div>
              <p className="product-story__eyebrow">
                {String((scrolling ? story.frame.titleChapter : selected) + 1).padStart(2, '0')} / 04{' '}
                <span>{t(language, 'EIN EINBLICK', 'A FIRST LOOK')}</span>
              </p>
              <h3>
                <span>{t(language, titleService.opening, 'This is how your')}</span>{' '}
                <strong>{titleService.product[language === 'de' ? 0 : 1]}</strong>{' '}
                <span>{t(language, 'aussehen.', 'could look.')}</span>
              </h3>
              <p className="product-story__description">{titleService.caption[language === 'de' ? 0 : 1]}</p>
              <span className="product-story__cue" aria-hidden="true">
                {t(language, 'WEITERSCROLLEN & ENTDECKEN', 'SCROLL TO EXPLORE')} <span>↓</span>
              </span>
            </div>
            <div className="product-story__outro" aria-hidden={!ending}>
              <div className="product-story__planes" aria-hidden="true">
                <i />
                <i />
                <i />
              </div>
              <p className="product-story__eyebrow">
                {t(language, 'IHRE IDEE. UNSERE ENTWICKLUNG.', 'YOUR IDEA. OUR CRAFT.')}
              </p>
              <h3>
                {t(language, 'Alles nach Ihrer Idee.', 'Built around your idea.')}{' '}
                <strong>{t(language, 'Maßgeschneidert.', 'Made for you.')}</strong>
              </h3>
              <p className="product-story__description">
                {t(
                  language,
                  'Design, Funktionen und Abläufe – nach Ihren Wünschen. Damit die Software zu Ihrem Unternehmen passt.',
                  'Design, features and workflows, shaped around your needs. Software that fits your business.',
                )}
              </p>
              <span className="product-story__cue" aria-hidden="true">
                {t(language, 'WEITER ZU JEDEM FORMAT', 'NEXT: EVERY SCREEN SIZE')} <span>↓</span>
              </span>
            </div>
            <div className="product-lab__scale" inert={demoHidden} aria-hidden={demoHidden}>
              <div className="product-lab__scene" ref={story.scene}>
                <div className="product-lab__transition" key={service.key}>
                  {service.key === 'pos' && (
                    <PosDemo language={language} previewStep={previewStep} onInteract={interact} />
                  )}
                  {service.key === 'web' && (
                    <WebsiteDemo language={language} previewStep={previewStep} onInteract={interact} />
                  )}
                  {service.key === 'app' && (
                    <AppDemo language={language} previewStep={previewStep} onInteract={interact} />
                  )}
                  {service.key === 'portal' && (
                    <PortalDemo language={language} previewStep={previewStep} onInteract={interact} />
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="product-lab__footer">
            <span className="product-lab__caption">
              {ending
                ? t(language, 'Ihre Wünsche geben die Richtung vor.', 'Your vision sets the direction.')
                : service.caption[language === 'de' ? 0 : 1]}
            </span>
            {story.available && (
              <button
                className="product-lab__mode"
                type="button"
                aria-pressed={scrolling}
                onClick={() => {
                  if (scrolling) lock(selected);
                  else {
                    setPausedAt(null);
                    setAutomatic(true);
                  }
                }}
              >
                <WidgetIcon name={scrolling ? 'pause' : 'play'} />
                <span>
                  {t(
                    language,
                    scrolling ? 'Selbst ausprobieren' : 'Scroll-Demo fortsetzen',
                    scrolling ? 'Try it yourself' : 'Resume scroll demo',
                  )}
                </span>
              </button>
            )}
            <a href={ending ? '/kontakt/' : service.url}>
              {ending ? t(language, 'Idee besprechen', 'Let’s talk') : t(language, 'Mehr erfahren', 'Learn more')}
              <WidgetIcon name="arrow" />
            </a>
          </div>
          <div className="product-story__progress" aria-hidden="true">
            <i />
          </div>
        </div>
      </div>
      <p className="product-story__summary">
        {t(
          language,
          'Alles nach Ihrer Idee. Design, Funktionen und Abläufe – maßgeschneidert für Ihr Unternehmen.',
          'Built around your idea. Design, features and workflows, made for your business.',
        )}
      </p>
    </div>
  );
}
