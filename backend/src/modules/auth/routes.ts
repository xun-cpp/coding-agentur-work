import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import type { Environment } from '../../config/env.js';
import type { HumanVerifier } from '../../security/turnstile.js';
import { LoginAttemptGuard } from './login-attempts.js';
import { AuthService, AuthenticationError, ServiceUnavailableError } from './service.js';

const credentialsSchema = z
  .object({
    email: z.string().trim().toLowerCase().email().max(254),
    password: z.string().min(12).max(1024),
    turnstileToken: z
      .string()
      .min(1)
      .max(2048)
      .regex(/^[\x21-\x7e]+$/)
      .optional(),
  })
  .strict();

const sessionLifetimeSeconds = 8 * 60 * 60;
const cookieName = (environment: Environment) =>
  environment.NODE_ENV === 'production' ? '__Host-ca_session' : 'ca_session';
const cookieOptions = (environment: Environment) => ({
  httpOnly: true,
  secure: environment.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  path: '/',
  priority: 'high' as const,
});

export function registerAuthRoutes(
  app: FastifyInstance,
  service: AuthService,
  environment: Environment,
  turnstile: HumanVerifier,
  attempts: LoginAttemptGuard,
): void {
  const sessionCookie = cookieName(environment);

  app.post(
    '/api/v1/auth/login',
    { bodyLimit: 4 * 1024, config: { rateLimit: { max: 5, timeWindow: '15 minutes' } } },
    async (request, reply) => {
      const input = credentialsSchema.safeParse(request.body);
      if (!input.success)
        return reply
          .code(400)
          .send({ error: { code: 'VALIDATION_ERROR', message: 'Die Anmeldung konnte nicht verarbeitet werden.' } });

      const verified = await turnstile.verify(input.data.turnstileToken, request.ip, 'login');
      if (!verified) {
        request.log.warn({ event: 'turnstile_rejected', requestId: request.id, flow: 'login' }, 'security_event');
        return reply.code(400).send({
          error: { code: 'VERIFICATION_FAILED', message: 'Die Sicherheitsprüfung konnte nicht bestätigt werden.' },
        });
      }
      if (attempts.isBlocked(input.data.email)) {
        request.log.warn({ event: 'login_account_throttled', requestId: request.id }, 'security_event');
        return reply.code(429).send({
          error: { code: 'RATE_LIMITED', message: 'Zu viele Anmeldeversuche. Bitte versuchen Sie es später erneut.' },
        });
      }

      try {
        const result = await service.login(input.data.email, input.data.password);
        attempts.reset(input.data.email);
        reply.setCookie(sessionCookie, result.sessionToken, {
          ...cookieOptions(environment),
          maxAge: sessionLifetimeSeconds,
        });
        request.log.info({ event: 'login_succeeded', requestId: request.id }, 'security_event');
        return { data: { user: result.user } };
      } catch (error) {
        if (error instanceof ServiceUnavailableError)
          return reply.code(503).send({
            error: { code: 'SERVICE_UNAVAILABLE', message: 'Der Kundenbereich ist derzeit nicht verfügbar.' },
          });
        if (error instanceof AuthenticationError) {
          attempts.recordFailure(input.data.email);
          request.log.warn({ event: 'login_failed', requestId: request.id }, 'security_event');
          return reply
            .code(401)
            .send({ error: { code: 'INVALID_CREDENTIALS', message: 'E-Mail oder Passwort sind nicht korrekt.' } });
        }
        throw error;
      }
    },
  );

  app.post(
    '/api/v1/auth/logout',
    { bodyLimit: 256, config: { rateLimit: { max: 30, timeWindow: '15 minutes' } } },
    async (request, reply) => {
      await service.logout(request.cookies[sessionCookie]);
      reply.clearCookie(sessionCookie, cookieOptions(environment));
      request.log.info({ event: 'logout', requestId: request.id }, 'security_event');
      return reply.code(204).send();
    },
  );

  app.get('/api/v1/auth/me', { config: { rateLimit: { max: 60, timeWindow: '1 minute' } } }, async (request, reply) => {
    try {
      return { data: { user: await service.getUser(request.cookies[sessionCookie]) } };
    } catch (error) {
      if (error instanceof ServiceUnavailableError)
        return reply
          .code(503)
          .send({ error: { code: 'SERVICE_UNAVAILABLE', message: 'Der Kundenbereich ist derzeit nicht verfügbar.' } });
      if (error instanceof AuthenticationError)
        return reply
          .code(401)
          .send({ error: { code: 'UNAUTHENTICATED', message: 'Eine Anmeldung ist erforderlich.' } });
      throw error;
    }
  });
}
