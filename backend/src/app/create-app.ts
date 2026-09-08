import { createHmac, randomUUID } from 'node:crypto';
import cookie from '@fastify/cookie';
import rateLimit from '@fastify/rate-limit';
import Fastify, { LogController, type FastifyInstance, type RawServerDefault } from 'fastify';
import type { Environment } from '../config/env.js';
import type { DatabaseConnection } from '../db/client.js';
import { createMailProvider, type MailProvider } from '../mail/provider.js';
import { LoginAttemptGuard } from '../modules/auth/login-attempts.js';
import { registerAuthRoutes } from '../modules/auth/routes.js';
import { AuthService, prepareAuthenticationTimingDefense } from '../modules/auth/service.js';
import {
  DevelopmentInquiryRepository,
  PostgresInquiryRepository,
  type InquiryRepository,
} from '../modules/inquiries/repository.js';
import { registerInquiryRoutes } from '../modules/inquiries/routes.js';
import { TurnstileVerifier, type HumanVerifier } from '../security/turnstile.js';

type Dependencies = {
  database: DatabaseConnection;
  mail?: MailProvider;
  inquiryRepository?: InquiryRepository;
  humanVerifier?: HumanVerifier;
};

const mutatingMethods = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);
const allowedCorsMethods = new Set(['GET', 'POST']);
const allowedCorsHeaders = new Set(['content-type', 'x-requested-with']);

function isJsonContentType(value: string | undefined): boolean {
  return value?.split(';', 1)[0]?.trim().toLowerCase() === 'application/json';
}

function productionLogger(environment: Environment) {
  if (environment.NODE_ENV === 'development') {
    return {
      transport: {
        target: 'pino-pretty',
        options: { colorize: true, translateTime: 'SYS:standard', ignore: 'pid,hostname' },
      },
    };
  }
  return {
    level: environment.NODE_ENV === 'test' ? 'silent' : 'info',
    redact: {
      paths: [
        'req.headers.authorization',
        'req.headers.cookie',
        'res.headers.set-cookie',
        'password',
        '*.password',
        'turnstileToken',
        '*.turnstileToken',
        'DATABASE_URL',
        'SESSION_SECRET',
        'TURNSTILE_SECRET_KEY',
        'MAIL_API_KEY',
      ],
      censor: '[REDACTED]',
    },
  };
}

