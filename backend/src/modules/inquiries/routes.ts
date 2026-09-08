import type { FastifyInstance } from 'fastify';
import type { InquiryRepository } from './repository.js';
import { inquirySchema } from './schema.js';
import type { HumanVerifier } from '../../security/turnstile.js';
import type { MailProvider } from '../../mail/provider.js';

export function registerInquiryRoutes(
  app: FastifyInstance,
  dependencies: { repository: InquiryRepository; turnstile: HumanVerifier; mail: MailProvider },
): void {
  app.post(
    '/api/v1/inquiries',
    { bodyLimit: 16 * 1024, config: { rateLimit: { max: 5, timeWindow: '15 minutes' } } },
    async (request, reply) => {
      const parsed = inquirySchema.safeParse(request.body);
      if (!parsed.success)
        return reply
          .code(400)
          .send({ error: { code: 'VALIDATION_ERROR', message: 'Bitte prüfen Sie Ihre Eingaben.' } });
      const inquiry = parsed.data;
      if (inquiry.website) return reply.code(202).send({ data: { received: true } });
      const isHuman = await dependencies.turnstile.verify(inquiry.turnstileToken, request.ip, 'contact');
      if (!isHuman) {
        request.log.warn({ event: 'turnstile_rejected', requestId: request.id, flow: 'contact' }, 'security_event');
        return reply.code(400).send({
          error: { code: 'VERIFICATION_FAILED', message: 'Die Sicherheitsprüfung konnte nicht bestätigt werden.' },
        });
      }
      await dependencies.repository.create(inquiry);
      const deliveries = await Promise.allSettled([
        dependencies.mail.sendInternalContactNotification(inquiry),
        dependencies.mail.sendContactConfirmation(inquiry),
      ]);
      const failedDeliveries = deliveries.filter((result) => result.status === 'rejected').length;
      if (failedDeliveries)
        request.log.warn({ event: 'inquiry_mail_failed', requestId: request.id, failedDeliveries }, 'delivery_event');
      return reply.code(201).send({ data: { received: true } });
    },
  );
}
