import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readTurnstileSiteKey } from '../src/config/turnstile.ts';

test('production rejects missing, truncated and malformed public site keys', () => {
  for (const key of [
    undefined,
    '',
    '  ',
    '0',
    'undefined',
    'null',
    'placeholder',
    'a'.repeat(129),
    'a'.repeat(20) + '<',
  ]) {
    assert.throws(() => readTurnstileSiteKey(key, true), /PUBLIC_TURNSTILE_SITE_KEY/);
  }
});

test('site keys remain strings, including their leading zero and letter case', () => {
  const key = '0x4AAAA-test-only-EXAMPLE';
  assert.equal(readTurnstileSiteKey(` ${key}\n`, true), key);
  assert.equal(readTurnstileSiteKey('1x00000000000000000000AA', true), '1x00000000000000000000AA');
});

test('development permits an absent key, but rejects a supplied invalid key', () => {
  assert.equal(readTurnstileSiteKey(undefined, false), undefined);
  assert.throws(() => readTurnstileSiteKey('0', false));
});
