import { describe, expect, it } from 'vitest';
import { wrapIndex } from '../../src/lib/slider';

describe('wrapIndex', () => {
  it('wraps forward past the last slide', () => {
    expect(wrapIndex(3, 3)).toBe(0);
    expect(wrapIndex(4, 3)).toBe(1);
  });

  it('wraps backward before the first slide', () => {
    expect(wrapIndex(-1, 3)).toBe(2);
    expect(wrapIndex(-4, 3)).toBe(2);
  });

  it('is safe for an empty slider', () => {
    expect(wrapIndex(5, 0)).toBe(0);
  });
});
