const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
const motionScenes = [...document.querySelectorAll<HTMLElement>('[data-motion]')];
const revealElements = [...document.querySelectorAll<HTMLElement>('.reveal')];
let frameId = 0;

function updateScenes() {
  frameId = 0;
  const viewportHeight = window.innerHeight;
  const reduced = motionPreference.matches;
  const measurements = motionScenes.map((element) => ({ element, rect: element.getBoundingClientRect() }));
  for (const { element, rect } of measurements) {
    const progress = Math.min(1, Math.max(0, (viewportHeight - rect.top) / (viewportHeight * 0.8)));
    const travel = Math.min(1, Math.max(0, -rect.top / Math.max(rect.height, 1)));
    element.style.setProperty('--enter', reduced ? '1' : progress.toFixed(4));
    element.style.setProperty('--travel', reduced ? '0' : travel.toFixed(4));
    element.classList.toggle('is-visible', !document.hidden && rect.bottom > 0 && rect.top < viewportHeight);
  }
}

function requestSceneUpdate() {
  if (!frameId) frameId = requestAnimationFrame(updateScenes);
}

if ('IntersectionObserver' in window && !motionPreference.matches) {
  const reveals = new IntersectionObserver(
    (entries, observer) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-in');
        observer.unobserve(entry.target);
      }
    },
    { threshold: 0.04, rootMargin: '0px 0px 24px 0px' },
  );
  for (const element of revealElements) {
    if (element.getBoundingClientRect().top < innerHeight) element.classList.add('is-in');
    else {
      element.classList.add('is-waiting');
      reveals.observe(element);
    }
  }
}

window.addEventListener('scroll', requestSceneUpdate, { passive: true });
window.addEventListener('resize', requestSceneUpdate, { passive: true });
window.addEventListener('pageshow', requestSceneUpdate);
document.addEventListener('visibilitychange', requestSceneUpdate);
motionPreference.addEventListener('change', () => {
  if (motionPreference.matches) revealElements.forEach((element) => element.classList.add('is-in'));
  requestSceneUpdate();
});

if ('ResizeObserver' in window) {
  const resizeObserver = new ResizeObserver(requestSceneUpdate);
  motionScenes.forEach((element) => resizeObserver.observe(element));
}
updateScenes();

for (const element of document.querySelectorAll<HTMLElement>('[data-tilt]')) {
  let tiltFrame = 0;
  let x = 0;
  let y = 0;
  const draw = () => {
    tiltFrame = 0;
    element.style.setProperty('--tilt-x', x.toFixed(3));
    element.style.setProperty('--tilt-y', y.toFixed(3));
  };
  element.addEventListener(
    'pointermove',
    (event) => {
      if (motionPreference.matches || event.pointerType !== 'mouse') return;
      const rect = element.getBoundingClientRect();
      x = (event.clientX - rect.left) / rect.width - 0.5;
      y = (event.clientY - rect.top) / rect.height - 0.5;
      if (!tiltFrame) tiltFrame = requestAnimationFrame(draw);
    },
    { passive: true },
  );
  element.addEventListener('pointerleave', () => {
    x = 0;
    y = 0;
    if (!tiltFrame) tiltFrame = requestAnimationFrame(draw);
  });
}
