import { describe, expect, it } from 'vitest';
import { alternateLocale, defaultLocale, isLocale, localePath, locales, t } from '../../src/i18n';
import { en } from '../../src/i18n/en';
import { ko } from '../../src/i18n/ko';

function leaves(value: unknown, prefix = ''): Array<[string, unknown]> {
  if (value !== null && typeof value === 'object') {
    return Object.entries(value as Record<string, unknown>).flatMap(([key, child]) =>
      leaves(child, prefix ? `${prefix}.${key}` : key),
    );
  }
  return [[prefix, value]];
}

describe('dictionaries', () => {
  it('FR-10 both dictionaries have the same keys', () => {
    const koKeys = leaves(ko).map(([key]) => key);
    const enKeys = leaves(en).map(([key]) => key);
    expect(enKeys).toEqual(koKeys);
  });

  it('FR-10 no dictionary value is empty', () => {
    for (const dictionary of [ko, en]) {
      for (const [key, value] of leaves(dictionary)) {
        expect(typeof value, key).toBe('string');
        expect((value as string).trim().length, key).toBeGreaterThan(0);
      }
    }
  });

  it('t returns the dictionary for a locale', () => {
    expect(t('ko')).toBe(ko);
    expect(t('en')).toBe(en);
  });
});

describe('locales', () => {
  it('FR-1 supports exactly ko and en with ko as default', () => {
    expect([...locales]).toEqual(['ko', 'en']);
    expect(defaultLocale).toBe('ko');
  });

  it('FR-1 isLocale accepts only supported locales', () => {
    expect(isLocale('ko')).toBe(true);
    expect(isLocale('en')).toBe(true);
    expect(isLocale('fr')).toBe(false);
    expect(isLocale('')).toBe(false);
    expect(isLocale('KO')).toBe(false);
  });

  it('FR-11 localePath builds a prefixed path with a trailing slash', () => {
    expect(localePath('ko')).toBe('/ko/');
    expect(localePath('en')).toBe('/en/');
    expect(localePath('ko', 'about')).toBe('/ko/about/');
    expect(localePath('en', '/about/')).toBe('/en/about/');
  });

  it('FR-11 alternateLocale swaps ko and en', () => {
    expect(alternateLocale('ko')).toBe('en');
    expect(alternateLocale('en')).toBe('ko');
  });
});
