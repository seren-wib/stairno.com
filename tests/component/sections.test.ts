import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { parse } from 'node-html-parser';
import { describe, expect, it } from 'vitest';
import Contact from '../../src/components/Contact.astro';
import Footer from '../../src/components/Footer.astro';
import Hero from '../../src/components/Hero.astro';
import News from '../../src/components/News.astro';
import ProjectCard from '../../src/components/ProjectCard.astro';
import Projects from '../../src/components/Projects.astro';
import { projects } from '../../src/data/projects';
import { site } from '../../src/data/site';
import { locales, t } from '../../src/i18n';

const forbidden = /회사|스튜디오|company|studio/i;

async function render(
  component: Parameters<AstroContainer['renderToString']>[0],
  props: Record<string, unknown>,
) {
  const container = await AstroContainer.create();
  return parse(await container.renderToString(component, { props }));
}

describe('Hero', () => {
  it.each(locales)('FR-5 shows the brand, tagline, intro and etymology in %s', async (locale) => {
    const root = await render(Hero, { locale });
    const text = root.text;
    expect(root.querySelector('h1')?.text.trim()).toBe(site.name);
    expect(text).toContain(t(locale).hero.tagline);
    expect(text).toContain(t(locale).hero.intro);
    expect(text).toContain(t(locale).hero.etymology);
  });

  it.each(locales)('DR-2 never calls the brand a company or studio in %s', async (locale) => {
    const root = await render(Hero, { locale });
    expect(root.text).not.toMatch(forbidden);
  });
});

describe('ProjectCard', () => {
  it('FR-6 links out in a new tab with noopener', async () => {
    const root = await render(ProjectCard, { project: projects[0], locale: 'en' });
    const link = root.querySelector('a');
    expect(link?.getAttribute('href')).toBe(projects[0].url);
    expect(link?.getAttribute('target')).toBe('_blank');
    expect(link?.getAttribute('rel')).toContain('noopener');
    expect(root.text).toContain(projects[0].name.en);
    expect(root.text).toContain(projects[0].description.en);
  });
});

describe('Projects', () => {
  it.each(locales)('FR-6 renders three cards with localized names in %s', async (locale) => {
    const root = await render(Projects, { locale });
    const links = root.querySelectorAll('a[target="_blank"]');
    expect(links).toHaveLength(3);
    expect(root.querySelector('h2')?.text.trim()).toBe(t(locale).projects.heading);
    for (const project of projects) {
      expect(root.text).toContain(project.name[locale]);
    }
  });
});

describe('News', () => {
  it.each(locales)('FR-7 shows a heading and the empty state only in %s', async (locale) => {
    const root = await render(News, { locale });
    expect(root.querySelector('h2')?.text.trim()).toBe(t(locale).news.heading);
    expect(root.text).toContain(t(locale).news.empty);
    expect(root.querySelector('ul')).toBeNull();
    expect(root.querySelector('time')).toBeNull();
  });
});

describe('Contact', () => {
  it.each(locales)('FR-8 links to the single contact address in %s', async (locale) => {
    const root = await render(Contact, { locale });
    const link = root.querySelector(`a[href="mailto:${site.email}"]`);
    expect(link).not.toBeNull();
    expect(link?.text.trim()).toBe(t(locale).contact.action);
    expect(root.querySelector('form')).toBeNull();
  });
});

describe('Footer', () => {
  it.each(locales)('FR-9 shows the brand, the year and the source link in %s', async (locale) => {
    const root = await render(Footer, { locale });
    expect(root.querySelector('footer')).not.toBeNull();
    expect(root.text).toContain(site.name);
    expect(root.text).toContain(String(new Date().getFullYear()));
    const source = root.querySelector(`a[href="${site.github}"]`);
    expect(source?.text.trim()).toBe(t(locale).footer.source);
  });
});
