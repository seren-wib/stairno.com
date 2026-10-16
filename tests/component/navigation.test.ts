import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { parse } from 'node-html-parser';
import { describe, expect, it } from 'vitest';
import Header from '../../src/components/Header.astro';
import LocaleSwitch from '../../src/components/LocaleSwitch.astro';
import ThemeToggle from '../../src/components/ThemeToggle.astro';
import { t } from '../../src/i18n';

describe('LocaleSwitch', () => {
  it('FR-11 links from ko to the same page in en', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(LocaleSwitch, { props: { locale: 'ko' } });
    const link = parse(html).querySelector('a');
    expect(link?.getAttribute('href')).toBe('/en/');
    expect(link?.getAttribute('hreflang')).toBe('en');
    expect(link?.getAttribute('lang')).toBe('en');
    expect(link?.text.trim()).toBe(t('ko').nav.switchLocale);
  });

  it('FR-11 links from en back to ko', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(LocaleSwitch, { props: { locale: 'en' } });
    const link = parse(html).querySelector('a');
    expect(link?.getAttribute('href')).toBe('/ko/');
    expect(link?.getAttribute('hreflang')).toBe('ko');
    expect(link?.text.trim()).toBe(t('en').nav.switchLocale);
  });
});

describe('ThemeToggle', () => {
  it('FR-16 renders a labelled button carrying both state labels', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(ThemeToggle, { props: { locale: 'ko' } });
    const button = parse(html).querySelector('button');
    expect(button).not.toBeNull();
    expect(button?.getAttribute('type')).toBe('button');
    expect(button?.hasAttribute('data-theme-toggle')).toBe(true);
    expect(button?.getAttribute('aria-label')).toBe(t('ko').nav.theme.toggle);
    expect(button?.getAttribute('data-label-light')).toBe(t('ko').nav.theme.light);
    expect(button?.getAttribute('data-label-dark')).toBe(t('ko').nav.theme.dark);
  });
});

describe('Header', () => {
  it('FR-4 has the brand home link, the locale switch and the theme toggle', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Header, { props: { locale: 'en' } });
    const root = parse(html);
    expect(root.querySelector('header')).not.toBeNull();
    const brand = root.querySelector('a[href="/en/"]');
    expect(brand?.text.trim()).toBe('Stairno');
    expect(root.querySelector('a[href="/ko/"][hreflang="ko"]')).not.toBeNull();
    expect(root.querySelector('button[data-theme-toggle]')).not.toBeNull();
  });
});
