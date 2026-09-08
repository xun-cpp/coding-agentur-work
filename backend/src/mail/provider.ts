import type { InquiryInput } from '../modules/inquiries/schema.js';

export type ContactMail = Pick<InquiryInput, 'name' | 'email' | 'company' | 'message' | 'phone' | 'budget'> & {
  projectType: string;
};
export interface MailProvider {
  sendContactConfirmation(inquiry: ContactMail): Promise<void>;
  sendInternalContactNotification(inquiry: ContactMail): Promise<void>;
  sendPasswordReset(email: string, resetUrl: string): Promise<void>;
  sendPasswordChanged(email: string): Promise<void>;
  sendInvoiceNotification(email: string, invoiceUrl: string): Promise<void>;
  sendWelcome(email: string, invitationUrl: string): Promise<void>;
}

export class DevelopmentMailProvider implements MailProvider {
  async sendContactConfirmation(): Promise<void> {
    console.info(
      JSON.stringify({ level: 'info', event: 'development_mail_prepared', template: 'contact_confirmation' }),
    );
  }
  async sendInternalContactNotification(inquiry: ContactMail): Promise<void> {
    console.info(
      JSON.stringify({
        level: 'info',
        event: 'development_mail_prepared',
        template: 'internal_inquiry_notification',
        projectType: inquiry.projectType,
      }),
    );
  }
  async sendPasswordReset(): Promise<void> {
    console.info(JSON.stringify({ level: 'info', event: 'development_mail_prepared', template: 'password_reset' }));
  }
  async sendPasswordChanged(): Promise<void> {
    console.info(JSON.stringify({ level: 'info', event: 'development_mail_prepared', template: 'password_changed' }));
  }
  async sendInvoiceNotification(): Promise<void> {
    console.info(
      JSON.stringify({ level: 'info', event: 'development_mail_prepared', template: 'invoice_notification' }),
    );
  }
  async sendWelcome(): Promise<void> {
    console.info(JSON.stringify({ level: 'info', event: 'development_mail_prepared', template: 'welcome' }));
  }
}

