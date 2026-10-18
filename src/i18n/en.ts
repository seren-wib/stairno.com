import type { Dictionary } from './types';

export const en: Dictionary = {
  meta: {
    title: 'Stairno',
    description: 'Small things, finished. Stairno makes games and tools.',
  },
  nav: {
    home: 'Home',
    switchLocale: '한국어',
    theme: {
      light: 'Switch to light mode',
      dark: 'Switch to dark mode',
      toggle: 'Toggle theme',
    },
    accountMenu: {
      signedIn: 'Account menu',
      signedOut: 'Sign-in menu',
      manage: 'Manage account',
      signOut: 'Sign out',
      signIn: 'Sign in',
      signUp: 'Sign up',
    },
  },
  hero: {
    tagline: 'Small things, finished.',
    intro: 'Stairno makes games and tools.',
    etymology: 'stairno, Gothic for star.',
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
