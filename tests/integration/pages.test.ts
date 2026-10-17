import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parse, type HTMLElement } from 'node-html-parser';
import { describe, expect, it } from 'vitest';
import { locales } from '../../src/i18n';
import { resolveTheme } from '@stairno/ui/theme';

const dist = join(process.cwd(), 'dist');

function page(...segments: string[]): HTMLElement {
  return parse(readFileSync(join(dist, ...segments), 'utf8'));
}

describe('build output', () => {
  it('FR-1 builds one home page per locale', () => {
    expect(existsSync(join(dist, 'ko', 'index.html'))).toBe(true);
    expect(existsSync(join(dist, 'en', 'index.html'))).toBe(true);
  });
});

describe('root entry', () => {
  const root = page('index.html');

  it('FR-2 falls back to /ko/ without scripts', () => {
    // node-html-parser keeps noscript content as text, so parse it on its own.
    const inner = parse(root.querySelector('noscript')?.innerHTML ?? '');
    const refresh = inner.querySelector('meta[http-equiv="refresh"]');
    expect(refresh?.getAttribute('content')).toMatch(/url=\/ko\/$/);
  });

  it('FR-2 picks the locale from the browser languages', () => {
    const script = root.querySelector('script')?.text ?? '';
    expect(script).toContain('navigator.languages');
    expect(script).toContain("'/ko/'");
    expect(script).toContain("'/en/'");
  });

  it('FR-2 offers both locale links as a fallback', () => {
    expect(root.querySelector('a[href="/ko/"]')).not.toBeNull();
    expect(root.querySelector('a[href="/en/"]')).not.toBeNull();
  });
});

describe.each(locales)('locale home /%s/', (locale) => {
  const home = page(locale, 'index.html');

  it('FR-12 sets the html lang attribute', () => {
    expect(home.querySelector('html')?.getAttribute('lang')).toBe(locale);
  });

  it('FR-12 lists hreflang alternates for both locales and x-default', () => {
    const alternates = home.querySelectorAll('link[rel="alternate"][hreflang]');
    const map = new Map(
      alternates.map((l) => [l.getAttribute('hreflang'), l.getAttribute('href')]),
    );
    expect(map.get('ko')).toBe('https://stairno.com/ko/');
    expect(map.get('en')).toBe('https://stairno.com/en/');
    expect(map.get('x-default')).toBe('https://stairno.com/');
  });

  it('FR-18 points canonical at its own locale URL', () => {
    expect(home.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe(
      `https://stairno.com/${locale}/`,
    );
  });

  it('FR-15 applies the theme in the first script of the head', () => {
    const first = home.querySelector('head script');
    expect(first).not.toBeNull();
    expect(first?.text).toContain('data-theme');
  });

  it('FR-11 links to the other locale', () => {
    const other = locale === 'ko' ? 'en' : 'ko';
    expect(home.querySelector(`a[href="/${other}/"][hreflang="${other}"]`)).not.toBeNull();
  });
});

describe('inline theme script', () => {
  const script = page('ko', 'index.html').querySelector('head script')?.text ?? '';

  it.each([
    [null, false],
    [null, true],
    ['light', true],
    ['dark', false],
    ['junk', true],
  ] as const)(
    'FR-13 FR-14 matches resolveTheme for stored=%s prefersDark=%s',
    (stored, prefersDark) => {
      const attributes: Record<string, string> = {};
      const fakeDocument = {
        documentElement: {
          style: {} as Record<string, string>,
          setAttribute: (name: string, value: string) => {
            attributes[name] = value;
          },
        },
      };
      const fakeWindow = { matchMedia: () => ({ matches: prefersDark }) };
      const fakeStorage = { getItem: () => stored };
      new Function('document', 'window', 'localStorage', script)(
        fakeDocument,
        fakeWindow,
        fakeStorage,
      );
      expect(attributes['data-theme']).toBe(resolveTheme(stored, prefersDark));
    },
  );
});
