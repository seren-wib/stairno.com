import { describe, expect, it } from 'vitest';
import { STEPS, dotField, stairTop, starAt } from '../../src/lib/dots';

describe('stairTop', () => {
  it('has no staircase on the left part of the field', () => {
    expect(stairTop(0)).toBe(1);
    expect(stairTop(0.5)).toBe(1);
  });

  it('rises step by step from left to right on the right part', () => {
    const tops = STEPS.map((step) => stairTop(step.x + step.width / 2));
    for (let i = 1; i < tops.length; i++) {
      expect(tops[i]).toBeLessThan(tops[i - 1]!);
    }
    expect(tops[tops.length - 1]).toBeGreaterThan(0);
  });
});

describe('starAt', () => {
  it('starts on the first step and ends above the last one', () => {
    const first = STEPS[0]!;
    const last = STEPS[STEPS.length - 1]!;
    const start = starAt(0);
    const end = starAt(1);
    expect(start.x).toBeCloseTo(first.x + first.width / 2, 2);
    expect(end.x).toBeCloseTo(last.x + last.width / 2, 2);
    expect(end.y).toBeLessThan(stairTop(end.x));
  });

  it('clamps progress outside 0..1', () => {
    expect(starAt(-1)).toEqual(starAt(0));
    expect(starAt(5)).toEqual(starAt(1));
  });
});

describe('dotField', () => {
  it('makes dots inside the staircase stronger than dots in the sky', () => {
    const inside = dotField(0.9, 0.95, 1, 0);
    const sky = dotField(0.1, 0.1, 1, 0);
    expect(inside.alpha).toBeGreaterThan(sky.alpha);
    expect(inside.radius).toBeGreaterThan(sky.radius);
  });

  it('turns dots near the star warm and bright', () => {
    const star = starAt(1);
    const near = dotField(star.x, star.y, 1, 0);
    const far = dotField(0.05, 0.05, 1, 0);
    expect(near.warmth).toBeGreaterThan(0.9);
    expect(far.warmth).toBe(0);
    expect(near.alpha).toBeGreaterThan(far.alpha);
  });

  it('keeps every value in range', () => {
    for (let x = 0; x <= 1; x += 0.1) {
      for (let y = 0; y <= 1; y += 0.1) {
        const d = dotField(x, y, 0.5, 3.3);
        expect(d.alpha).toBeGreaterThanOrEqual(0);
        expect(d.alpha).toBeLessThanOrEqual(1);
        expect(d.warmth).toBeGreaterThanOrEqual(0);
        expect(d.warmth).toBeLessThanOrEqual(1);
        expect(d.radius).toBeGreaterThan(0);
        expect(d.radius).toBeLessThanOrEqual(0.5);
      }
    }
  });
});
