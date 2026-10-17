// Full-page scrolling. One wheel notch, swipe or arrow key moves the page one
// screen (hero → projects → news → contact → page end); a screen may claim
// the gesture first through a gate, which is how the project slider turns a
// card instead. Pure DOM, no dependencies. SDD 4.6.
//
// Markup contract: every full-height section carries [data-screen].

// Deltas smaller than this are the tail of a trackpad gesture, not a new one.
const MIN_DELTA = 4;
// ms during which further gestures are swallowed after a move
const LOCK = 1000;
// px a finger has to travel before a swipe counts
const SWIPE = 40;

export type Direction = 1 | -1;

// A gate sees the gesture before the page moves; returning true consumes it.
export type Gate = (direction: Direction) => boolean;

export function nearestScreen(tops: readonly number[], scrollY: number): number {
  let best = 0;
  let bestDistance = Infinity;
  tops.forEach((top, index) => {
    const distance = Math.abs(top - scrollY);
    if (distance < bestDistance) {
      best = index;
      bestDistance = distance;
    }
  });
  return best;
}

// Scroll position to move to, or null when there is nowhere to go.
export function targetFor(
  direction: Direction,
  current: number,
  tops: readonly number[],
  maxScroll: number,
  scrollY: number = tops[current] ?? 0,
): number | null {
  const last = tops.length - 1;
  if (last < 0) return null;
  if (direction > 0) {
    if (current < last) return tops[current + 1] ?? null;
    return scrollY < maxScroll - 1 ? maxScroll : null;
  }
  const top = tops[current] ?? 0;
  if (scrollY > top + 1) return top;
  return current > 0 ? (tops[current - 1] ?? null) : null;
}

export function createPageScroll(screens: HTMLElement[], gates: Gate[] = []): void {
  if (screens.length === 0) return;
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let lockedUntil = 0;

  function tops(): number[] {
    return screens.map((screen) => Math.round(screen.getBoundingClientRect().top + window.scrollY));
  }

  function maxScroll(): number {
    return document.documentElement.scrollHeight - window.innerHeight;
  }

  // Moves one screen (or lets a gate take the gesture). Returns false when
  // nothing happened, so a caller may fall back to the browser's own scroll.
  function move(direction: Direction): boolean {
    for (const gate of gates) if (gate(direction)) return true;
    const positions = tops();
    const target = targetFor(
      direction,
      nearestScreen(positions, window.scrollY),
      positions,
      maxScroll(),
      window.scrollY,
    );
    if (target === null) return false;
    window.scrollTo({ top: target, behavior: reduceMotion ? 'auto' : 'smooth' });
    return true;
  }

  function gesture(direction: Direction): boolean {
    const now = performance.now();
    if (now < lockedUntil) return true;
    lockedUntil = now + LOCK;
    return move(direction);
  }

  window.addEventListener(
    'wheel',
    (event) => {
      if (Math.abs(event.deltaY) < MIN_DELTA) return;
      event.preventDefault();
      gesture(event.deltaY > 0 ? 1 : -1);
    },
    { passive: false },
  );

  let touchStart = 0;
  let touchDone = false;
  window.addEventListener(
    'touchstart',
    (event) => {
      touchStart = event.touches[0]?.clientY ?? 0;
      touchDone = false;
    },
    { passive: true },
  );
  window.addEventListener(
    'touchmove',
    (event) => {
      event.preventDefault();
      if (touchDone) return;
      const delta = touchStart - (event.touches[0]?.clientY ?? touchStart);
      if (Math.abs(delta) < SWIPE) return;
      touchDone = true;
      gesture(delta > 0 ? 1 : -1);
    },
    { passive: false },
  );

  window.addEventListener('keydown', (event) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    const target = event.target as HTMLElement | null;
    if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
    const direction: Direction | 0 =
      event.key === 'ArrowDown' || event.key === 'PageDown' || event.key === ' '
        ? 1
        : event.key === 'ArrowUp' || event.key === 'PageUp'
          ? -1
          : 0;
    if (direction === 0) return;
    event.preventDefault();
    gesture(direction);
  });
}
