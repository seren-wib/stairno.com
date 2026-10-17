import type { Dictionary } from './types';

export const ko: Dictionary = {
  meta: {
    title: 'Stairno',
    description: '작은 걸 끝까지. Stairno는 게임과 도구를 만듭니다.',
  },
  nav: {
    home: '홈',
    switchLocale: 'English',
    theme: {
      light: '라이트 모드로 전환',
      dark: '다크 모드로 전환',
      toggle: '테마 전환',
    },
  },
  hero: {
    tagline: '작은 걸 끝까지',
    intro: 'Stairno는 게임과 도구를 만듭니다.',
    etymology: 'stairno, 고트어로 별.',
  },
  projects: {
    heading: '프로젝트',
    previous: '이전 프로젝트',
    next: '다음 프로젝트',
    goTo: '{name} 보기',
  },
  news: { heading: '소식', empty: '아직 소식이 없습니다.' },
  contact: { heading: '연락', action: '메일 보내기' },
  footer: { source: '소스 코드', projects: '프로젝트' },
  notFound: { heading: '페이지를 찾을 수 없습니다', home: '한국어 홈으로' },
};
