export const productChapters = [
  { key: 'pos', length: 8, stops: [0, 0.12, 0.26, 0.4, 0.56, 0.72, 0.84] },
  { key: 'web', length: 6, stops: [0, 0.17, 0.34, 0.51, 0.7, 0.86] },
  { key: 'app', length: 7, stops: [0, 0.12, 0.25, 0.38, 0.53, 0.68, 0.83] },
  { key: 'portal', length: 5, stops: [0, 0.2, 0.4, 0.62, 0.82] },
] as const;

export const storyTiming = { intro: 2.4, reveal: 2, transition: 2, outro: 3.5 } as const;
const chapterLead = storyTiming.intro + storyTiming.reveal;
export const productStoryLength = productChapters.reduce<number>(
  (total, chapter) => total + chapterLead + chapter.length + storyTiming.transition,
  storyTiming.outro,
);

export type ProductPhase = 'intro' | 'reveal' | 'demo' | 'transition' | 'outro';
export type ProductFrame = {
  chapter: number;
  titleChapter: number;
  step: number;
  phase: ProductPhase;
  progress: number;
  introOpacity: number;
  introDepth: number;
  demoOpacity: number;
  demoReveal: number;
  demoExit: number;
  outroOpacity: number;
};

const clamp = (value: number) => Math.min(1, Math.max(0, Number.isFinite(value) ? value : 0));
const smooth = (value: number) => {
  const bounded = clamp(value);
  return bounded * bounded * (3 - 2 * bounded);
};

export function productFrame(progress: number): ProductFrame {
  const position = clamp(progress) * productStoryLength;
  let start = 0;
  for (let index = 0; index < productChapters.length; index++) {
    const chapter = productChapters[index];
    const length = chapterLead + chapter.length + storyTiming.transition;
    const last = index === productChapters.length - 1;
    if (position < start + length || last) {
      const local = Math.max(0, position - start);
      const demoProgress = clamp((local - chapterLead) / chapter.length);
      const reveal = smooth((local - storyTiming.intro) / storyTiming.reveal);
      const exit = smooth((local - chapterLead - chapter.length) / storyTiming.transition);
      const leaving = local >= chapterLead + chapter.length;
      let step = 0;
      for (let stop = 1; stop < chapter.stops.length; stop++) {
        if (demoProgress >= chapter.stops[stop]) step = stop;
      }
      return {
        chapter: index,
        titleChapter: leaving && !last ? index + 1 : index,
        step,
        phase: leaving
          ? last
            ? 'outro'
            : 'transition'
          : local < storyTiming.intro
            ? 'intro'
            : local < chapterLead
              ? 'reveal'
              : 'demo',
        progress: clamp(local / length),
        introOpacity: leaving ? (last ? 0 : smooth((exit - 0.15) / 0.85)) : 1 - smooth(reveal),
        introDepth: leaving ? 1 - exit : reveal,
        demoOpacity: leaving ? 1 - smooth(exit) : smooth(reveal),
        demoReveal: reveal,
        demoExit: exit,
        outroOpacity: last && leaving ? smooth((exit - 0.15) / 0.85) : 0,
      };
    }
    start += length;
  }
  throw new Error('The product story must have at least one chapter.');
}

export function storyProgress(sectionTop: number, pinTop: number, sectionHeight: number, panelHeight: number) {
  const distance = sectionHeight - panelHeight;
  if (!Number.isFinite(distance) || distance <= 0) return 0;
  return clamp((pinTop - sectionTop) / distance);
}

export const appointmentTimes = ['10:00', '11:30', '14:00'] as const;
export type AppointmentTime = (typeof appointmentTimes)[number];
export type WebsiteState = { booking: boolean; time: AppointmentTime; confirmed: boolean };
export function websitePreview(step: number): WebsiteState {
  return { booking: step >= 2, time: step >= 3 ? '11:30' : '10:00', confirmed: step >= 4 };
}

export type AppState = {
  done: readonly number[];
  view: 'tasks' | 'calendar';
  time: AppointmentTime;
  confirmed: boolean;
};
export function appPreview(step: number): AppState {
  return {
    done: [0, 1, 2].slice(0, Math.min(3, Math.max(0, step))),
    view: step >= 4 ? 'calendar' : 'tasks',
    time: step >= 5 ? '11:30' : '10:00',
    confirmed: step >= 6,
  };
}

export type PortalState = { period: number; approved: boolean };
export function portalPreview(step: number): PortalState {
  return { period: Math.min(2, Math.max(0, step)), approved: step >= 3 };
}
