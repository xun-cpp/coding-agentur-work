import assert from 'node:assert/strict';
import { test } from 'node:test';
import { currency, initialPos, posReducer, products, totalCents } from '../src/components/home/pos-model.ts';

test('prices and quantities use integer cents', () => {
  assert.equal(totalCents({ cappuccino: 2, water: 1 }), 1120);
  assert.equal(totalCents({ espresso: 3, croissant: 1 }), 1300);
  assert.equal(totalCents({}), 0);
  for (const product of products) assert.ok(Number.isSafeInteger(product.cents));
});

test('an empty basket cannot be charged', () => {
  assert.equal(posReducer(initialPos, { type: 'pay' }), initialPos);
  assert.equal(posReducer(initialPos, { type: 'approve' }), initialPos);
  assert.equal(posReducer(initialPos, { type: 'receipt' }), initialPos);
});

test('add and remove preserve unrelated items and initial state', () => {
  const coffee = posReducer(initialPos, { type: 'add', id: 'cappuccino' });
  const basket = posReducer(coffee, { type: 'add', id: 'water' });
  const withoutCoffee = posReducer(basket, { type: 'remove', id: 'cappuccino' });
  assert.deepEqual(withoutCoffee.basket, { water: 1 });
  assert.deepEqual(initialPos.basket, {});
  assert.deepEqual(coffee.basket, { cappuccino: 1 });
  assert.deepEqual(posReducer(withoutCoffee, { type: 'remove', id: 'cappuccino' }), withoutCoffee);
});

test('quantities are capped at 20 and never negative', () => {
  let state = initialPos;
  for (let i = 0; i < 25; i++) state = posReducer(state, { type: 'add', id: 'espresso' });
  assert.equal(state.basket.espresso, 20);
  for (let i = 0; i < 25; i++) state = posReducer(state, { type: 'remove', id: 'espresso' });
  assert.deepEqual(state.basket, {});
});

test('payment is ordered, immutable while processing, and cannot be repeated', () => {
  const basket = posReducer(initialPos, { type: 'add', id: 'water' });
  const pending = posReducer(basket, { type: 'pay' });
  assert.equal(pending.phase, 'payment');
  assert.equal(posReducer(pending, { type: 'pay' }), pending);
  assert.equal(posReducer(pending, { type: 'add', id: 'espresso' }), pending);
  assert.equal(posReducer(pending, { type: 'remove', id: 'water' }), pending);
  const approved = posReducer(pending, { type: 'approve' });
  const receipt = posReducer(approved, { type: 'receipt' });
  assert.equal(receipt.phase, 'receipt');
  assert.equal(totalCents(receipt.basket), 280);
  assert.equal(posReducer(receipt, { type: 'pay' }), receipt);
});

test('a new order after a receipt starts fresh', () => {
  const receipt = posReducer(initialPos, { type: 'frame', frame: 6 });
  const next = posReducer(receipt, { type: 'add', id: 'croissant' });
  assert.deepEqual(next, { basket: { croissant: 1 }, phase: 'cart' });
  assert.deepEqual(posReducer(next, { type: 'reset' }), initialPos);
});

test('autoplay loops deterministically through cart, payment and receipt', () => {
  const phases = Array.from({ length: 8 }, (_, frame) => posReducer(initialPos, { type: 'frame', frame }).phase);
  assert.deepEqual(phases, ['cart', 'cart', 'cart', 'cart', 'payment', 'approved', 'receipt', 'cart']);
  for (const frame of [3, 4, 5, 6])
    assert.equal(totalCents(posReducer(initialPos, { type: 'frame', frame }).basket), 1120);
});

test('localized totals keep two decimal places', () => {
  assert.match(currency(1120), /11,20/);
  assert.match(currency(0), /0,00/);
  assert.match(currency(1120, 'en'), /11\.20/);
});
