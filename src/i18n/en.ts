import type { Dictionary } from './types';

export const en: Dictionary = {
  meta: {
    title: 'Stairno',
    description:
      'A star that climbs from the ground. Stairno builds client work, games and small tools.',
  },
  nav: {
    home: 'Home',
    switchLocale: '한국어',
    theme: {
      light: 'Switch to light mode',
      dark: 'Switch to dark mode',
      toggle: 'Toggle theme',
    },
  },
  hero: {
    tagline: 'A star that climbs from the ground',
    intro: 'Stairno builds client work, games and small tools.',
    etymology:
      'The name comes from Gothic stairno, “star”. Read in English it carries stair: a star climbing one step at a time.',
  },
  projects: {
    heading: 'Projects',
    previous: 'Previous project',
    next: 'Next project',
    goTo: 'Show {name}',
  },
  news: { heading: 'News', empty: 'Nothing to announce yet.' },
  contact: { heading: 'Contact', action: 'Send an email' },
  footer: { source: 'Source code', projects: 'Projects' },
  notFound: { heading: 'Page not found', home: 'Go to the English home' },
};
