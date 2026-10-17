// Text rendered as dots. Samples an element's own text with its computed
// font into a dot grid and draws it on a canvas laid over the element; the
// real text stays in the DOM for assistive tech and turns transparent while
// the dots are shown. Used by the hero wordmark, the header menu (current
// item) and the section headings. SDD 4.2, 4.6.

import { assemble, burst, dotsFromMask, type MaskPoint } from './dots';

export type Sample = { points: MaskPoint[]; width: number; height: number };

// Renders `el`'s text off screen with its computed font and samples it.
export function sampleText(el: HTMLElement, spacing: number): Sample {
  const style = getComputedStyle(el);
  const size = parseFloat(style.fontSize);
  const width = Math.ceil(el.offsetWidth) + spacing;
  const height = Math.ceil(el.offsetHeight) + spacing;
  if (width <= 0 || height <= 0) return { points: [], width, height };
  const off = document.createElement('canvas');
  off.width = width;
  off.height = height;
  const ctx = off.getContext('2d');
  if (!ctx) return { points: [], width, height };
  ctx.font = `${style.fontWeight} ${size}px ${style.fontFamily}`;
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = '#fff';
  // The baseline sits about 0.8em below the top of the line box for this face.
  const lineHeight = parseFloat(style.lineHeight) || size;
  ctx.fillText(el.textContent?.trim() ?? '', 0, (lineHeight - size) / 2 + size * 0.8);
  const data = ctx.getImageData(0, 0, width, height).data;
  const alpha = new Uint8ClampedArray(width * height);
  for (let i = 0; i < width * height; i++) alpha[i] = data[i * 4 + 3] ?? 0;
  return { points: dotsFromMask(alpha, width, height, spacing), width, height };
}

export type DotTextOptions = {
  spacing: number;
  color: () => string;
  // 'always': dots from the start. 'visible': while the closest [data-reveal]
  // ancestor has is-visible. 'current': while the closest <a> has aria-current.
  trigger: 'always' | 'visible' | 'current';
  // seconds over which per-dot delays are spread
  spread?: number;
};

export function mountDotText(el: HTMLElement, options: DotTextOptions): void {
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canvas = document.createElement('canvas');
  canvas.className = 'dot-text-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  el.classList.add('has-dot-text');
  el.appendChild(canvas);
  const context = canvas.getContext('2d');
  if (!context) return;
  const spread = options.spread ?? 0.5;

  let sample: Sample = { points: [], width: 0, height: 0 };
  let dpr = 1;
  let frame = 0;
  let start = 0;
  let active = false;

  function resample(): void {
    sample = sampleText(el, options.spacing);
    dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.round(sample.width * dpr);
    canvas.height = Math.round(sample.height * dpr);
    canvas.style.width = `${sample.width}px`;
    canvas.style.height = `${sample.height}px`;
    context!.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function draw(seconds: number): boolean {
    const { width, height, points } = sample;
    const cx = width / 2;
    const cy = height / 2;
    context!.clearRect(0, 0, width, height);
    context!.fillStyle = options.color();
    let settled = true;
    for (const point of points) {
      const p = reduceMotion ? 1 : assemble(seconds, point.delay * spread);
      if (p < 1) settled = false;
      if (p <= 0) continue;
      const scale = burst(p);
      const grow = Math.min(1, p * 1.4);
      const px = cx + (point.x + point.sx * (1 - p) - cx) * scale;
      const py = cy + (point.y + point.sy * (1 - p) - cy) * scale;
      context!.globalAlpha = grow;
      context!.beginPath();
      context!.arc(px, py, options.spacing * 0.42 * grow, 0, Math.PI * 2);
      context!.fill();
    }
    context!.globalAlpha = 1;
    return settled;
  }

  function loop(now: number): void {
    const settled = draw((now - start) / 1000);
    if (!settled) frame = requestAnimationFrame(loop);
  }

  function show(): void {
    if (active) return;
    active = true;
    el.classList.add('is-dots');
    resample();
    cancelAnimationFrame(frame);
    start = performance.now();
    if (reduceMotion) draw(0);
    else frame = requestAnimationFrame(loop);
  }

  function hide(): void {
    if (!active) return;
    active = false;
    el.classList.remove('is-dots');
    cancelAnimationFrame(frame);
    context!.clearRect(0, 0, sample.width, sample.height);
  }

  function sync(): void {
    if (options.trigger === 'always') {
      show();
      return;
    }
    const host =
      options.trigger === 'current'
        ? el.closest('a')
        : (el.closest<HTMLElement>('[data-reveal]') ?? el);
    const on =
      options.trigger === 'current'
        ? host?.getAttribute('aria-current') === 'true'
        : (host?.classList.contains('is-visible') ?? true);
    if (on) show();
    else hide();
  }

  const watched =
    options.trigger === 'current'
      ? el.closest('a')
      : options.trigger === 'visible'
        ? (el.closest<HTMLElement>('[data-reveal]') ?? el)
        : null;
  if (watched) {
    new MutationObserver(sync).observe(watched, {
      attributes: true,
      attributeFilter: ['class', 'aria-current'],
    });
  }

  document.fonts?.ready.then(() => {
    if (active) {
      resample();
      draw(1e9);
    }
  });
  new ResizeObserver(() => {
    if (active) {
      resample();
      draw(1e9);
    }
  }).observe(el);

  sync();
}
