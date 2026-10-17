// Halftone dot field for the hero. Pure functions over a normalized
// (0..1, 0..1) field so they can be unit tested; HeroDots.astro samples
// them on a grid and draws circles. SDD 4.2 and 4.6.

export type Step = { x: number; width: number; top: number };

// Four steps on the right half, each occupying a slice of width and
// rising towards the right. `top` is the y (0 = top of field) of the tread.
export const STEPS: readonly Step[] = [
  { x: 0.52, width: 0.12, top: 0.82 },
  { x: 0.64, width: 0.12, top: 0.66 },
  { x: 0.76, width: 0.12, top: 0.5 },
  { x: 0.88, width: 0.12, top: 0.34 },
];

// y of the staircase surface at x; 1 (the floor) where there is no step.
export function stairTop(x: number): number {
  for (const step of STEPS) {
    if (x >= step.x && x < step.x + step.width) return step.top;
  }
  return 1;
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

// Position of the star for a climb progress in 0..1: it hops from the
// centre of the first tread to the centre of the last, hovering above each.
export function starAt(progress: number): { x: number; y: number } {
  const p = clamp01(progress);
  const last = STEPS.length - 1;
  const scaled = p * last;
  const i = Math.min(last, Math.floor(scaled));
  const j = Math.min(last, i + 1);
  const t = scaled - i;
  const eased = t * t * (3 - 2 * t);
  const a = STEPS[i]!;
  const b = STEPS[j]!;
  const ax = a.x + a.width / 2;
  const bx = b.x + b.width / 2;
  const hover = 0.1;
  const x = ax + (bx - ax) * eased;
  // Arc up between treads so the hop reads as a jump.
  const y = a.top - hover + (b.top - a.top) * eased - Math.sin(eased * Math.PI) * 0.06;
  return { x, y };
}

export type ClimbTiming = { delay: number; climb: number; hold: number; fade: number };

// Where the star is in its endless loop at `seconds` since load: it waits
// on the first step for `delay`, climbs for `climb`, holds the top for
// `hold`, fades out for `fade`, then starts again from the first step.
export function climbCycle(
  seconds: number,
  timing: ClimbTiming,
): { progress: number; strength: number } {
  if (seconds < timing.delay) return { progress: 0, strength: 1 };
  const period = timing.climb + timing.hold + timing.fade;
  const local = (seconds - timing.delay) % period;
  if (local < timing.climb) return { progress: local / timing.climb, strength: 1 };
  if (local < timing.climb + timing.hold) return { progress: 1, strength: 1 };
  const fading = (local - timing.climb - timing.hold) / timing.fade;
  return { progress: 1, strength: clamp01(1 - fading) };
}

export type Dot = {
  // 0..1 opacity of the dot
  alpha: number;
  // radius as a fraction of the grid spacing, 0..0.5
  radius: number;
  // 0 = plain star yellow, 1 = white-hot centre of the star
  warmth: number;
};

// progress: star climb 0..1; time: seconds, drives a slow shimmer.
export function dotField(x: number, y: number, progress: number, time: number, strength = 1): Dot {
  const top = stairTop(x);
  const step = STEPS.find((s) => x >= s.x && x < s.x + s.width);
  const inside = step !== undefined && y > top;
  const shimmer = 0.5 + 0.5 * Math.sin(time * 0.9 + x * 7 + y * 5);

  let alpha: number;
  let radius: number;
  if (inside) {
    // Halftone shading: solid along the tread, thinning towards the floor
    // and towards the left edge of each step, like a printed gradient.
    const depth = (y - top) / Math.max(0.05, 1 - top);
    const across = (x - step!.x) / step!.width;
    const shade = clamp01(1 - depth * 0.85) * clamp01(0.55 + across * 0.45);
    alpha = 0.25 + 0.7 * shade;
    radius = 0.2 + 0.28 * shade;
  } else {
    alpha = 0.14 + 0.08 * shimmer;
    radius = 0.15 + 0.04 * shimmer;
  }

  const star = starAt(progress);
  const dx = (x - star.x) * 1.6; // the field is wider than tall; keep the glow round-ish
  const dy = y - star.y;
  const glow = Math.exp(-(dx * dx + dy * dy) / (2 * 0.06 * 0.06)) * clamp01(strength);

  alpha = alpha + (1 - alpha) * glow;
  radius = radius + (0.5 - radius) * glow;

  return {
    alpha: clamp01(alpha),
    radius: Math.min(0.5, Math.max(0.05, radius)),
    warmth: glow < 0.001 ? 0 : clamp01(glow * 1.2),
  };
}
