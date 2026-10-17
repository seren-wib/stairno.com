// One card per scroll. The projects section fills the screen; while it is
// pinned, the page-scroll gesture (src/lib/screens.ts) turns one card instead
// of moving the page. Past the last card (or before the first) the gesture
// falls through and the page moves on. Pure DOM, no dependencies. SDD 4.6.
//
// Markup contract (see Projects.astro):
//   [data-slider]                     the section (pinned when its top is at 0)
//     [data-slides] > [data-slide]*   one slide per project
//     button[data-slider-dot][data-index]*

export type Flip = 'next' | 'prev' | 'pass';

// Deltas smaller than this are the tail of a trackpad gesture, not a new one.
const MIN_DELTA = 4;
// px tolerance for "the section sits at the top of the viewport"
const PINNED = 2;

export function clampIndex(index: number, count: number): number {
  if (count <= 0) return 0;
  return Math.min(count - 1, Math.max(0, index));
}

// What a scroll of `deltaY` (positive = down) does on card `current`.
export function flipFor(deltaY: number, current: number, count: number): Flip {
  if (count < 2 || Math.abs(deltaY) < MIN_DELTA) return 'pass';
  if (deltaY > 0) return current < count - 1 ? 'next' : 'pass';
  return current > 0 ? 'prev' : 'pass';
}

export function createSlider(root: HTMLElement): {
  go(index: number): void;
  current(): number;
  consume(direction: 1 | -1): boolean;
} {
  const track = root.querySelector<HTMLElement>('[data-slides]');
  const slides = Array.from(root.querySelectorAll<HTMLElement>('[data-slide]'));
  const dots = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-slider-dot]'));
  const count = slides.length;

  let current = 0;

  function render(): void {
    if (track) track.style.transform = `translateX(${-current * 100}%)`;
    slides.forEach((slide, i) => {
      slide.setAttribute('aria-hidden', i === current ? 'false' : 'true');
      slide.classList.toggle('is-active', i === current);
      if (i === current) slide.removeAttribute('inert');
      else slide.setAttribute('inert', '');
    });
    dots.forEach((dot, i) => {
      dot.setAttribute('aria-selected', i === current ? 'true' : 'false');
      dot.classList.toggle('is-active', i === current);
    });
  }

  function go(index: number): void {
    const next = clampIndex(index, count);
    if (next === current) return;
    current = next;
    render();
  }

  function pinned(): boolean {
    return Math.abs(root.getBoundingClientRect().top) <= PINNED;
  }

  function apply(flip: Flip): void {
    if (flip === 'next') go(current + 1);
    else if (flip === 'prev') go(current - 1);
  }

  // Gate for the page scroll: while the section is pinned, a downward gesture
  // turns to the next card and an upward one to the previous; past either end
  // the gesture is left to the page.
  function consume(direction: 1 | -1): boolean {
    if (!pinned()) return false;
    const flip = flipFor(direction * 100, current, count);
    if (flip === 'pass') return false;
    apply(flip);
    return true;
  }

  dots.forEach((dot) => {
    dot.addEventListener('click', () => go(Number(dot.dataset.index)));
  });

  render();

  return { go, current: () => current, consume };
}
