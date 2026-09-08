import { describe, expect, it } from 'vitest';
import { readEnvironment } from '../src/config/env.js';

const productionEnvironment = {
  NODE_ENV: 'production',
  PORT: '3001',
  DATABASE_URL: ['postgresql://runtime', 'test-password@127.0.0.1:5432/reference_application'].join(':'),
  SESSION_SECRET: 's'.repeat(48),
  TURNSTILE_SECRET_KEY: `test-${'t'.repeat(24)}`,
  TURNSTILE_EXPECTED_HOSTNAME: 'reference.example.invalid',
  MAIL_PROVIDER: 'resend',
  MAIL_FROM: 'service@example.invalid',
  MAIL_API_KEY: `test-${'m'.repeat(24)}`,
  MAIL_INTERNAL_TO: 'contact@example.invalid',
  CORS_ORIGIN: 'https://reference.example.invalid',
} as const;

describe('environment trust boundary', () => {
  it('accepts the complete production configuration', () => {
    const environment = readEnvironment(productionEnvironment);
    expect(environment.NODE_ENV).toBe('production');
    expect(environment.CORS_ORIGIN).toBe('https://reference.example.invalid');
  });

  it.each([
    { ...productionEnvironment, DATABASE_URL: 'https://runtime:secret@example.test/database' },
    { ...productionEnvironment, DATABASE_URL: 'postgresql://127.0.0.1/database' },
    { ...productionEnvironment, CORS_ORIGIN: 'http://reference.example.invalid' },
    { ...productionEnvironment, CORS_ORIGIN: 'https://reference.example.invalid/path' },
    { ...productionEnvironment, TURNSTILE_EXPECTED_HOSTNAME: 'https://reference.example.invalid' },
    { ...productionEnvironment, TURNSTILE_SECRET_KEY: 'too-short' },
    { ...productionEnvironment, SESSION_SECRET: 'too-short' },
    { ...productionEnvironment, MAIL_PROVIDER: 'development' },
    { ...productionEnvironment, ALLOW_PUBLIC_REGISTRATION: 'true' },
  ])('rejects unsafe production configuration', (source) => {
    expect(() => readEnvironment(source)).toThrow();
  });

  it('never includes a supplied secret value in configuration errors', () => {
    expect(() =>
      readEnvironment({
        ...productionEnvironment,
        DATABASE_URL: 'https://runtime:do-not-print-me@example.test/database',
      }),
    ).toThrowError(expect.not.stringContaining('do-not-print-me'));
  });
});
