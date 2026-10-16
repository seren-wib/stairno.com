import { en } from './en';
import { ko } from './ko';
import type { Dictionary } from './types';

export type { Dictionary } from './types';

export const locales = ['ko', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'ko';

const dictionaries: Record<Locale, Dictionary> = { ko, en };

export function t(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function localePath(locale: Locale, path = ''): string {
  const trimmed = path.replace(/^\/+|\/+$/g, '');
  return trimmed ? `/${locale}/${trimmed}/` : `/${locale}/`;
}

export function alternateLocale(locale: Locale): Locale {
  return locale === 'ko' ? 'en' : 'ko';
}
