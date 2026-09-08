import { readTurnstileSiteKey } from './turnstile';

const turnstileSiteKey = readTurnstileSiteKey(import.meta.env.PUBLIC_TURNSTILE_SITE_KEY, import.meta.env.PROD);
const configuredApiBaseUrl = import.meta.env.PUBLIC_API_BASE_URL?.trim().replace(/\/+$/, '') || '';
if (import.meta.env.PROD && configuredApiBaseUrl && configuredApiBaseUrl !== 'https://reference.example.invalid') {
  throw new Error('PUBLIC_API_BASE_URL must use the canonical same-origin endpoint.');
}

export const site = {
  name: 'Coding Agentur',
  domain: 'reference.example.invalid',
  location: 'Deutschland',
  contactEmail: 'contact@example.invalid',
  whatsappNumber: import.meta.env.PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, '') || undefined,
  apiBaseUrl: configuredApiBaseUrl,
  turnstileSiteKey,
  googleSiteVerification: import.meta.env.PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
  bingSiteVerification: import.meta.env.PUBLIC_BING_SITE_VERIFICATION || undefined,
  pricing: {
    websiteStartingPrice: undefined as number | undefined,
    webAppStartingPrice: undefined as number | undefined,
    mobileAppStartingPrice: undefined as number | undefined,
    integrationStartingPrice: undefined as number | undefined,
    maintenanceMonthlyPrice: undefined as number | undefined,
  },
  features: {
    showWhatsApp: true,
  },
} as const;

export const navigation = [
  { href: '/#leistungen', label: 'Leistungen', en: 'Services' },
  { href: '/ueber-uns/', label: 'Über uns', en: 'About' },
  { href: '/#ablauf', label: 'Ablauf', en: 'Process' },
  { href: '/#kontakt', label: 'Kontakt', en: 'Contact' },
] as const;

export const services = [
  {
    slug: 'websites',
    label: 'Websites',
    eyebrow: 'Präsenz, die arbeitet',
    title: 'Websites mit Substanz.',
    description:
      'Unternehmenswebsites, Landingpages und digitale Auftritte, die Ihre Leistungen verständlich machen und technisch sauber umgesetzt sind.',
    items: [
      'Individuelle Gestaltung',
      'Mehrsprachigkeit und SEO-Grundlagen',
      'CMS- und Lead-Anbindungen',
      'Performance und interaktive Komponenten',
    ],
  },
  {
    slug: 'web-apps',
    label: 'Web-Apps',
    eyebrow: 'Prozesse im Browser',
    title: 'Web-Anwendungen für den Arbeitsalltag.',
    description:
      'Kundenportale, interne Systeme und Administrationsoberflächen, abgestimmt auf Rollen, Prozesse und vorhandene Daten.',
    items: [
      'Kunden- und Mitgliederbereiche',
      'Dashboards und interne Systeme',
      'Buchungen und Dokumente',
      'Rechte, Daten und Schnittstellen',
    ],
  },
  {
    slug: 'apps',
    label: 'Mobile Apps',
    eyebrow: 'Nativ gedacht',
    title: 'Mobile Anwendungen, die sich einfügen.',
    description:
      'Für Kunden, Teams und digitale Services – mit einer klaren Aufgabe, belastbarer Backend-Anbindung und guter mobiler Nutzung.',
    items: [
      'iOS, Android und Cross-Platform',
      'Push und Authentifizierung',
      'Zahlungs- und API-Anbindungen',
      'Mitarbeiter- und Kunden-Apps',
    ],
  },
  {
    slug: 'webshops',
    label: 'Webshops',
    eyebrow: 'Online verkaufen',
    title: 'Webshops, die zu Ihrem Geschäft passen.',
    description:
      'Individuelle Shops mit Produktdarstellung, Warenkorb, Zahlungen und Anbindungen an die Abläufe Ihres Unternehmens.',
    items: [
      'Produktkataloge und Varianten',
      'Warenkorb und Checkout',
      'Zahlungsanbieter und Versand',
      'Bestellungen und Schnittstellen',
    ],
  },
  {
    slug: 'kassensysteme',
    label: 'Kassensysteme',
    eyebrow: 'Verkauf und Betrieb verbunden',
    title: 'Kassensysteme nach Ihrem Ablauf.',
    description:
      'POS-Oberflächen und Integrationen, die Produktdaten, Bestellungen, Rechte und Auswertungen sinnvoll zusammenbringen.',
    items: [
      'POS und Bestellungen',
      'Inventar und Produktverwaltung',
      'Mitarbeiterrechte und Filialen',
      'Zahlungen und Schnittstellen',
    ],
  },
  {
    slug: 'integrationen',
    label: 'APIs und Integrationen',
    eyebrow: 'Systeme, die zusammenarbeiten',
    title: 'Verbindungen statt Medienbrüche.',
    description:
      'Wir verbinden bestehende Software, Datenquellen und externe Dienste mit nachvollziehbaren Schnittstellen und verlässlichen Abläufen.',
    items: [
      'REST-APIs und Webhooks',
      'CRM, ERP und Buchungssysteme',
      'Zahlungsanbieter',
      'Datenimporte und Automatisierung',
    ],
  },
] as const;
