import { describe, expect, it } from 'vitest';
import { nearestScreen, targetFor } from '../../src/lib/screens';

const tops = [0, 800, 1600, 2400];

describe('nearestScreen', () => {
  it('picks the screen whose top is closest to the scroll position', () => {
    expect(nearestScreen(tops, 0)).toBe(0);
    expect(nearestScreen(tops, 790)).toBe(1);
    expect(nearestScreen(tops, 1300)).toBe(2);
    expect(nearestScreen(tops, 9000)).toBe(3);
  });

  it('is 0 with no screens', () => {
    expect(nearestScreen([], 500)).toBe(0);
  });
});

describe('targetFor', () => {
  it('moves one screen at a time', () => {
    expect(targetFor(1, 0, tops, 3000)).toBe(800);
    expect(targetFor(-1, 2, tops, 3000)).toBe(800);
  });

  it('goes to the end of the page after the last screen and stays there', () => {
    expect(targetFor(1, 3, tops, 3000)).toBe(3000);
    expect(targetFor(1, 3, tops, 2400)).toBeNull();
  });

  it('has nowhere to go before the first screen', () => {
    expect(targetFor(-1, 0, tops, 3000)).toBeNull();
  });

  it('comes back from the page end to the last screen', () => {
    // scrollY past the last screen top: the "current" index is still the last screen
    expect(targetFor(-1, 3, tops, 3000, 3000)).toBe(2400);
    expect(targetFor(-1, 3, tops, 3000, 2400)).toBe(1600);
  });
});
