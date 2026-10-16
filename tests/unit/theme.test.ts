import { describe, expect, it } from 'vitest';
import { THEME_KEY, nextTheme, resolveTheme } from '../../src/lib/theme';

describe('resolveTheme', () => {
  it('FR-13 follows the system preference when nothing is stored', () => {
    expect(resolveTheme(null, false)).toBe('light');
    expect(resolveTheme(null, true)).toBe('dark');
  });

  it('FR-14 uses the stored theme over the system preference', () => {
    expect(resolveTheme('light', true)).toBe('light');
    expect(resolveTheme('dark', false)).toBe('dark');
  });

  it('FR-14 ignores unknown stored values', () => {
    expect(resolveTheme('junk', true)).toBe('dark');
    expect(resolveTheme('', false)).toBe('light');
  });
});

describe('nextTheme', () => {
  it('FR-16 flips between light and dark', () => {
    expect(nextTheme('light')).toBe('dark');
    expect(nextTheme('dark')).toBe('light');
  });
});

describe('storage', () => {
  it('NFR-9 stores the theme under a single known key', () => {
    expect(THEME_KEY).toBe('theme');
  });
});
