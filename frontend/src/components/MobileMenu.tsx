import { useCallback, useEffect, useRef, useState } from 'react';
import type { KeyboardEvent, MouseEvent } from 'react';
import { createPortal } from 'react-dom';
import { navigation, site } from '../config/site';
import './mobile-menu.css';

declare global {
  interface Window {
    __caI18n?: { lang: string; set: (l: string) => void; refresh: () => void };
  }
}

type Language = 'de' | 'en';

function lockPageScroll() {
  const body = document.body;
  const root = document.documentElement;
  const scrollPosition = { left: window.scrollX, top: window.scrollY };
  const properties = ['position', 'top', 'left', 'width', 'overflow', 'padding-right'];
  const previousStyles = properties.map((property) => ({
    property,
    value: body.style.getPropertyValue(property),
    priority: body.style.getPropertyPriority(property),
  }));
  const scrollbarWidth = Math.max(0, window.innerWidth - root.clientWidth);
  const paddingRight = Number.parseFloat(getComputedStyle(body).paddingRight) || 0;

  body.style.position = 'fixed';
  body.style.top = `${-scrollPosition.top}px`;
  body.style.left = `${-scrollPosition.left}px`;
  body.style.width = '100%';
  body.style.overflow = 'hidden';
  if (scrollbarWidth > 0) body.style.paddingRight = `${paddingRight + scrollbarWidth}px`;

  return () => {
    for (const { property, value, priority } of previousStyles) {
      if (value) body.style.setProperty(property, value, priority);
      else body.style.removeProperty(property);
    }

    const behavior = root.style.getPropertyValue('scroll-behavior');
    const priority = root.style.getPropertyPriority('scroll-behavior');
    root.style.setProperty('scroll-behavior', 'auto', 'important');
    window.scrollTo(scrollPosition);
    if (behavior) root.style.setProperty('scroll-behavior', behavior, priority);
    else root.style.removeProperty('scroll-behavior');
  };
}

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [language, setLanguage] = useState<Language>('de');
  const [activeHref, setActiveHref] = useState('');
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const unlockRef = useRef<(() => void) | null>(null);
  const english = language === 'en';

  const unlockPage = useCallback(() => {
    const unlock = unlockRef.current;
    unlockRef.current = null;
    unlock?.();
  }, []);

  const closeMenu = useCallback(() => {
    if (dialogRef.current?.open) dialogRef.current.close();
    unlockPage();
    setOpen(false);
  }, [unlockPage]);

  useEffect(() => {
    setMounted(true);
    const readLanguage = () => {
      setLanguage((window.__caI18n?.lang ?? document.documentElement.lang) === 'en' ? 'en' : 'de');
    };
    const readLocation = () => setActiveHref(`${window.location.pathname}${window.location.hash}`);
    readLanguage();
    readLocation();
    document.addEventListener('ca:lang', readLanguage);
    window.addEventListener('hashchange', readLocation);
    return () => {
      document.removeEventListener('ca:lang', readLanguage);
      window.removeEventListener('hashchange', readLocation);
    };
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!mounted || !open || !dialog) return;

    const desktop = window.matchMedia('(min-width: 941px)');
    if (desktop.matches) {
      setOpen(false);
      return;
    }

    unlockRef.current = lockPageScroll();
    dialog.showModal();
    closeRef.current?.focus({ preventScroll: true });

    const onResize = () => {
      if (desktop.matches) closeMenu();
    };
    desktop.addEventListener('change', onResize);
    window.addEventListener('hashchange', closeMenu);

    return () => {
      desktop.removeEventListener('change', onResize);
      window.removeEventListener('hashchange', closeMenu);
      if (dialog.open) dialog.close();
      unlockPage();
      if (document.activeElement === document.body || dialog.contains(document.activeElement)) {
        triggerRef.current?.focus({ preventScroll: true });
      }
    };
  }, [open, mounted, closeMenu, unlockPage]);

  function handleKeyDown(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key !== 'Tab') return;
    const focusable = Array.from(
      event.currentTarget.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ),
    ).filter((element) => element.getClientRects().length > 0);
    const first = focusable[0];
    const last = focusable.at(-1);
    if (!first || !last) return;
    if (event.shiftKey && (document.activeElement === first || document.activeElement === event.currentTarget)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function handleBackdropClick(event: MouseEvent<HTMLDialogElement>) {
    if (event.target !== event.currentTarget) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    if (
      event.clientX < bounds.left ||
      event.clientX > bounds.right ||
      event.clientY < bounds.top ||
      event.clientY > bounds.bottom
    ) {
      closeMenu();
    }
  }

  return (
    <div className="mobile-menu-slot">
      <button
        ref={triggerRef}
        className="menu-toggle"
        type="button"
        aria-expanded={open}
        aria-controls="mobile-nav"
        aria-haspopup="dialog"
        onClick={() => setOpen((value) => !value)}
      >
        <span className="sr-only">{english ? 'Open menu' : 'Menü öffnen'}</span>
        <i aria-hidden="true" />
        <i aria-hidden="true" />
      </button>

      {mounted &&
        createPortal(
          <dialog
            ref={dialogRef}
            id="mobile-nav"
            className="mobile-menu-dialog"
            aria-labelledby="mobile-menu-title"
            onCancel={(event) => {
              event.preventDefault();
              closeMenu();
            }}
            onClose={() => {
              if (!dialogRef.current?.open) closeMenu();
            }}
            onClick={handleBackdropClick}
            onKeyDown={handleKeyDown}
          >
            <div className="mobile-menu-dialog__content">
              <div className="mobile-menu-dialog__head">
                <h2 id="mobile-menu-title">{english ? 'Explore' : 'Entdecken'}</h2>
                <button
                  ref={closeRef}
                  className="mobile-menu-dialog__close"
                  type="button"
                  onClick={closeMenu}
                  aria-label={english ? 'Close menu' : 'Menü schließen'}
                >
                  <svg
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    aria-hidden="true"
                  >
                    <path d="m5 5 10 10M15 5 5 15" />
                  </svg>
                </button>
              </div>

              <nav className="mobile-menu-dialog__links" aria-label={english ? 'Main navigation' : 'Hauptnavigation'}>
                {navigation.map((item, index) => (
                  <a
                    key={item.href}
                    href={item.href}
                    aria-current={activeHref === item.href ? 'location' : undefined}
                    onClick={closeMenu}
                  >
                    <span className="mobile-menu-dialog__number" aria-hidden="true">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span>{english ? item.en : item.label}</span>
                    <svg
                      viewBox="0 0 20 20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M5 10h10m-4-4 4 4-4 4" />
                    </svg>
                  </a>
                ))}
              </nav>

              <div className="mobile-menu-dialog__foot">
                <a className="mobile-menu-dialog__contact" href="/#kontakt" onClick={closeMenu}>
                  <span>{english ? 'Get in touch' : 'Kontakt aufnehmen'}</span>
                  <svg
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M4 10h12m-5-5 5 5-5 5" />
                  </svg>
                </a>
                <div className="mobile-menu-dialog__utility">
                  <div className="mobile-menu-dialog__languages" role="group" aria-label="Sprache / Language">
                    <button type="button" aria-pressed={language === 'de'} onClick={() => window.__caI18n?.set('de')}>
                      DE
                    </button>
                    <button type="button" aria-pressed={language === 'en'} onClick={() => window.__caI18n?.set('en')}>
                      EN
                    </button>
                  </div>
                  <a className="mobile-menu-dialog__login" href="/login/" onClick={closeMenu}>
                    {english ? 'Client login' : 'Kundenlogin'}
                    <span aria-hidden="true">↗</span>
                  </a>
                </div>
                <div className="mobile-menu-dialog__meta">
                  <span>
                    {site.location} · {english ? 'nationwide' : 'deutschlandweit'}
                  </span>
                  <a href={`mailto:${site.contactEmail}`} onClick={closeMenu}>
                    {site.contactEmail}
                  </a>
                </div>
              </div>
            </div>
          </dialog>,
          document.body,
        )}
    </div>
  );
}
