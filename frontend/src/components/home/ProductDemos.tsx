import { useEffect, useState } from 'react';
import { translate as t, type Language } from '../../lib/useLanguage';
import WidgetIcon from './WidgetIcon';
import {
  appPreview,
  appointmentTimes,
  portalPreview,
  websitePreview,
  type AppState,
  type PortalState,
  type WebsiteState,
} from './product-story-model';

type DemoProps = { language: Language; previewStep?: number; onInteract?: () => void };

export function WebsiteDemo({ language, previewStep, onInteract }: DemoProps) {
  const [local, setLocal] = useState<WebsiteState>(() => websitePreview(0));
  const state = previewStep === undefined ? local : websitePreview(previewStep);
  useEffect(() => {
    if (previewStep !== undefined) setLocal(websitePreview(previewStep));
  }, [previewStep]);
  const change = (next: Partial<WebsiteState>) => {
    setLocal({ ...state, ...next });
    onInteract?.();
  };

  return (
    <div className="web-demo" data-phase={state.confirmed ? 'confirmed' : state.booking ? 'booking' : 'home'}>
      <div className="demo-chrome">
        <span className="demo-chrome__dots">
          <i />
          <i />
          <i />
        </span>
        <span>{t(language, 'ihre-website.de', 'your-website.com')}</span>
        <WidgetIcon name="shield" />
      </div>
      <div className="web-demo__nav">
        <b>{t(language, 'Ihre Website', 'Your website')}</b>
        <span>{t(language, 'Ihr Auftritt. Ihre Regeln.', 'Your presence. Your rules.')}</span>
        <span>↗</span>
      </div>
      {!state.booking ? (
        <div className="web-demo__page">
          <div>
            <span className="web-demo__ey">{t(language, 'IHRE WEBSITE', 'YOUR WEBSITE')}</span>
            <h3>
              {t(language, 'Gefunden werden.', 'Get found.')}
              <br />
              <em>{t(language, 'Gebucht werden.', 'Get booked.')}</em>
            </h3>
            <p>
              {t(
                language,
                'Ihre Leistungen, Ihre Termine, Ihre Kunden – auf einer Seite.',
                'Your services, your appointments, your clients – on one page.',
              )}
            </p>
            <button type="button" data-demonstrating={previewStep === 1} onClick={() => change({ booking: true })}>
              {t(language, 'Termin vereinbaren', 'Book a time')}
              <WidgetIcon name="arrow" />
            </button>
          </div>
          <div className="web-demo__art" aria-hidden="true">
            <div className="web-demo__sheet">
              <span>01 / DESIGN</span>
              <b>{t(language, 'Ihr Logo', 'Your logo')}</b>
              <div className="web-demo__swatches">
                <i />
                <i />
                <i />
              </div>
              <span>{t(language, 'IHRE FARBEN.', 'YOUR COLOURS.')}</span>
            </div>
            <div className="web-demo__round" />
            <div className="web-demo__card">
              {t(language, 'MOBIL + DESKTOP', 'MOBILE + DESKTOP')} <span>↗</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="web-demo__booking">
          <span className="web-demo__ey">{t(language, 'TERMINVORSCHAU', 'BOOKING PREVIEW')}</span>
          <h3>
            {state.confirmed
              ? t(language, 'Einfach. Vereinbart.', 'Simply. Booked.')
              : t(language, 'Wann passt es Ihnen?', 'What works for you?')}
          </h3>
          {state.confirmed ? (
            <div className="booking-confirmation" aria-live={previewStep === undefined ? 'polite' : 'off'}>
              <WidgetIcon name="check" />
              <div>
                <b>{t(language, 'Termin bestätigt', 'Appointment confirmed')}</b>
                <span>
                  {t(language, 'Ihr Demo-Termin', 'Your demo appointment')} · {state.time}
                </span>
              </div>
            </div>
          ) : (
            <>
              <div className="booking-calendar" aria-hidden="true">
                <span>
                  MO<b>21</b>
                </span>
                <span>
                  DI<b>22</b>
                </span>
                <span className="is-selected">
                  MI<b>23</b>
                </span>
                <span>
                  DO<b>24</b>
                </span>
                <span>
                  FR<b>25</b>
                </span>
              </div>
              <div className="booking-times" role="group" aria-label={t(language, 'Uhrzeit wählen', 'Choose a time')}>
                {appointmentTimes.map((value) => (
                  <button
                    type="button"
                    key={value}
                    aria-pressed={state.time === value}
                    data-demonstrating={previewStep === 3 && value === '11:30'}
                    onClick={() => change({ time: value })}
                  >
                    {value}
                  </button>
                ))}
              </div>
              <button type="button" className="widget-action" onClick={() => change({ confirmed: true })}>
                {t(language, 'Demo-Termin bestätigen', 'Confirm demo time')}
                <WidgetIcon name="arrow" />
              </button>
            </>
          )}
          <button
            type="button"
            className="widget-text-button"
            onClick={() => change({ booking: false, confirmed: false })}
          >
            {t(language, 'Zurück zur Website', 'Back to the website')}
          </button>
        </div>
      )}
      <div className="web-demo__foot">
        <span>{t(language, 'Ihre Inhalte. Ihre Termine.', 'Your content. Your bookings.')}</span>
        <span>{t(language, 'WEBSITE-DEMO', 'WEBSITE DEMO')}</span>
      </div>
    </div>
  );
}

