import type { Locale } from '../i18n';

export type Project = {
  id: 'works' | 'games' | 'labs';
  url: `https://${string}`;
  name: Record<Locale, string>;
  description: Record<Locale, string>;
};

export const projects: readonly Project[] = [
  {
    id: 'works',
    url: 'https://stairnoworks.com',
    name: { ko: 'Stairno Works', en: 'Stairno Works' },
    description: {
      ko: '외주 작업. 의뢰부터 납품까지 한 곳에서.',
      en: 'Client work, from brief to delivery in one place.',
    },
  },
  {
    id: 'games',
    url: 'https://stairnogames.com',
    name: { ko: 'Stairno Games', en: 'Stairno Games' },
    description: {
      ko: '작게 만들고 끝까지 만드는 게임.',
      en: 'Small games, finished.',
    },
  },
  {
    id: 'labs',
    url: 'https://stairnolabs.com',
    name: { ko: 'Stairno Labs', en: 'Stairno Labs' },
    description: {
      ko: '한 가지 일을 잘하는 작은 도구.',
      en: 'Small tools that do one thing well.',
    },
  },
];
