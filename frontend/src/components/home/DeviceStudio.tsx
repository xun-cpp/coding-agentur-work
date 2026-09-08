import { useEffect, useRef, useState } from 'react';
import { translate as t, useLanguage } from '../../lib/useLanguage';
import WidgetIcon, { type WidgetIconName } from './WidgetIcon';
import '../../styles/device-studio.css';

const formats = [
  { key: 'desktop', label: 'Desktop', icon: 'desktop' },
  { key: 'laptop', label: 'Laptop', icon: 'web' },
  { key: 'tablet', label: 'Tablet', icon: 'tablet' },
  { key: 'mobile', label: 'Mobile', icon: 'app' },
] as const satisfies readonly { key: string; label: string; icon: WidgetIconName }[];

const morphWindows = [
  [0.16, 0.3],
  [0.43, 0.57],
  [0.7, 0.84],
] as const;

export function devicePoseAt(progress: number): number {
  for (const [index, [start, end]] of morphWindows.entries()) {
    if (progress <= start) return index;
    if (progress < end) {
      const position = (progress - start) / (end - start);
      return index + position ** 3 * (position * (position * 6 - 15) + 10);
    }
  }
  return formats.length - 1;
}

export default function DeviceStudio() {
  const language = useLanguage();
  const [format, setFormat] = useState(0);
  const [automatic, setAutomatic] = useState(true);
  const [scrollAvailable, setScrollAvailable] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const activeFormat = useRef(0);

  useEffect(() => {
    const section = root.current?.closest<HTMLElement>('[data-device-story]');
    const sticky = section?.querySelector<HTMLElement>('.device-sticky');
    if (!section || !sticky) return;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const previousSpace = section.style.getPropertyValue('--device-scroll-space');
    const previousPriority = section.style.getPropertyPriority('--device-scroll-space');
    const measure = () => {
      const style = getComputedStyle(sticky);
      const top = Number.parseFloat(style.top) || 0;
      const fits = sticky.offsetHeight + top <= window.innerHeight - 8;
      const available = !reduced.matches && style.position === 'sticky' && fits;
      section.style.setProperty('--device-scroll-space', available ? 'var(--device-scroll-distance)' : '0px');
      setScrollAvailable(available);
    };
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measure);
    observer?.observe(sticky);
    measure();
    window.addEventListener('resize', measure, { passive: true });
    window.addEventListener('pageshow', measure);
    reduced.addEventListener('change', measure);
    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', measure);
      window.removeEventListener('pageshow', measure);
      reduced.removeEventListener('change', measure);
      if (previousSpace) section.style.setProperty('--device-scroll-space', previousSpace, previousPriority);
      else section.style.removeProperty('--device-scroll-space');
    };
  }, []);

  useEffect(() => {
    const studio = root.current;
    const section = studio?.closest<HTMLElement>('[data-device-story]');
    const sticky = section?.querySelector<HTMLElement>('.device-sticky');
    if (!automatic || !scrollAvailable || !studio || !section || !sticky) return;
    let pose = activeFormat.current;
    let frame = 0;
    let previousTime = performance.now();

    const paint = () => {
      formats.forEach((_, index) => {
        const weight = Math.max(0, 1 - Math.abs(pose - index));
        studio.style.setProperty(`--device-weight-${index}`, weight.toFixed(5));
      });
      let nextFormat = activeFormat.current;
      while (nextFormat < formats.length - 1 && pose > nextFormat + 0.58) nextFormat++;
      while (nextFormat > 0 && pose < nextFormat - 0.58) nextFormat--;
      if (nextFormat !== activeFormat.current) {
        activeFormat.current = nextFormat;
        setFormat(nextFormat);
      }
    };

    const draw = (time: number) => {
      frame = 0;
      if (document.hidden) {
        previousTime = time;
        return;
      }
      const rect = section.getBoundingClientRect();
      const top = Number.parseFloat(getComputedStyle(sticky).top) || 0;
      const distance = Math.max(section.offsetHeight - sticky.offsetHeight, 1);
      const progress = Math.min(1, Math.max(0, (top - rect.top) / distance));
      const target = devicePoseAt(progress);
      const visible = rect.bottom > top && rect.top < window.innerHeight;
      const elapsed = Math.min(64, Math.max(1, time - previousTime));
      previousTime = time;
      pose = visible ? pose + (target - pose) * (1 - Math.exp(-elapsed / 145)) : target;
      if (Math.abs(target - pose) < 0.001) pose = target;
      paint();
      if (visible && pose !== target) frame = requestAnimationFrame(draw);
    };
    const request = () => {
      if (!frame) {
        previousTime = performance.now() - 16;
        frame = requestAnimationFrame(draw);
      }
    };
    paint();
    request();
    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request, { passive: true });
    window.addEventListener('pageshow', request);
    document.addEventListener('visibilitychange', request);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', request);
      window.removeEventListener('resize', request);
      window.removeEventListener('pageshow', request);
      document.removeEventListener('visibilitychange', request);
      formats.forEach((_, index) => studio.style.removeProperty(`--device-weight-${index}`));
    };
  }, [automatic, scrollAvailable]);

  return (
    <div
      className="device-studio"
      ref={root}
      data-scroll-driven={automatic && scrollAvailable}
      data-scroll-available={scrollAvailable}
    >
      <div className="device-formats" role="group" aria-label={t(language, 'Bildschirmformat', 'Screen format')}>
        {formats.map((item, index) => (
          <button
            type="button"
            key={item.key}
            aria-pressed={format === index}
            onClick={() => {
              activeFormat.current = index;
              setAutomatic(false);
              setFormat(index);
            }}
          >
            <WidgetIcon name={item.icon} />
            <span>{item.label}</span>
          </button>
        ))}
      </div>
      <div className="device-canvas" data-format={formats[format].key}>
        <div className="device-canvas__halo" aria-hidden="true" />
        <div
          className="morph-device"
          data-device={formats[format].key}
          aria-label={`${formats[format].label}: ${t(language, 'responsive Oberflächenvorschau', 'responsive interface preview')}`}
        >
          <div className="morph-device__shell">
            <div className="morph-device__camera" />
            <div className="morph-device__screen">
              <div className="responsive-app" aria-hidden="true">
                <div className="responsive-app__sidebar">
                  <b>ca®</b>
                  <span className="selected">
                    <WidgetIcon name="portal" />
                  </span>
                  <span>
                    <WidgetIcon name="web" />
                  </span>
                  <span>
                    <WidgetIcon name="shield" />
                  </span>
                  <span className="responsive-app__profile">A</span>
                </div>
                <div className="responsive-app__main">
                  <div className="responsive-app__nav">
                    <b>Workspace</b>
                    <span>↗</span>
                  </div>
                  <div className="responsive-app__greeting">
                    <span>{t(language, 'GUTEN MORGEN', 'GOOD MORNING')}</span>
                    <h3>{t(language, 'Alles an seinem Platz.', 'Everything in its place.')}</h3>
                    <p>{t(language, 'Ihr Unternehmen. Ein bisschen leichter.', 'Your business. A little easier.')}</p>
                  </div>
                  <div className="responsive-app__cards">
                    <div>
                      <span>{t(language, 'Aufträge', 'Orders')}</span>
                      <b>24</b>
                      <i>↗</i>
                    </div>
                    <div>
                      <span>{t(language, 'Erledigt', 'Complete')}</span>
                      <b>18</b>
                      <i>✓</i>
                    </div>
                    <div>
                      <span>{t(language, 'Heute', 'Today')}</span>
                      <b>06</b>
                      <i>◷</i>
                    </div>
                  </div>
                  <div className="responsive-app__bottom">
                    <div className="responsive-app__chart">
                      <span>{t(language, 'Ihre Woche', 'Your week')}</span>
                      <div>
                        {[34, 59, 46, 78, 62, 92, 73, 100, 91].map((height, index) => (
                          <i key={index} style={{ height: `${height}%` }} />
                        ))}
                      </div>
                    </div>
                    <div className="responsive-app__list">
                      <span>{t(language, 'Zuletzt erledigt', 'Recently completed')}</span>
                      <p>
                        <i>✓</i>
                        {t(language, 'Angebot freigegeben', 'Quote approved')}
                      </p>
                      <p>
                        <i>✓</i>
                        {t(language, 'Termin bestätigt', 'Appointment confirmed')}
                      </p>
                      <p>
                        <i>✓</i>
                        {t(language, 'Alles synchronisiert', 'Everything synced')}
                      </p>
                    </div>
                  </div>
                  <div className="responsive-app__dock">
                    <WidgetIcon name="portal" />
                    <WidgetIcon name="web" />
                    <span>◉</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="morph-device__chin">
              <span>coding agentur</span>
              <i />
            </div>
          </div>
          <div className="morph-device__stand" aria-hidden="true" />
          <div className="morph-device__foot" aria-hidden="true" />
          <div className="morph-device__keyboard" aria-hidden="true">
            <i />
          </div>
        </div>
        <span className="device-canvas__label" aria-hidden="true">
          {`0${format + 1}`} <i>/</i> 04
        </span>
      </div>
      <div className="device-studio__footer">
        <span>{t(language, 'Eine Oberfläche. Passt sich wirklich an.', 'One interface. Truly responsive.')}</span>
        <button
          type="button"
          disabled={!scrollAvailable}
          aria-pressed={automatic && scrollAvailable}
          onClick={() => setAutomatic((current) => !current)}
        >
          <span>↓</span>
          {t(
            language,
            automatic ? 'Scroll-gesteuert' : 'Scroll-Modus aktivieren',
            automatic ? 'Scroll-controlled' : 'Enable scroll mode',
          )}
        </button>
      </div>
    </div>
  );
}