const appTasks = [
  ['Design freigeben', 'Approve design'],
  ['Termin bestätigen', 'Confirm appointment'],
  ['Dokument prüfen', 'Review document'],
] as const;

export function AppDemo({ language, previewStep, onInteract }: DemoProps) {
  const [local, setLocal] = useState<AppState>(() => appPreview(0));
  const state = previewStep === undefined ? local : appPreview(previewStep);
  useEffect(() => {
    if (previewStep !== undefined) setLocal(appPreview(previewStep));
  }, [previewStep]);
  const change = (next: Partial<AppState>) => {
    setLocal({ ...state, ...next });
    onInteract?.();
  };
  const progress = Math.round((state.done.length / appTasks.length) * 100);

  return (
    <div
      className="apps-demo"
      data-view={state.view}
      data-completed={state.done.length}
      data-confirmed={state.confirmed}
    >
      <div className="apps-demo__note">
        <span>iOS + ANDROID</span>
        <h3>
          {t(language, 'Ein Fingertipp.', 'One tap.')}
          <br />
          <em>{t(language, 'Alles im Griff.', 'All in hand.')}</em>
        </h3>
        <p>{t(language, 'Aufgaben. Termine. Erledigt.', 'Tasks. Appointments. Done.')}</p>
        <span className="apps-demo__orbit">
          <WidgetIcon name="app" />
          <i />
        </span>
      </div>
      <div className="apps-demo__phone">
        <div className="apps-demo__status">
          <span>9:41</span>
          <i />
          <span>▮▮</span>
        </div>
        <div className="apps-demo__content">
          <span className="apps-demo__ey">{t(language, 'GUTEN MORGEN', 'GOOD MORNING')}</span>
          <h3>{t(language, 'Ihre App.', 'Your app.')}</h3>
          <div className="apps-demo__panel">
            {state.view === 'tasks' ? (
              <>
                <div className="apps-demo__progress">
                  <svg viewBox="0 0 100 100" aria-hidden="true">
                    <circle cx="50" cy="50" r="42" />
                    <circle cx="50" cy="50" r="42" pathLength="100" strokeDasharray={`${progress} 100`} />
                  </svg>
                  <span>
                    {progress}
                    <small>%</small>
                  </span>
                </div>
                <p>{t(language, 'Ihr Tag wird leichter.', 'Your day, made easier.')}</p>
                <div className="apps-demo__tasks">
                  {appTasks.map((task, index) => (
                    <button
                      type="button"
                      key={task[0]}
                      aria-pressed={state.done.includes(index)}
                      data-demonstrating={previewStep === index + 1}
                      onClick={() =>
                        change({
                          done: state.done.includes(index)
                            ? state.done.filter((value) => value !== index)
                            : [...state.done, index],
                        })
                      }
                    >
                      <span className="apps-demo__check">
                        {state.done.includes(index) && <WidgetIcon name="check" />}
                      </span>
                      <span>{task[language === 'de' ? 0 : 1]}</span>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className="apps-demo__calendar">
                <div className="app-calendar-date">
                  <span>{t(language, 'MI', 'WED')}</span>
                  <b>23</b>
                  <span>SEPTEMBER</span>
                </div>
                <b>{t(language, 'Ihr nächster Termin', 'Your next appointment')}</b>
                {state.confirmed ? (
                  <div className="app-calendar-confirmation" aria-live={previewStep === undefined ? 'polite' : 'off'}>
                    <WidgetIcon name="check" />
                    <b>{t(language, 'Bestätigt', 'Confirmed')}</b>
                    <span>
                      {state.time} · {t(language, 'Demo-Termin', 'Demo appointment')}
                    </span>
                    <button type="button" onClick={() => change({ confirmed: false })}>
                      {t(language, 'Termin ändern', 'Change time')}
                    </button>
                  </div>
                ) : (
                  <>
                    <div
                      className="app-calendar-times"
                      role="group"
                      aria-label={t(language, 'App-Termin wählen', 'Choose app appointment')}
                    >
                      {appointmentTimes.map((value) => (
                        <button
                          key={value}
                          type="button"
                          aria-pressed={state.time === value}
                          data-demonstrating={previewStep === 5 && value === '11:30'}
                          onClick={() => change({ time: value })}
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                    <button className="app-calendar-book" type="button" onClick={() => change({ confirmed: true })}>
                      {t(language, 'Termin bestätigen', 'Confirm time')}
                      <WidgetIcon name="check" />
                    </button>
                    <span className="app-calendar-hint">
                      {t(language, 'Nur eine Demo-Buchung.', 'Demo booking only.')}
                    </span>
                  </>
                )}
              </div>
            )}
          </div>
          <div className="apps-demo__dock" role="group" aria-label={t(language, 'App-Navigation', 'App navigation')}>
            <button
              type="button"
              aria-label={t(language, 'Aufgaben anzeigen', 'Show tasks')}
              aria-pressed={state.view === 'tasks'}
              onClick={() => change({ view: 'tasks' })}
            >
              <WidgetIcon name="portal" />
              <span>{t(language, 'Aufgaben', 'Tasks')}</span>
            </button>
            <button
              type="button"
              aria-label={t(language, 'Termine anzeigen', 'Show appointments')}
              aria-pressed={state.view === 'calendar'}
              data-demonstrating={previewStep === 4}
              onClick={() => change({ view: 'calendar' })}
            >
              <WidgetIcon name="app" />
              <span>{t(language, 'Termine', 'Calendar')}</span>
            </button>
          </div>
        </div>
        <div className="stage-phone__home" />
      </div>
      <div className="apps-demo__toast">
        <WidgetIcon name="check" />
        <span>
          {state.view === 'calendar' && state.confirmed
            ? t(language, 'Termin bestätigt', 'Appointment confirmed')
            : `${state.done.length} / 3 ${t(language, 'erledigt', 'done')}`}
        </span>
      </div>
    </div>
  );
}

const periods = [
  { de: 'Juni', en: 'June', values: [29, 44, 35, 58, 48, 72, 57, 77, 65, 85, 76, 92], orders: 48, revenue: '12.480' },
  { de: 'Juli', en: 'July', values: [43, 35, 53, 43, 65, 51, 72, 88, 70, 78, 92, 86], orders: 57, revenue: '15.210' },
  {
    de: 'August',
    en: 'August',
    values: [37, 48, 43, 66, 54, 71, 67, 83, 80, 70, 93, 99],
    orders: 64,
    revenue: '18.640',
  },
] as const;

export function PortalDemo({ language, previewStep, onInteract }: DemoProps) {
  const [local, setLocal] = useState<PortalState>(() => portalPreview(0));
  const state = previewStep === undefined ? local : portalPreview(previewStep);
  useEffect(() => {
    if (previewStep !== undefined) setLocal(portalPreview(previewStep));
  }, [previewStep]);
  const change = (next: Partial<PortalState>) => {
    setLocal({ ...state, ...next });
    onInteract?.();
  };
  const current = periods[state.period];

  return (
    <div className="portal-demo" data-period={state.period} data-approved={state.approved}>
      <div className="portal-demo__sidebar">
        <b>
          ca<span>®</span>
        </b>
        <WidgetIcon name="portal" />
        <WidgetIcon name="web" />
        <WidgetIcon name="shield" />
        <span>A</span>
      </div>
      <div className="portal-demo__content">
        <div className="portal-demo__head">
          <div>
            <span>{t(language, 'IHRE WEB-APP', 'YOUR WEB APP')}</span>
            <h3>{t(language, 'Alles im Überblick.', 'The whole picture.')}</h3>
          </div>
          <span className="portal-demo__avatar">A</span>
        </div>
        <div className="portal-demo__metrics">
          <div>
            <span>{t(language, 'Umsatz', 'Revenue')}</span>
            <b>{current.revenue} €</b>
          </div>
          <div>
            <span>{t(language, 'Aufträge', 'Orders')}</span>
            <b>{current.orders}</b>
          </div>
          <div>
            <span>{t(language, 'Offen', 'Open')}</span>
            <b>{state.approved ? '03' : '04'}</b>
          </div>
        </div>
        <div className="portal-demo__charthead">
          <b>{t(language, 'Entwicklung', 'Activity')}</b>
          <div role="group" aria-label={t(language, 'Monat wählen', 'Select month')}>
            {periods.map((value, index) => (
              <button
                type="button"
                key={value.de}
                aria-pressed={index === state.period}
                data-demonstrating={previewStep === index && previewStep > 0}
                onClick={() => change({ period: index })}
              >
                {value[language]}
              </button>
            ))}
          </div>
        </div>
        <div className="portal-demo__chart" aria-label={`${current[language]}: ${current.revenue} Euro`} role="img">
          {current.values.map((height, index) => (
            <i key={index} style={{ height: `${height}%`, transitionDelay: `${index * 25}ms` }} />
          ))}
        </div>
        <div className="portal-demo__activity">
          <span className="portal-demo__activity-icon">
            <WidgetIcon name={state.approved ? 'check' : 'web'} />
          </span>
          <div>
            <b>
              {t(
                language,
                state.approved ? 'Angebot freigegeben' : 'Angebot zur Freigabe',
                state.approved ? 'Quote approved' : 'Quote awaiting approval',
              )}
            </b>
            <span>
              {t(
                language,
                state.approved ? 'Ihr Team ist informiert.' : 'Ein Klick. Alles auf dem Laufenden.',
                state.approved ? 'Your team is up to date.' : 'One click. Everyone up to date.',
              )}
            </span>
          </div>
          <button
            className="portal-demo__approve"
            type="button"
            disabled={state.approved}
            data-demonstrating={previewStep === 3}
            aria-label={t(
              language,
              state.approved ? 'Angebot ist freigegeben' : 'Demo-Angebot freigeben',
              state.approved ? 'Quote is approved' : 'Approve demo quote',
            )}
            onClick={() => change({ approved: true })}
          >
            <WidgetIcon name={state.approved ? 'check' : 'arrow'} />
          </button>
        </div>
        <span className="portal-demo__disclaimer">{t(language, 'WEB-APP-DEMO', 'WEB APP DEMO')}</span>
      </div>
    </div>
  );
}
