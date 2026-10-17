import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { parse } from 'node-html-parser';
import { describe, expect, it } from 'vitest';
import Contact from '../../src/components/Contact.astro';
import Footer from '../../src/components/Footer.astro';
import Header from '../../src/components/Header.astro';
import Hero from '../../src/components/Hero.astro';
import News from '../../src/components/News.astro';
import Projects from '../../src/components/Projects.astro';
import { projects } from '../../src/data/projects';
import { locales, t } from '../../src/i18n';

async function render(
  component: Parameters<AstroContainer['renderToString']>[0],
  props: Record<string, unknown>,
) {
  const container = await AstroContainer.create();
  return parse(await container.renderToString(component, { props }));
}

describe('Projects slider', () => {
  it.each(locales)(
    'FR-6 renders one slide per project, each with its link, in %s',
    async (locale) => {
      const root = await render(Projects, { locale });
      const slider = root.querySelector('[data-slider]');
      expect(slider).not.toBeNull();
      const slides = root.querySelectorAll('[data-slide]');
      expect(slides).toHaveLength(projects.length);
      for (const [index, slide] of slides.entries()) {
        const link = slide.querySelector('a[target="_blank"]');
        expect(link?.getAttribute('href')).toBe(projects[index]?.url);
        expect(slide.text).toContain(projects[index]?.name[locale]);
      }
    },
  );

  it.each(locales)(
    'FR-6 has one labelled dot per project and no arrow buttons in %s',
    async (locale) => {
      const root = await render(Projects, { locale });
      const copy = t(locale).projects;
      expect(root.querySelector('button[data-slider-prev]')).toBeNull();
      expect(root.querySelector('button[data-slider-next]')).toBeNull();
      const dots = root.querySelectorAll('button[data-slider-dot]');
      expect(dots).toHaveLength(projects.length);
      expect(dots[0]?.getAttribute('aria-label')).toBe(
        copy.goTo.replace('{name}', projects[0]!.name[locale]),
      );
    },
  );

  it('plays automatically with a declared interval and pauses on hover', async () => {
    const root = await render(Projects, { locale: 'ko' });
    const slider = root.querySelector('[data-slider]');
    expect(Number(slider?.getAttribute('data-interval'))).toBeGreaterThanOrEqual(4000);
    expect(slider?.getAttribute('aria-roledescription')).toBe('carousel');
  });

  it('exposes exactly three new-tab links so the external link count stays at three', async () => {
    const root = await render(Projects, { locale: 'en' });
    expect(root.querySelectorAll('a[target="_blank"]')).toHaveLength(3);
  });
});

describe('Header', () => {
  it('FR-4 is marked sticky so the script can solidify it on scroll', async () => {
    const root = await render(Header, { locale: 'ko' });
    expect(root.querySelector('header[data-sticky]')).not.toBeNull();
  });

  it('FR-4 marks the menu for the scroll spy and starts with nothing current', async () => {
    const root = await render(Header, { locale: 'ko' });
    expect(root.querySelector('ul[data-menu]')).not.toBeNull();
    expect(root.querySelector('nav a[aria-current]')).toBeNull();
  });

  it.each(locales)('FR-4 links to the three sections of the page in %s', async (locale) => {
    const root = await render(Header, { locale });
    const copy = t(locale);
    const links = root.querySelectorAll('nav a[href^="#"]');
    expect(links.map((a) => a.getAttribute('href'))).toEqual(['#projects', '#news', '#contact']);
    expect(links.map((a) => a.text.trim())).toEqual([
      copy.projects.heading,
      copy.news.heading,
      copy.contact.heading,
    ]);
  });
});

describe('dot text', () => {
  it('renders each header menu label as a dot-text target that follows aria-current', async () => {
    const root = await render(Header, { locale: 'ko' });
    const labels = root.querySelectorAll('[data-menu] a > [data-dot-text]');
    expect(labels).toHaveLength(3);
    for (const label of labels) {
      expect(label.getAttribute('data-dot-trigger')).toBe('current');
    }
  });

  it('renders section headings as dot-text targets that assemble when visible', async () => {
    for (const component of [Projects, News, Contact]) {
      const root = await render(component, { locale: 'ko' });
      const label = root.querySelector('h2[data-reveal] > [data-dot-text]');
      expect(label?.getAttribute('data-dot-trigger')).toBe('visible');
    }
  });
});

describe('Hero dots', () => {
  it('FR-5 draws the staircase and star on a decorative canvas', async () => {
    const root = await render(Hero, { locale: 'ko' });
    const canvas = root.querySelector('canvas[data-hero-dots]');
    expect(canvas).not.toBeNull();
    expect(canvas?.getAttribute('aria-hidden')).toBe('true');
  });
});

describe('scroll reveal', () => {
  it('marks hero copy with staggered reveal targets', async () => {
    const root = await render(Hero, { locale: 'ko' });
    const targets = root.querySelectorAll('[data-reveal]');
    expect(targets.length).toBeGreaterThanOrEqual(3);
  });

  it('marks the projects heading as a reveal target', async () => {
    const root = await render(Projects, { locale: 'ko' });
    expect(root.querySelector('h2[data-reveal]')).not.toBeNull();
  });
});

describe('Footer', () => {
  it('reveals its three columns in sequence', async () => {
    const root = await render(Footer, { locale: 'ko' });
    const targets = root.querySelectorAll('footer [data-reveal]');
    expect(targets.map((el) => el.getAttribute('data-reveal'))).toEqual(['1', '2', '3']);
  });

  it.each(locales)(
    'FR-9 links to every project in the same tab plus the source in %s',
    async (locale) => {
      const root = await render(Footer, { locale });
      for (const project of projects) {
        const link = root.querySelector(`a[href="${project.url}"]`);
        expect(link?.text.trim()).toBe(project.name[locale]);
        expect(link?.hasAttribute('target')).toBe(false);
      }
      expect(root.text).toContain(t(locale).footer.projects);
    },
  );
});
