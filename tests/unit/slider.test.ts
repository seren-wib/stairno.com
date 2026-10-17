import { describe, expect, it } from 'vitest';
import { clampIndex, flipFor } from '../../src/lib/slider';

describe('flipFor', () => {
  it('goes to the next card on a downward scroll while cards remain', () => {
    expect(flipFor(120, 0, 3)).toBe('next');
    expect(flipFor(40, 1, 3)).toBe('next');
  });

  it('goes to the previous card on an upward scroll while cards remain', () => {
    expect(flipFor(-120, 2, 3)).toBe('prev');
    expect(flipFor(-40, 1, 3)).toBe('prev');
  });

  it('lets the page scroll past the first and last card', () => {
    expect(flipFor(120, 2, 3)).toBe('pass');
    expect(flipFor(-120, 0, 3)).toBe('pass');
  });

  it('ignores the tiny deltas of a trackpad tail', () => {
    expect(flipFor(2, 0, 3)).toBe('pass');
    expect(flipFor(-3, 2, 3)).toBe('pass');
    expect(flipFor(0, 1, 3)).toBe('pass');
  });

  it('never flips a single-card or empty slider', () => {
    expect(flipFor(120, 0, 1)).toBe('pass');
    expect(flipFor(120, 0, 0)).toBe('pass');
  });
});

describe('clampIndex', () => {
  it('keeps the index inside the deck', () => {
    expect(clampIndex(-1, 3)).toBe(0);
    expect(clampIndex(5, 3)).toBe(2);
    expect(clampIndex(1, 3)).toBe(1);
    expect(clampIndex(4, 0)).toBe(0);
  });
});
