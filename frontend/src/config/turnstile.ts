export function readTurnstileSiteKey(value: string | undefined, production: boolean): string | undefined {
  const key = value?.trim() || undefined;
  if (!key) {
    if (production) throw new Error('PUBLIC_TURNSTILE_SITE_KEY is required for a production build.');
    return undefined;
  }
  if (!/^[A-Za-z0-9_-]{20,128}$/.test(key)) {
    throw new Error(
      'PUBLIC_TURNSTILE_SITE_KEY has an invalid format. Supply the complete public Cloudflare site key as a quoted string.',
    );
  }
  return key;
}
