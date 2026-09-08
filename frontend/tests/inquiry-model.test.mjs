import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readPayload, validate } from '../src/features/contact/inquiry-model.ts';
import { inquirySchema } from '../../backend/src/modules/inquiries/schema.ts';

function form(overrides = {}) {
  const values = {
    company: '  Musterbetrieb  ',
    name: '  Max   Mustermann  ',
    email: 'MAX@example.test',
    phone: '',
    projectType: 'Website',
    budget: '',
    message: 'Bitte erstellen Sie uns eine neue Website.',
    privacyAccepted: 'true',
    website: '',
    ...overrides,
  };
  const result = new FormData();
  for (const [name, value] of Object.entries(values)) result.set(name, value);
  return result;
}

test('development submissions omit empty tokens and satisfy the API schema', () => {
  const payload = readPayload(form(), '');
  assert.equal(Object.hasOwn(payload, 'turnstileToken'), false);
  assert.equal(payload.company, 'Musterbetrieb');
  assert.equal(payload.name, 'Max Mustermann');
  assert.equal(payload.email, 'max@example.test');
  assert.deepEqual(validate(payload), {});
  assert.equal(inquirySchema.safeParse(payload).success, true);
});

test('verified submissions send the complete single-use token', () => {
  const token = 'test-only-contact-token';
  const payload = readPayload(form(), token);
  assert.equal(payload.turnstileToken, token);
  assert.equal(inquirySchema.safeParse(payload).success, true);
});

test('phone errors are shown locally instead of consuming verification and failing at the API', () => {
  for (const phone of ['call me', '+49 <123>', '+49\r\nBcc: someone@example.test']) {
    const payload = readPayload(form({ phone }), 'test-only-token');
    assert.equal(validate(payload).phone, 'phone');
    assert.equal(inquirySchema.safeParse(payload).success, false);
  }
  for (const phone of ['', '+49 (5241) 123-456', '05241 / 12345']) {
    const payload = readPayload(form({ phone }), 'test-only-token');
    assert.deepEqual(validate(payload), {});
    assert.equal(inquirySchema.safeParse(payload).success, true);
  }
});

test('the compact form can submit without a budget field', () => {
  const values = form();
  values.delete('budget');
  const payload = readPayload(values, 'test-only-token');
  assert.deepEqual(validate(payload), {});
  assert.equal(inquirySchema.safeParse(payload).success, true);
});

test('invalid required fields are identified before any API request', () => {
  const payload = readPayload(
    form({ company: ' ', name: ' ', email: 'bad', projectType: '', message: ' ', privacyAccepted: '' }),
    '',
  );
  assert.deepEqual(validate(payload), {
    company: 'required',
    name: 'name',
    email: 'email',
    projectType: 'projectType',
    message: 'message',
    privacyAccepted: 'privacy',
  });
});
