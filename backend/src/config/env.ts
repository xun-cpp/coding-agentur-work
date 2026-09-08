import { z } from 'zod';

const databaseUrl = z
  .string()
  .url()
  .superRefine((value, context) => {
    const url = new URL(value);
    if (!['postgres:', 'postgresql:'].includes(url.protocol)) {
      context.addIssue({ code: 'custom', message: 'DATABASE_URL muss PostgreSQL verwenden.' });
    }
    if (!url.username || !url.password || !url.hostname || !url.pathname.slice(1)) {
      context.addIssue({ code: 'custom', message: 'DATABASE_URL ist unvollständig.' });
    }
  });

const webOrigin = z
  .string()
  .url()
  .superRefine((value, context) => {
    const url = new URL(value);
    if (
      !['http:', 'https:'].includes(url.protocol) ||
      url.username ||
      url.password ||
      url.search ||
      url.hash ||
      (url.pathname !== '' && url.pathname !== '/')
    ) {
      context.addIssue({ code: 'custom', message: 'CORS_ORIGIN muss ein exakter Web-Origin sein.' });
    }
  });

const turnstileKey = z.string().regex(/^[A-Za-z0-9._-]{20,256}$/);

const environmentSchema = z
  .object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    PORT: z.coerce.number().int().min(1).max(65535).default(3001),
    DATABASE_URL: databaseUrl.optional(),
    SESSION_SECRET: z.string().min(32).optional(),
    TURNSTILE_SECRET_KEY: turnstileKey.optional(),
    TURNSTILE_EXPECTED_HOSTNAME: z
      .string()
      .regex(/^(?=.{1,253}$)(?!-)(?:[a-z0-9-]+\.)*[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/)
      .optional(),
    MAIL_PROVIDER: z.enum(['development', 'resend']).default('development'),
    MAIL_FROM: z.string().email().default('service@example.invalid'),
    MAIL_API_KEY: z.string().min(16).optional(),
    MAIL_INTERNAL_TO: z.string().email().optional(),
    ALLOW_PUBLIC_REGISTRATION: z
      .enum(['true', 'false'])
      .default('false')
      .transform((value) => value === 'true'),
    CORS_ORIGIN: webOrigin.default('http://localhost:4321'),
  })
  .strict();

export type Environment = z.infer<typeof environmentSchema>;
export function readEnvironment(source: NodeJS.ProcessEnv = process.env): Environment {
  const result = environmentSchema.safeParse({
    NODE_ENV: source.NODE_ENV,
    PORT: source.PORT,
    DATABASE_URL: source.DATABASE_URL,
    SESSION_SECRET: source.SESSION_SECRET,
    TURNSTILE_SECRET_KEY: source.TURNSTILE_SECRET_KEY,
    TURNSTILE_EXPECTED_HOSTNAME: source.TURNSTILE_EXPECTED_HOSTNAME,
    MAIL_PROVIDER: source.MAIL_PROVIDER,
    MAIL_FROM: source.MAIL_FROM,
    MAIL_API_KEY: source.MAIL_API_KEY,
    MAIL_INTERNAL_TO: source.MAIL_INTERNAL_TO,
    ALLOW_PUBLIC_REGISTRATION: source.ALLOW_PUBLIC_REGISTRATION,
    CORS_ORIGIN: source.CORS_ORIGIN,
  });
  if (!result.success)
    throw new Error(
      `Ungültige Server-Konfiguration: ${result.error.issues.map((issue) => issue.path.join('.')).join(', ')}`,
    );
  const env = result.data;
  if (env.NODE_ENV === 'production') {
    const missing = [
      !env.DATABASE_URL && 'DATABASE_URL',
      (!env.SESSION_SECRET || env.SESSION_SECRET.length < 48) && 'SESSION_SECRET (mindestens 48 Zeichen)',
      !env.TURNSTILE_SECRET_KEY && 'TURNSTILE_SECRET_KEY',
      !env.TURNSTILE_EXPECTED_HOSTNAME && 'TURNSTILE_EXPECTED_HOSTNAME',
      env.MAIL_PROVIDER !== 'resend' && 'MAIL_PROVIDER=resend',
      !env.MAIL_API_KEY && 'MAIL_API_KEY',
      !env.MAIL_INTERNAL_TO && 'MAIL_INTERNAL_TO',
      env.ALLOW_PUBLIC_REGISTRATION && 'ALLOW_PUBLIC_REGISTRATION=false',
      !env.CORS_ORIGIN.startsWith('https://') && 'CORS_ORIGIN (HTTPS)',
    ].filter(Boolean);
    if (missing.length) throw new Error(`Ungültige Production-Konfiguration: ${missing.join(', ')}.`);
  }
  return env;
}
