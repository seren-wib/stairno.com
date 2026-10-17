import type { Dictionary } from './types';

export const en: Dictionary = {
  meta: {
    title: 'Stairno',
    description: 'A star, one step at a time. Stairno makes games and small tools.',
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
    tagline: 'A star, one step at a time',
    intro: 'Games and small tools. Started small, finished.',
    etymology: 'Stairno: star in Gothic, stair in English.',
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