const escapeHtml = (value: string): string =>
  value.replace(
    /[&<>"']/g,
    (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character] as string,
  );
const safeSubjectPart = (value: string): string =>
  value
    .replace(/[\r\n\u0000-\u001f\u007f]/g, ' ')
    .trim()
    .slice(0, 120);
const safeProductUrl = (value: string): string => {
  const url = new URL(value);
  if (
    url.protocol !== 'https:' ||
    url.hostname !== 'reference.example.invalid' ||
    url.username ||
    url.password ||
    url.port
  ) {
    throw new Error('unsafe_transactional_url');
  }
  return url.toString();
};
const layout = (heading: string, body: string): string =>
  `<div style="font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;max-width:560px;margin:0 auto;color:#0a0c11;line-height:1.6">
    <h1 style="font-size:18px;margin:0 0 16px">${heading}</h1>
    ${body}
    <hr style="border:none;border-top:1px solid #e3e5ea;margin:24px 0" />
    <p style="font-size:12px;color:#767b88;margin:0">Coding Agentur</p>
  </div>`;

type ResendConfig = { apiKey: string; from: string; internalTo: string };

export class ResendMailProvider implements MailProvider {
  constructor(private readonly config: ResendConfig) {}

  private async send(to: string, subject: string, html: string, replyTo?: string): Promise<void> {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'User-Agent': 'reference-application-api/1.0',
      },
      redirect: 'error',
      signal: AbortSignal.timeout(5_000),
      body: JSON.stringify({
        from: this.config.from,
        to,
        subject: safeSubjectPart(subject),
        html,
        ...(replyTo ? { reply_to: replyTo } : {}),
      }),
    });
    await response.body?.cancel();
    if (!response.ok) throw new Error(`resend_send_failed_${response.status}`);
  }

  async sendContactConfirmation(inquiry: ContactMail): Promise<void> {
    await this.send(
      inquiry.email,
      'Ihre Anfrage bei der Coding Agentur',
      layout(
        'Vielen Dank für Ihre Anfrage',
        `
        <p style="margin:0 0 12px">Hallo ${escapeHtml(inquiry.name)},</p>
        <p style="margin:0 0 12px">wir haben Ihre Anfrage zum Thema <strong>${escapeHtml(inquiry.projectType)}</strong> erhalten und melden uns in der Regel am selben Werktag bei Ihnen.</p>
        <p style="margin:0 0 16px">Mit freundlichen Grüßen<br />Coding Agentur</p>
        <p style="margin:0;font-size:12px;color:#767b88">Diese Nachricht wurde automatisch erzeugt. Bitte antworten Sie nicht direkt auf diese E-Mail – wir melden uns persönlich bei Ihnen.</p>
      `,
      ),
    );
  }

  async sendInternalContactNotification(inquiry: ContactMail): Promise<void> {
    const projectType = safeSubjectPart(inquiry.projectType);
    const budgets = {
      bis_5000: 'Bis 5.000 €',
      '5000_15000': '5.000 – 15.000 €',
      '15000_50000': '15.000 – 50.000 €',
      ab_50000: 'Ab 50.000 €',
    };
    const budget = inquiry.budget ? budgets[inquiry.budget] : 'Noch offen';
    await this.send(
      this.config.internalTo,
      `Neue Projektanfrage: ${projectType}`,
      layout(
        'Neue Projektanfrage',
        `
        <table style="font-size:14px;border-collapse:collapse">
          <tr><td style="padding:2px 12px 2px 0;color:#767b88">Firma</td><td>${escapeHtml(inquiry.company)}</td></tr>
          <tr><td style="padding:2px 12px 2px 0;color:#767b88">Name</td><td>${escapeHtml(inquiry.name)}</td></tr>
          <tr><td style="padding:2px 12px 2px 0;color:#767b88">E-Mail</td><td>${escapeHtml(inquiry.email)}</td></tr>
          <tr><td style="padding:2px 12px 2px 0;color:#767b88">Telefon</td><td>${escapeHtml(inquiry.phone || 'Nicht angegeben')}</td></tr>
          <tr><td style="padding:2px 12px 2px 0;color:#767b88">Projekt</td><td>${escapeHtml(inquiry.projectType)}</td></tr>
          <tr><td style="padding:2px 12px 2px 0;color:#767b88">Budget</td><td>${escapeHtml(budget)}</td></tr>
        </table>
        <h2 style="font-size:15px;margin:20px 0 8px">Nachricht</h2>
        <p style="margin:0;overflow-wrap:anywhere">${escapeHtml(inquiry.message).replace(/\r\n|\r|\n/g, '<br />')}</p>
      `,
      ),
      inquiry.email,
    );
  }

  async sendPasswordReset(email: string, resetUrl: string): Promise<void> {
    const url = safeProductUrl(resetUrl);
    await this.send(
      email,
      'Passwort zurücksetzen',
      layout(
        'Passwort zurücksetzen',
        `
      <p style="margin:0 0 12px">Sie haben angefragt, Ihr Passwort zurückzusetzen. Der Link ist 60 Minuten gültig:</p>
      <p style="margin:0 0 12px"><a href="${escapeHtml(url)}" style="color:#0a0c11">${escapeHtml(url)}</a></p>
      <p style="margin:0">Falls Sie das nicht waren, ignorieren Sie diese E-Mail.</p>
    `,
      ),
    );
  }

  async sendPasswordChanged(email: string): Promise<void> {
    await this.send(
      email,
      'Ihr Passwort wurde geändert',
      layout(
        'Passwort geändert',
        `
      <p style="margin:0">Das Passwort für Ihren Zugang wurde soeben geändert. Wenn Sie das nicht veranlasst haben, kontaktieren Sie uns bitte umgehend.</p>
    `,
      ),
    );
  }

  async sendInvoiceNotification(email: string, invoiceUrl: string): Promise<void> {
    const url = safeProductUrl(invoiceUrl);
    await this.send(
      email,
      'Neue Rechnung verfügbar',
      layout(
        'Neue Rechnung',
        `
      <p style="margin:0 0 12px">In Ihrem Kundenbereich steht eine neue Rechnung bereit:</p>
      <p style="margin:0"><a href="${escapeHtml(url)}" style="color:#0a0c11">${escapeHtml(url)}</a></p>
    `,
      ),
    );
  }

  async sendWelcome(email: string, invitationUrl: string): Promise<void> {
    const url = safeProductUrl(invitationUrl);
    await this.send(
      email,
      'Willkommen bei der Coding Agentur',
      layout(
        'Willkommen',
        `
      <p style="margin:0 0 12px">Ihr Zugang wurde angelegt. Bitte vergeben Sie über den folgenden Link Ihr Passwort:</p>
      <p style="margin:0"><a href="${escapeHtml(url)}" style="color:#0a0c11">${escapeHtml(url)}</a></p>
    `,
      ),
    );
  }
}

type MailEnvironment = {
  MAIL_PROVIDER: 'development' | 'resend';
  MAIL_FROM: string;
  MAIL_API_KEY?: string | undefined;
  MAIL_INTERNAL_TO?: string | undefined;
};

export function createMailProvider(environment: MailEnvironment): MailProvider {
  if (environment.MAIL_PROVIDER === 'resend') {
    if (!environment.MAIL_API_KEY) throw new Error('MAIL_PROVIDER=resend benötigt MAIL_API_KEY.');
    return new ResendMailProvider({
      apiKey: environment.MAIL_API_KEY,
      from: environment.MAIL_FROM,
      internalTo: environment.MAIL_INTERNAL_TO ?? environment.MAIL_FROM,
    });
  }
  return new DevelopmentMailProvider();
}
