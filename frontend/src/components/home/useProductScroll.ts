import { useEffect, useRef, useState } from 'react';
import { productFrame, storyProgress, type ProductFrame } from './product-story-model';

export function useProductScroll() {
  const root = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const scene = useRef<HTMLDivElement>(null);
  const [available, setAvailable] = useState(false);
  const [frame, setFrame] = useState<ProductFrame>(() => productFrame(0));
  const [nudge, setNudge] = useState(0);

  useEffect(() => {
    const element = root.current;
    const sticky = panel.current;
    const stage = viewport.current;
    if (!element || !sticky || !stage) return;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    let animationFrame = 0;
    let lastHeight = 0;
    let lastScale = '';
    let lastNudged = -1;
    let lastProgress = -1;
    let measureNeeded = true;
    let enabled = false;
    let panelHeight = 0;
    let sectionHeight = 0;
    let pinTop = 0;

    const draw = () => {
      animationFrame = 0;
      if (document.hidden) return;
      if (measureNeeded) {
        measureNeeded = false;
        enabled = !reduced.matches && innerHeight >= 480;
        setAvailable(enabled);
        element.dataset.enhanced = String(enabled);
        panelHeight = sticky.offsetHeight;
        if (panelHeight !== lastHeight) {
          element.style.setProperty('--story-panel-height', `${panelHeight}px`);
          lastHeight = panelHeight;
        }

        const stageStyle = getComputedStyle(stage);
        const availableHeight = Math.max(
          0,
          stage.clientHeight - parseFloat(stageStyle.paddingTop) - parseFloat(stageStyle.paddingBottom),
        );
        const naturalHeight = scene.current?.offsetHeight ?? 0;
        const scale = (enabled && naturalHeight > 0 ? Math.min(1, availableHeight / naturalHeight) : 1).toFixed(4);
        if (lastScale !== scale) {
          element.style.setProperty('--demo-scale', scale);
          lastScale = scale;
        }
        pinTop = parseFloat(getComputedStyle(sticky).top) || 0;
        sectionHeight = element.offsetHeight;
      }

      if (!enabled) return;
      const progress = storyProgress(element.getBoundingClientRect().top, pinTop, sectionHeight, panelHeight);
      if (progress === lastProgress) return;
      lastProgress = progress;
      const next = productFrame(progress);
      element.style.setProperty('--story-progress', progress.toFixed(4));
      element.style.setProperty('--intro-opacity', next.introOpacity.toFixed(4));
      element.style.setProperty('--intro-depth', next.introDepth.toFixed(4));
      element.style.setProperty('--demo-opacity', next.demoOpacity.toFixed(4));
      element.style.setProperty('--demo-reveal', next.demoReveal.toFixed(4));
      element.style.setProperty('--demo-exit', next.demoExit.toFixed(4));
      element.style.setProperty('--outro-opacity', next.outroOpacity.toFixed(4));
      setFrame((current) =>
        current.chapter === next.chapter &&
        current.titleChapter === next.titleChapter &&
        current.step === next.step &&
        current.phase === next.phase
          ? current
          : next,
      );
      if (lastNudged < 0 || Math.abs(progress - lastNudged) > 0.008) {
        lastNudged = progress;
        setNudge((value) => value + 1);
      }
    };
    const request = () => {
      if (!animationFrame) animationFrame = requestAnimationFrame(draw);
    };
    const measure = () => {
      measureNeeded = true;
      request();
    };
    const resize = new ResizeObserver(measure);
    resize.observe(element);
    resize.observe(sticky);
    resize.observe(stage);
    if (scene.current) resize.observe(scene.current);
    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', measure, { passive: true });
    window.addEventListener('pageshow', measure);
    reduced.addEventListener('change', measure);
    document.addEventListener('visibilitychange', measure);
    draw();
    return () => {
      cancelAnimationFrame(animationFrame);
      resize.disconnect();
      window.removeEventListener('scroll', request);
      window.removeEventListener('resize', measure);
      window.removeEventListener('pageshow', measure);
      reduced.removeEventListener('change', measure);
      document.removeEventListener('visibilitychange', measure);
    };
  }, []);

  return { root, panel, viewport, scene, frame, available, nudge };
}