export function createApp(environment: Environment, dependencies: Dependencies): FastifyInstance {
  const app = Fastify<RawServerDefault>({
    logger: productionLogger(environment),
    logController: new LogController({ disableRequestLogging: true }),
    bodyLimit: 16 * 1024,
    requestIdHeader: false,
    genReqId: () => randomUUID(),
    trustProxy: 'loopback',
  });
  const logSecret = environment.SESSION_SECRET ?? 'local-development-log-fingerprint-secret';
  const clientFingerprint = (ip: string) => createHmac('sha256', logSecret).update(ip).digest('base64url').slice(0, 16);
  const expectedProductionHost = new URL(environment.CORS_ORIGIN).host.toLowerCase();

  app.addHook('onReady', prepareAuthenticationTimingDefense);

  void app.register(cookie, { hook: 'onRequest' });
  void app.register(rateLimit, {
    global: true,
    max: 120,
    timeWindow: '1 minute',
    keyGenerator: (request) => request.ip,
    errorResponseBuilder: () => ({
      error: { code: 'RATE_LIMITED', message: 'Zu viele Anfragen. Bitte versuchen Sie es später erneut.' },
    }),
  });

  app.addHook('onRequest', async (request, reply) => {
    reply
      .header('X-Request-Id', request.id)
      .header('X-Content-Type-Options', 'nosniff')
      .header('Referrer-Policy', 'no-referrer')
      .header(
        'Permissions-Policy',
        'accelerometer=(), autoplay=(), camera=(), display-capture=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), publickey-credentials-get=(), usb=()',
      )
      .header('X-Frame-Options', 'DENY')
      .header('X-Permitted-Cross-Domain-Policies', 'none')
      .header('Cross-Origin-Opener-Policy', 'same-origin')
      .header('Cross-Origin-Resource-Policy', 'same-origin')
      .header('Cross-Origin-Embedder-Policy', 'require-corp')
      .header('Cache-Control', 'no-store')
      .header(
        'Content-Security-Policy',
        "default-src 'none'; frame-ancestors 'none'; base-uri 'none'; form-action 'none'",
      );

    if (!request.url.startsWith('/api/')) return;
    if (environment.NODE_ENV === 'production' && request.headers.host?.toLowerCase() !== expectedProductionHost) {
      return reply
        .code(421)
        .send({ error: { code: 'MISDIRECTED_REQUEST', message: 'Die Anfrage konnte nicht verarbeitet werden.' } });
    }
    const origin = request.headers.origin;
    if (origin === environment.CORS_ORIGIN) {
      reply
        .header('Access-Control-Allow-Origin', environment.CORS_ORIGIN)
        .header('Access-Control-Allow-Credentials', 'true')
        .header('Vary', 'Origin');
    }

    if (request.method === 'OPTIONS') {
      const requestedMethod = request.headers['access-control-request-method']?.toUpperCase();
      const requestedHeaders = (request.headers['access-control-request-headers'] ?? '')
        .split(',')
        .map((header) => header.trim().toLowerCase())
        .filter(Boolean);
      if (
        origin !== environment.CORS_ORIGIN ||
        !requestedMethod ||
        !allowedCorsMethods.has(requestedMethod) ||
        requestedHeaders.some((header) => !allowedCorsHeaders.has(header))
      ) {
        return reply
          .code(403)
          .send({ error: { code: 'CORS_REJECTED', message: 'Die Anfrage konnte nicht verarbeitet werden.' } });
      }
      reply
        .header('Access-Control-Allow-Methods', 'GET, POST')
        .header('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With')
        .header('Access-Control-Max-Age', '600')
        .code(204)
        .send();
      return reply;
    }

    if (mutatingMethods.has(request.method)) {
      const fetchSite = request.headers['sec-fetch-site'];
      if (origin !== environment.CORS_ORIGIN || (fetchSite && fetchSite !== 'same-origin')) {
        return reply
          .code(403)
          .send({ error: { code: 'CSRF_REJECTED', message: 'Die Anfrage konnte nicht verarbeitet werden.' } });
      }
      if (request.headers['x-requested-with'] !== 'XMLHttpRequest') {
        return reply
          .code(403)
          .send({ error: { code: 'CSRF_REJECTED', message: 'Die Anfrage konnte nicht verarbeitet werden.' } });
      }
      if (!isJsonContentType(request.headers['content-type'])) {
        return reply
          .code(415)
          .send({ error: { code: 'UNSUPPORTED_MEDIA_TYPE', message: 'Der Inhaltstyp wird nicht unterstützt.' } });
      }
    }
  });

  app.addHook('onResponse', async (request, reply) => {
    const event = {
      event: 'request_completed',
      requestId: request.id,
      method: request.method,
      route: request.routeOptions.url ?? 'unmatched',
      statusCode: reply.statusCode,
      elapsedMs: Math.round(reply.elapsedTime),
      client: clientFingerprint(request.ip),
    };
    if ([401, 403, 421, 429].includes(reply.statusCode)) request.log.warn(event, 'security_event');
    else request.log.info(event, 'request_completed');
  });

  app.setNotFoundHandler((request, reply) =>
    reply.code(404).send({ error: { code: 'NOT_FOUND', message: 'Die angeforderte Ressource wurde nicht gefunden.' } }),
  );
  app.setErrorHandler((error, request, reply) => {
    const failure = error instanceof Error ? error : new Error('Unknown request failure');
    const statusCode = 'statusCode' in failure && typeof failure.statusCode === 'number' ? failure.statusCode : 500;
    const errorCode = 'code' in failure && typeof failure.code === 'string' ? failure.code : undefined;
    if (statusCode >= 500) {
      request.log.error(
        {
          event: 'request_failed',
          requestId: request.id,
          route: request.routeOptions.url ?? 'unmatched',
          errorType: failure.name,
          errorCode,
        },
        'request_failed',
      );
    }
    if (statusCode === 400)
      return reply.code(400).send({ error: { code: 'BAD_REQUEST', message: 'Die Anfrage ist ungültig.' } });
    if (statusCode === 413)
      return reply.code(413).send({ error: { code: 'PAYLOAD_TOO_LARGE', message: 'Die Anfrage ist zu groß.' } });
    if (statusCode === 415)
      return reply
        .code(415)
        .send({ error: { code: 'UNSUPPORTED_MEDIA_TYPE', message: 'Der Inhaltstyp wird nicht unterstützt.' } });
    if (statusCode === 429)
      return reply
        .code(429)
        .send({ error: { code: 'RATE_LIMITED', message: 'Zu viele Anfragen. Bitte versuchen Sie es später erneut.' } });
    return reply
      .code(500)
      .send({ error: { code: 'INTERNAL_ERROR', message: 'Die Anfrage konnte nicht verarbeitet werden.' } });
  });

  app.get('/health', { config: { rateLimit: false } }, async () => ({ data: { status: 'ok' } }));
  const repository =
    dependencies.inquiryRepository ??
    (dependencies.database.db
      ? new PostgresInquiryRepository(dependencies.database.db)
      : new DevelopmentInquiryRepository());
  const humanVerifier = dependencies.humanVerifier ?? new TurnstileVerifier(environment);
  const sessionSecret = environment.SESSION_SECRET ?? 'local-development-session-secret-not-for-production';
  registerInquiryRoutes(app, {
    repository,
    turnstile: humanVerifier,
    mail: dependencies.mail ?? createMailProvider(environment),
  });
  registerAuthRoutes(
    app,
    new AuthService(dependencies.database.db, sessionSecret),
    environment,
    humanVerifier,
    new LoginAttemptGuard(sessionSecret),
  );
  return app;
}
