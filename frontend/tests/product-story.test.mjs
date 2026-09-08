import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  appPreview,
  portalPreview,
  productChapters,
  productFrame,
  productStoryLength,
  storyProgress,
  storyTiming,
  websitePreview,
} from '../src/components/home/product-story-model.ts';

const at = (position) => productFrame(position / productStoryLength);
const lead = storyTiming.intro + storyTiming.reveal;
const chapterLength = (chapter) => lead + chapter.length + storyTiming.transition;
const starts = productChapters.map((_, index) =>
  productChapters.slice(0, index).reduce((sum, chapter) => sum + chapterLength(chapter), 0),
);

test('each product has a readable introduction before the first demo action', () => {
  productChapters.forEach((_, index) => {
    for (const offset of [0.01, storyTiming.intro / 2, storyTiming.intro - 0.01]) {
      const frame = at(starts[index] + offset);
      assert.equal(frame.chapter, index);
      assert.equal(frame.titleChapter, index);
      assert.equal(frame.phase, 'intro');
      assert.equal(frame.step, 0);
      assert.equal(frame.introOpacity, 1);
      assert.equal(frame.demoOpacity, 0);
    }
    const reveal = at(starts[index] + storyTiming.intro + storyTiming.reveal / 2);
    assert.equal(reveal.phase, 'reveal');
    assert.equal(reveal.step, 0);
    assert.ok(reveal.introOpacity > 0 && reveal.introOpacity < 1);
    assert.ok(reveal.demoOpacity > 0 && reveal.demoOpacity < 1);
    assert.ok(Math.abs(reveal.introOpacity + reveal.demoOpacity - 1) < 0.00001);
  });
});

test('every existing demo action runs in order after the text has transformed', () => {
  productChapters.forEach((chapter, index) => {
    chapter.stops.forEach((stop, step) => {
      const frame = at(starts[index] + lead + (stop + 0.00001) * chapter.length);
      assert.equal(frame.phase, 'demo');
      assert.equal(frame.chapter, index);
      assert.equal(frame.step, step);
      assert.equal(frame.demoOpacity, 1);
      assert.equal(frame.introOpacity, 0);
    });
  });
});

test('outgoing demos blend into the next introduction without an empty chapter', () => {
  productChapters.slice(0, -1).forEach((chapter, index) => {
    const transition = at(starts[index] + lead + chapter.length + storyTiming.transition / 2);
    assert.equal(transition.phase, 'transition');
    assert.equal(transition.titleChapter, index + 1);
    assert.equal(transition.step, chapter.stops.length - 1);
    assert.ok(transition.demoOpacity > 0);
    assert.ok(transition.introOpacity > 0);
    const before = at(starts[index + 1] - 0.000001);
    const after = at(starts[index + 1] + 0.000001);
    assert.ok(Math.abs(before.introOpacity - after.introOpacity) < 0.00001);
    assert.equal(before.titleChapter, after.titleChapter);
  });
});

test('the final tailored message has its own hold before leaving the story', () => {
  for (const position of [productStoryLength - storyTiming.outro + 0.001, productStoryLength - 1, productStoryLength]) {
    const frame = at(position);
    assert.equal(frame.phase, 'outro');
    assert.equal(frame.chapter, productChapters.length - 1);
    assert.equal(frame.outroOpacity, 1);
    assert.equal(frame.demoOpacity, 0);
    assert.equal(frame.introOpacity, 0);
  }
});

test('scrolling backwards reproduces the same frames and every blend stays bounded', () => {
  const forwards = Array.from({ length: 1001 }, (_, index) => productFrame(index / 1000));
  for (let index = 1000; index >= 0; index--) {
    const frame = productFrame(index / 1000);
    assert.deepEqual(frame, forwards[index]);
    for (const key of [
      'progress',
      'introOpacity',
      'introDepth',
      'demoOpacity',
      'demoReveal',
      'demoExit',
      'outroOpacity',
    ]) {
      assert.ok(Number.isFinite(frame[key]) && frame[key] >= 0 && frame[key] <= 1, key);
    }
    assert.ok(frame.introOpacity + frame.demoOpacity + frame.outroOpacity > 0.7);
  }
});

test('invalid progress and geometry fail safely; completed stories stay completed', () => {
  for (const value of [NaN, Infinity, -Infinity, -10]) assert.deepEqual(productFrame(value), productFrame(0));
  assert.deepEqual(productFrame(10), productFrame(1));
  assert.equal(storyProgress(200, 80, 1000, 600), 0);
  assert.equal(storyProgress(-120, 80, 1000, 600), 0.5);
  assert.equal(storyProgress(-900, 80, 1000, 600), 1);
  assert.equal(storyProgress(0, 80, 600, 600), 0);
  assert.equal(storyProgress(NaN, 80, 1000, 600), 0);
  assert.equal(storyProgress(0, 80, Infinity, 600), 0);
});

test('booking, app and portal demos retain their complete final states', () => {
  assert.deepEqual(websitePreview(0), { booking: false, time: '10:00', confirmed: false });
  assert.deepEqual(websitePreview(5), { booking: true, time: '11:30', confirmed: true });
  assert.deepEqual(appPreview(6), { done: [0, 1, 2], view: 'calendar', time: '11:30', confirmed: true });
  assert.deepEqual(portalPreview(4), { period: 2, approved: true });
});
