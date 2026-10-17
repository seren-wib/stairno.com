export type Dictionary = {
  meta: { title: string; description: string };
  nav: {
    home: string;
    switchLocale: string;
    theme: { light: string; dark: string; toggle: string };
  };
  hero: { tagline: string; intro: string; etymology: string };
  projects: { heading: string; previous: string; next: string; goTo: string };
  news: { heading: string; empty: string };
  contact: { heading: string; action: string };
  footer: { source: string; projects: string };
  notFound: { heading: string; home: string };
};
