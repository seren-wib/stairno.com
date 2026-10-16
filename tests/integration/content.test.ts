import { existsSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { parse, type HTMLElement } from 'node-html-parser';
import { describe, expect, it } from 'vitest';
import { projects } from '../../src/data/projects';
import { site } from '../../src/data/site';
import { locales, t } from '../../src/i18n';

const dist = join(process.cwd(), 'dist');

function page(...segments: string[]): HTMLElement {
  return parse(readFileSync(join(dist, ...segments), 'utf8'));
}

function meta(root: HTMLElement, property: string): string | undefined {
  return root.querySelector(`meta[property="${property}"]`)?.getAttribute('content');
}

describe('generated files', () => {
  it('FR-3 FR-19 ships a 404 page, robots.txt and a sitemap', () => {
    expect(existsSync(join(dist, '404.html'))).toBe(true);
    expect(existsSync(join(dist, 'robots.txt'))).toBe(true);
    expect(existsSync(join(dist, 'sitemap-index.xml'))).toBe(true);
  });

  it('FR-19 robots.txt allows crawling and names the sitemap', () => {
    const robots = readFileSync(join(dist, 'robots.txt'), 'utf8');
    expect(robots).toMatch(/Allow: \/|Disallow:\s*$/m);
    expect(robots).toContain(`${site.url}/sitemap-index.xml`);
  });

  it('FR-3 the 404 page links to both locale homes', () => {
    const notFound = page('404.html');
    expect(notFound.querySelector('a[href="/ko/"]')).not.toBeNull();
    expect(notFound.querySelector('a[href="/en/"]')).not.toBeNull();
  });
});

describe.each(locales)('home content /%s/', (locale) => {
  const home = page(locale, 'index.html');
  const dictionary = t(locale);

  it('FR-17 carries a title, a description and Open Graph tags', () => {
    expect(home.querySelector('title')?.text).toBe(dictionary.meta.title);
    expect(home.querySelector('meta[name="description"]')?.getAttribute('content')).toBe(
      dictionary.meta.description,
    );
    expect(meta(home, 'og:title')).toBe(dictionary.meta.title);
    expect(meta(home, 'og:description')).toBe(dictionary.meta.description);
    expect(meta(home, 'og:type')).toBe('website');
    expect(meta(home, 'og:url')).toBe(`${site.url}/${locale}/`);
    expect(meta(home, 'og:locale')).toBe(locale === 'ko' ? 'ko_KR' : 'en_US');
    expect(meta(home, 'og:site_name')).toBe(site.name);
  });

  it('FR-6 links to the three project sites and nothing else in a new tab', () => {
    const external = home.querySelectorAll('a[target="_blank"]').map((a) => a.getAttribute('href'));
    expect(external.sort()).toEqual(projects.map((p) => p.url).sort());
  });

  it('FR-8 has exactly one mailto link', () => {
    const mail = home.querySelectorAll('a[href^="mailto:"]');
    expect(mail).toHaveLength(1);
    expect(mail[0]?.getAttribute('href')).toBe(`mailto:${site.email}`);
  });

  it('FR-4 FR-5 FR-7 FR-9 renders header, main sections and footer in order', () => {
    const body = home.querySelector('body');
    const order = body?.childNodes
      .filter((n) => n.nodeType === 1)
      .map((n) => (n as HTMLElement).tagName.toLowerCase());
    expect(order?.slice(0, 3)).toEqual(['header', 'main', 'footer']);
    const headings = home.querySelectorAll('main h2').map((h) => h.text.trim());
    expect(headings).toEqual([
      dictionary.projects.heading,
      dictionary.news.heading,
      dictionary.contact.heading,
    ]);
  });

  it('DR-2 never calls the brand a company or studio', () => {
    expect(home.querySelector('body')?.text).not.toMatch(/회사|스튜디오|company|studio/i);
  });

  it('DR-1 has no forms, inputs or commerce wording', () => {
    expect(home.querySelector('form')).toBeNull();
    expect(home.querySelector('input')).toBeNull();
    expect(home.querySelector('body')?.text).not.toMatch(/결제|접수|checkout|payment/i);
  });

  it('NFR-1 keeps the HTML under 200KB', () => {
    expect(statSync(join(dist, locale, 'index.html')).size).toBeLessThan(200 * 1024);
  });

  it('NFR-8 loads no third-party scripts', () => {
    const external = home
      .querySelectorAll('script[src]')
      .map((s) => s.getAttribute('src') ?? '')
      .filter((src) => /^https?:\/\//.test(src));
    expect(external).toEqual([]);
  });
});
